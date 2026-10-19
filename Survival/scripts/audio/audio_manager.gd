class_name SurvivalAudio
extends Node
var ambience := AudioStreamPlayer.new()
var effects: Array[AudioStreamPlayer] = []
var next_voice: int = 0

func _ready() -> void:
	for bus_name in ["Music","Effects","Ambience"]:
		if AudioServer.get_bus_index(bus_name)<0:
			AudioServer.add_bus()
			var index := AudioServer.bus_count-1
			AudioServer.set_bus_name(index,bus_name)
			AudioServer.set_bus_send(index,"Master")
	add_child(ambience)
	ambience.bus = "Ambience"
	var stream := load("res://assets/audio/forest.wav") as AudioStreamWAV
	stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	stream.loop_end = stream.data.size()/2
	ambience.stream = stream
	ambience.play()
	for i in 4:
		var voice := AudioStreamPlayer.new()
		voice.bus = "Effects"
		add_child(voice)
		effects.append(voice)
	Settings.apply()

func play(id: String) -> void:
	if not id in ["chop","stone_hit","craft","success"]:
		return
	var voice := effects[next_voice]
	next_voice = (next_voice+1)%effects.size()
	voice.stream = load("res://assets/audio/"+id+".wav")
	voice.play()
