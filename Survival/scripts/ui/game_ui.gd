class_name SurvivalUI
extends CanvasLayer
const CREAM := Color("f0e8ce")
const GOLD := Color("e2bd7d")
const MUTED := Color("a9b7a5")
var game: Node3D
var root := Control.new()
var safe := Control.new()
var hud := Control.new()
var overlay := TouchOverlay.new()
var modal := PanelContainer.new()
var modal_box := VBoxContainer.new()
var title_label := Label.new()
var content := VBoxContainer.new()
var toast_label := Label.new()
var toast_timer: float = 0.0
var menu: String = "main"
var health_bar := ProgressBar.new()
var stamina_bar := ProgressBar.new()
var hunger_bar := ProgressBar.new()
var quest_label := Label.new()
var info_label := Label.new()
var interaction_button: Button
var hotbar: Array[Button] = []
var inventory_cursor: int = 0
var swap_from: int = -1
var loading_label := Label.new()
var ui_timer: float = 0.0

func _ready() -> void:
	layer = 10
	add_child(root)
	root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.theme = _theme()
	root.add_child(safe)
	safe.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	safe.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.resized.connect(_safe_area)
	_safe_area()
	safe.add_child(hud)
	hud.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_build_hud()
	root.add_child(overlay)
	root.add_child(modal)
	modal.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	modal.offset_left = -430
	modal.offset_right = 430
	modal.offset_top = -302
	modal.offset_bottom = 302
	modal.add_theme_stylebox_override("panel",_panel(Color(.045,.095,.095,.97),22))
	var margin := MarginContainer.new()
	for side in ["margin_left","margin_right","margin_top","margin_bottom"]:
		margin.add_theme_constant_override(side,24)
	modal.add_child(margin)
	margin.add_child(modal_box)
	modal_box.add_theme_constant_override("separation",14)
	modal_box.add_child(title_label)
	title_label.add_theme_font_size_override("font_size",30)
	title_label.add_theme_color_override("font_color",GOLD)
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	modal_box.add_child(scroll)
	scroll.add_child(content)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_theme_constant_override("separation",12)
	root.add_child(toast_label)
	toast_label.set_anchors_and_offsets_preset(Control.PRESET_CENTER_BOTTOM)
	toast_label.offset_left = -400
	toast_label.offset_right = 400
	toast_label.offset_top = -175
	toast_label.offset_bottom = -132
	toast_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	toast_label.add_theme_color_override("font_color",CREAM)
	toast_label.add_theme_font_size_override("font_size",20)
	toast_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	Inventory.changed.connect(refresh_inventory)
	Quests.changed.connect(_refresh_quest)
	refresh_inventory()
	show_main()

func _panel(color: Color, radius: int = 12) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = color
	style.set_corner_radius_all(radius)
	style.border_color = Color(.57,.66,.55,.22)
	style.set_border_width_all(1)
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 9
	style.content_margin_bottom = 9
	return style

func _theme() -> Theme:
	var theme := Theme.new()
	theme.default_font_size = 20
	theme.set_color("font_color","Label",CREAM)
	theme.set_color("font_color","Button",CREAM)
	theme.set_stylebox("normal","Button",_panel(Color(.12,.21,.19,.94)))
	theme.set_stylebox("hover","Button",_panel(Color(.20,.30,.25,.98)))
	theme.set_stylebox("pressed","Button",_panel(Color(.31,.36,.24,.98)))
	theme.set_stylebox("focus","Button",_panel(Color(.20,.29,.24,.98)))
	theme.set_stylebox("disabled","Button",_panel(Color(.10,.14,.13,.8)))
	theme.set_color("font_disabled_color","Button",Color("66756c"))
	return theme

func _safe_area() -> void:
	if not OS.has_feature("android"):
		return
	var area := DisplayServer.get_display_safe_area()
	var screen := Vector2(DisplayServer.screen_get_size())
	if screen.x<1 or screen.y<1: return
	var scale_value := root.size/screen
	safe.offset_left = maxf(8,area.position.x*scale_value.x)
	safe.offset_top = maxf(8,area.position.y*scale_value.y)
	safe.offset_right = -maxf(8,(screen.x-area.end.x)*scale_value.x)
	safe.offset_bottom = -maxf(8,(screen.y-area.end.y)*scale_value.y)

