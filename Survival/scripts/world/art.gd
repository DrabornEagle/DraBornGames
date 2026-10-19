class_name SurvivalArt
extends RefCounted
static var materials: Dictionary = {}

static func material(color: Color, emission: float = 0.0) -> StandardMaterial3D:
	var key := str(color)+str(emission)
	if materials.has(key):
		return materials[key]
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.89
	if emission > 0:
		mat.emission_enabled = true
		mat.emission = color
		mat.emission_energy_multiplier = emission
	materials[key] = mat
	return mat

static func box(parent: Node3D, pos: Vector3, size: Vector3, color: Color, solid: bool = false) -> MeshInstance3D:
	var view := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = size
	view.mesh = mesh
	view.material_override = material(color)
	view.position = pos
	parent.add_child(view)
	if solid:
		var body := StaticBody3D.new()
		body.collision_layer = 1
		body.collision_mask = 0
		var collider := CollisionShape3D.new()
		var shape := BoxShape3D.new()
		shape.size = size
		collider.shape = shape
		body.add_child(collider)
		view.add_child(body)
	return view

static func sphere(parent: Node3D, pos: Vector3, scale_value: Vector3, color: Color) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	var mesh := SphereMesh.new()
	mesh.radius = 0.5
	mesh.height = 1.0
	mesh.radial_segments = 10
	mesh.rings = 5
	node.mesh = mesh
	node.material_override = material(color)
	node.position = pos
	node.scale = scale_value
	parent.add_child(node)
	return node

static func label(parent: Node3D, pos: Vector3, text: String, color: Color = Color("f4dbab")) -> Label3D:
	var node := Label3D.new()
	node.text = text
	node.position = pos
	node.font_size = 38
	node.pixel_size = 0.006
	node.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	node.modulate = color
	node.outline_size = 6
	parent.add_child(node)
	return node

static func campfire(parent: Node3D, position_value: Vector3, lit: bool = true) -> Node3D:
	var root := Node3D.new()
	parent.add_child(root)
	root.position = position_value
	for i in 8:
		var a := i*TAU/8.0
		sphere(root,Vector3(cos(a)*0.52,0.12,sin(a)*0.52),Vector3(0.28,0.24,0.27),Color("727970"))
	for i in 3:
		var log_view := box(root,Vector3(0,0.18,0),Vector3(0.8,0.18,0.18),Color("62472d"))
		log_view.rotation.y = i*PI/3.0
	if lit:
		var flame := sphere(root,Vector3(0,0.47,0),Vector3(0.38,0.75,0.38),Color("ffc077"))
		flame.material_override = material(Color("ffae59"),1.7)
		var light := OmniLight3D.new()
		light.light_color = Color("ffb76c")
		light.omni_range = 7
		light.light_energy = 1.7
		light.position.y = 0.8
		root.add_child(light)
	return root
