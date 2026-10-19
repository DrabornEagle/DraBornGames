extends Node3D
## Shared meshes + MultiMesh per chunk; resource physics exists only in loaded chunks.
static var trunk_mesh: CylinderMesh
static var crown_mesh: ArrayMesh
static var rock_mesh: SphereMesh
static var grass_mesh: ArrayMesh
static var leaf_mat: ShaderMaterial
static var grass_mat: ShaderMaterial

static func _prepare() -> void:
	if trunk_mesh != null:
		return
	trunk_mesh = CylinderMesh.new()
	trunk_mesh.top_radius = 0.13
	trunk_mesh.bottom_radius = 0.31
	trunk_mesh.height = 4.5
	trunk_mesh.radial_segments = 7
	trunk_mesh.material = SurvivalArt.material(Color("67503a"))
	var tool := SurfaceTool.new()
	tool.begin(Mesh.PRIMITIVE_TRIANGLES)
	for i in 4:
		var ball := SphereMesh.new()
		ball.radius = 1.6
		ball.height = 3.2
		ball.radial_segments = 9
		ball.rings = 4
		var loc := Vector3(sin(i*2.5)*0.85,3.9+i*0.46,cos(i*2.5)*0.8)
		tool.append_from(ball,0,Transform3D(Basis.from_scale(Vector3(1.0,0.8,1.0)),loc))
	crown_mesh = tool.commit()
	leaf_mat = ShaderMaterial.new()
	leaf_mat.shader = load("res://shaders/foliage.gdshader")
	leaf_mat.set_shader_parameter("tint",Color("42623b"))
	leaf_mat.set_shader_parameter("camera_clear_radius",3.5)
	crown_mesh.surface_set_material(0,leaf_mat)
	rock_mesh = SphereMesh.new()
	rock_mesh.radius = 0.75
	rock_mesh.height = 1.1
	rock_mesh.radial_segments = 7
	rock_mesh.rings = 3
	rock_mesh.material = SurvivalArt.material(Color("777d73"))
	var grass := SurfaceTool.new()
	grass.begin(Mesh.PRIMITIVE_TRIANGLES)
	for angle in [0.0,PI/2.0]:
		var a := Vector3(cos(angle)*0.25,0,sin(angle)*0.25)
		for vertex in [-a,a,Vector3(0,0.8,0)]:
			grass.set_normal(Vector3.UP)
			grass.add_vertex(vertex)
	grass_mesh = grass.commit()
	grass_mat = ShaderMaterial.new()
	grass_mat.shader = leaf_mat.shader
	grass_mat.set_shader_parameter("tint",Color("6a7849"))
	grass_mat.set_shader_parameter("strength",0.12)
	grass_mesh.surface_set_material(0,grass_mat)

func _multimesh(mesh: Mesh, transforms: Array[Transform3D]) -> MultiMeshInstance3D:
	var node := MultiMeshInstance3D.new()
	var multi := MultiMesh.new()
	multi.transform_format = MultiMesh.TRANSFORM_3D
	multi.mesh = mesh
	multi.instance_count = transforms.size()
	for i in transforms.size():
		multi.set_instance_transform(i,transforms[i])
	node.multimesh = multi
	node.visibility_range_end = 95.0
	add_child(node)
	return node

func populate(world: SurvivalWorld, coord: Vector2i) -> void:
	_prepare()
	var rng := RandomNumberGenerator.new()
	rng.seed = absi(world.world_seed + coord.x*73856093 + coord.y*19349663)
	var trunks: Array[Transform3D] = []
	var crowns: Array[Transform3D] = []
	var rocks: Array[Transform3D] = []
	var grasses: Array[Transform3D] = []
	var resources: Array[Dictionary] = []
	var origin := Vector3(coord.x*16,0,coord.y*16)
	# Generate a fixed candidate count regardless of profile, keeping stable resource IDs.
	for i in 16:
		var local := Vector3(rng.randf_range(1,15),0,rng.randf_range(1,15))
		var scale_value := rng.randf_range(0.75,1.2)
		var angle := rng.randf()*TAU
		var global := origin+local
		var y := world.generator.height_at(floori(global.x),floori(global.z))
		if y <= 18 or Vector2(global.x-4,global.z+2).length() < 18.0:
			continue
		local.y = y
		var id := "%d:%d:%d" % [coord.x,coord.y,i]
		if world.harvested.has(id):
			continue
		if i < 10:
			if i >= int(Settings.values().trees):
				continue
			var index := trunks.size()
			var transform := Transform3D(Basis(Vector3.UP,angle).scaled(Vector3.ONE*scale_value),local)
			crowns.append(transform)
			var t := transform
			t.origin += Vector3(0,2.25*scale_value,0)
			trunks.append(t)
			resources.append({"id":id,"kind":"wood","pos":local+Vector3(0,1.4*scale_value,0),"index":index,"size":Vector3(.75,2.8, .75)*scale_value})
		else:
			var index := rocks.size()
			rocks.append(Transform3D(Basis(Vector3.UP,angle).scaled(Vector3(1.0,0.9,1.1)*scale_value),local+Vector3(0,.3,0)))
			resources.append({"id":id,"kind":"stone","pos":local+Vector3(0,.4,0),"index":index,"size":Vector3(1.5,1.1,1.5)*scale_value})
	for i in int(Settings.values().grass):
		var p := Vector3(rng.randf()*16,0,rng.randf()*16)
		var global := origin+p
		p.y = world.generator.height_at(int(global.x),int(global.z))
		if p.y > 18 and Vector2(global.x-4,global.z+2).length() > 9:
			grasses.append(Transform3D(Basis(Vector3.UP,rng.randf()*TAU).scaled(Vector3.ONE*rng.randf_range(.4,1.0)),p))
	var trunk_view := _multimesh(trunk_mesh,trunks)
	var crown_view := _multimesh(crown_mesh,crowns)
	var rock_view := _multimesh(rock_mesh,rocks)
	_multimesh(grass_mesh,grasses)
	for info in resources:
		var body := Harvestable.new()
		body.resource_id = info.kind
		body.stable_id = info.id
		body.world = world
		body.position = info.pos
		var shape := BoxShape3D.new()
		shape.size = info.size
		var collider := CollisionShape3D.new()
		collider.shape = shape
		body.add_child(collider)
		var index := int(info.index)
		var kind := str(info.kind)
		body.on_depleted = func():
			var hidden := Transform3D(Basis.from_scale(Vector3.ONE*0.00001),Vector3(0,-100,0))
			if kind == "wood":
				trunk_view.multimesh.set_instance_transform(index,hidden)
				crown_view.multimesh.set_instance_transform(index,hidden)
			else:
				rock_view.multimesh.set_instance_transform(index,hidden)
		add_child(body)
