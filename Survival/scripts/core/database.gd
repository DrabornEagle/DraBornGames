extends Node
## Offline content registry. Data lives in JSON; identifiers survive save migrations.
var items: Dictionary = {}
var blocks: Dictionary = {}
var recipes: Dictionary = {}
var quests: Dictionary = {}
var npcs: Dictionary = {}

func _ready() -> void:
	items = read_json("res://data/items/items.json")
	blocks = read_json("res://data/blocks/blocks.json")
	recipes = read_json("res://data/recipes/recipes.json")
	quests = read_json("res://data/quests/quests.json")
	npcs = read_json("res://data/npcs/kora.json")

func read_json(path: String) -> Dictionary:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		push_error("Eksik veri dosyası: " + path)
		return {}
	var value = JSON.parse_string(file.get_as_text())
	if not value is Dictionary:
		push_error("Geçersiz JSON: " + path)
		return {}
	return value

func item_name(id: String) -> String:
	return str(items.get(id, {}).get("name", id))