func _label(text: String, parent: Node, font_size: int = 20, color: Color = CREAM) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size",font_size)
	label.add_theme_color_override("font_color",color)
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	parent.add_child(label)
	return label

func _button(text: String, parent: Node, callback: Callable, min_width: float = 0) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size = Vector2(min_width,48)
	button.pressed.connect(callback)
	button.focus_mode = Control.FOCUS_NONE
	parent.add_child(button)
	return button

func _build_hud() -> void:
	var stats := VBoxContainer.new()
	stats.position = Vector2(20,18)
	stats.size = Vector2(235,148)
	hud.add_child(stats)
	_label("DraBornGames  /  SURVIVAL",stats,16,GOLD)
	for info in [["SAĞLIK",health_bar,Color("bc6e59")],["DAYANIKLILIK",stamina_bar,Color("87ad8b")],["AÇLIK",hunger_bar,Color("c6a66e")]]:
		var row := HBoxContainer.new()
		stats.add_child(row)
		var name_label := _label(info[0],row,12,MUTED)
		name_label.custom_minimum_size.x = 104
		var bar: ProgressBar = info[1]
		bar.show_percentage = false
		bar.custom_minimum_size = Vector2(110,9)
		bar.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		bar.add_theme_stylebox_override("background",_panel(Color(.06,.12,.12,.85),4))
		bar.add_theme_stylebox_override("fill",_panel(info[2],4))
		row.add_child(bar)
	stats.add_child(info_label)
	info_label.add_theme_font_size_override("font_size",13)
	info_label.add_theme_color_override("font_color",MUTED)
	var map := SurvivalMinimap.new()
	map.game = game
	map.set_anchors_and_offsets_preset(Control.PRESET_TOP_RIGHT)
	map.offset_left = -170
	map.offset_right = -20
	map.offset_top = 22
	map.offset_bottom = 142
	hud.add_child(map)
	var north := _label("K  /  SINIR ORMANI",hud,13,GOLD)
	north.set_anchors_and_offsets_preset(Control.PRESET_TOP_RIGHT)
	north.offset_left = -170
	north.offset_right = -20
	north.offset_top = 2
	hud.add_child(quest_label)
	quest_label.set_anchors_and_offsets_preset(Control.PRESET_TOP_RIGHT)
	quest_label.offset_left = -295
	quest_label.offset_right = -20
	quest_label.offset_top = 158
	quest_label.offset_bottom = 260
	quest_label.add_theme_font_size_override("font_size",17)
	quest_label.add_theme_color_override("font_color",GOLD)
	quest_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	var hot_row := HBoxContainer.new()
	hud.add_child(hot_row)
	hot_row.set_anchors_and_offsets_preset(Control.PRESET_CENTER_BOTTOM)
	hot_row.offset_left = -198
	hot_row.offset_right = 198
	hot_row.offset_top = -89
	hot_row.offset_bottom = -24
	hot_row.add_theme_constant_override("separation",6)
	for i in 6:
		var button := _button("",hot_row,func(): Inventory.select(i),60)
		button.custom_minimum_size.y = 62
		button.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
		button.expand_icon = true
		button.add_theme_constant_override("icon_max_width",30)
		button.add_theme_font_size_override("font_size",14)
		hotbar.append(button)
		overlay.zones["slot%d"%i] = button
	var buttons := {"jump":["ZIPLA",Vector2(-100,-145)],"mine":["KIR",Vector2(-193,-145)],"place":["YERLEŞTİR",Vector2(-193,-80)],"interact":["ETKİLEŞ",Vector2(-100,-210)],"sprint":["KOŞ",Vector2(-286,-80)],"use":["KULLAN",Vector2(-286,-145)]}
	for action in buttons:
		var button := _button(buttons[action][0],hud,func(): Controls.queue_action(action),88)
		button.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_RIGHT)
		button.offset_left = buttons[action][1].x
		button.offset_top = buttons[action][1].y
		button.offset_right = button.offset_left+88
		button.offset_bottom = button.offset_top+56
		button.add_theme_font_size_override("font_size",14)
		overlay.zones[action] = button
		if action == "interact": interaction_button = button
	var menu_row := HBoxContainer.new()
	hud.add_child(menu_row)
	menu_row.position = Vector2(20,150)
	for entry in [["ÇANTA","inventory"],["GÖREV","quests"],["ÜRET","craft"],["☰","pause"]]:
		var action: String = entry[1]
		var button := _button(entry[0],menu_row,func(): Controls.queue_action(action),60)
		button.add_theme_font_size_override("font_size",13)
		overlay.zones[action] = button
	var cross := _label("+",hud,24,Color(1,.95,.77,.85))
	cross.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	cross.offset_left = -10
	cross.offset_top = -16
	cross.offset_right = 10
	cross.offset_bottom = 16
	cross.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(loading_label)
	loading_label.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	loading_label.offset_left = -200
	loading_label.offset_right = 200
	loading_label.offset_top = 40
	loading_label.offset_bottom = 80
	loading_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER

