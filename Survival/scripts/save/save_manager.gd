extends Node
## Checksummed envelope, atomic temporary file and last-known-good backup.
signal saved(ok: bool)
const SCHEMA := 1
const FILE := "user://survival_v1.json"
var worker := Thread.new()
var pending: String = ""
var recovered_backup: bool = false

static func encode_snapshot(data: Dictionary) -> String:
	var payload := JSON.stringify(data)
	return JSON.stringify({"schema": SCHEMA, "sha256":payload.sha256_text(),"payload":payload})

static func decode_snapshot(text: String) -> Dictionary:
	var parser := JSON.new()
	if parser.parse(text) != OK:
		return {}
	var envelope = parser.data
	if not envelope is Dictionary or int(envelope.get("schema", -1)) != SCHEMA:
		return {}
	var payload = envelope.get("payload", null)
	if not payload is String or payload.sha256_text() != str(envelope.get("sha256", "")):
		return {}
	var payload_parser := JSON.new()
	if payload_parser.parse(payload) != OK:
		return {}
	var data = payload_parser.data
	if not data is Dictionary:
		return {}
	if not data.get("player", null) is Dictionary or not data.get("world", null) is Dictionary:
		return {}
	var pos = data.player.get("position", [])
	if not pos is Array or pos.size() != 3:
		return {}
	for value in pos:
		if not (value is int or value is float) or not is_finite(float(value)) or absf(float(value)) > 1000000.0:
			return {}
	if not data.get("inventory", null) is Array or data.inventory.size() != 12:
		return {}
	for slot in data.inventory:
		if not slot is Dictionary or not slot.get("id", null) is String or not slot.has("count"):
			return {}
		var id := str(slot.id)
		var count := int(slot.count)
		if id == "":
			if count != 0:
				return {}
		elif not DB.items.has(id) or count <= 0 or count > int(DB.items[id].stack):
			return {}
	if not data.world.get("edits", null) is Dictionary or not data.world.get("harvested", null) is Dictionary or not data.world.get("structures", null) is Array:
		return {}
	if not data.world.get("seed", null) is float and not data.world.get("seed", null) is int:
		return {}
	if not data.get("quests", null) is Dictionary or not data.quests.get("states", null) is Dictionary:
		return {}
	for name_value in ["health","stamina","hunger","yaw","pitch"]:
		var number = data.player.get(name_value,0)
		if not (number is int or number is float) or not is_finite(float(number)):
			return {}
	var time_value = data.get("day_time",0.32)
	if not (time_value is int or time_value is float) or not is_finite(float(time_value)):
		return {}
	if not data.get("npc",{}) is Dictionary:
		return {}
	if data.get("npc",{}).has("position") and not _valid_position(data.npc.position):
		return {}
	for structure in data.world.structures:
		if not structure is Dictionary or structure.get("type","") != "campfire" or not _valid_position(structure.get("position",null)):
			return {}
	if not data.world.get("drops",[]) is Array:
		return {}
	for entry in data.world.get("drops",[]):
		if not entry is Dictionary or not DB.items.has(str(entry.get("id",""))) or not _valid_position(entry.get("position",null)):
			return {}
		if int(entry.get("count",0)) < 1 or int(entry.get("count",0)) > int(DB.items[entry.id].stack):
			return {}
	for key in data.world.edits:
		var parts := str(key).split(",")
		if parts.size() != 3:
			return {}
		for part in parts:
			if not part.is_valid_int():
				return {}
		if int(parts[1]) < 1 or int(parts[1]) >= 64 or int(data.world.edits[key]) < 0 or int(data.world.edits[key]) > 6:
			return {}
	return data

static func _valid_position(value: Variant) -> bool:
	if not value is Array or value.size() != 3:
		return false
	for component in value:
		if not (component is int or component is float) or not is_finite(float(component)) or absf(float(component)) > 1000000:
			return false
	return true

func has_save() -> bool:
	return not load_game().is_empty()

func load_game() -> Dictionary:
	recovered_backup = false
	for path in [FILE, FILE + ".bak"]:
		if FileAccess.file_exists(path):
			var file := FileAccess.open(path, FileAccess.READ)
			if file == null:
				continue
			var data := decode_snapshot(file.get_as_text())
			if not data.is_empty():
				recovered_backup = path.ends_with(".bak")
				return data
	return {}

func request_save(data: Dictionary) -> void:
	pending = encode_snapshot(data)
	_start_pending()

func _start_pending() -> void:
	if worker.is_started() or pending.is_empty():
		return
	var body := pending
	pending = ""
	var path := ProjectSettings.globalize_path(FILE)
	worker.start(_write_blob.bind(path, body))

static func _write_blob(path: String, body: String) -> bool:
	var file := FileAccess.open(path + ".tmp", FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(body)
	file.flush()
	var error := file.get_error()
	file.close()
	if error != OK:
		return false
	# Validate only the envelope here: never touch autoload/scene state on this worker.
	if FileAccess.file_exists(path):
		var old := FileAccess.get_file_as_string(path)
		var parser := JSON.new()
		var env = parser.data if parser.parse(old) == OK else null
		if env is Dictionary and env.get("payload", null) is String and str(env.payload).sha256_text() == str(env.get("sha256", "")):
			if DirAccess.copy_absolute(path, path + ".bak") != OK:
				return false
	return DirAccess.rename_absolute(path + ".tmp", path) == OK

func _process(_delta: float) -> void:
	if worker.is_started() and not worker.is_alive():
		var ok := bool(worker.wait_to_finish())
		saved.emit(ok)
	_start_pending()

func flush(data: Dictionary = {}) -> bool:
	if worker.is_started():
		worker.wait_to_finish()
	if not data.is_empty():
		pending = encode_snapshot(data)
	if pending.is_empty():
		return true
	var body := pending
	pending = ""
	return _write_blob(ProjectSettings.globalize_path(FILE), body)

func _exit_tree() -> void:
	flush()
