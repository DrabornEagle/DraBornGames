extends SceneTree
## Launch in a separate process to verify renderer overrides are read before startup.
func _initialize() -> void:
	var expected := "gl_compatibility" if "--expect-compatibility" in OS.get_cmdline_user_args() else "mobile"
	var actual := RenderingServer.get_current_rendering_method()
	print("RENDERER_BOOT "+JSON.stringify({"expected":expected,"actual":actual,"passed":actual==expected}))
	quit(0 if expected==actual else 1)