func _open(id: String, title: String) -> void:
	menu = id
	Controls.reset()
	Controls.blocked = true
	modal.show()
	hud.hide()
	title_label.text = title
	for child in content.get_children():
		content.remove_child(child)
		child.queue_free()

func close() -> void:
	menu = ""
	modal.hide()
	hud.show()
	Controls.reset()
	Controls.blocked = false

func show_main() -> void:
	_open("main","DraBornGames: SURVIVAL")
	_label("SINIR ORMANI  •  v0.1.0",content,17,GOLD)
	_label("Kendi yolunu kaz. Bir yuva kur. Sönen ışığı geri getir.",content,26)
	_label("Orman, bloklarla değiştirilebilir. Karakterler ve bitkiler ayrı 3D modellerdir. Bu ilk sürüm, Sönen Fener göreviyle tamamlanan çevrimdışı bir oynanış çekirdeğidir.",content,19,MUTED)
	_button("DEVAM ET" if game.loaded_save else "ORMANA GİR",content,func(): game.started=true; close())
	_button("YENİ DÜNYA",content,show_new)
	var row := HBoxContainer.new()
	content.add_child(row)
	_button("Ayarlar",row,show_settings,180)
	_button("Kontroller",row,show_help,180)
	_label("Geçici özgün modeller • İnternet veya ücretli servis gerekmez",content,14,MUTED)

func show_new() -> void:
	_open("new","Yeni dünya")
	_label("Yeni dünya başlatıldığında sonraki kayıt, mevcut ilerlemenin yerini alır. Son sağlam kayıt yedek olarak korunur.",content,21)
	var seed_input := LineEdit.new()
	seed_input.text = "41729"
	seed_input.placeholder_text = "Sayısal dünya seed değeri"
	seed_input.custom_minimum_size.y = 52
	content.add_child(seed_input)
	_button("BU SEED İLE BAŞLA",content,func():
		if not seed_input.text.is_valid_int():
			toast("Sayısal bir seed gir.")
			return
		game.start_new(int(seed_input.text))
		close())
	_button("Geri",content,show_main)

func show_pause() -> void:
	_open("pause","Kamp molası")
	_label("Dünya duraklatıldı. İlerlemeni kaydedebilir, tariflere bakabilir veya görüntü ayarlarını değiştirebilirsin.",content,21,MUTED)
	_button("OYUNA DÖN",content,close)
	_button("ŞİMDİ KAYDET",content,func(): game.save_game(); toast("Kayıt hazırlanıyor…"))
	var row := HBoxContainer.new()
	content.add_child(row)
	_button("Envanter",row,show_inventory,180)
	_button("Üretim",row,show_crafting,180)
	_button("Harita",row,show_map,180)
	_button("Ayarlar",content,show_settings)
	_button("Kontroller",content,show_help)
	_button("Kaydet ve ana menü",content,func(): game.save_game(); show_main())

