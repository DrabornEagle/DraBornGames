extends Node
signal changed
const PROFILES := {
	"Düşük": {"radius": 1, "grass": 24, "trees": 4, "scale": 0.65, "shadows": false, "fps": 30},
	"Orta": {"radius": 2, "grass": 60, "trees": 7, "scale": 0.85, "shadows": true, "fps": 45},
	"Yüksek": {"radius": 3, "grass": 110, "trees": 10, "scale": 1.0, "shadows": true, "fps": 60}
}
var profile: String = "Orta"
var sensitivity: float = 0.005
var volumes: Dictionary = {"Master": 0.8, "Music": 0.45, "Effects": 0.8, "Ambience": 0.5}
var compatibility_requested: bool = false

func _ready() -> void:
	var cfg := ConfigFile.new()
	if cfg.load("user://settings.cfg") == OK:
		profile = str(cfg.get_value("graphics", "profile", "Orta"))
		sensitivity = float(cfg.get_value("controls", "sensitivity", 0.005))
		compatibility_requested = bool(cfg.get_value("graphics", "compatibility", false))
		for bus in volumes:
			volumes[bus] = clampf(float(cfg.get_value("audio", bus, volumes[bus])), 0.0, 1.0)
	if not PROFILES.has(profile):
		profile = "Orta"
	apply()

func values() -> Dictionary:
	return PROFILES[profile]

func apply() -> void:
	Engine.max_fps = int(values().fps)
	get_viewport().scaling_3d_scale = float(values().scale)
	for bus in volumes:
		var index := AudioServer.get_bus_index(bus)
		if index >= 0:
			AudioServer.set_bus_volume_db(index, linear_to_db(maxf(0.001, float(volumes[bus]))))
	changed.emit()

func persist() -> void:
	var cfg := ConfigFile.new()
	cfg.set_value("graphics", "profile", profile)
	cfg.set_value("graphics", "compatibility", compatibility_requested)
	cfg.set_value("controls", "sensitivity", sensitivity)
	for bus in volumes:
		cfg.set_value("audio", bus, volumes[bus])
	cfg.save("user://settings.cfg")
	# Read by Godot before renderer initialization on the next launch, including Android.
	var renderer_override := ConfigFile.new()
	var method := "gl_compatibility" if compatibility_requested else "mobile"
	renderer_override.set_value("rendering","renderer/rendering_method",method)
	renderer_override.set_value("rendering","renderer/rendering_method.mobile",method)
	renderer_override.save("user://renderer.cfg")
	apply()
