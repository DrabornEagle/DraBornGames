extends Node3D
## Session composition and events; mechanics live in their own modules.
var session: Node3D
var world: SurvivalWorld
var player: SurvivalPlayer
var kora: KoraNPC
var day: DayCycle
var settlement: Settlement
var interaction: WorldInteraction
var ui: SurvivalUI
var audio: SurvivalAudio
var loaded_save: bool = false
var started: bool = false
var autosave_timer: float = 45
var resetting: bool = false

func _ready() -> void:
	get_tree().auto_accept_quit = false
	var data := Saves.load_game()
	loaded_save = not data.is_empty()
	_create_session(data)
	audio = SurvivalAudio.new()
	add_child(audio)
	ui = SurvivalUI.new()
	ui.game = self
	add_child(ui)
	Saves.saved.connect(func(ok: bool): ui.toast("İlerleme kaydedildi." if ok else "Kayıt yazılamadı. Depolama alanını kontrol et."))
	if Saves.recovered_backup:
		ui.toast("Son sağlam yedek kayıt kurtarıldı.")

func _create_session(data: Dictionary) -> void:
	if data.has("inventory"):
		Inventory.restore(data.inventory,int(data.get("selected",0)))
		Quests.restore(data.get("quests",{}))
	else:
		Inventory.start_items()
		Quests.reset()
	session = Node3D.new()
	session.name = "Session"
	add_child(session)
	world = SurvivalWorld.new()
	world.name = "World"
	session.add_child(world)
	world.setup(data.get("world",{}))
	day = DayCycle.new()
	day.day_time = fposmod(float(data.get("day_time",.32)),1.0)
	session.add_child(day)
	settlement = Settlement.new()
	session.add_child(settlement)
	player = (load("res://scenes/player/player.tscn") as PackedScene).instantiate()
	player.world = world
	player.restore(data.get("player",{}))
	session.add_child(player)
	world.player = player
	player.died.connect(_respawn)
	kora = (load("res://scenes/npc/kora.tscn") as PackedScene).instantiate()
	kora.world = world
	kora.day = day
	var npc_data: Dictionary = data.get("npc",{})
	var pos: Array = npc_data.get("position",[6,20,-6])
	kora.position = Vector3(float(pos[0]),float(pos[1]),float(pos[2]))
	kora.relation = int(npc_data.get("relation",0))
	session.add_child(kora)
	interaction = WorldInteraction.new()
	interaction.world = world
	interaction.player = player
	session.add_child(interaction)
	interaction.message.connect(func(text: String): if ui!=null: ui.toast(text))
	interaction.effect.connect(func(id: String): if audio!=null: audio.play(id))
	for structure in world.structures:
		if structure.get("type","")=="campfire":
			var p: Array = structure.position
			SurvivalArt.campfire(world,Vector3(float(p[0]),float(p[1]),float(p[2])))
	for entry in world.drops:
		_spawn_pickup(entry)
	for i in 3:
		var stable_id := "camp_berry_%d"%i
		if world.harvested.has(stable_id): continue
		var bush := Harvestable.new()
		bush.stable_id = stable_id
		bush.resource_id = "berry"
		bush.remaining = 1
		bush.world = world
		bush.position = Vector3(1+i*1.8,20.45,2.5)
		var collision := CollisionShape3D.new()
		var shape := SphereShape3D.new()
		shape.radius = .6
		collision.shape = shape
		bush.add_child(collision)
		SurvivalArt.sphere(bush,Vector3.ZERO,Vector3(1.3,.9,1.1),Color("526744"))
		for j in 4:
			SurvivalArt.sphere(bush,Vector3(sin(j*2.1)*.45,.25,cos(j*2.1)*.42),Vector3.ONE*.15,Color("b75b50"))
		world.add_child(bush)
	world.stream_to(player.position)

func start_new(seed_value: int) -> void:
	if resetting: return
	resetting = true
	started = false
	Controls.blocked = true
	Saves.flush()
	session.queue_free()
	await get_tree().process_frame
	_create_session({"world":{"seed":seed_value}})
	loaded_save = false
	started = true
	autosave_timer = 45
	resetting = false
	Controls.blocked = false
	ui.refresh_inventory()
	ui.toast("Yeni dünya hazır. Yerleşimde Kora'yı bul.")

