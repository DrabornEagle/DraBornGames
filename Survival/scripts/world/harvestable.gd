class_name Harvestable
extends StaticBody3D
var resource_id: String = "wood"
var stable_id: String = ""
var remaining: int = 4
var world: SurvivalWorld
var on_depleted: Callable

func _init() -> void:
	collision_layer = 4
	collision_mask = 0

func harvest(tool: String) -> Dictionary:
	var effective := (resource_id == "wood" and tool == "axe") or (resource_id == "stone" and tool == "pickaxe") or resource_id == "berry"
	remaining -= 2 if effective else 1
	if remaining > 0:
		return {"text":"%s · %d vuruş kaldı" % [DB.item_name(resource_id),remaining],"sound":"chop" if resource_id == "wood" else "stone_hit"}
	var amount := 5 if resource_id == "wood" else (4 if resource_id == "stone" else 3)
	if not Inventory.add_item(resource_id,amount):
		remaining = 1
		return {"text":"Envanter dolu. Bir yuva boşalt.","sound":""}
	world.harvested[stable_id] = true
	if on_depleted.is_valid():
		on_depleted.call()
	collision_layer = 0
	queue_free()
	world.edited.emit()
	return {"text":"+%d %s" % [amount,DB.item_name(resource_id)],"sound":"chop" if resource_id == "wood" else "stone_hit"}
