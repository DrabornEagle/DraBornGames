class_name SurvivalWorld
extends Node3D
signal chunk_ready(coord: Vector2i)
signal edited
const ChunkDecor = preload("res://scripts/world/chunk_decoration.gd")
var world_seed: int = 41729
var generator: VoxelGenerator
var chunks: Dictionary = {}
var edits: Dictionary = {}
var harvested: Dictionary = {}
var structures: Array = []
var drops: Array = []
var queue: Array[Vector2i] = []
var revisions: Dictionary = {}
var dirty: Dictionary = {}
var cache: Dictionary = {}
var thread := Thread.new()
var center := Vector2i(99999,99999)
var player: Node3D
var material: StandardMaterial3D
var max_install_ms: float = 0.0
var jobs_discarded: int = 0
var stream_timer: float = 0.0
var applied_profile: String = ""

func setup(data: Dictionary = {}) -> void:
	applied_profile = Settings.profile
	world_seed = int(data.get("seed",41729))
	generator = VoxelGenerator.new(world_seed)
	edits = data.get("edits",{}).duplicate(true)
	harvested = data.get("harvested",{}).duplicate(true)
	structures = data.get("structures",[]).duplicate(true)
	drops = data.get("drops",[]).duplicate(true)
	material = StandardMaterial3D.new()
	material.albedo_texture = load("res://assets/textures/terrain_atlas.png")
	material.normal_enabled = true
	material.normal_texture = load("res://assets/textures/terrain_normal.png")
	material.normal_scale = 0.4
	material.roughness = 0.93
	material.vertex_color_use_as_albedo = true
	material.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS
	Settings.changed.connect(_profile_changed)

func _profile_changed() -> void:
	if applied_profile == Settings.profile: return
	applied_profile = Settings.profile
	center = Vector2i(99999,99999)
	cache.clear()
	for chunk in chunks.values():
		if is_instance_valid(chunk.decoration):
			chunk.decoration.queue_free()
			chunk.decoration = null
		chunk.decoration = ChunkDecor.new()
		chunk.add_child(chunk.decoration)
		chunk.decoration.populate(self,chunk.coord)

func _process(delta: float) -> void:
	stream_timer -= delta
	if is_instance_valid(player) and stream_timer <= 0.0:
		stream_timer = 0.2
		stream_to(player.global_position)
	if thread.is_started() and not thread.is_alive():
		var result: Dictionary = thread.wait_to_finish()
		var coord: Vector2i = result.coord
		var radius := int(Settings.values().radius)
		if int(revisions.get(coord,0)) == int(result.revision) and _distance(coord,center) <= radius:
			_install(result)
		else:
			jobs_discarded += 1
			if _distance(coord,center) <= radius:
				_enqueue(coord)
	if not thread.is_started() and not queue.is_empty():
		var coord: Vector2i = queue.pop_front()
		if cache.has(coord) and int(cache[coord].revision) == int(revisions.get(coord,0)):
			_install(cache[coord])
			cache.erase(coord)
		else:
			# Snapshot only edits near the task (including halo). All ownership stays on main thread.
			var local_edits: Dictionary = {}
			for key in edits:
				var pos := parse_key(str(key))
				if pos.x >= coord.x*16-1 and pos.x <= coord.x*16+16 and pos.z >= coord.y*16-1 and pos.z <= coord.y*16+16:
					local_edits[key] = edits[key]
			thread.start(ChunkBuilder.build.bind(coord,world_seed,local_edits,int(revisions.get(coord,0))))

func stream_to(pos: Vector3) -> void:
	var next := VoxelGenerator.chunk_at(pos)
	if next == center:
		return
	center = next
	var radius := int(Settings.values().radius)
	queue.clear()
	for z in range(-radius,radius+1):
		for x in range(-radius,radius+1):
			var coord := center + Vector2i(x,z)
			if not chunks.has(coord) or dirty.has(coord):
				_enqueue(coord)
	queue.sort_custom(func(a: Vector2i,b: Vector2i): return a.distance_squared_to(center) < b.distance_squared_to(center))
	for coord in chunks.keys():
		if _distance(coord,center) > radius:
			chunks[coord].queue_free()
			chunks.erase(coord)

static func _distance(a: Vector2i,b: Vector2i) -> int:
	return maxi(absi(a.x-b.x),absi(a.y-b.y))

func _enqueue(coord: Vector2i) -> void:
	if not queue.has(coord):
		queue.append(coord)

func _install(data: Dictionary) -> void:
	var started := Time.get_ticks_usec()
	var coord: Vector2i = data.coord
	var chunk: VoxelChunk
	if chunks.has(coord):
		chunk = chunks[coord]
	else:
		chunk = VoxelChunk.new()
		add_child(chunk)
		chunks[coord] = chunk
	chunk.install(data,material)
	dirty.erase(coord)
	if chunk.decoration == null:
		chunk.decoration = ChunkDecor.new()
		chunk.add_child(chunk.decoration)
		chunk.decoration.populate(self,coord)
	cache[coord] = data
	while cache.size() > 12:
		cache.erase(cache.keys()[0])
	max_install_ms = maxf(max_install_ms,float(Time.get_ticks_usec()-started)/1000.0)
	chunk_ready.emit(coord)

func is_ready_at(pos: Vector3) -> bool:
	var coord := VoxelGenerator.chunk_at(pos)
	# At borders require the next collision surface before movement crosses it.
	for offset in [Vector3(-0.5,0,-0.5),Vector3(0.5,0,0.5)]:
		if not chunks.has(VoxelGenerator.chunk_at(pos+offset)):
			return false
	return chunks.has(coord)

func block_at(pos: Vector3i) -> int:
	return int(edits.get(VoxelGenerator.key(pos),generator.base_block(pos.x,pos.y,pos.z)))

func set_block(pos: Vector3i, id: int) -> bool:
	if pos.y < 1 or pos.y >= 64 or id < 0 or id > 6 or not chunks.has(VoxelGenerator.chunk_at(Vector3(pos))):
		return false
	if block_at(pos) == id:
		return false
	var key := VoxelGenerator.key(pos)
	if generator.base_block(pos.x,pos.y,pos.z) == id:
		edits.erase(key)
	else:
		edits[key] = id
	var coords: Array[Vector2i] = [VoxelGenerator.chunk_at(Vector3(pos))]
	var local_x := posmod(pos.x,16)
	var local_z := posmod(pos.z,16)
	if local_x == 0: coords.append(coords[0]+Vector2i(-1,0))
	if local_x == 15: coords.append(coords[0]+Vector2i(1,0))
	if local_z == 0: coords.append(coords[0]+Vector2i(0,-1))
	if local_z == 15: coords.append(coords[0]+Vector2i(0,1))
	for coord in coords:
		revisions[coord] = int(revisions.get(coord,0))+1
		dirty[coord] = true
		cache.erase(coord)
		if chunks.has(coord):
			_enqueue(coord)
	edited.emit()
	return true

static func parse_key(key: String) -> Vector3i:
	var parts := key.split(",")
	return Vector3i(int(parts[0]),int(parts[1]),int(parts[2]))

func snapshot() -> Dictionary:
	return {"seed":world_seed,"edits":edits.duplicate(true),"harvested":harvested.duplicate(true),"structures":structures.duplicate(true),"drops":drops.duplicate(true)}

func _exit_tree() -> void:
	if thread.is_started():
		thread.wait_to_finish()
