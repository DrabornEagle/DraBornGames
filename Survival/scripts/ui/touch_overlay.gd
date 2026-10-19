class_name TouchOverlay
extends Control
var zones: Dictionary = {}
var joystick_id: int = -1
var camera_id: int = -1
var joystick_center := Vector2.ZERO
var knob := Vector2.ZERO
var joystick_radius: float = 66.0

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)

func _process(_delta: float) -> void:
	if Controls.blocked:
		joystick_id = -1
		camera_id = -1
		knob = Vector2.ZERO
		Controls.touch_move = Vector2.ZERO
	queue_redraw()

func _input(event: InputEvent) -> void:
	if Controls.blocked:
		return
	if event is InputEventScreenTouch:
		if event.pressed:
			for action in zones:
				var button: Control = zones[action]
				if button.is_visible_in_tree() and button.get_global_rect().has_point(event.position):
					if str(action).begins_with("slot"):
						Inventory.select(int(str(action).trim_prefix("slot")))
					elif action == "sprint":
						Controls.sprint = not Controls.sprint
					else:
						Controls.queue_action(action)
					get_viewport().set_input_as_handled()
					return
			if event.position.x < size.x*.26 and event.position.y > size.y*.57 and joystick_id==-1:
				joystick_id = event.index
				joystick_center = event.position
				knob = Vector2.ZERO
				get_viewport().set_input_as_handled()
			elif event.position.x>size.x*.28 and event.position.y>size.y*.16 and camera_id==-1:
				camera_id = event.index
				get_viewport().set_input_as_handled()
		else:
			if event.index==joystick_id:
				joystick_id = -1
				Controls.touch_move = Vector2.ZERO
				knob = Vector2.ZERO
				get_viewport().set_input_as_handled()
			if event.index==camera_id:
				camera_id = -1
				get_viewport().set_input_as_handled()
	if event is InputEventScreenDrag:
		if event.index==joystick_id:
			knob = (event.position-joystick_center).limit_length(joystick_radius)
			Controls.touch_move = knob/joystick_radius
			get_viewport().set_input_as_handled()
		elif event.index==camera_id:
			Controls.look_delta += event.relative
			get_viewport().set_input_as_handled()

func _draw() -> void:
	if Controls.blocked:
		return
	var center := joystick_center if joystick_id>=0 else Vector2(115,size.y-125)
	draw_circle(center,joystick_radius,Color(.06,.13,.13,.40))
	draw_arc(center,joystick_radius,0,TAU,48,Color(.8,.83,.70,.35),2,true)
	draw_circle(center+knob,27,Color(.67,.74,.62,.47))
