class_name WorldPickup
extends Node3D
var entry: Dictionary = {}
var world: SurvivalWorld
var phase: float = 0.0

func _ready() -> void:
	add_to_group("loose_items")
	var p: Array = entry.position
	position = Vector3(float(p[0]),float(p[1]),float(p[2]))
	var view := SurvivalArt.sphere(self,Vector3.ZERO,Vector3.ONE*.35,Color("bdad7a"))
	view.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	SurvivalArt.label(self,Vector3(0,.5,0),DB.item_name(str(entry.id))+" × "+str(entry.count))

func collect() -> bool:
	if not Inventory.add_item(str(entry.id),int(entry.count)):
		return false
	world.drops.erase(entry)
	queue_free()
	return true
