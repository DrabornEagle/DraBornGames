class_name SurvivalPlayer
extends CharacterBody3D
signal stats_changed
signal died
var world: SurvivalWorld
var health: float = 100.0
var stamina: float = 100.0
var hunger: float = 100.0
var yaw: float = 0.1
var pitch: float = -0.33
var fall_speed: float = 0.0
var step_clock: float = 0.0
var visual := CharacterVisual.new()
var pivot := Node3D.new()
var arm := SpringArm3D.new()
var camera := Camera3D.new()
var jump_requested: bool = false
var first_frame: bool = true

func _ready() -> void:
	collision_layer = 2
	collision_mask = 1|4|8
	floor_snap_length = .25
	floor_max_angle = deg_to_rad(48)
	var collider := CollisionShape3D.new()
	var capsule := CapsuleShape3D.new()
	capsule.radius = .33
	capsule.height = 1.88
	collider.shape = capsule
	collider.position.y = .94
	add_child(collider)
	add_child(visual)
	visual.setup("res://assets/models/traveler.glb")
	add_child(pivot)
	pivot.top_level = true
	pivot.add_child(arm)
	arm.add_child(camera)
	arm.spring_length = 6
	arm.margin = .2
	arm.collision_mask = 1|4
	arm.add_excluded_object(get_rid())
	var cam_shape := SphereShape3D.new()
	cam_shape.radius = .19
	arm.shape = cam_shape
	camera.fov = 66
	camera.near = .08
	camera.far = 160
	camera.current = true

func restore(data: Dictionary) -> void:
	var p: Array = data.get("position",[3,20.3,8])
	position = Vector3(float(p[0]),float(p[1]),float(p[2]))
	health = clampf(float(data.get("health",100)),1,100)
	stamina = clampf(float(data.get("stamina",100)),0,100)
	hunger = clampf(float(data.get("hunger",100)),0,100)
	yaw = float(data.get("yaw",.1))
	pitch = clampf(float(data.get("pitch",-.33)),-1.15,.28)
	first_frame = true

func _physics_process(delta: float) -> void:
	if world == null or not world.is_ready_at(global_position) or Controls.blocked:
		jump_requested = false
		return
	var movement := Controls.movement()
	var dir := (Basis(Vector3.UP,yaw)*Vector3(movement.x,0,movement.y)).limit_length()
	var running := Controls.running() and stamina>1.0 and movement.length()>.1
	var speed := 5.8 if running else 3.5
	if running:
		stamina = maxf(0,stamina-14*delta)
	else:
		stamina = minf(100,stamina+19*delta)
	var target_pos := global_position + dir*speed*delta
	if not world.is_ready_at(target_pos):
		dir = Vector3.ZERO
	velocity.x = move_toward(velocity.x,dir.x*speed,22*delta)
	velocity.z = move_toward(velocity.z,dir.z*speed,22*delta)
	var grounded := is_on_floor()
	if not grounded:
		velocity.y -= 20*delta
		fall_speed = minf(fall_speed,velocity.y)
	elif velocity.y < 0:
		velocity.y = 0
	if jump_requested and grounded and stamina>=8:
		velocity.y = 7.0
		stamina -= 8
	jump_requested = false
	move_and_slide()
	if is_on_floor():
		if fall_speed < -12:
			take_damage((-fall_speed-12)*4)
		fall_speed = 0
	if dir.length()>.05:
		visual.rotation.y = lerp_angle(visual.rotation.y,atan2(dir.x,dir.z),1-exp(-12*delta))
	visual.update_motion(Vector2(velocity.x,velocity.z).length(),is_on_floor(),delta)
	hunger = maxf(0,hunger-delta*.032)
	if hunger <= 0:
		health = maxf(0,health-delta*.7)
	elif hunger>65 and health<100:
		health = minf(100,health+delta*.35)
	if global_position.y < -15 or health<=0:
		died.emit()
	stats_changed.emit()

func _process(delta: float) -> void:
	if not Controls.blocked:
		yaw -= Controls.look_delta.x*Settings.sensitivity
		pitch = clampf(pitch-Controls.look_delta.y*Settings.sensitivity,-1.15,.28)
		arm.spring_length = clampf(arm.spring_length+Controls.zoom_delta,2.3,8.0)
	Controls.look_delta = Vector2.ZERO
	Controls.zoom_delta = 0
	var target := global_position+Vector3(0,1.5,0)
	pivot.global_position = target if first_frame else pivot.global_position.lerp(target,1-exp(-18*delta))
	first_frame = false
	pivot.rotation = Vector3(pitch,yaw,0)
	visual.visible = camera.global_position.distance_to(global_position+Vector3(0,1.1,0))>1.2

func take_damage(amount: float) -> void:
	health = maxf(0,health-amount)
	stats_changed.emit()

func eat() -> bool:
	var id := Inventory.selected_id()
	var item: Dictionary = DB.items.get(id,{})
	if not item.has("hunger") or not Inventory.remove_item(id,1):
		return false
	hunger = minf(100,hunger+float(item.hunger))
	health = minf(100,health+float(item.get("heal",0)))
	visual.action("interact")
	stats_changed.emit()
	return true

func snapshot() -> Dictionary:
	return {"position":[position.x,position.y,position.z],"health":health,"stamina":stamina,"hunger":hunger,"yaw":yaw,"pitch":pitch}