func refresh_inventory() -> void:
	for i in hotbar.size():
		var slot: Dictionary = Inventory.slots[i]
		hotbar[i].text = str(slot.count) if slot.id!="" else str(i+1)
		hotbar[i].icon = load("res://assets/icons/"+str(DB.items[slot.id].icon)+".png") if DB.items.has(slot.id) else null
		hotbar[i].add_theme_stylebox_override("normal",_panel(Color(.33,.37,.24,.95) if i==Inventory.selected else Color(.06,.12,.12,.88)))
	_refresh_quest()

func show_inventory() -> void:
	_open("inventory","Çanta  /  12 yuva")
	_label("İlk 6 yuva hızlı çubuktur. Bir yuva seç; eşyayı kullan veya yerini değiştir.",content,17,MUTED)
	var grid := GridContainer.new()
	grid.columns = 6
	grid.add_theme_constant_override("h_separation",8)
	grid.add_theme_constant_override("v_separation",8)
	content.add_child(grid)
	for i in 12:
		var slot: Dictionary = Inventory.slots[i]
		var text := "%d\n%s\n× %d" % [i+1,DB.item_name(slot.id),int(slot.count)] if slot.id!="" else "%d\nBoş"%(i+1)
		var button := _button(text,grid,func():
			if swap_from>=0:
				Inventory.swap(swap_from,i)
				swap_from = -1
			inventory_cursor = i
			if i<6: Inventory.select(i)
			show_inventory(),115)
		button.custom_minimum_size.y = 118
		if slot.id!="":
			button.text = "\n\n"+DB.item_name(slot.id)+"\n× "+str(slot.count)
			var icon := TextureRect.new()
			icon.texture = load("res://assets/icons/"+str(DB.items[slot.id].icon)+".png")
			icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
			button.add_child(icon)
			icon.set_anchors_and_offsets_preset(Control.PRESET_CENTER_TOP)
			icon.offset_left=-18; icon.offset_right=18; icon.offset_top=5; icon.offset_bottom=41
		button.add_theme_font_size_override("font_size",15)
		if i==inventory_cursor:
			button.add_theme_stylebox_override("normal",_panel(Color(.28,.34,.23,.98)))
	var selected: Dictionary = Inventory.slots[inventory_cursor]
	_label("Yuvasını seç…" if swap_from>=0 else (DB.item_name(selected.id) if selected.id!="" else "Boş yuva"),content,22,GOLD)
	var row := HBoxContainer.new()
	content.add_child(row)
	_button("Kullan",row,func(): game.use_item(str(selected.id)); show_inventory(),140).disabled = not DB.items.get(selected.id,{}).has("hunger")
	_button("Yeri değiştir",row,func(): swap_from=inventory_cursor; show_inventory(),160)
	_button("Hızlı yuvaya taşı",row,func(): Inventory.swap(inventory_cursor,Inventory.selected); show_inventory(),190)
	_button("Bırak ×1",row,func(): game.drop_item(str(selected.id)); show_inventory(),140).disabled = selected.id==""
	_button("Oyuna dön",content,close)

func show_crafting() -> void:
	_open("craft","Üretim tezgâhı")
	_label("Tarifler çevrimdışı JSON verilerinden okunur. Kaynaklar ancak üretim başarıyla tamamlanırsa harcanır.",content,17,MUTED)
	for id in DB.recipes:
		var recipe: Dictionary = DB.recipes[id]
		var parts: PackedStringArray = []
		for item in recipe.cost:
			parts.append("%s %d/%d" % [DB.item_name(item),Inventory.count_item(item),int(recipe.cost[item])])
		var recipe_id := str(id)
		var button := _button(str(recipe.name)+"  ·  "+"  /  ".join(parts),content,func():
			if Inventory.craft(recipe_id):
				game.audio.play("craft")
				toast("Üretildi: "+str(DB.recipes[recipe_id].name))
			else:
				toast("Kaynak veya envanter alanı yetersiz.")
			show_crafting())
		button.disabled = not Inventory.has_cost(recipe.cost)
	_button("Çantayı aç",content,show_inventory)
	_button("Oyuna dön",content,close)