func _process(delta: float) -> void:
	if resetting: return
	var actions: Array[String] = Controls.actions.duplicate()
	Controls.actions.clear()
	for action in actions:
		if action in ["inventory","quests","craft","pause"]:
			if not started: continue
			if ui.menu == action or (action=="pause" and ui.menu!=""):
				ui.close()
			elif action=="inventory": ui.show_inventory()
			elif action=="quests": ui.show_quests()
			elif action=="craft": ui.show_crafting()
			else: ui.show_pause()
			continue
		if Controls.blocked: continue
		match action:
			"jump": player.jump_requested = true
			"sprint": Controls.sprint = not Controls.sprint
			"mine": interaction.mine()
			"place": interaction.place()
			"interact": interact()
			"use":
				if not use_item(Inventory.selected_id()): ui.toast("Meyve seçerek KULLAN'a dokun.")
	if started and not Controls.blocked:
		autosave_timer -= delta
		if autosave_timer<=0:
			autosave_timer=45
			save_game()

func interact() -> void:
	var nearest: WorldPickup
	var distance: float = 2.6
	for node in get_tree().get_nodes_in_group("loose_items"):
		var d := player.position.distance_to(node.position)
		if d<distance:
			nearest = node
			distance = d
	if nearest!=null:
		ui.toast("Eşya alındı." if nearest.collect() else "Envanter dolu.")
	elif player.position.distance_to(kora.position)<3.8:
		ui.show_dialogue()
	else:
		ui.toast("Konuşmak için Kora'ya yaklaş. Turkuaz harita işaretini izle.")

func use_item(id: String) -> bool:
	var item: Dictionary = DB.items.get(id,{})
	if not item.has("hunger") or not Inventory.remove_item(id,1):
		return false
	player.hunger = minf(100,player.hunger+float(item.hunger))
	player.health = minf(100,player.health+float(item.get("heal",0)))
	player.visual.action("interact")
	ui.toast(DB.item_name(id)+" kullanıldı.")
	return true

func drop_item(id: String) -> void:
	if not Inventory.remove_item(id,1): return
	var pos := player.position + Vector3(sin(player.yaw)*1.2,.4,cos(player.yaw)*1.2)
	var entry := {"id":id,"count":1,"position":[pos.x,pos.y,pos.z]}
	world.drops.append(entry)
	_spawn_pickup(entry)
	ui.toast("Eşya bırakıldı. ETKİLEŞ ile geri alabilirsin.")

func _spawn_pickup(entry: Dictionary) -> void:
	var pickup := WorldPickup.new()
	pickup.world = world
	pickup.entry = entry
	world.add_child(pickup)

func _respawn() -> void:
	player.position = Vector3(3,20.3,8)
	player.velocity = Vector3.ZERO
	player.fall_speed = 0
	player.health = 100
	player.hunger = 70
	player.stamina = 100
	player.first_frame = true
	world.stream_to(player.position)
	ui.toast("Kampta yeniden doğdun. Kolay zorlukta envanterin korunur.")
	save_game()

func snapshot() -> Dictionary:
	return {"game_version":"0.1.0","world":world.snapshot(),"player":player.snapshot(),"inventory":Inventory.slots.duplicate(true),"selected":Inventory.selected,"quests":Quests.snapshot(),"day_time":day.day_time,"npc":{"position":[kora.position.x,kora.position.y,kora.position.z],"relation":kora.relation}}

func save_game() -> void:
	if not resetting and started:
		Saves.request_save(snapshot())
		loaded_save = true

func _notification(what: int) -> void:
	if not is_inside_tree() or world==null or resetting:
		return
	if what==NOTIFICATION_WM_GO_BACK_REQUEST and ui!=null:
		Controls.queue_action("pause")
	if what==NOTIFICATION_APPLICATION_PAUSED or what==NOTIFICATION_WM_CLOSE_REQUEST:
		if started:
			Saves.flush(snapshot())
		if what==NOTIFICATION_WM_CLOSE_REQUEST:
			get_tree().quit()
