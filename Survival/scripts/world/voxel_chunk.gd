class_name VoxelChunk
extends Node3D
var coord := Vector2i.ZERO
var triangles: int = 0
var terrain_mesh := MeshInstance3D.new()
var body := StaticBody3D.new()
var collision := CollisionShape3D.new()
var decoration: Node3D

func _init() -> void:
	add_child(terrain_mesh)
	add_child(body)
	body.add_child(collision)
	body.collision_layer = 1
	body.collision_mask = 0
	body.add_to_group("terrain")

func install(data: Dictionary, material: Material) -> void:
	coord = data.coord
	position = Vector3(coord.x*16,0,coord.y*16)
	var mesh := ArrayMesh.new()
	mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, data.arrays)
	mesh.surface_set_material(0, material)
	terrain_mesh.mesh = mesh
	var shape := ConcavePolygonShape3D.new()
	shape.set_faces(data.faces)
	collision.shape = shape
	triangles = int(data.triangles)
