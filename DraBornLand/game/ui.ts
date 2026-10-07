import type { Game } from './simulation';
import { BUILD_COSTS, LANDMARKS, LIGHTHOUSE_COST, RECIPES, RELICS } from './simulation';
import type { Cost } from './simulation';

export interface UICallbacks {
  start(newGame: boolean): void;
  pause(paused: boolean): void;
  action(name: string, value?: string): void;
  look?(dx: number, dy: number): void;
}

type Panel = 'inventory' | 'craft' | 'build' | 'journal' | 'map' | 'settings' | 'pause' | 'controls' | null;
type IconName = 'heart' | 'stamina' | 'hunger' | 'sun' | 'moon' | 'bag' | 'craft' | 'build' | 'journal' | 'map' | 'settings' | 'axe' | 'pickaxe' | 'sword' | 'food' | 'wood' | 'stone' | 'fiber' | 'crystal' | 'relic' | 'fire' | 'door' | 'roof' | 'floor' | 'wall' | 'jump' | 'run' | 'hand' | 'save' | 'sound' | 'arrow' | 'close' | 'lighthouse';

const paths: Record<IconName, string> = {
  heart: '<path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/>',
  stamina: '<path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z"/>',
  hunger: '<path d="M7 2v7m-3-7v5c0 2 1 3 3 3s3-1 3-3V2M7 10v12M19 22V2c-4 2-5 9-1 11h1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M21 13A9 9 0 0 1 11 3 9 9 0 1 0 21 13Z"/>',
  bag: '<path d="M5 6h14l2 15H3L5 6Zm3 0V5a4 4 0 0 1 8 0v1M9 11h6"/>',
  craft: '<path d="m14 3 7 7-3 3-7-7 3-3ZM12 9 3 18v3h3l9-9M2 3l5 5m-5 0 5-5"/>',
  build: '<path d="m3 11 9-8 9 8M5 9v12h14V9M10 21v-8h4v8"/>',
  journal: '<path d="M5 3h14v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v18M9 8h6m-6 4h6m-6 4h3"/>',
  map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5ZM9 3v16m6-14v16"/>',
  settings: '<path d="m10 3-1 3-3 1-3-1-1 3 2 3-1 3 2 3 3-1 3 2 3-1 3 1 2-3-1-3 2-3-1-3-3 1-3-1-1-3h-4Z"/><circle cx="12" cy="12" r="3"/>',
  axe: '<path d="m5 21 9-14m-4-3 6-2 5 6-4 5-7-9Zm1 9L6 9"/>',
  pickaxe: '<path d="m5 21 9-14M4 7c8-6 13-3 17 4M10 4l5 4"/>',
  sword: '<path d="m4 20 3-3m-2-3 5 5m-2-4L18 3h3v3L10 17m-8 3 2 2 3-3"/>',
  food: '<path d="M12 8c-8-7-12 7-6 12 3 2 4 0 6 0s3 2 6 0c6-5 2-19-6-12Zm0 0V3m0 1c3-3 6-2 6-2-1 3-3 4-6 4"/>',
  wood: '<path d="m4 9 9-6 7 12-9 6L4 9Z"/><ellipse cx="7.5" cy="15" rx="3.5" ry="6" transform="rotate(-30 7.5 15)"/><path d="m11 5 7 12"/>',
  stone: '<path d="m3 15 4-10 8-2 6 9-3 8H7l-4-5Zm4-10 6 7 8 0M3 15l10-3 5 8"/>',
  fiber: '<path d="M12 22V7m0 7C6 14 3 10 3 5c6 0 9 3 9 9Zm0-4c0-6 3-9 9-9 0 6-3 9-9 9Z"/>',
  crystal: '<path d="m12 2 7 6v10l-7 4-7-4V8l7-6Zm0 0v20M5 8l7 4 7-4"/>',
  relic: '<path d="m12 2 8 7-8 13-8-13 8-7Zm0 4 4 4-4 7-4-7 4-4Z"/>',
  fire: '<path d="M12 2c1 6 8 8 8 13a8 8 0 0 1-16 0c0-3 2-6 5-9 0 4 2 5 3 5V2Z"/><path d="M12 12c3 3 4 5 2 8-4 1-6-3-2-8Z"/>',
  door: '<path d="M5 22V2h14v20M8 22V5h8v17m-3-8h1"/>',
  roof: '<path d="m2 12 10-9 10 9H2Zm3 0v9h14v-9"/>',
  floor: '<path d="m2 13 10-7 10 7-10 7-10-7Zm10 7v3M2 13v3l10 7 10-7v-3"/>',
  wall: '<path d="M3 4h18v16H3V4Zm0 8h18m-9-8v8m-5 0v8m10-8v8"/>',
  jump: '<path d="m7 8 5-5 5 5M12 3v12M4 17v4h16v-4"/>',
  run: '<circle cx="15" cy="4" r="2"/><path d="m5 10 5-3 5 5 5 1m-10-6-3 7 6 3-1 5m-5-8-4 7"/>',
  hand: '<path d="M8 12V5a2 2 0 0 1 4 0v7-9a2 2 0 0 1 4 0v10-7a2 2 0 0 1 4 0v10c0 4-3 6-6 6h-3c-3 0-5-3-8-8-1-2 1-4 3-2l2 2Z"/>',
  save: '<path d="M3 3h15l3 3v15H3V3Zm4 0v6h9V3M7 21v-8h10v8"/>',
  sound: '<path d="M3 9h4l5-5v16l-5-5H3V9Zm13-1c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  lighthouse: '<path d="m7 22 2-14h6l2 14M8 4h8v4H8V4Zm4-3v3M3 6h2m14 0h2M10 13h4m-5 5h6"/>',
};
const icon = (name: IconName, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
const names: Record<string, string> = {wood:'Odun', stone:'Taş', berries:'Yaban meyvesi', fiber:'Lif', crystal:'Kristal', axe:'Taş balta', pickaxe:'Taş kazma', sword:'Ada kılıcı', emberSword:'Fırtına kılıcı', campfire:'Kamp ateşi', floor:'Zemin', wall:'Duvar', door:'Kapı', roof:'Çatı'};
const resourceIcons: Record<string, IconName> = { wood:'wood', stone:'stone', berries:'food', fiber:'fiber', crystal:'crystal' };
const crafts = [
  {id:'axe', icon:'axe' as IconName, label:'Taş balta', description:'Başlangıç baltanı güçlendir. Ağaçları daha hızlı kes.', costs:RECIPES.axe.cost},
  {id:'pickaxe', icon:'pickaxe' as IconName, label:'Taş kazma', description:'Başlangıç kazmanı güçlendir. Kayaları daha hızlı kır.', costs:RECIPES.pickaxe.cost},
  {id:'sword', icon:'sword' as IconName, label:'Ada kılıcı', description:'Gecenin yaratıklarına karşı daha güçlü saldırılar.', costs:RECIPES.sword.cost},
  {id:'campfire', icon:'fire' as IconName, label:'Kamp ateşi', description:'Barınağına sıcaklık kat. Ateşin yakınında iyileş.', costs:RECIPES.campfire.cost},
];
const builds = [
  {id:'floor', icon:'floor' as IconName, label:'Zemin', costs:BUILD_COSTS.floor},
  {id:'wall', icon:'wall' as IconName, label:'Duvar', costs:BUILD_COSTS.wall},
  {id:'door', icon:'door' as IconName, label:'Kapı', costs:BUILD_COSTS.door},
  {id:'roof', icon:'roof' as IconName, label:'Çatı', costs:BUILD_COSTS.roof},
  {id:'campfire', icon:'fire' as IconName, label:'Kamp ateşi', costs:BUILD_COSTS.campfire},
];

/** DOM interface. Every game action is forwarded to the host, which owns simulation and audio. */
export class UI {
  readonly input = {moveX:0, moveZ:0, sprint:false, jump:false};
  readonly root: HTMLDivElement;
  private running = false;
  private panel: Panel = null;
  private selectedBuild = 'floor';
  private prompt = '';
  private tick = 0;
  private lastPanelState = '';
  private terminalState = '';
  private menuSettings = false;
  private toastTimer = 0;
  private eventController = new AbortController();
  private waypoint = '';
  private quality = localStorage.getItem('drabornland-quality') || 'medium';
  private audio = localStorage.getItem('drabornland-audio') !== 'off';

  constructor(private game: Game, private callbacks: UICallbacks) {
    this.root = document.createElement('div');
    this.root.id = 'game-ui';
    this.root.className = 'menu-visible';
    this.root.innerHTML = this.shell();
    document.body.appendChild(this.root);
    const signal = this.eventController.signal;
    this.root.addEventListener('click', (event) => this.onClick(event), {signal});
    this.root.addEventListener('pointerdown', (event) => event.stopPropagation(), {signal});
    this.root.addEventListener('change', (event) => this.onChange(event), {signal});
    window.addEventListener('keydown', (event) => this.onKey(event), {signal});
    this.bindTouch();
    this.update();
  }

  get blocked(): boolean { return !this.running || !!this.panel || !!this.terminalState; }

  setHasSave(hasSave: boolean): void {
    const button=this.root.querySelector<HTMLElement>('[data-action="start"][data-value="continue"]')!;
    button.innerHTML=`${hasSave?'ADAYA DÖN':'ADADA UYAN'} ${icon('arrow')}`;
    button.dataset.hasSave=String(hasSave);
  }

  setRunning(running: boolean): void {
    this.running = running;
    this.panel = null;
    this.terminalState = '';
    this.root.classList.toggle('menu-visible', !running);
    this.root.classList.toggle('playing', running);
    this.root.querySelector('#main-menu')!.classList.toggle('hidden', running);
    this.closePanel(false);
    this.clearInput();
    if (running) this.toast('Kıyıdan içeri yürü. Bu ada, keşfedilmeyi bekliyor.');
    this.update();
  }

  setPrompt(text: string): void {
    if (text === this.prompt) return;
    this.prompt = text;
    const node = this.root.querySelector('#interaction-prompt')!;
    node.innerHTML = text ? `<kbd>E</kbd><span>${this.escape(text)}</span>` : '';
    node.classList.toggle('visible', !!text);
  }

  toast(message: string): void {
    const node = this.root.querySelector('#toast')!;
    node.textContent = message;
    node.classList.add('visible');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => node.classList.remove('visible'), 4200);
  }

  update(): void {
    const state = this.game.state;
    const p = state.player;
    this.stat('health', p.health);
    this.stat('stamina', p.stamina);
    this.stat('hunger', p.hunger);
    this.root.classList.toggle('low-health', p.health < 25 && this.running && !p.dead);
    this.root.querySelector('#day-status')!.innerHTML = `${icon(state.isNight ? 'moon' : 'sun')}<span>${state.day}. GÜN <i>·</i> ${state.isNight ? 'GECE' : 'GÜNDÜZ'}</span>`;
    const angle = ((180 - p.rotation * 180 / Math.PI) % 360 + 360) % 360;
    const headings = ['G','GD','D','KD','K','KB','B','GB'];
    this.root.querySelector('#compass-heading')!.textContent = headings[Math.round(angle / 45) % 8];
    const q = state.quests;
    this.root.querySelector('#quest-progress')!.textContent = q.completed ? 'Ada yeniden ışıldıyor' : !q.templeOpen ? `Antik eserleri bul · ${q.relics.length}/3` : !q.bossDefeated ? 'Tapınağın muhafızını yen' : !q.lighthouseRepaired ? 'Deniz fenerini onar' : 'Ada yeniden ışıldıyor';
    this.root.querySelector('#quest-emblem')!.innerHTML = icon(!q.lighthouseRepaired && q.bossDefeated ? 'lighthouse' : 'relic');
    const dragon = state.enemies.find(e=>e.type==='dragon'&&e.alive&&Math.hypot(e.x-p.x,e.z-p.z)<24);
    const bossBar=this.root.querySelector('#boss-status')!;
    bossBar.classList.toggle('hidden',!dragon||!this.running);
    if(dragon){this.root.querySelector<HTMLElement>('#boss-health')!.style.width=`${dragon.hp/dragon.maxHp*100}%`;this.root.querySelector('#boss-warning')!.textContent=dragon.phase==='windup'?(dragon.attackKind==='fire'?'ATEŞ NEFESİ · KAÇ!':'SALDIRI · UZAKLAŞ!'):'';}
    this.root.querySelector('#build-shortcuts')!.classList.toggle('hidden',state.tool!=='build');
    this.root.querySelector('#interaction-prompt')!.classList.toggle('building',state.tool==='build');
    for (const slot of this.root.querySelectorAll<HTMLButtonElement>('[data-action="tool"]')) {
      slot.classList.toggle('active', slot.dataset.value === state.tool);
      slot.setAttribute('aria-pressed', String(slot.dataset.value === state.tool));
      const count = slot.querySelector('.slot-count');
      if (count && slot.dataset.value === 'food') count.textContent = String(state.inventory.berries);
      if (slot.dataset.value === 'sword') slot.classList.toggle('ember-equipped', state.equipment.emberSword);
    }
    const wanted = this.running ? p.dead ? 'death' : q.completed ? 'win' : '' : '';
    if (wanted !== this.terminalState) {
      this.terminalState = wanted;
      this.root.querySelector('#terminal-overlay')!.classList.toggle('hidden', !wanted);
      if (wanted) {this.clearInput();this.callbacks.pause(true);this.renderTerminal(wanted);}
    }
    if (this.tick++ % 12 === 0) {
      if (this.panel && !['pause','settings','controls'].includes(this.panel)) {
        const key = JSON.stringify([state.inventory,state.equipment,state.quests,state.builds.length]);
        if (key !== this.lastPanelState) {this.lastPanelState=key;this.renderPanel();}
      }
      if (this.panel === 'map') this.drawMap();
    }
  }

  dispose(): void {
    this.eventController.abort();
    window.clearTimeout(this.toastTimer);
    this.clearInput();
    this.root.remove();
  }

  private shell(): string {
    return `
    <div class="danger-vignette"></div>
    <div id="main-menu" class="main-menu">
      <header class="menu-header"><a class="wordmark" href="https://www.draborneagle.com/DraBornGames/" aria-label="DraBornGames">${icon('relic')}<span>DRABORN<span class="wordmark-light">GAMES</span></span></a><span class="build-label">BİR ADA. YENİ BİR BAŞLANGIÇ.</span></header>
      <div class="menu-story"><div class="eyebrow"><span></span> KEŞİF · İNŞA · HAYATTA KALMA</div><h1>DraBorn<span>Land</span></h1><p class="story-subtitle">KÜLLERİN KIYISI</p><p class="story-description">Unutulmuş bir kıyıda uyan.<br>Bir yuva kur. Kadim ateşi yeniden yak.</p>
        <div class="menu-buttons"><button class="primary-button" data-action="start" data-value="continue">ADADA UYAN ${icon('arrow')}</button><button class="secondary-button" data-action="start" data-value="new">YENİ BİR YOLCULUK</button></div>
        <div class="menu-links"><button data-action="panel" data-value="controls">NASIL OYNANIR</button><span>·</span><button data-action="panel" data-value="settings">AYARLAR</button></div>
      </div>
      <footer class="menu-footer"><span class="island-name">${icon('map')} KUZEY KIYISI <span> / </span> BİLİNMEYEN ADA</span><span class="save-note"><i></i> YEREL KAYIT · ÇEVRİMDIŞI OYNANABİLİR</span></footer>
      <div class="scene-caption"><span>01 / KIYI</span><p>Gündüzün sessizliğine aldanma.</p></div>
    </div>
    <div id="hud" class="hud">
      <div class="survival-cluster"><div class="hud-brand">DRABORNLAND <span>KÜLLERİN KIYISI</span></div><div class="vitals">${this.statShell('health','heart','Can')}${this.statShell('stamina','stamina','Dayanıklılık')}${this.statShell('hunger','hunger','Tokluk')}</div><div id="day-status" class="day-status"></div></div>
      <div class="navigation-cluster"><div class="compass"><span>B</span><span class="compass-mark"></span><b id="compass-heading">K</b><span class="compass-mark"></span><span>D</span></div><button class="quest-chip" data-action="panel" data-value="journal"><span id="quest-emblem">${icon('relic')}</span><span id="quest-progress">Antik eserleri bul · 0/3</span><span class="quest-chevron">›</span></button></div>
      <div id="boss-status" class="boss-status hidden"><span class="boss-title">KÜL MUHAFIZI</span><div class="boss-track"><span id="boss-health"></span></div><span id="boss-warning"></span></div>
      <nav class="hud-tools" aria-label="Oyun menüleri">${[['inventory','bag','Envanter','Tab'],['craft','craft','Üretim','C'],['build','build','İnşa','B'],['journal','journal','Günlük','J'],['map','map','Harita','M'],['pause','settings','Menü','Esc']].map(([panel,i,label,key])=>`<button title="${label} (${key})" aria-label="${label}" data-action="panel" data-value="${panel}">${icon(i as IconName)}<span>${key}</span></button>`).join('')}</nav>
      <div id="interaction-prompt" class="interaction-prompt"></div>
      <div class="hotbar" role="toolbar" aria-label="Hızlı erişim">${[['axe','axe','Balta','1'],['pickaxe','pickaxe','Kazma','2'],['sword','sword','Kılıç','3'],['food','food','Meyve','4'],['build','build','İnşa','5']].map(([tool,i,label,key])=>`<button class="hotbar-slot" data-action="tool" data-value="${tool}" title="${label} (${key})" aria-label="${label}"><span class="slot-key">${key}</span>${icon(i as IconName)}<span class="slot-label">${label}</span>${tool==='food'?'<span class="slot-count">0</span>':''}</button>`).join('')}</div>
      <div class="build-shortcuts hidden" id="build-shortcuts"><span>İNŞA MODU</span><button data-action="rotate">Döndür <kbd>R</kbd></button><button data-action="place">Yerleştir <kbd>Enter</kbd></button></div>
      <div class="desktop-help"><span><kbd>W A S D</kbd> hareket</span><span><kbd>Fare</kbd> bakış</span><span><kbd>F / tık</kbd> saldırı</span></div>
      <div class="touch-controls"><div class="joystick-wrap"><div class="joystick" id="joystick" aria-label="Hareket kontrolü"><span id="joystick-thumb"></span></div><span class="joystick-label">HAREKET</span></div><div class="touch-actions"><button class="touch-attack" data-action="attack" aria-label="Saldır">${icon('sword')}</button><button data-action="interact" aria-label="Etkileşim">${icon('hand')}</button><button id="touch-jump" data-action="jump" aria-label="Zıpla">${icon('jump')}</button><button id="touch-run" aria-label="Koş" title="Basılı tutarak koş">${icon('run')}</button></div></div>
    </div>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
    <div id="panel-overlay" class="panel-overlay hidden"><section class="game-panel" role="dialog" aria-modal="true" aria-label="Oyun menüsü"><header class="panel-header"><div><span id="panel-eyebrow" class="eyebrow">ADA GÜNLÜĞÜ</span><h2 id="panel-title"></h2></div><button class="icon-button" data-action="close" aria-label="Kapat">${icon('close')}</button></header><div id="panel-content" class="panel-content"></div><footer class="panel-footer"><span>${icon('save')} İlerleme bu cihazda saklanır.</span><button data-action="close">GERİ DÖN <kbd>Esc</kbd></button></footer></section></div>
    <div id="terminal-overlay" class="terminal-overlay hidden"></div>`;
  }

  private statShell(id: string, i: IconName, label: string): string {
    return `<div class="vital vital-${id}" title="${label}" aria-label="${label}">${icon(i)}<div class="vital-track"><span id="${id}-bar"></span></div><span id="${id}-value">100</span></div>`;
  }

  private stat(id: string, value: number): void {
    this.root.querySelector<HTMLElement>(`#${id}-bar`)!.style.width = `${Math.max(0,Math.min(100,value))}%`;
    this.root.querySelector(`#${id}-value`)!.textContent = String(Math.round(value));
  }

  private onClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!button || button.hasAttribute('disabled')) return;
    const action = button.dataset.action!;
    const value = button.dataset.value;
    if (action === 'start') { this.callbacks.start(value === 'new'); return; }
    if (action === 'close') {this.closePanel(); return;}
    if (action === 'panel') {this.openPanel(value as Panel);return;}
    if (action === 'resume') {this.closePanel();return;}
    if (action === 'menu') {
      this.callbacks.action('save'); this.callbacks.pause(true); this.setRunning(false); return;
    }
    if (action === 'respawn') {
      this.terminalState='';this.root.querySelector('#terminal-overlay')!.classList.add('hidden');
      this.callbacks.action(action);this.callbacks.pause(false);return;
    }
    if (action === 'newgame') {this.callbacks.start(true);return;}
    if (action === 'import') {this.root.querySelector<HTMLInputElement>('#save-import')?.click();return;}
    if (action === 'importText') {
      const raw=this.root.querySelector<HTMLTextAreaElement>('#save-import-text')?.value.trim();
      if(!raw){this.toast('Dışa aktardığın JSON kayıt metnini yapıştır.');return;}
      this.callbacks.action('import',raw);this.lastPanelState='';return;
    }
    if (action === 'buildKind') {
      this.selectedBuild=value!;this.callbacks.action(action,value);this.callbacks.action('tool','build');this.closePanel();
      this.toast(`${names[value!]} seçildi. Enter ile yerleştir; R ile döndür.`);return;
    }
    if (action === 'waypoint') {this.waypoint=value!;this.callbacks.action(action,value);this.closePanel();this.toast('Haritada bir rota seçildi.');return;}
    if (action === 'quality') {
      this.quality=value!;localStorage.setItem('drabornland-quality',this.quality);this.callbacks.action(action,value);this.renderPanel();return;
    }
    if (action === 'audio') {this.audio=!this.audio;localStorage.setItem('drabornland-audio',this.audio?'on':'off');this.callbacks.action(action,this.audio?'on':'off');this.renderPanel();return;}
    if (action === 'jump') this.input.jump = true;
    if (action === 'tool' && value === 'food') {this.callbacks.action('tool','food');this.callbacks.action('eat');return;}
    if (action === 'tool' && value === 'build') {this.callbacks.action(action,value);this.openPanel('build');return;}
    if (action === 'interact' && this.game.state.tool === 'build') {this.callbacks.action('place');return;}
    if (action === 'attack' && this.game.state.tool === 'food') {this.callbacks.action('eat');return;}
    this.callbacks.action(action,value);
    if (action === 'craft') {this.lastPanelState='';this.renderPanel();}
  }

  private onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.id !== 'save-import' || !target.files?.[0]) return;
    const file = target.files[0];
    if(file.size>2_000_000) {this.toast('Kayıt dosyası çok büyük. Geçerli bir DraBornLand kaydı seç.');return;}
    file.text().then(raw=>{this.callbacks.action('import',raw);target.value='';this.renderPanel();}).catch(()=>this.toast('Kayıt dosyası okunamadı.'));
  }

  private onKey(event: KeyboardEvent): void {
    if (event.repeat || (event.target as HTMLElement)?.matches?.('input,textarea')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if(this.panel) this.closePanel(); else if(this.running&&!this.terminalState) this.openPanel('pause');return;
    }
    if (!this.running || this.terminalState) return;
    const keys: Record<string,Panel> = {Tab:'inventory',i:'inventory',c:'craft',b:'build',j:'journal',m:'map'};
    const panel=keys[event.key] || keys[event.key.toLowerCase()];
    if(panel) {event.preventDefault();if(this.panel===panel)this.closePanel();else this.openPanel(panel);}
  }

  private openPanel(panel: Panel): void {
    if(!panel||this.terminalState)return;
    this.menuSettings=!this.running;
    this.panel=panel;this.clearInput();this.callbacks.pause(true);
    this.root.querySelector('#panel-overlay')!.classList.remove('hidden');
    this.root.classList.add('panel-open');
    this.lastPanelState='';this.renderPanel();
  }

  private closePanel(unpause=true): void {
    this.panel=null;
    this.root.querySelector('#panel-overlay')!.classList.add('hidden');
    this.root.classList.remove('panel-open');
    if(unpause&&this.running&&!this.terminalState)this.callbacks.pause(false);
  }

  private renderPanel(): void {
    const title: Record<string,string> = {inventory:'Yanında taşıdıkların',craft:'Ellerinle bir gelecek kur',build:'Buraya ait bir yuva',journal:'Adanın hatıraları',map:'Bilinmeyenin kıyısında',settings:'Yolculuğunu ayarla',pause:'Bir an soluklan',controls:'İlk adımlar'};
    const eyebrow: Record<string,string> = {inventory:'ENVANTER',craft:'ÜRETİM TEZGAHI',build:'İNŞA',journal:'ADA GÜNLÜĞÜ',map:'KEŞİF HARİTASI',settings:'AYARLAR',pause:'YOLCULUK DURAKLATILDI',controls:'NASIL OYNANIR'};
    this.root.querySelector('#panel-title')!.textContent=title[this.panel!]||'';
    this.root.querySelector('#panel-eyebrow')!.textContent=eyebrow[this.panel!]||'';
    this.root.querySelector('.game-panel')!.classList.toggle('map-panel',this.panel==='map');
    const node=this.root.querySelector('#panel-content')!;
    if(this.panel==='inventory')node.innerHTML=this.inventoryPanel();
    if(this.panel==='craft')node.innerHTML=this.craftPanel();
    if(this.panel==='build')node.innerHTML=this.buildPanel();
    if(this.panel==='journal')node.innerHTML=this.journalPanel();
    if(this.panel==='map'){node.innerHTML=this.mapPanel();this.drawMap();}
    if(this.panel==='settings')node.innerHTML=this.settingsPanel();
    if(this.panel==='pause')node.innerHTML=`<p class="panel-intro">Kıyı seni bekleyecek. Yolculuğun bu cihazda kaydedilir.</p><div class="pause-actions"><button class="primary-button" data-action="resume">YOLCULUĞA DÖN ${icon('arrow')}</button><button class="secondary-button" data-action="save">KAYDET ${icon('save')}</button><button class="secondary-button" data-action="panel" data-value="settings">AYARLAR ${icon('settings')}</button><button class="text-button" data-action="menu">ANA MENÜYE DÖN</button></div>`;
    if(this.panel==='controls')node.innerHTML=this.controlsPanel();
  }

  private inventoryPanel(): string {
    const state=this.game.state;
    return `<p class="panel-intro">Topladığın her şey, bir sonraki günün başlangıcı.</p><div class="resource-grid">${Object.entries(state.inventory).map(([key,value])=>`<div class="resource-card">${icon(resourceIcons[key]||'crystal')}<strong>${value}</strong><span>${names[key]}</span>${key==='berries'?'<button class="small-button" data-action="eat">Ye · +tokluk</button>':''}</div>`).join('')}</div><div class="section-label">EKİPMAN</div><div class="equipment-list">${[['axe','axe'],['pickaxe','pickaxe'],['sword','sword'],['emberSword','sword']].map(([key,i])=>`<div class="equipment ${state.equipment[key as keyof typeof state.equipment]?'owned':''}">${icon(i as IconName)}<span>${names[key]}</span><small>${state.equipment[key as keyof typeof state.equipment]?'Hazır':'Henüz yok'}</small></div>`).join('')}</div><button class="inline-link" data-action="panel" data-value="craft">Bir şey üret ${icon('arrow')}</button>`;
  }

  private costs(costs: Cost): string {
    return Object.entries(costs).filter(([,count])=>typeof count==='number').map(([key,count])=>`<span class="cost ${this.game.state.inventory[key as keyof typeof this.game.state.inventory] < count!?'insufficient':''}">${icon(resourceIcons[key]||'wood')}${count} ${names[key]}</span>`).join('');
  }

  private craftPanel(): string {
    return `<p class="panel-intro">Kaynaklarını araçlara dönüştür. Daha uzağa git, daha sağlam dur.</p><div class="recipe-list">${crafts.map(recipe=>{const can=this.game.canAfford(recipe.costs);const owned=recipe.id==='axe'?this.game.state.upgrades.axe:recipe.id==='pickaxe'?this.game.state.upgrades.pickaxe:recipe.id==='sword'?this.game.state.equipment.sword:false;return `<article class="recipe"><div class="recipe-emblem">${icon(recipe.icon)}</div><div class="recipe-body"><h3>${recipe.label}</h3><p>${recipe.description}</p><div class="cost-list">${this.costs(recipe.costs)}</div></div><button class="small-button" data-action="craft" data-value="${recipe.id}" ${!can||owned?'disabled':''}>${owned?'HAZIR':recipe.id==='axe'||recipe.id==='pickaxe'?'GELİŞTİR':'ÜRET'}</button></article>`;}).join('')}</div><p class="muted-note">Ağaç ve kayalara seçili aracınla F / sol tık kullan. E ile gevşek kaynakları, meyve ve lifleri topla.</p>`;
  }

  private buildPanel(): string {
    return `<p class="panel-intro">Bir parça seç. Hayalet önizlemeyi konumlandır ve yerleştir.<br><kbd>R</kbd> döndür <span class="dot-divider">·</span> <kbd>Enter</kbd> yerleştir</p><div class="build-grid">${builds.map(item=>`<button class="build-card ${this.selectedBuild===item.id?'selected':''}" data-action="buildKind" data-value="${item.id}">${icon(item.icon)}<strong>${item.label}</strong><div class="cost-list">${item.id==='campfire'&&this.game.state.craftedCampfires>0?`<span class="cost">${this.game.state.craftedCampfires} hazır kit</span>`:this.costs(item.costs)}</div><span>SEÇ ${icon('arrow')}</span></button>`).join('')}</div><p class="muted-note">Aynı zemine duvar, kapı ve çatı ekleyebilirsin. Kaynaklar yerleştirince harcanır.</p>`;
  }

  private journalPanel(): string {
    const q=this.game.state.quests;
    return `<p class="panel-intro">Bu ada unutulmuş olabilir. Işığı henüz sönmedi.</p><article class="quest-entry ${q.bossDefeated?'complete':''}"><div class="quest-number">01</div><div class="quest-entry-body"><span class="quest-category">KADİM MİRAS</span><h3>Küllerin ardındaki kapı</h3><p>Ormandaki, kayalıklardaki ve kadim kıyıdaki üç eseri bul. Eserler tapınağın mührünü kıracak. İçerideki ejderhayı yen.</p><div class="quest-steps"><span class="${q.relics.length===3?'done':''}">${q.relics.length}/3 antik eser</span><span class="${q.templeOpen?'done':''}">${q.templeOpen?'Kapı açıldı':'Tapınak mühürlü'}</span><span class="${q.bossDefeated?'done':''}">${q.bossDefeated?'Muhafız yenildi':'Ejderha bekliyor'}</span></div><button class="inline-link" data-action="panel" data-value="map">Haritayı aç ${icon('arrow')}</button></div></article><article class="quest-entry ${q.lighthouseRepaired?'complete':''}"><div class="quest-number">02</div><div class="quest-entry-body"><span class="quest-category">UMUDUN IŞIĞI</span><h3>Sönmüş deniz feneri</h3><p>Adanın kalbindeki deniz fenerine ${LIGHTHOUSE_COST.wood} odun ve ${LIGHTHOUSE_COST.stone} taş götür. Işığı yeniden yak ve Fırtına Kılıcı'nı kazan.</p><div class="quest-steps"><span class="${q.lighthouseRepaired?'done':''}">${q.lighthouseRepaired?'Fener onarıldı':'Odun ve taş topla'}</span><span class="${q.lighthouseRepaired?'done':''}">${q.lighthouseRepaired?'Fırtına kılıcı alındı':'Ödül: Fırtına kılıcı'}</span></div></div></article><div class="journal-tip">${icon('moon')}<p>Gece yaratıklar kıyıya iner. Meyve taşı, barınak kur ve silahını hazır tut.</p></div>`;
  }

  private mapPanel(): string {
    return `<div class="map-wrap"><canvas id="island-map" width="760" height="540" aria-label="Ada haritası"></canvas><span class="map-north">K <span>↑</span></span><span class="map-caption">KÜLLERİN KIYISI <i>·</i> KEŞİF HARİTASI</span></div><div class="map-legend"><span><i class="player-dot"></i> Sen</span><span><i class="relic-dot"></i> Antik eser</span><span><i class="landmark-dot"></i> Yapı</span><span><i class="danger-dot"></i> Tehlike</span></div><div class="map-waypoints"><button data-action="waypoint" data-value="lighthouse">${icon('lighthouse')} Deniz feneri</button><button data-action="waypoint" data-value="temple">${icon('relic')} Kadim tapınak</button>${RELICS.filter(r=>!this.game.state.quests.relics.includes(r.id)).map(r=>`<button data-action="waypoint" data-value="${r.id}">${icon('relic')} ${r.label}</button>`).join('')}</div>`;
  }

  private settingsPanel(): string {
    return `<p class="panel-intro">Bu ayarlar bu cihazda hatırlanır.</p><div class="setting-row"><div><h3>Görüntü kalitesi</h3><p>Mobil cihazlarda Dengeli önerilir.</p></div><div class="segmented">${[['low','HAFİF'],['medium','DENGELİ'],['high','YÜKSEK']].map(([value,label])=>`<button class="${this.quality===value?'active':''}" data-action="quality" data-value="${value}" aria-pressed="${this.quality===value}">${label}</button>`).join('')}</div></div><div class="setting-row"><div><h3>Ses & atmosfer</h3><p>Dalgalar, adımlar ve adanın sesleri.</p></div><button class="toggle-button ${this.audio?'active':''}" data-action="audio">${icon('sound')}${this.audio?'AÇIK':'KAPALI'}<span></span></button></div><div class="section-label">YOLCULUK KAYDI</div><p class="muted-note">İlerleme tarayıcıda veya Expo Go içinde yerel saklanır. Cihazlar arasında taşımak için kayıt dosyanı dışa aktar.</p><div class="save-actions"><button class="secondary-button" data-action="save">${icon('save')} KAYDET</button><button class="secondary-button" data-action="export">DIŞA AKTAR ${icon('arrow')}</button><button class="secondary-button" data-action="import">İÇE AKTAR</button></div><input type="file" id="save-import" accept="application/json,.json" hidden><details class="text-import"><summary>Kayıt metnini yapıştır</summary><label for="save-import-text">Dışa aktardığın JSON kayıt metni</label><textarea id="save-import-text" rows="4" spellcheck="false" placeholder='JSON kayıt metnini buraya yapıştır…'></textarea><button class="small-button" data-action="importText">KAYDI YÜKLE</button></details><button class="inline-link" data-action="panel" data-value="controls">Kontrolleri göster ${icon('arrow')}</button>`;
  }

  private controlsPanel(): string {
    return `<p class="panel-intro">Hayatta kalmak bir adımla başlar. Kıyıyı keşfet, kaynakları topla ve üç eserin izini sür.</p><div class="controls-columns"><div><div class="section-label">KLAVYE & FARE</div>${[['W A S D','Hareket'],['Fare sürükle','Kamerayı çevir'],['Shift','Koş'],['Space','Zıpla'],['F / sol tık','Saldır / kaynağı kır'],['E','Topla / feneri onar'],['1–5','Araç seç'],['C / B','Üretim / inşa'],['Tab / M','Envanter / harita'],['R','Meyve ye / parçayı döndür'],['Enter / E','İnşa parçasını yerleştir']].map(([key,label])=>`<div class="control-row"><span>${label}</span><kbd>${key}</kbd></div>`).join('')}</div><div><div class="section-label">DOKUNMATİK</div><div class="mobile-control-guide">${icon('hand')}<h3>Keşfetmek için dokun</h3><p>Sol çubukla hareket et. Ekranın sağ yarısını sürükleyerek etrafına bak.</p><p>Sağdaki düğmeler saldırı, etkileşim ve zıplama içindir. Koş düğmesini basılı tut.</p><p>Alt çubuktan araçlarını, üst simgelerden menülerini seç.</p></div><div class="first-steps">${icon('sun')}<span>İlk iş: biraz odun, taş ve meyve topla. Geceyi hazırlıklı karşıla.</span></div></div></div>`;
  }

  private renderTerminal(mode: string): void {
    const node=this.root.querySelector('#terminal-overlay')!;
    node.innerHTML=mode==='death'?`<section class="terminal-card"><span class="terminal-emblem">${icon('moon')}</span><div class="eyebrow">KIYI SENİ HATIRLAYACAK</div><h2>Ateşin sönmedi.</h2><p>Ada bir nefes daha veriyor.<br>Kaynaklarının %20'sini kaybedersin. Araçların ve görevlerin korunur.</p><button class="primary-button" data-action="respawn">YENİDEN UYAN ${icon('arrow')}</button></section>`:`<section class="terminal-card victory"><span class="terminal-emblem">${icon('lighthouse')}</span><div class="eyebrow">YOLCULUK TAMAMLANDI</div><h2>Kıyıda yeniden ışık var.</h2><p>Üç eser bulundu. Kadim muhafız yenildi.<br>Deniz feneri yeniden parlıyor. Bu ada artık senin yuvan.</p><div class="victory-seals">${icon('relic')}${icon('sword')}${icon('lighthouse')}</div><button class="primary-button" data-action="export">YOLCULUĞU SAKLA ${icon('save')}</button><button class="text-button" data-action="newgame">YENİ BİR YOLCULUK</button></section>`;
  }

  private bindTouch(): void {
    const signal=this.eventController.signal;
    const joystick=this.root.querySelector<HTMLElement>('#joystick')!;
    const thumb=this.root.querySelector<HTMLElement>('#joystick-thumb')!;
    let pointer=-1;
    const move=(event:PointerEvent)=>{
      if(this.blocked)return;
      const rect=joystick.getBoundingClientRect();
      let x=event.clientX-(rect.left+rect.width/2), y=event.clientY-(rect.top+rect.height/2);
      const radius=rect.width*.34, distance=Math.hypot(x,y);
      if(distance>radius){x=x/distance*radius;y=y/distance*radius;}
      this.input.moveX=x/radius;this.input.moveZ=y/radius;
      thumb.style.transform=`translate(${x}px,${y}px)`;
    };
    joystick.addEventListener('pointerdown',(event)=>{if(this.blocked)return;event.preventDefault();pointer=event.pointerId;joystick.setPointerCapture(pointer);move(event);},{signal});
    joystick.addEventListener('pointermove',(event)=>{if(event.pointerId===pointer)move(event);},{signal});
    const end=(event:PointerEvent)=>{if(event.pointerId!==pointer)return;pointer=-1;this.input.moveX=0;this.input.moveZ=0;thumb.style.transform='translate(0,0)';};
    joystick.addEventListener('pointerup',end,{signal});joystick.addEventListener('pointercancel',end,{signal});
    const run=this.root.querySelector<HTMLElement>('#touch-run')!;
    run.addEventListener('pointerdown',(event)=>{if(this.blocked)return;event.preventDefault();run.setPointerCapture(event.pointerId);this.input.sprint=true;run.classList.add('pressed');},{signal});
    const release=()=>{this.input.sprint=false;run.classList.remove('pressed');};
    run.addEventListener('pointerup',release,{signal});run.addEventListener('pointercancel',release,{signal});
  }

  private clearInput(): void {
    this.input.moveX=0;this.input.moveZ=0;this.input.sprint=false;this.input.jump=false;
    const thumb=this.root.querySelector<HTMLElement>('#joystick-thumb');if(thumb)thumb.style.transform='translate(0,0)';
  }

  private drawMap(): void {
    const canvas=this.root.querySelector<HTMLCanvasElement>('#island-map');if(!canvas)return;
    const c=canvas.getContext('2d');if(!c)return;
    const w=canvas.width,h=canvas.height;
    c.clearRect(0,0,w,h);c.fillStyle='#172c30';c.fillRect(0,0,w,h);
    const px=(x:number)=>w/2+x*3,py=(z:number)=>h/2+z*3;
    c.strokeStyle='rgba(147,181,166,.09)';c.lineWidth=1;
    for(let x=0;x<w;x+=38){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(let y=0;y<h;y+=38){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
    for(let layer=2;layer>=0;layer--){c.beginPath();for(let a=0;a<=Math.PI*2+.03;a+=.03){const r=72+7*Math.sin(a*3)+5*Math.cos(a*5)+layer*3;const x=px(Math.cos(a)*r),y=py(Math.sin(a)*r*.83);if(a===0)c.moveTo(x,y);else c.lineTo(x,y);}c.closePath();c.fillStyle=['#536956','#8c8d63','#b0a276'][layer];c.fill();c.strokeStyle='#bdd0ad40';c.stroke();}
    c.fillStyle='#334f42';c.beginPath();c.ellipse(px(-25),py(-23),90,61,-.4,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(px(31),py(18),65,46,.6,0,Math.PI*2);c.fill();
    c.fillStyle='#757563';c.beginPath();c.ellipse(px(28),py(-28),62,49,-.7,0,Math.PI*2);c.fill();
    const state=this.game.state;
    for(const relic of RELICS){if(state.quests.relics.includes(relic.id))continue;this.mapMark(c,px(relic.x),py(relic.z),'#e4c37d',5);}
    for(const enemy of state.enemies){if(!enemy.alive)continue;this.mapMark(c,px(enemy.x),py(enemy.z),'#9a4b42',3);}
    for(const build of state.builds)this.mapMark(c,px(build.x),py(build.z),'#ceccac',2);
    const landmarks=[{...LANDMARKS.lighthouse,label:'DENİZ FENERİ'},{...LANDMARKS.temple,label:'KADİM TAPINAK'}];
    c.font='10px system-ui';c.textAlign='center';
    for(const landmark of landmarks){const x=px(landmark.x),y=py(landmark.z);c.fillStyle='#f1d7a0';c.fillRect(x-4,y-4,8,8);c.fillStyle='#f1e3c6';c.shadowColor='#172c30';c.shadowBlur=6;c.fillText(landmark.label,x,y+21);c.shadowBlur=0;}
    const x=px(state.player.x),y=py(state.player.z);c.save();c.translate(x,y);c.rotate(Math.PI-state.player.rotation);c.fillStyle='#f4f0df';c.strokeStyle='#23332c';c.lineWidth=2;c.beginPath();c.moveTo(0,-9);c.lineTo(6,7);c.lineTo(0,4);c.lineTo(-6,7);c.closePath();c.stroke();c.fill();c.restore();
  }

  private mapMark(c:CanvasRenderingContext2D,x:number,y:number,color:string,size:number):void {c.fillStyle=color;c.beginPath();c.arc(x,y,size,0,Math.PI*2);c.fill();}
  private escape(text:string):string {return text.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));}
}
