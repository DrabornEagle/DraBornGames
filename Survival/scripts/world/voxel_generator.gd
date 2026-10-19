class_name VoxelGenerator
extends RefCounted
const SIZE := 16
const HEIGHT := 64
var terrain := FastNoiseLite.new()
var detail := FastNoiseLite.new()
var world_seed: int

func _init(seed_value: int = 41729) -> void:
	world_seed = seed_value
	terrain.seed = seed_value
	terrain.frequency = 0.014
	terrain.fractal_octaves = 3
	detail.seed = seed_value + 71
	detail.frequency = 0.055

func height_at(x: int, z: int) -> int:
	var distance := Vector2(x - 4, z + 2).length()
	var natural := 20.0 + terrain.get_noise_2d(x, z) * 11.0 + detail.get_noise_2d(x,z) * 2.5
	var blend := smoothstep(13.0, 26.0, distance)
	var height := lerpf(20.0, natural, blend)
	var lake := Vector2(x + 18, z - 13).length()
	if lake < 10.0:
		height = lerpf(16.0, height, smoothstep(6.5, 10.0, lake))
	return clampi(int(round(height)), 7, 49)

func base_block(x: int, y: int, z: int) -> int:
	return column_block(height_at(x,z), y)

static func column_block(height: int, y: int) -> int:
	if y < 0:
		return 3
	if y >= HEIGHT or y >= height:
		return 0
	if y == height - 1:
		return 4 if height <= 18 else 1
	if y >= height - 4:
		return 4 if height <= 18 else 2
	return 3

static func key(pos: Vector3i) -> String:
	return "%d,%d,%d" % [pos.x,pos.y,pos.z]

static func chunk_at(pos: Vector3) -> Vector2i:
	return Vector2i(floori(pos.x / SIZE), floori(pos.z / SIZE))
