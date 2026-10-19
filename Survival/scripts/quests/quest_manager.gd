extends Node
signal changed
signal completed(id: String)
var states: Dictionary = {}
var xp: int = 0

func reset() -> void:
	states = {}
	xp = 0
	changed.emit()

func state(id: String = "dying_beacon") -> String:
	return str(states.get(id, "available"))

func accept(id: String = "dying_beacon") -> bool:
	if not DB.quests.has(id) or state(id) != "available":
		return false
	states[id] = "active"
	changed.emit()
	return true

func ready_to_complete(id: String = "dying_beacon") -> bool:
	return state(id) == "active" and Inventory.has_cost(DB.quests[id].requirements)

func hand_in(id: String = "dying_beacon") -> bool:
	if not ready_to_complete(id):
		return false
	var definition: Dictionary = DB.quests[id]
	if not Inventory.transact(definition.requirements, definition.rewards):
		return false
	states[id] = "completed"
	xp += int(definition.xp)
	changed.emit()
	completed.emit(id)
	return true

func restore(data: Dictionary) -> void:
	states.clear()
	var loaded: Dictionary = data.get("states", {})
	for id in loaded:
		if DB.quests.has(id) and str(loaded[id]) in ["active", "completed"]:
			states[id] = str(loaded[id])
	xp = maxi(0, int(data.get("xp", 0)))
	changed.emit()

func snapshot() -> Dictionary:
	return {"states":states.duplicate(true),"xp":xp}
