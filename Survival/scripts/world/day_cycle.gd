class_name DayCycle
extends Node3D
var day_time: float = 0.32
var sun := DirectionalLight3D.new()
var moon := DirectionalLight3D.new()
var environment := Environment.new()
var world_environment := WorldEnvironment.new()
var ambient_timer: float = 0.0

func _ready() -> void:
	environment.background_mode = Environment.BG_SKY
	var sky := Sky.new()
	var sky_material := ProceduralSkyMaterial.new()
	sky_material.sky_top_color = Color("436274")
	sky_material.sky_horizon_color = Color("c1c7b4")
	sky_material.ground_bottom_color = Color("354640")
	sky_material.ground_horizon_color = Color("b3b69b")
	sky.sky_material = sky_material
	environment.sky = sky
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	environment.ambient_light_color = Color("9cbaa8")
	environment.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	environment.fog_enabled = true
	environment.fog_light_color = Color("9cae9e")
	environment.fog_density = 0.009
	world_environment.environment = environment
	add_child(world_environment)
	sun.light_color = Color("ffdfae")
	sun.directional_shadow_max_distance = 55
	sun.directional_shadow_mode = DirectionalLight3D.SHADOW_PARALLEL_2_SPLITS
	add_child(sun)
	moon.light_color = Color("9ab7cf")
	add_child(moon)
	Settings.changed.connect(_settings_changed)
	_settings_changed()
	_update_light()

func _settings_changed() -> void:
	sun.shadow_enabled = bool(Settings.values().shadows)

func _process(delta: float) -> void:
	if Controls.blocked:
		return
	day_time = fposmod(day_time+delta/1200.0,1.0)
	ambient_timer += delta
	if ambient_timer > 0.15:
		ambient_timer = 0
		_update_light()

func _update_light() -> void:
	var angle := day_time*TAU
	var daylight := clampf(sin(angle),0.0,1.0)
	sun.rotation = Vector3(-angle, -.65, 0)
	sun.light_energy = daylight*1.35
	sun.visible = daylight > .01
	moon.rotation = Vector3(-angle+PI,-.65,0)
	moon.light_energy = 0.22
	moon.visible = daylight < .1
	environment.ambient_light_energy = lerpf(.28,.65,daylight)
	environment.fog_light_color = Color("203541").lerp(Color("9cae9e"),daylight)
	var sky_mat := environment.sky.sky_material as ProceduralSkyMaterial
	sky_mat.sky_top_color = Color("0a1826").lerp(Color("436c82"),daylight)
	sky_mat.sky_horizon_color = Color("34434b").lerp(Color("ccd0b9"),daylight)

func clock_text() -> String:
	var hour := int(day_time*24)
	var minute := int(fmod(day_time*24*60,60))
	return "%02d:%02d" % [hour,minute]
