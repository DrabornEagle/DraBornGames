class_name SurvivalMinimap
extends Control
var game: Node3D
var radius: float = 30.0
var timer: float = 0.0
var samples: Array[Color] = []

func _ready() -> void:
	mouse_filter = MOUSE_FILTER_IGNORE

func _process(delta: float) -> void:
	if game == null or game.world == null:
		return
	timer -= delta
	if timer<=0:
		timer = 1
		samples.clear()
		for z in 20:
			for x in 20:
				var p: Vector3 = game.player.position+Vector3((x-10)*radius/10,0,(z-10)*radius/10)
				var h: int = game.world.generator.height_at(int(p.x),int(p.z))
				samples.append(Color("39737c") if h<=18 else Color("3b5846").lightened((h-12)*.012))
		queue_redraw()

func _point(world_pos: Vector3) -> Vector2:
	var relative: Vector3 = world_pos-game.player.position
	return size*.5+Vector2(relative.x,relative.z)*size/(radius*2)

func _draw() -> void:
	if samples.size()!=400:
		return
	for z in 20:
		for x in 20:
			draw_rect(Rect2(Vector2(x,z)*size/20.0,size/20.0+Vector2.ONE),samples[z*20+x])
	var p: Vector2 = _point(game.kora.position)
	if Rect2(Vector2.ZERO,size).has_point(p): draw_circle(p,4,Color("82d4d0"))
	p = _point(Vector3(10,20,-8))
	if Rect2(Vector2.ZERO,size).has_point(p): draw_circle(p,5,Color("edbc72"))
	draw_circle(size*.5,4,Color("fff0c2"))
	var direction := Vector2(-sin(game.player.yaw),-cos(game.player.yaw))
	draw_line(size*.5,size*.5+direction*13,Color("fff0c2"),2)
	draw_rect(Rect2(Vector2.ZERO,size),Color(.7,.8,.7,.6),false,2)
