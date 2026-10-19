class_name WorldInteraction
extends Node3D
signal message(text: String)
signal effect(id: String)
var player: SurvivalPlayer
var world: SurvivalWorld
var target: Dictionary = {}
var preview := MeshInstance3D.new()
var preview_mat := StandardMaterial3D.new()
var target_timer: float = 0.0
var cooldown: float = 0.0
var mining_key: String = ""
var mining_hits: int = 0

func _ready() -> void:
	var mesh := BoxMesh.new()
	mesh.size = Vector3.ONE*1.015
	preview.mesh = mesh
	preview_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	preview_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	preview.material_override = preview_mat
	preview.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(preview)
	preview.top_level = true

func _process(delta: float) -> void:
	cooldown = maxf(0,cooldown-delta)
	target_timer -= delta
	if Controls.blocked:
		preview.visible = false
		return
	if target_timer<=0:
		target_timer = .065
		refresh_target()

func refresh_target() -> void:
	var from := player.camera.global_position
	var to := from-player.camera.global_basis.z*14
	var query := PhysicsRayQueryParameters3D.create(from,to,1|4)
	query.exclude = [player.get_rid()]
	target = get_world_3d().direct_space_state.intersect_ray(query)
	preview.visible = false
	if target.is_empty() or player.global_position.distance_to(target.position)>5.5:
		target.clear()
		return
	if not target.collider.is_in_group("terrain"):
		return
	var item: Dictionary = DB.items.get(Inventory.selected_id(),{})
	var placing := item.has("block") or item.has("structure")
	var cell := Vector3i((target.position+target.normal*(.02 if placing else -.02)).floor())
	preview.global_position = Vector3(cell)+Vector3.ONE*.5
	preview_mat.albedo_color = Color(.46,.83,.67,.30) if (placing and can_place(cell)) else (Color(.9,.38,.25,.24) if placing else Color(.95,.83,.50,.13))
	preview.visible = true

func can_place(cell: Vector3i) -> bool:
	if cell.y<1 or cell.y>=64 or world.block_at(cell)!=0 or not world.is_ready_at(Vector3(cell)+Vector3.ONE*.5):
		return false
	for entry in world.structures:
		var p: Array = entry.position
		if Vector3i(Vector3(float(p[0]),float(p[1]),float(p[2])).floor()) == cell:
			return false
	var player_box := AABB(player.global_position-Vector3(.37,0,.37),Vector3(.74,1.92,.74))
	if player_box.intersects(AABB(Vector3(cell),Vector3.ONE)):
		return false
	var shape := BoxShape3D.new()
	shape.size = Vector3.ONE*.94
	var query := PhysicsShapeQueryParameters3D.new()
	query.shape = shape
	query.transform.origin = Vector3(cell)+Vector3.ONE*.5
	query.collision_mask = 1|2|4|8
	return get_world_3d().direct_space_state.intersect_shape(query,1).is_empty()

func mine() -> bool:
	if cooldown>0:
		return false
	refresh_target()
	if target.is_empty():
		message.emit("Hedefi ortadaki nişangâha getir ve yaklaş.")
		return false
	cooldown = .34
	player.visual.action("mine")
	if target.collider is Harvestable:
		var result: Dictionary = target.collider.harvest(str(DB.items.get(Inventory.selected_id(),{}).get("tool","")))
		message.emit(str(result.text))
		if result.sound != "": effect.emit(result.sound)
		return true
	if not target.collider.is_in_group("terrain"):
		message.emit("Yerleşim yapıları koruma altında.")
		return false
	var cell := Vector3i((target.position-target.normal*.02).floor())
	var id := world.block_at(cell)
	if cell.y<=0 or id==0:
		return false
	var definition: Dictionary = DB.blocks.get(str(id),{})
	var key := VoxelGenerator.key(cell)
	if key != mining_key:
		mining_key = key
		mining_hits = 0
	var tool := str(DB.items.get(Inventory.selected_id(),{}).get("tool",""))
	mining_hits += 3 if tool!="" and tool==str(definition.get("tool","axe")) else 1
	effect.emit("stone_hit" if id==3 else "chop")
	if mining_hits<int(definition.get("hardness",2)):
		message.emit("%s · %d/%d" % [definition.get("name","Blok"),mining_hits,int(definition.get("hardness",2))])
		return true
	var drop := str(definition.get("drop","dirt"))
	if not Inventory.add_item(drop,1):
		message.emit("Envanter dolu.")
		return false
	if not world.set_block(cell,0):
		Inventory.remove_item(drop,1)
		return false
	mining_hits = 0
	message.emit("+1 "+DB.item_name(drop))
	return true

func place() -> bool:
	if cooldown>0:
		return false
	refresh_target()
	var id := Inventory.selected_id()
	var item: Dictionary = DB.items.get(id,{})
	if not item.has("block") and not item.has("structure"):
		message.emit("Hızlı çubuktan bir yapı bloğu veya kamp ateşi seç.")
		return false
	if target.is_empty() or not target.collider.is_in_group("terrain"):
		message.emit("Yerleştirmek için yakındaki bir blok yüzeyini hedefle.")
		return false
	var cell := Vector3i((target.position+target.normal*.02).floor())
	if item.has("structure") and target.normal.y < 0.9:
		message.emit("Kamp ateşini düz bir üst yüzeye yerleştir.")
		return false
	if not can_place(cell):
		message.emit("Bu konum dolu veya karaktere çok yakın.")
		return false
	if not Inventory.remove_item(id,1):
		return false
	if item.has("block"):
		if not world.set_block(cell,int(item.block)):
			Inventory.add_item(id,1)
			return false
	else:
		var pos := Vector3(cell)+Vector3(.5,0,.5)
		world.structures.append({"type":"campfire","position":[pos.x,pos.y,pos.z]})
		SurvivalArt.campfire(world,pos)
		world.edited.emit()
	cooldown = .25
	effect.emit("chop")
	message.emit(DB.item_name(id)+" yerleştirildi.")
	return true
