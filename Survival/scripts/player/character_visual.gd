class_name CharacterVisual
extends Node3D
var model: Node3D
var animator := AnimationPlayer.new()
var current: String = ""
var action_time: float = 0.0

func setup(path: String) -> void:
	model = (load(path) as PackedScene).instantiate()
	add_child(model)
	add_child(animator)
	var library := AnimationLibrary.new()
	for id in ["idle","walk","run","jump","mine","interact","death"]:
		var anim := Animation.new()
		anim.length = 1.6 if id == "idle" else (.65 if id == "run" else 1.0)
		anim.loop_mode = Animation.LOOP_LINEAR if id in ["idle","walk","run"] else Animation.LOOP_NONE
		for part_name in ["ArmL","ArmR","LegL","LegR"]:
			var part := model.find_child(part_name,true,false) as Node3D
			if part == null:
				continue
			var track := anim.add_track(Animation.TYPE_VALUE)
			anim.track_set_path(track,NodePath(str(animator.get_parent().get_path_to(part))+":rotation:x"))
			for i in 9:
				var t := float(i)/8.0
				var phase := 1.0 if part_name in ["ArmL","LegR"] else -1.0
				var value := sin(t*TAU)*phase*(.65 if id == "run" else .42)
				if id == "idle": value = sin(t*TAU)*.035
				if id == "mine": value = -sin(t*PI)*1.7 if part_name == "ArmR" else 0.0
				if id == "interact": value = -sin(t*PI)*.65 if part_name.begins_with("Arm") else 0.0
				if id == "jump": value = -.55 if part_name.begins_with("Arm") else .15
				if id == "death": value = 0.0
				anim.track_insert_key(track,t*anim.length,value)
		library.add_animation(id,anim)
	animator.add_animation_library("",library)
	play("idle")

func play(id: String) -> void:
	if id != current:
		current = id
		animator.play(id,.16)

func action(id: String) -> void:
	action_time = .75
	play(id)

func update_motion(speed: float, grounded: bool, delta: float) -> void:
	action_time = maxf(0,action_time-delta)
	if action_time > 0:
		return
	play("jump" if not grounded else ("run" if speed>4.2 else ("walk" if speed>.2 else "idle")))
