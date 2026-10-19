class_name KoraNPC
extends CharacterBody3D
var visual := CharacterVisual.new()
var day: DayCycle
var world: SurvivalWorld
var routine: String = "İş başında"
var relation: int = 0
var update_timer: float = 0.0
var destination := Vector3(6,20,-5)

func _ready() -> void:
	collision_layer = 8
	collision_mask = 1|4
	var shape := CapsuleShape3D.new()
	shape.radius = .32
	shape.height = 1.8
	var collider := CollisionShape3D.new()
	collider.shape = shape
	collider.position.y = .9
	add_child(collider)
	add_child(visual)
	visual.setup("res://assets/models/kora.glb")
	SurvivalArt.label(self,Vector3(0,2.35,0),"KORA\nFener bekçisi")

func _physics_process(delta: float) -> void:
	if Controls.blocked or world == null or not world.is_ready_at(global_position):
		return
	if global_position.distance_squared_to(world.player.global_position)>1600:
		# Sleeping chunks contain no simulated NPC physics.
		return
	update_timer -= delta
	if update_timer<=0:
		update_timer = .6
		var hour := day.day_time*24.0
		if hour < 6 or hour >= 21:
			destination = Vector3(0,20,-8)
			routine = "Dinleniyor"
		elif hour < 17:
			destination = Vector3(6,20,-6)
			routine = "Feneri denetliyor"
		else:
			destination = Vector3(4,20,1)
			routine = "Kampa dönüyor"
	var direction := destination-global_position
	direction.y = 0
	if direction.length()>.35:
		direction = direction.normalized()
		velocity.x = direction.x*1.15
		velocity.z = direction.z*1.15
		visual.rotation.y = lerp_angle(visual.rotation.y,atan2(direction.x,direction.z),delta*8)
	else:
		velocity.x = 0
		velocity.z = 0
		var towards := world.player.global_position-global_position
		if towards.length()<4:
			visual.rotation.y = lerp_angle(visual.rotation.y,atan2(towards.x,towards.z),delta*5)
	if not is_on_floor():
		velocity.y -= 20*delta
	else:
		velocity.y = 0
	move_and_slide()
	visual.update_motion(Vector2(velocity.x,velocity.z).length(),is_on_floor(),delta)

func dialogue_key() -> String:
	if Quests.state()=="completed": return "complete"
	if Quests.ready_to_complete(): return "ready"
	if Quests.state()=="active": return "active"
	return "offer"
