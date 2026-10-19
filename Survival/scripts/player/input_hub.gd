extends Node
var touch_move := Vector2.ZERO
var look_delta := Vector2.ZERO
var zoom_delta: float = 0.0
var sprint: bool = false
var blocked: bool = true
var actions: Array[String] = []
var mouse_look: bool = false

func _ready() -> void:
	var keys := {"move_left":KEY_A,"move_right":KEY_D,"move_forward":KEY_W,"move_back":KEY_S,"jump":KEY_SPACE,"sprint":KEY_SHIFT,"interact":KEY_E,"mine":KEY_Q,"place":KEY_R,"inventory":KEY_I,"quests":KEY_J,"craft":KEY_C,"pause":KEY_ESCAPE,"use":KEY_F}
	for action in keys:
		if not InputMap.has_action(action):
			InputMap.add_action(action)
		var event := InputEventKey.new()
		event.physical_keycode = keys[action]
		InputMap.action_add_event(action, event)

func movement() -> Vector2:
	if blocked:
		return Vector2.ZERO
	var keyboard := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	return (keyboard + touch_move).limit_length()

func running() -> bool:
	return not blocked and (sprint or Input.is_action_pressed("sprint"))

func queue_action(action: String) -> void:
	if actions.size() < 16:
		actions.append(action)

func reset() -> void:
	touch_move = Vector2.ZERO
	look_delta = Vector2.ZERO
	sprint = false
	mouse_look = false
	actions.clear()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		for action in ["inventory","quests","craft","pause"]:
			if event.is_action_pressed(action):
				queue_action(action)
		if blocked:
			return
		for action in ["jump","interact","mine","place","use"]:
			if event.is_action_pressed(action):
				queue_action(action)
		if event.physical_keycode >= KEY_1 and event.physical_keycode <= KEY_6:
			Inventory.select(event.physical_keycode - KEY_1)
	if blocked:
		return
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_RIGHT:
			mouse_look = event.pressed
		if event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			queue_action("mine")
		if event.pressed and event.button_index == MOUSE_BUTTON_MIDDLE:
			queue_action("place")
		if event.pressed and event.button_index == MOUSE_BUTTON_WHEEL_UP:
			zoom_delta -= 0.5
		if event.pressed and event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			zoom_delta += 0.5
	if event is InputEventMouseMotion and mouse_look:
		look_delta += event.relative