func _refresh_quest() -> void:
	if Quests.state()=="available":
		quest_label.text = "SÖNEN FENER\nYerleşimde Kora'yı bul."
	elif Quests.state()=="active":
		quest_label.text = "SÖNEN FENER\nOdun %d/12  ·  Taş %d/8\nKora'ya teslim et." % [Inventory.count_item("wood"),Inventory.count_item("stone")]
	else:
		quest_label.text = "SÖNEN FENER  ✓\nIşık geri döndü.\nİnşa et ve keşfet."

func show_quests() -> void:
	_open("quests","Görev günlüğü")
	_label("SÖNEN FENER",content,26,GOLD)
	_label(str(DB.quests.dying_beacon.description),content,22)
	_label("Durum: "+{"available":"Kora ile konuş","active":"Devam ediyor","completed":"Tamamlandı"}[Quests.state()],content,20)
	_label("Odun: %d / 12\nTaş: %d / 8\n\nÖdül: 20 sınır sikkesi, 5 yaban meyvesi ve 50 deneyim." % [Inventory.count_item("wood"),Inventory.count_item("stone")],content,21,MUTED)
	_label("Deneyim: %d  •  İlk görevin ardından dünya serbestçe oynanmaya devam eder."%Quests.xp,content,18)
	_button("Oyuna dön",content,close)

func show_dialogue() -> void:
	_open("dialogue","Kora  /  Fener bekçisi")
	_label(game.kora.routine,content,17,GOLD)
	_label(str(DB.npcs.dialogue[game.kora.dialogue_key()]),content,23)
	if Quests.state()=="available":
		_button("Yardım edeceğim. [Görevi kabul et]",content,func(): Quests.accept(); show_dialogue())
		_button("Daha sonra döneceğim.",content,close)
	elif Quests.ready_to_complete():
		_button("12 odun ve 8 taşı teslim et",content,func():
			if Quests.hand_in():
				game.kora.relation += 10
				game.audio.play("success")
				game.save_game()
				toast("Sönen Fener tamamlandı! +50 deneyim")
			show_dialogue())
		_button("Malzemeleri şimdilik tutacağım.",content,close)
	else:
		_button("Görüşürüz, Kora.",content,close)

func show_map() -> void:
	_open("map","Sınır Ormanı  /  Yerel harita")
	var map := SurvivalMinimap.new()
	map.game = game
	map.radius = 85
	map.custom_minimum_size = Vector2(700,340)
	content.add_child(map)
	_label("Sarı: Sen  •  Turkuaz: Kora  •  Altın: Fener\nSeed: %d  |  Konum: %.1f, %.1f" % [game.world.world_seed,game.player.position.x,game.player.position.z],content,18,MUTED)
	_button("Oyuna dön",content,close)

