extends Node
signal changed
const SIZE := 12
var slots: Array[Dictionary] = []
var selected: int = 0

func _ready() -> void:
	reset()

func reset() -> void:
	slots.clear()
	for i in SIZE:
		slots.append({"id": "", "count": 0})
	selected = 0

func start_items() -> void:
	reset()
	add_item("berry", 4)
	add_item("dirt", 8)
	changed.emit()

func count_item(id: String) -> int:
	var total: int = 0
	for slot in slots:
		if slot.id == id:
			total += int(slot.count)
	return total

func add_item(id: String, amount: int) -> bool:
	if not DB.items.has(id) or amount <= 0:
		return false
	var candidate: Array[Dictionary] = slots.duplicate(true)
	var limit := int(DB.items[id].stack)
	var remaining := amount
	for slot in candidate:
		if slot.id == id and int(slot.count) < limit:
			var take := mini(limit - int(slot.count), remaining)
			slot.count = int(slot.count) + take
			remaining -= take
	for slot in candidate:
		if slot.id == "" and remaining > 0:
			var take := mini(limit, remaining)
			slot.id = id
			slot.count = take
			remaining -= take
	if remaining > 0:
		return false
	slots = candidate
	changed.emit()
	return true

func remove_item(id: String, amount: int) -> bool:
	if amount <= 0 or count_item(id) < amount:
		return false
	var remaining := amount
	for slot in slots:
		if slot.id == id:
			var take := mini(int(slot.count), remaining)
			slot.count = int(slot.count) - take
			remaining -= take
			if int(slot.count) == 0:
				slot.id = ""
	changed.emit()
	return true

func has_cost(cost: Dictionary) -> bool:
	for id in cost:
		if count_item(str(id)) < int(cost[id]):
			return false
	return true

func transact(cost: Dictionary, output: Dictionary) -> bool:
	if not has_cost(cost):
		return false
	var before: Array[Dictionary] = slots.duplicate(true)
	for id in cost:
		remove_item(str(id), int(cost[id]))
	for id in output:
		if not add_item(str(id), int(output[id])):
			slots = before
			changed.emit()
			return false
	changed.emit()
	return true

func craft(id: String) -> bool:
	if not DB.recipes.has(id):
		return false
	return transact(DB.recipes[id].cost, DB.recipes[id].output)

func selected_id() -> String:
	return str(slots[selected].id)

func select(index: int) -> void:
	selected = clampi(index, 0, 5)
	changed.emit()

func swap(a: int, b: int) -> void:
	if a < 0 or b < 0 or a >= SIZE or b >= SIZE:
		return
	var item := slots[a]
	slots[a] = slots[b]
	slots[b] = item
	changed.emit()

func restore(data: Array, slot: int = 0) -> bool:
	if data.size() != SIZE:
		return false
	var candidate: Array[Dictionary] = []
	for entry in data:
		if not entry is Dictionary or not entry.has("id") or not entry.has("count"):
			return false
		var id := str(entry.id)
		var amount := int(entry.count)
		if id != "" and (not DB.items.has(id) or amount < 1 or amount > int(DB.items[id].stack)):
			return false
		if id == "" and amount != 0:
			return false
		candidate.append({"id":id,"count":amount})
	slots = candidate
	selected = clampi(slot, 0, 5)
	changed.emit()
	return true
