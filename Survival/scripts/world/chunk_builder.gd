class_name ChunkBuilder
extends RefCounted
## Worker-only plain data preparation. No scene tree or physics resources.
const DIRECTIONS := [Vector3i(1,0,0),Vector3i(-1,0,0),Vector3i(0,1,0),Vector3i(0,-1,0),Vector3i(0,0,1),Vector3i(0,0,-1)]
const CORNERS := [
	[Vector3(1,0,0),Vector3(1,1,0),Vector3(1,1,1),Vector3(1,0,1)],
	[Vector3(0,0,1),Vector3(0,1,1),Vector3(0,1,0),Vector3(0,0,0)],
	[Vector3(0,1,1),Vector3(1,1,1),Vector3(1,1,0),Vector3(0,1,0)],
	[Vector3(0,0,0),Vector3(1,0,0),Vector3(1,0,1),Vector3(0,0,1)],
	[Vector3(1,0,1),Vector3(1,1,1),Vector3(0,1,1),Vector3(0,0,1)],
	[Vector3(0,0,0),Vector3(0,1,0),Vector3(1,1,0),Vector3(1,0,0)]
]
const FACE_UVS := [Vector2(0,1),Vector2(0,0),Vector2(1,0),Vector2(1,1)]

static func build(coord: Vector2i, seed_value: int, edits: Dictionary, revision: int) -> Dictionary:
	var generator := VoxelGenerator.new(seed_value)
	var origin := Vector3i(coord.x * 16, 0, coord.y * 16)
	# One-cell halo makes seam culling agree with neighbors, including edited edges.
	var voxels := PackedByteArray()
	voxels.resize(18 * 64 * 18)
	for z in range(-1,17):
		for x in range(-1,17):
			var height := generator.height_at(origin.x+x,origin.z+z)
			for y in 64:
				var pos := Vector3i(origin.x+x,y,origin.z+z)
				voxels[((z+1)*18+(x+1))*64+y] = int(edits.get(VoxelGenerator.key(pos),VoxelGenerator.column_block(height,y)))
	var vertices := PackedVector3Array()
	var normals := PackedVector3Array()
	var uvs := PackedVector2Array()
	var colors := PackedColorArray()
	var indices := PackedInt32Array()
	for z in 16:
		for x in 16:
			for y in 64:
				var id := int(voxels[((z+1)*18+(x+1))*64+y])
				if id == 0:
					continue
				for face in 6:
					var n: Vector3i = DIRECTIONS[face]
					var ny := y+n.y
					if ny < 0:
						continue
					if ny < 64 and voxels[((z+n.z+1)*18+(x+n.x+1))*64+ny] != 0:
						continue
					var tile := id - 1
					if id == 1 and face != 2:
						tile = 1
					var start := vertices.size()
					var shade := 1.0 if face == 2 else (0.76 if face == 3 else 0.91)
					for corner in 4:
						vertices.append(Vector3(x,y,z) + CORNERS[face][corner])
						normals.append(Vector3(n))
						var uv: Vector2 = FACE_UVS[corner]
						uv = uv * 0.96 + Vector2(0.02,0.02)
						uv.x = (uv.x + tile) / 6.0
						uvs.append(uv)
						colors.append(Color(shade,shade,shade))
					# Godot front faces wind clockwise (cross product points inward).
					for index in [0,2,1,0,3,2]:
						indices.append(start+index)
	var arrays: Array = []
	arrays.resize(Mesh.ARRAY_MAX)
	arrays[Mesh.ARRAY_VERTEX] = vertices
	arrays[Mesh.ARRAY_NORMAL] = normals
	arrays[Mesh.ARRAY_TEX_UV] = uvs
	arrays[Mesh.ARRAY_COLOR] = colors
	arrays[Mesh.ARRAY_INDEX] = indices
	var faces := PackedVector3Array()
	faces.resize(indices.size())
	for i in indices.size():
		faces[i] = vertices[indices[i]]
	return {"coord":coord,"revision":revision,"arrays":arrays,"faces":faces,"triangles":indices.size()/3}