func show_settings() -> void:
	_open("settings","Ayarlar")
	_label("GRAFİK PROFİLİ",content,17,GOLD)
	var row := HBoxContainer.new()
	content.add_child(row)
	for name_value in Settings.PROFILES:
		var profile_id := str(name_value)
		_button(("✓ " if Settings.profile==profile_id else "")+profile_id,row,func(): Settings.profile=profile_id; Settings.persist(); show_settings(),180)
	_label("Görüş: %d × %d chunk  •  İç çözünürlük: %d%%  •  FPS sınırı: %d\nRenderer: %s" % [int(Settings.values().radius)*2+1,int(Settings.values().radius)*2+1,int(float(Settings.values().scale)*100),int(Settings.values().fps),RenderingServer.get_current_rendering_method()],content,17,MUTED)
	var compatibility := CheckButton.new()
	compatibility.text = "Bir sonraki açılışta Compatibility renderer"
	compatibility.button_pressed = Settings.compatibility_requested
	compatibility.toggled.connect(func(value: bool): Settings.compatibility_requested=value; Settings.persist())
	content.add_child(compatibility)
	_label("Renderer değişikliği oyunu tamamen kapatıp açınca uygulanır. Editörde sağ üstteki renderer menüsünü kullan.",content,15,MUTED)
	_label("KAMERA HASSASİYETİ",content,15,GOLD)
	var sensitivity := HSlider.new()
	sensitivity.min_value = .002
	sensitivity.max_value = .009
	sensitivity.step = .0005
	sensitivity.value = Settings.sensitivity
	sensitivity.custom_minimum_size.y = 40
	sensitivity.value_changed.connect(func(value: float): Settings.sensitivity=value; Settings.persist())
	content.add_child(sensitivity)
	for bus in Settings.volumes:
		var name_value := str(bus)
		var volume_row := HBoxContainer.new()
		content.add_child(volume_row)
		_label({"Master":"Genel ses","Music":"Müzik","Effects":"Efekt","Ambience":"Ortam"}[name_value],volume_row,17).custom_minimum_size.x=150
		var slider := HSlider.new()
		slider.min_value=0
		slider.max_value=1
		slider.step=.05
		slider.value=float(Settings.volumes[name_value])
		slider.custom_minimum_size=Vector2(500,36)
		slider.value_changed.connect(func(value: float): Settings.volumes[name_value]=value; Settings.persist())
		volume_row.add_child(slider)
	_label("v0.1.0 özgün ortam ve eylem seslerini içerir. Müzik içeriği sonraki sürümlere aittir.",content,14,MUTED)
	_button("Geri",content,show_pause if game.started else show_main)

func show_help() -> void:
	_open("help","Kontroller ve ilk adımlar")
	_label("1. Kora'yı bul ve Sönen Fener görevini kabul et.\n2. Ağaç veya kayayı nişangâha getir; yaklaş ve KIR'a dokun.\n3. 12 odun ve 8 taş toplayıp Kora'ya teslim et.\n4. ÜRET ekranından alet, yapı bloğu ve kamp ateşi üret.",content,21)
	_label("TELEFON\nSol alt: joystick. Boş sağ/orta alan: kamerayı sürükle. İkisi farklı parmaklarla aynı anda çalışır. KOŞ aç/kapat. KIR kaynak toplar. YERLEŞTİR seçili bloğu koyar. KULLAN meyve yer. ETKİLEŞ Kora ile konuşur veya yakındaki eşyayı alır.",content,19,MUTED)
	_label("KLAVYE / FARE\nWASD hareket • Shift koş • Space zıpla\nSağ fareyi sürükle: kamera • Tekerlek: zoom\nQ / sol tık: kır • R / orta tık: yerleştir\nE etkileş • F kullan • 1–6 hızlı yuva\nI çanta • C üretim • J görev • Esc duraklat",content,19,MUTED)
	_label("Kayıt: 45 saniyede bir, görev tesliminde ve uygulama arka plana geçerken. İlk yüklemede zemin hazırlanırken hareket kısa süre bekler.",content,17,GOLD)
	_button("Lisanslar",content,show_licenses)
	_button("Geri",content,show_pause if game.started else show_main)

func show_licenses() -> void:
	_open("licenses","Kaynaklar ve lisanslar")
	_label(FileAccess.get_file_as_string("res://assets/LICENSES.md"),content,17,MUTED)
	_label(FileAccess.get_file_as_string("res://assets/GODOT-LICENSE.txt"),content,16,MUTED)
	_button("Geri",content,show_help)

func toast(text: String) -> void:
	toast_label.text = text
	toast_timer = 4.5

func _process(delta: float) -> void:
	toast_timer -= delta
	toast_label.visible = toast_timer>0
	ui_timer -= delta
	if ui_timer>0 or game.resetting or not is_instance_valid(game.player):
		return
	ui_timer=.15
	health_bar.value=game.player.health
	stamina_bar.value=game.player.stamina
	hunger_bar.value=game.player.hunger
	info_label.text="%s  ·  %d FPS  ·  %d chunk" % [game.day.clock_text(),Engine.get_frames_per_second(),game.world.chunks.size()]
	loading_label.text="Zemin hazırlanıyor…" if not game.world.is_ready_at(game.player.position) else ""
	interaction_button.text="KORA" if game.player.position.distance_to(game.kora.position)<3.8 else "ETKİLEŞ"
