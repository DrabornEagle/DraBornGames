class_name Settlement
extends Node3D
var beacon_fire: Node3D
var beacon_light := OmniLight3D.new()
var banner: Label3D
var pickups: Array[Node3D] = []

func _ready() -> void:
	_hut(Vector3(0,20,-8),Color("85745b"))
	_hut(Vector3(12,20,-1),Color("6d7a69"))
	SurvivalArt.campfire(self,Vector3(3,20,5))
	for i in 4:
		SurvivalArt.box(self,Vector3(8.2+i*.9,20.15,-7),Vector3(.8,.3,1.2),Color("8d9180"),true)
	SurvivalArt.box(self,Vector3(10,21.05,-8),Vector3(2,2.1,2),Color("737c76"),true)
	SurvivalArt.box(self,Vector3(10,22.25,-8),Vector3(2.4,.3,2.4),Color("9f9b80"),true)
	beacon_fire = SurvivalArt.campfire(self,Vector3(10,22.4,-8))
	beacon_light.position = Vector3(10,24,-8)
	beacon_light.light_color = Color("ffc582")
	beacon_light.omni_range = 20
	beacon_light.light_energy = 4
	add_child(beacon_light)
	banner = SurvivalArt.label(self,Vector3(10,24.8,-8),"SÖNEN FENER")
	set_beacon(Quests.state() == "completed")
	Quests.completed.connect(func(_id: String): set_beacon(true))
	var water := MeshInstance3D.new()
	var disc := CylinderMesh.new()
	disc.top_radius = 7.8
	disc.bottom_radius = 7.8
	disc.height = 0.05
	disc.radial_segments = 48
	water.mesh = disc
	water.position = Vector3(-18,18,13)
	var mat := ShaderMaterial.new()
	mat.shader = load("res://shaders/water.gdshader")
	water.material_override = mat
	add_child(water)
	SurvivalArt.label(self,Vector3(3,22.2,8),"SINIR ORMANI\nBaşlangıç kampı",Color("d8c399"))

func set_beacon(lit: bool) -> void:
	beacon_fire.visible = lit
	beacon_light.visible = lit
	banner.text = "FENER YANIYOR" if lit else "SÖNEN FENER"

func _hut(pos: Vector3, color: Color) -> void:
	var root := Node3D.new()
	add_child(root)
	root.position = pos
	SurvivalArt.box(root,Vector3(0,.12,0),Vector3(4.4,.24,3.8),Color("79654c"),true)
	SurvivalArt.box(root,Vector3(-2,1.5,0),Vector3(.22,3,3.6),color,true)
	SurvivalArt.box(root,Vector3(2,1.5,0),Vector3(.22,3,3.6),color,true)
	SurvivalArt.box(root,Vector3(0,1.5,-1.7),Vector3(4,3,.22),color,true)
	for x in [-1.5,1.5]:
		SurvivalArt.box(root,Vector3(x,1.5,1.7),Vector3(1,3,.22),color,true)
	for s in [-1,1]:
		var roof := SurvivalArt.box(root,Vector3(s*1.1,3.15,0),Vector3(2.7,.18,4.2),Color("4d5141"),true)
		roof.rotation.z = -s*.48
	SurvivalArt.box(root,Vector3(0,2.8,1.73),Vector3(1.1,.4,.25),Color("ae9266"))
