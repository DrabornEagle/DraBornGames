extends Node
## End-to-end regression scene. Run with an isolated XDG_DATA_HOME.
var game: Node3D
var passed: int = 0
var failed: int = 0
var results: Array[Dictionary] = []
var start_ms: int
var visual: bool = false

func check(ok: bool, name_value: String) -> void:
	if ok: passed+=1
	else: failed+=1
	results.append({"test":name_value,"passed":ok})
	print(("PASS " if ok else "FAIL ")+name_value)

func frames(count: int) -> void:
	for i in count:
		await get_tree().physics_frame

func wait_chunks() -> bool:
	var time := Time.get_ticks_msec()
	while Time.get_ticks_msec()-time<45000:
		if game.world.queue.is_empty() and not game.world.thread.is_started():
			await frames(3)
			return true
		await get_tree().process_frame
	return false

func press_button(fragment: String) -> bool:
	for node in game.ui.content.find_children("*","Button",true,false):
		if fragment in node.text:
			node.pressed.emit()
			return true
	return false

func screenshot(filename: String) -> void:
	if not visual: return
	await RenderingServer.frame_post_draw
	var img := get_viewport().get_texture().get_image()
	img.save_png("/tmp/draborn-tools/"+filename)

func _ready() -> void:
	start_ms = Time.get_ticks_msec()
	visual = OS.get_cmdline_user_args().has("--visual")
	await get_tree().process_frame
	# Isolate every suite run from past runs; validate actual on-disk saves later.
	for suffix in ["",".bak",".tmp"]:
		DirAccess.remove_absolute(ProjectSettings.globalize_path(Saves.FILE+suffix))
	check(DB.items.size()==10 and DB.recipes.size()==4 and DB.quests.has("dying_beacon"),"offline JSON registry")
	var a := VoxelGenerator.new(41729)
	var b := VoxelGenerator.new(41729)
	var c := VoxelGenerator.new(85)
	var deterministic := true
	var different := false
	for x in range(100,200,7):
		deterministic = deterministic and a.height_at(x,139)==b.height_at(x,139)
		different = different or a.height_at(x,139)!=c.height_at(x,139)
	check(deterministic and different,"seed determinism and variation")
	check(a.height_at(3,8)==20 and a.height_at(-18,13)==16,"safe camp and lake basin")
	check(VoxelGenerator.chunk_at(Vector3(-.01,0,-16.1))==Vector2i(-1,-2),"negative chunk coordinate flooring")
	Inventory.reset()
	Inventory.add_item("wood",4)
	var before := JSON.stringify(Inventory.slots)
	check(not Inventory.craft("axe") and JSON.stringify(Inventory.slots)==before,"insufficient crafting leaves inventory unchanged")
	Inventory.reset()
	for i in 12: Inventory.add_item("coin",999)
	before = JSON.stringify(Inventory.slots)
	check(not Inventory.transact({"coin":1},{"axe":1}) and JSON.stringify(Inventory.slots)==before,"full inventory transaction rollback")
	Inventory.reset()
	check(Inventory.add_item("wood",120) and Inventory.count_item("wood")==120 and Inventory.slots[0].count==99 and Inventory.slots[1].count==21,"stack overflow uses next slot")
	var invalid: Array = Inventory.slots.duplicate(true)
	invalid[0].count=9999
	check(not Inventory.restore(invalid),"reject invalid inventory restore")
	game = (load("res://scenes/main/main.tscn") as PackedScene).instantiate()
	add_child(game)
	check(await wait_chunks(),"initial async chunk queue completes")
	check(game.world.chunks.size()==25,"medium profile loads 5x5 chunks")
	check(game.world.cache.size()<=12,"mesh cache remains bounded")
	await screenshot("menu.png")
	game.started=true
	game.ui.close()
	await frames(90)
	check(game.player.is_on_floor() and absf(game.player.position.y-20)<.15,"character stands on voxel collider")
	check(game.player.arm.get_hit_length()>3.5 and game.player.visual.visible,"spawn camera keeps third-person character visible")
	var ray := PhysicsRayQueryParameters3D.create(Vector3(7,26,3),Vector3(7,15,3),1)
	var hit := get_viewport().world_3d.direct_space_state.intersect_ray(ray)
	check(not hit.is_empty() and absf(hit.position.y-20)<.01 and hit.normal.y>.9,"terrain winding and ray collision")
	var p0: Vector3 = game.player.position
	Controls.touch_move=Vector2(0,-1)
	await frames(45)
	Controls.touch_move=Vector2.ZERO
	await frames(8)
	check(game.player.position.distance_to(p0)>1.5 and game.player.position.y>19.8,"physical walking preserves ground contact")
	p0=game.player.position
	game.player.jump_requested=true
	await frames(12)
	check(game.player.position.y>p0.y+.5,"jump raises character")
	await frames(65)
	check(game.player.is_on_floor(),"jump lands on terrain")
	# Real InputEvent routing: two independent fingers, then a third action finger.
	var touch := InputEventScreenTouch.new()
	touch.index=3;touch.pressed=true;touch.position=Vector2(100,620)
	get_viewport().push_input(touch,true)
	await frames(2)
	touch=InputEventScreenTouch.new()
	touch.index=4;touch.pressed=true;touch.position=Vector2(700,400)
	get_viewport().push_input(touch,true)
	var drag := InputEventScreenDrag.new()
	drag.index=3;drag.position=Vector2(100,575);drag.relative=Vector2(0,-45)
	get_viewport().push_input(drag,true)
	drag=InputEventScreenDrag.new()
	drag.index=4;drag.position=Vector2(740,420);drag.relative=Vector2(40,20)
	var yaw_before: float = game.player.yaw
	get_viewport().push_input(drag,true)
	await frames(3)
	await get_tree().process_frame
	await get_tree().process_frame
	check(Controls.touch_move.y<-.5 and game.player.yaw<yaw_before-.1,"simultaneous joystick and camera fingers")
	touch=InputEventScreenTouch.new()
	touch.index=5;touch.pressed=true;touch.position=game.ui.overlay.zones.jump.get_global_rect().get_center()
	get_viewport().push_input(touch,true)
	await frames(8)
	check(game.player.velocity.y>0,"third touch activates jump while joystick held")
	for id in [3,4,5]:
		touch=InputEventScreenTouch.new();touch.index=id;touch.pressed=false;touch.position=Vector2(740,420)
		get_viewport().push_input(touch,true)
	await frames(65)
	check(Controls.touch_move==Vector2.ZERO and game.ui.overlay.camera_id==-1,"touch release clears control ownership")
	game.player.position=Vector3(3,20.1,8)
	game.player.yaw=0.1
	game.player.pitch=-.33
	await frames(12)
	await screenshot("gameplay.png")
	# A real wall shortens SpringArm rather than clipping the camera through it.
	game.player.position=Vector3(3,20.1,8)
	game.player.yaw=0
	game.player.pitch=-.25
	await frames(6)
	var wall := SurvivalArt.box(game.session,Vector3(3,22,11),Vector3(4,4,.5),Color.GRAY,true)
	await frames(10)
	check(game.player.arm.get_hit_length()<game.player.arm.spring_length-1,"spring arm responds to wall collision")
	wall.queue_free()
	await frames(4)
	# Real NPC UI buttons accept, then resource harvests feed the same economy.
	game.player.position=game.kora.position+Vector3(0,0,2)
	await frames(3)
	game.interact()
	check(game.ui.menu=="dialogue" and press_button("kabul et") and Quests.state()=="active","Kora dialogue accepts quest")
	game.ui.close()
	var wood_before := Inventory.count_item("wood")
	var stone_before := Inventory.count_item("stone")
	var resource_keys: Array[String] = []
	for chunk in game.world.chunks.values():
		for node in chunk.decoration.get_children():
			if not node is Harvestable: continue
			if Inventory.count_item(node.resource_id)>=30: continue
			resource_keys.append(node.stable_id)
			while node.remaining>0:
				node.harvest("axe" if node.resource_id=="wood" else "pickaxe")
	check(Inventory.count_item("wood")>=30 and Inventory.count_item("stone")>=30 and world_harvested_count()>0,"tree and rock depletion grant persistent resources")
	var w := Inventory.count_item("wood")
	var s := Inventory.count_item("stone")
	check(Inventory.craft("axe") and Inventory.count_item("wood")==w-3 and Inventory.count_item("stone")==s-2,"stone axe crafting consumes exact resources")
	check(Inventory.craft("pickaxe") and Inventory.craft("plank") and Inventory.craft("campfire"),"all remaining recipes produce usable items")
	game.ui.show_inventory()
	await screenshot("inventory.png")
	check(game.ui.content.find_children("*","Button",true,false).size()>=17,"inventory exposes slots and actions")
	game.ui.close()
	# Place through the real third-person targeting ray, with a fixed QA camera.
	game.player.position=Vector3(3,20.1,8)
	game.player.camera.top_level=true
	game.player.camera.global_position=Vector3(4,24,8)
	game.player.camera.look_at(Vector3(4.5,20,5.5))
	for i in 6:
		if Inventory.slots[i].id=="dirt": Inventory.select(i)
	game.interaction.cooldown=0
	game.interaction.refresh_target()
	var placed_cell := Vector3i.ZERO
	if not game.interaction.target.is_empty():
		placed_cell=Vector3i((game.interaction.target.position+game.interaction.target.normal*.02).floor())
	var dirt_before := Inventory.count_item("dirt")
	check(game.interaction.place() and game.world.block_at(placed_cell)==2 and Inventory.count_item("dirt")==dirt_before-1,"real target placement consumes a block")
	check(not game.interaction.can_place(Vector3i(game.player.position.floor())),"placement inside player rejected")
	await wait_chunks()
	game.player.camera.global_position=Vector3(4,24,8)
	game.player.camera.look_at(Vector3(placed_cell)+Vector3(.5,.8,.5))
	game.interaction.cooldown=0
	game.interaction.mine()
	game.interaction.cooldown=0
	var mined: bool = game.interaction.mine()
	check(mined and game.world.block_at(placed_cell)==0 and Inventory.count_item("dirt")==dirt_before,"mining placed block returns correct item")
	await wait_chunks()
	# Special 3D structures use the same placement validation and save delta.
	var camp_slot: int = -1
	for i in 12:
		if Inventory.slots[i].id=="campfire": camp_slot=i
	Inventory.swap(camp_slot,5)
	Inventory.select(5)
	game.player.camera.global_position=Vector3(4,24,8)
	game.player.camera.look_at(Vector3(6.5,20,5.5))
	game.interaction.cooldown=0
	check(game.interaction.place() and game.world.structures.size()==1,"campfire placement creates persistent 3D structure")
	if game.world.structures.size()==1:
		var camp_pos: Array = game.world.structures[0].position
		check(not game.interaction.can_place(Vector3i(Vector3(camp_pos[0],camp_pos[1],camp_pos[2]).floor())),"overlapping campfires rejected")
	var east := int(game.world.revisions.get(Vector2i(1,0),0))
	var untouched := int(game.world.revisions.get(Vector2i(0,1),0))
	check(game.world.set_block(Vector3i(15,19,0),0) and int(game.world.revisions.get(Vector2i(1,0),0))==east+1 and int(game.world.revisions.get(Vector2i(0,1),0))==untouched,"edge edit invalidates only affected neighbors")
	check(game.world.set_block(Vector3i(-16,20,5),3) and game.world.block_at(Vector3i(-16,20,5))==3,"negative coordinate block editing")
	await wait_chunks()
	# Finish via Kora's actual hand-in UI; repeats cannot grant another reward.
	game.player.camera.top_level=false
	game.player.position=game.kora.position+Vector3(0,0,2)
	game.interact()
	var coins_before := Inventory.count_item("coin")
	check(press_button("teslim et") and Quests.state()=="completed" and Inventory.count_item("coin")==coins_before+20 and Quests.xp==50,"quest hand-in consumes resources and grants reward")
	check(not Quests.hand_in() and Inventory.count_item("coin")==coins_before+20,"quest reward cannot be duplicated")
	check(game.settlement.beacon_fire.visible and game.settlement.beacon_light.visible,"completed quest lights beacon")
	await screenshot("quest-complete.png")
	game.ui.close()
	game.player.hunger=45
	game.player.health=70
	var berries := Inventory.count_item("berry")
	check(game.use_item("berry") and game.player.hunger==69 and game.player.health==82 and Inventory.count_item("berry")==berries-1,"food restores hunger and health once")
	game.drop_item("wood")
	await frames(2)
	var dropped_before := Inventory.count_item("wood")
	game.interact()
	check(Inventory.count_item("wood")==dropped_before+1 and game.world.drops.is_empty(),"dropped item can be collected")
	var captured: Dictionary = game.snapshot()
	check(Saves.flush(captured),"checksummed atomic save writes to disk")
	check(not Saves.decode_snapshot(Saves.encode_snapshot(captured)).is_empty(),"save envelope round trip")
	var malformed: Dictionary = captured.duplicate(true)
	malformed.world.structures=[{"type":"campfire","position":[1]}]
	check(Saves.decode_snapshot(Saves.encode_snapshot(malformed)).is_empty(),"malformed structure position rejected")
	var bad := Saves.encode_snapshot(captured).replace('"schema":1','"schema":99')
	check(Saves.decode_snapshot(bad).is_empty(),"unsupported save schema rejected")
	var text := FileAccess.get_file_as_string(Saves.FILE)
	check(Saves.decode_snapshot(text.substr(0,text.length()/2)).is_empty(),"truncated save rejected")
	check(Saves.flush(captured),"second save maintains backup")
	var file := FileAccess.open(Saves.FILE,FileAccess.WRITE)
	file.store_string("corrupted");file.close()
	var recovered := Saves.load_game()
	check(not recovered.is_empty() and Saves.recovered_backup,"corrupt main save recovers last valid backup")
	Saves.flush(captured)
	# Stream away and back: bounded live nodes, removed trees and edited blocks survive.
	var peak_chunks: int = 0
	for pos in [Vector3(150,30,150),Vector3(-170,30,130),Vector3(3,20.2,8)]:
		game.player.position=pos
		game.player.velocity=Vector3.ZERO
		game.world.stream_to(pos)
		check(await wait_chunks(),"stream queue at "+str(pos))
		peak_chunks=maxi(peak_chunks,game.world.chunks.size())
	check(peak_chunks<=25 and game.world.chunks.size()==25 and game.world.cache.size()<=12,"streaming unloads chunks and bounds cache")
	check(game.world.block_at(Vector3i(-16,20,5))==3 and game.world.block_at(Vector3i(15,19,0))==0,"terrain edits survive streaming")
	var respawned := false
	for chunk in game.world.chunks.values():
		for node in chunk.decoration.get_children():
			if node is Harvestable and node.stable_id in resource_keys: respawned=true
	check(not respawned,"harvested resources do not respawn after chunk reload")
	game.queue_free()
	await frames(3)
	game=(load("res://scenes/main/main.tscn") as PackedScene).instantiate()
	add_child(game)
	await wait_chunks()
	check(game.loaded_save and Quests.state()=="completed" and game.world.block_at(Vector3i(-16,20,5))==3 and game.world.structures.size()==1 and Inventory.count_item("coin")==coins_before+20,"fresh session restores inventory, quest and world deltas")
	var settings_before := Settings.profile
	Settings.profile="Düşük";Settings.apply()
	game.world.stream_to(game.player.position)
	await wait_chunks()
	check(game.world.chunks.size()==9 and get_viewport().scaling_3d_scale<.7 and not game.day.sun.shadow_enabled,"low profile changes chunk count, scale and shadows")
	Settings.profile="Yüksek";Settings.apply()
	game.world.stream_to(game.player.position)
	await wait_chunks()
	check(game.world.chunks.size()==49 and game.day.sun.shadow_enabled,"high profile changes chunk count and shadows")
	Settings.profile=settings_before;Settings.apply()
	Settings.compatibility_requested=true;Settings.persist()
	var renderer_cfg := ConfigFile.new()
	check(renderer_cfg.load("user://renderer.cfg")==OK and renderer_cfg.get_value("rendering","renderer/rendering_method.mobile","")=="gl_compatibility","Android renderer preference writes startup override")
	Settings.compatibility_requested=false;Settings.persist()
	# Timing reports are diagnostic desktop data, never mobile FPS claims.
	var metrics := {"max_chunk_install_ms":game.world.max_install_ms,"static_memory_bytes":Performance.get_monitor(Performance.MEMORY_STATIC),"elapsed_ms":Time.get_ticks_msec()-start_ms,"renderer":RenderingServer.get_current_rendering_method(),"hardware":"Linux container; no Android hardware"}
	var report := {"passed":passed,"failed":failed,"results":results,"metrics":metrics}
	var out := FileAccess.open("user://test-report.json",FileAccess.WRITE)
	out.store_string(JSON.stringify(report,"  "));out.close()
	print("RESULT "+JSON.stringify(report))
	Saves.flush()
	game.queue_free()
	await frames(3)
	get_tree().quit(0 if failed==0 else 1)

func world_harvested_count() -> int:
	return game.world.harvested.size()
