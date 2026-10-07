/** Shared, platform-independent DraBornLand survival rules. All coordinates are world metres. */
export type ResourceKind = 'wood' | 'stone' | 'berries' | 'crystal' | 'fiber';
export type ResourceType = 'tree' | 'rock' | 'berry' | 'crystal' | 'wood' | 'stone' | 'fiber';
export type Tool = 'axe' | 'pickaxe' | 'sword' | 'food' | 'build';
export type BuildKind = 'floor' | 'wall' | 'door' | 'roof' | 'campfire';
export type EnemyType = 'wolf' | 'shade' | 'dragon';
export type CraftId = 'axe' | 'pickaxe' | 'sword' | 'campfire';
export type Cost = Partial<Record<ResourceKind, number>>;
export interface Input { moveX: number; moveZ: number; sprint: boolean; jump: boolean }
export interface Player {
  x: number; y: number; z: number; rotation: number; health: number; stamina: number;
  hunger: number; dead: boolean; grounded: boolean; attackTimer: number; verticalVelocity: number;
}
export interface Resource {
  id: string; type: ResourceType; x: number; y: number; z: number; hp: number; maxHp: number;
  depleted: boolean; yield: number; scale: number;
}
export interface Enemy {
  id: string; type: EnemyType; x: number; y: number; z: number; rotation: number;
  hp: number; maxHp: number; alive: boolean; phase: 'idle' | 'chase' | 'windup' | 'recover';
  attackTimer: number; windup: number; stagger: number; homeX: number; homeZ: number;
  attackX: number; attackZ: number; attackKind: 'melee' | 'fire';
}
export interface BuildPiece {
  id: string; kind: BuildKind; x: number; y: number; z: number; rotation: number;
  hp: number; open: boolean;
}
export interface Quests {
  relics: string[]; templeOpen: boolean; lighthouseRepaired: boolean;
  bossDefeated: boolean; completed: boolean;
}
export interface GameState {
  seed: number; time: number; day: number; dayPhase: number; isNight: boolean;
  player: Player; inventory: Record<ResourceKind, number>;
  equipment: { axe: boolean; pickaxe: boolean; sword: boolean; emberSword: boolean };
  upgrades: { axe: boolean; pickaxe: boolean }; craftedCampfires: number;
  resources: Resource[]; enemies: Enemy[]; builds: BuildPiece[]; quests: Quests; tool: Tool;
  stats: { gathered: number; killed: number; deaths: number; buildings: number };
}
export interface ActionResult { ok: boolean; message: string }
export interface EnvironmentCollider { x: number; z: number; radius: number }
export interface Target {
  type: 'resource' | 'relic' | 'lighthouse' | 'temple' | 'door' | 'campfire' | 'enemy';
  id: string; x: number; z: number; distance: number; label: string;
}
export type EventType = 'harvest' | 'hit' | 'attack' | 'hurt' | 'death' | 'respawn' | 'craft' | 'build' |
  'relic' | 'temple-open' | 'repair' | 'boss-spawn' | 'boss-defeated' | 'night' | 'dawn' |
  'enemy-spawn' | 'enemy-windup' | 'enemy-attack' | 'eat' | 'win' | 'door' | 'message';
export interface GameEvent {
  type: EventType; x: number; z: number; message?: string; id?: string; amount?: number;
  resource?: ResourceKind; enemyType?: EnemyType; attackKind?: 'melee' | 'fire';
}
export const ISLAND_RADIUS = 70;
export const DAY_LENGTH = 480;
export const HOTBAR: readonly Tool[] = ['axe', 'pickaxe', 'sword', 'food', 'build'];
export const RESOURCE_LABELS: Record<ResourceKind, string> = {
  wood: 'Odun', stone: 'Taş', berries: 'Orman meyvesi', crystal: 'Kristal', fiber: 'Lif',
};
export const LANDMARKS = {
  spawn: { x: 0, z: 34, label: 'Kazazede Koyu' },
  lighthouse: { x: 0, z: 0, label: 'Eski Deniz Feneri' },
  temple: { x: 0, z: -42, label: 'Kül Tapınağı' },
  templeGate: { x: 0, z: -36, label: 'Tapınak Kapısı' },
} as const;
export const RELICS = [
  { id: 'forest', x: -38, z: -12, label: 'Orman Mührü', region: 'Sis Ormanı' },
  { id: 'cliffs', x: 37, z: -20, label: 'Dağ Mührü', region: 'Kristal Kayalıklar' },
  { id: 'shore', x: 29, z: 35, label: 'Gelgit Mührü', region: 'Batık Kalıntılar' },
] as const;
export const REGIONS = [
  { id: 'shore', name: 'Kazazede Koyu', x: 0, z: 34, radius: 20, danger: 0 },
  { id: 'forest', name: 'Sis Ormanı', x: -33, z: -9, radius: 24, danger: 1 },
  { id: 'cliffs', name: 'Kristal Kayalıklar', x: 35, z: -18, radius: 22, danger: 2 },
  { id: 'ruins', name: 'Batık Kalıntılar', x: 29, z: 35, radius: 14, danger: 1 },
  { id: 'temple', name: 'Kül Tapınağı', x: 0, z: -43, radius: 15, danger: 3 },
] as const;
export const BUILD_COSTS: Record<BuildKind, Cost> = {
  floor: { wood: 4 }, wall: { wood: 3, fiber: 1 }, door: { wood: 4, stone: 2 },
  roof: { wood: 5, fiber: 2 }, campfire: { wood: 6, stone: 4 },
};
export const RECIPES: Record<CraftId, { id: CraftId; label: string; cost: Cost; description: string }> = {
  axe: { id: 'axe', label: 'Taş Balta', cost: { wood: 4, stone: 3 }, description: 'Ağaç kesme gücünü yükseltir.' },
  pickaxe: { id: 'pickaxe', label: 'Taş Kazma', cost: { wood: 4, stone: 5 }, description: 'Kayaları ve kristalleri daha hızlı kırar.' },
  sword: { id: 'sword', label: 'Ada Kılıcı', cost: { wood: 6, stone: 8, crystal: 2 }, description: 'Yaratıklara karşı 26 hasar verir.' },
  campfire: { id: 'campfire', label: 'Kamp Ateşi', cost: BUILD_COSTS.campfire, description: 'İnşa menüsünden yerleştir; yakınında can yenilenir.' },
};
export const LIGHTHOUSE_COST: Cost = { wood: 24, stone: 18 };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const distance = (ax: number, az: number, bx: number, bz: number) => Math.hypot(ax - bx, az - bz);
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const smoothstep = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
/** Flat construction/quest clearings blend into gently rolling hills and a low beach. */
export function terrainHeight(x: number, z: number): number {
  const radial = Math.hypot(x, z);
  let height = 2.2 + Math.sin(x * .075) * Math.cos(z * .06) * 1.15 + Math.sin((x + z) * .035) * .75;
  height += Math.exp(-((x - 36) ** 2 + (z + 20) ** 2) / 380) * 2.7;
  const clearings = [{ x: 0, z: 0, r: 9, h: 2.2 }, { x: 0, z: -44, r: 13, h: 3 }, { x: 0, z: 34, r: 8, h: 1.6 }];
  for (const c of clearings) {
    const blend = 1 - smoothstep(c.r, c.r + 5, distance(x, z, c.x, c.z));
    height = height * (1 - blend) + c.h * blend;
  }
  const beach = smoothstep(56, ISLAND_RADIUS, radial);
  return height * (1 - beach) - beach * 1.1;
}

function randomGenerator(seed: number) {
  let value = seed >>> 0;
  return () => { value += 0x6D2B79F5; let t = value; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function createResources(seed: number): Resource[] {
  const random = randomGenerator(seed), resources: Resource[] = [];
  const append = (type: ResourceType, x: number, z: number) => {
    const maxHp = type === 'tree' ? 60 : type === 'rock' ? 55 : type === 'crystal' ? 70 : 1;
    resources.push({ id: `resource-${resources.length}`, type, x, y: terrainHeight(x, z), z, hp: maxHp, maxHp, depleted: false,
      yield: type === 'tree' ? 5 : type === 'rock' ? 4 : type === 'crystal' ? 3 : type === 'berry' ? 4 : 2, scale: .8 + random() * .55 });
  };
  // The first materials and food are easy to spot from the landing beach.
  for (const [type, x, z] of [['wood', -3, 30], ['stone', 3, 30], ['fiber', -5, 33], ['berry', 5, 31],
    ['tree', -8, 26], ['tree', 8, 24], ['rock', -9, 34], ['rock', 9, 36]] as [ResourceType, number, number][]) append(type, x, z);
  const counts: [ResourceType, number][] = [['tree', 68], ['rock', 42], ['berry', 20], ['crystal', 14], ['wood', 13], ['stone', 13], ['fiber', 18]];
  for (const [type, count] of counts) {
    let placed = 0;
    for (let attempt = 0; placed < count && attempt < count * 60; attempt++) {
      let x = (random() - .5) * 116, z = (random() - .5) * 116;
      if (type === 'crystal') { x = 21 + random() * 28; z = -34 + random() * 33; }
      if (type === 'tree' && x > 21 && z < 0 && random() < .65) continue;
      if (Math.hypot(x, z) > 59 || terrainHeight(x, z) < 1 || distance(x, z, 0, 0) < 10 || distance(x, z, 0, -43) < 15 || distance(x, z, 0, 34) < 7) continue;
      if (RELICS.some(r => distance(x, z, r.x, r.z) < 4) || resources.some(r => distance(x, z, r.x, r.z) < (type === 'tree' ? 3.2 : 2))) continue;
      append(type, x, z); placed++;
    }
  }
  return resources;
}
function createEnemy(id: string, type: EnemyType, x: number, z: number): Enemy {
  const maxHp = type === 'dragon' ? 360 : type === 'shade' ? 72 : 48;
  return { id, type, x, y: terrainHeight(x, z), z, rotation: 0, hp: maxHp, maxHp, alive: true, phase: 'idle',
    attackTimer: 1.4, windup: 0, stagger: 0, homeX: x, homeZ: z, attackX: x, attackZ: z, attackKind: 'melee' };
}
export function createGame(seed = 42891): Game { return new Game(seed); }

export class Game {
  state: GameState;
  private events: GameEvent[] = [];
  private spawnTimer = 24;
  private enemySerial = 0;
  private buildSerial = 0;
  private random: () => number;
  private jumpHeld = false;
  private environmentColliders: EnvironmentCollider[] = [];

  constructor(seed = 42891) {
    seed = Number.isFinite(seed) ? Math.floor(seed) >>> 0 : 42891;
    this.random = randomGenerator(seed ^ 0x8917);
    this.state = {
      seed, time: 80, day: 1, dayPhase: 80 / DAY_LENGTH, isNight: false,
      player: { x: 0, y: terrainHeight(0, 34), z: 34, rotation: Math.PI, health: 100, stamina: 100,
        hunger: 100, dead: false, grounded: true, attackTimer: 0, verticalVelocity: 0 },
      inventory: { wood: 0, stone: 0, berries: 3, crystal: 0, fiber: 0 },
      equipment: { axe: true, pickaxe: true, sword: false, emberSword: false },
      upgrades: { axe: false, pickaxe: false }, craftedCampfires: 0,
      resources: createResources(seed), enemies: [
        createEnemy('enemy-0', 'wolf', -32, -3), createEnemy('enemy-1', 'wolf', -42, -22),
        createEnemy('enemy-2', 'wolf', 31, -13), createEnemy('enemy-3', 'wolf', 45, -27),
        createEnemy('enemy-4', 'wolf', 36, 34),
      ], builds: [], quests: { relics: [], templeOpen: false, lighthouseRepaired: false, bossDefeated: false, completed: false },
      tool: 'axe', stats: { gathered: 0, killed: 0, deaths: 0, buildings: 0 },
    };
    this.enemySerial = 5;
  }

  drainEvents(): GameEvent[] { const events = this.events; this.events = []; return events; }
  /** Decorative geometry shares physics without becoming a harvested or saved resource. */
  setEnvironmentColliders(colliders: readonly EnvironmentCollider[]): void {
    if (!Array.isArray(colliders)) return;
    this.environmentColliders = colliders.filter(c => c && finite(c.x) && finite(c.z) && finite(c.radius) &&
      c.radius > 0 && c.radius <= 6 && Math.hypot(c.x, c.z) <= 80).slice(0, 1500)
      .map(c => ({ x: c.x, z: c.z, radius: c.radius }));
  }
  private emit(type: EventType, x: number, z: number, extra: Partial<GameEvent> = {}) {
    this.events.push({ type, x, z, ...extra });
    if (this.events.length > 160) this.events.splice(0, this.events.length - 160);
  }
  private result(ok: boolean, message: string): ActionResult { return { ok, message }; }
  private spend(cost: Cost): boolean {
    if (!this.canAfford(cost)) return false;
    for (const [key, amount] of Object.entries(cost)) this.state.inventory[key as ResourceKind] -= amount!;
    return true;
  }
  canAfford(cost: Cost): boolean {
    return Object.entries(cost).every(([key, amount]) => this.state.inventory[key as ResourceKind] >= amount!);
  }
  private credit(kind: ResourceKind, amount: number) {
    this.state.inventory[kind] = Math.min(999, this.state.inventory[kind] + amount);
    this.state.stats.gathered += amount;
  }

  setTool(tool: Tool): ActionResult {
    if (!HOTBAR.includes(tool)) return this.result(false, 'Geçersiz araç.');
    if (tool === 'sword' && !this.state.equipment.sword) return this.result(false, 'Önce bir kılıç üret veya feneri onar.');
    this.state.tool = tool;
    return this.result(true, '');
  }

  tick(dt: number, input: Input): void {
    if (!finite(dt) || dt <= 0) return;
    const elapsed = Math.min(dt, .25), stepCount = Math.ceil(elapsed / .05), step = elapsed / stepCount;
    const safeInput: Input = {
      moveX: finite(input.moveX) ? clamp(input.moveX, -1, 1) : 0,
      moveZ: finite(input.moveZ) ? clamp(input.moveZ, -1, 1) : 0,
      sprint: !!input.sprint, jump: !!input.jump,
    };
    const jump = safeInput.jump && !this.jumpHeld;
    this.jumpHeld = safeInput.jump;
    for (let i = 0; i < stepCount; i++) this.advance(step, { ...safeInput, jump: jump && i === 0 });
  }

  private advance(dt: number, input: Input) {
    const state = this.state, p = state.player;
    if (p.dead || state.quests.completed) return;
    const wasNight = state.isNight;
    state.time += dt;
    state.day = Math.floor(state.time / DAY_LENGTH) + 1;
    state.dayPhase = (state.time % DAY_LENGTH) / DAY_LENGTH;
    state.isNight = state.dayPhase >= .67 || state.dayPhase < .055;
    if (state.isNight !== wasNight) {
      this.emit(state.isNight ? 'night' : 'dawn', p.x, p.z, {
        message: state.isNight ? 'Gece çöktü. Gölgeler adaya çıkıyor; ateşinin yakınında kal.' : 'Şafak söktü. Ada yeniden nefes alıyor.',
      });
      this.spawnTimer = state.isNight ? 1 : 25;
    }
    p.attackTimer = Math.max(0, p.attackTimer - dt);
    const magnitude = Math.hypot(input.moveX, input.moveZ), moving = magnitude > .05;
    const sheltered = this.isSheltered(p.x, p.z), warm = state.builds.some(b => b.kind === 'campfire' && distance(p.x, p.z, b.x, b.z) < 5);
    p.hunger = Math.max(0, p.hunger - dt * (warm ? .08 : input.sprint && moving ? .19 : .115));
    if (p.hunger <= 0) this.hurtPlayer(dt * 1.6, 'Açlıktan güç kaybediyorsun.');
    const sprinting = moving && input.sprint && p.stamina > 2 && p.grounded;
    p.stamina = clamp(p.stamina + dt * (sprinting ? -14 : 10), 0, 100);
    if ((warm || sheltered) && p.hunger > 20 && !state.enemies.some(e => e.alive && distance(e.x, e.z, p.x, p.z) < 9)) {
      p.health = Math.min(100, p.health + dt * (warm ? 3 : 1.8));
    }
    if (moving) {
      const mx = input.moveX / Math.max(1, magnitude), mz = input.moveZ / Math.max(1, magnitude);
      const speed = sprinting ? 6.6 : 4.25;
      const targetRotation = Math.atan2(mx, mz);
      p.rotation += Math.atan2(Math.sin(targetRotation - p.rotation), Math.cos(targetRotation - p.rotation)) * Math.min(1, dt * 12);
      const nx = p.x + mx * speed * dt, nz = p.z + mz * speed * dt;
      if (!this.blocked(nx, p.z, .4)) p.x = nx;
      if (!this.blocked(p.x, nz, .4)) p.z = nz;
    }
    if (input.jump && p.grounded && p.stamina >= 12) {
      p.verticalVelocity = 6.6; p.grounded = false; p.stamina -= 12;
    }
    const ground = this.groundAt(p.x, p.z);
    if (!p.grounded) {
      p.verticalVelocity -= 18 * dt; p.y += p.verticalVelocity * dt;
      if (p.y <= ground) { p.y = ground; p.grounded = true; p.verticalVelocity = 0; }
    } else p.y = ground;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = state.isNight ? 18 : 55;
      this.spawnEnemy();
    }
    for (const enemy of state.enemies) if (enemy.alive) this.advanceEnemy(enemy, dt);
    // A bounded list keeps long-running mobile saves small.
    if (state.enemies.length > 28) state.enemies = state.enemies.filter(e => e.alive || e.type === 'dragon').slice(-22);
  }

  private groundAt(x: number, z: number): number {
    let h = terrainHeight(x, z);
    for (const b of this.state.builds) if (b.kind === 'floor' && Math.abs(x - b.x) < 1.5 && Math.abs(z - b.z) < 1.5) h = Math.max(h, b.y + .18);
    return h;
  }

  private blocked(x: number, z: number, radius: number, enemy = false): boolean {
    if (Math.hypot(x, z) > 66 || terrainHeight(x, z) < -.08) return true;
    if (distance(x, z, 0, 0) < 2.15 + radius) return true;
    const gatePlane = Math.abs(z + 36) < radius + .3;
    if (gatePlane && Math.abs(x) < 7.85 + radius && (Math.abs(x) > 2.2 - radius || !this.state.quests.templeOpen)) return true;
    // These dimensions match the visible temple masonry in world.ts.
    if (z < -44 + radius && z > -52 - radius && Math.abs(x + 7.85) < radius + .35) return true;
    if (z < -43 + radius && z > -52 - radius && Math.abs(x - 7.85) < radius + .35) return true;
    if (Math.abs(x) < 8.5 + radius && Math.abs(z + 53.5) < radius + .4) return true;
    for (const c of this.environmentColliders) if (distance(x, z, c.x, c.z) < radius + c.radius) return true;
    if (!enemy) for (const r of this.state.resources) {
      if (!r.depleted && (r.type === 'tree' || r.type === 'rock') && distance(x, z, r.x, r.z) < radius + (r.type === 'tree' ? .42 : .65)) return true;
    }
    for (const b of this.state.builds) {
      if (b.kind !== 'wall' && b.kind !== 'door') continue;
      // Opening the 1.34m door leaf leaves both wooden side panels solid.
      const openingHalf = b.kind === 'door' && b.open ? .67 : 0;
      if (this.insideWall(x, z, b.x, b.z, b.rotation, radius, openingHalf)) return true;
    }
    return false;
  }

  private insideWall(x: number, z: number, wallX: number, wallZ: number, rotation: number, radius: number, openingHalf = 0): boolean {
    const dx = x - wallX, dz = z - wallZ;
    const localX = dx * Math.cos(rotation) - dz * Math.sin(rotation), localZ = dx * Math.sin(rotation) + dz * Math.cos(rotation);
    return Math.abs(localX) < 1.5 + radius && Math.abs(localZ) < .16 + radius &&
      (openingHalf <= 0 || Math.abs(localX) > openingHalf - radius);
  }

  private clearAttackLine(ax: number, az: number, bx: number, bz: number): boolean {
    const steps = Math.max(2, Math.ceil(distance(ax, az, bx, bz) / .22));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (this.blocked(ax + (bx - ax) * t, az + (bz - az) * t, .03, true)) return false;
    }
    return true;
  }

  private isSheltered(x: number, z: number): boolean {
    return this.state.builds.some(b => b.kind === 'roof' && distance(x, z, b.x, b.z) < 2.3) &&
      this.state.builds.filter(b => (b.kind === 'wall' || b.kind === 'door') && distance(x, z, b.x, b.z) < 4.5).length >= 2;
  }

  private spawnEnemy() {
    const s = this.state, p = s.player;
    const count = s.enemies.filter(e => e.alive && e.type !== 'dragon').length;
    if (count >= (s.isNight ? 13 : 6)) return;
    const type: EnemyType = s.isNight ? (this.random() < .65 ? 'shade' : 'wolf') : 'wolf';
    for (let i = 0; i < 16; i++) {
      const angle = this.random() * Math.PI * 2, radius = 17 + this.random() * 12;
      const x = p.x + Math.sin(angle) * radius, z = p.z + Math.cos(angle) * radius;
      if (Math.hypot(x, z) > 59 || distance(x, z, 0, 34) < (s.isNight ? 8 : 22) || (Math.abs(x) < 11 && z < -32) || this.blocked(x, z, .5, true)) continue;
      const enemy = createEnemy(`enemy-${this.enemySerial++}`, type, x, z);
      s.enemies.push(enemy); this.emit('enemy-spawn', x, z, { id: enemy.id, enemyType: type }); return;
    }
  }

  private advanceEnemy(e: Enemy, dt: number) {
    const p = this.state.player;
    if (p.dead) return;
    e.attackTimer = Math.max(0, e.attackTimer - dt);
    if (e.stagger > 0) { e.stagger = Math.max(0, e.stagger - dt); return; }
    const d = distance(e.x, e.z, p.x, p.z), dragon = e.type === 'dragon';
    if (e.phase === 'windup') {
      e.windup -= dt;
      if (e.windup <= 0) {
        const fire = e.attackKind === 'fire';
        const hit = (fire ? distance(p.x, p.z, e.attackX, e.attackZ) < 3.7 && p.grounded : d < (dragon ? 3.6 : 2.25)) &&
          this.clearAttackLine(e.x, e.z, p.x, p.z);
        if (hit) this.hurtPlayer(dragon ? fire ? 23 : 17 : e.type === 'shade' ? 12 : 8);
        this.emit('enemy-attack', fire ? e.attackX : e.x, fire ? e.attackZ : e.z, { id: e.id, enemyType: e.type, attackKind: e.attackKind });
        e.phase = 'recover'; e.attackTimer = dragon ? 2.5 : 1.65;
      }
      return;
    }
    if (e.phase === 'recover' && e.attackTimer > .4) return;
    const aggro = dragon ? this.state.quests.templeOpen && p.z < -31 && Math.abs(p.x) < 13 : d < (this.state.isNight ? 19 : 11);
    if (!aggro) {
      e.phase = 'idle';
      if (distance(e.x, e.z, e.homeX, e.homeZ) > 2) this.moveEnemy(e, e.homeX, e.homeZ, dt, 1.1);
      return;
    }
    e.rotation = Math.atan2(p.x - e.x, p.z - e.z);
    const attackRange = dragon ? (e.hp < e.maxHp * .5 ? 10 : 8) : 1.75;
    if (d < attackRange && e.attackTimer <= 0 && this.clearAttackLine(e.x, e.z, p.x, p.z)) {
      e.attackKind = dragon && d > 3 ? 'fire' : 'melee';
      e.phase = 'windup'; e.windup = dragon ? e.attackKind === 'fire' ? 1.35 : .9 : .65;
      e.attackX = p.x; e.attackZ = p.z;
      this.emit('enemy-windup', e.attackX, e.attackZ, { id: e.id, enemyType: e.type, attackKind: e.attackKind });
      return;
    }
    e.phase = 'chase';
    if (d > (dragon ? 2.8 : 1.5)) this.moveEnemy(e, p.x, p.z, dt, dragon ? 2.4 : e.type === 'shade' ? 3.45 : 3.0);
  }

  private moveEnemy(e: Enemy, targetX: number, targetZ: number, dt: number, speed: number) {
    const dx = targetX - e.x, dz = targetZ - e.z, len = Math.hypot(dx, dz) || 1;
    const nx = e.x + dx / len * speed * dt, nz = e.z + dz / len * speed * dt;
    if (!this.blocked(nx, e.z, e.type === 'dragon' ? 1.05 : .4, true)) e.x = nx;
    if (!this.blocked(e.x, nz, e.type === 'dragon' ? 1.05 : .4, true)) e.z = nz;
    if (e.type === 'dragon') { e.x = clamp(e.x, -6.8, 6.8); e.z = clamp(e.z, -53.5, -38); }
    e.y = terrainHeight(e.x, e.z);
  }

  private hurtPlayer(damage: number, message?: string) {
    const p = this.state.player;
    if (p.dead) return;
    p.health = Math.max(0, p.health - damage);
    if (damage >= 1) this.emit('hurt', p.x, p.z, { amount: damage, message });
    if (p.health <= 0) {
      p.dead = true; this.state.stats.deaths++;
      this.emit('death', p.x, p.z, { message: 'Adanın karanlığı seni yuttu. Kıyıda yeniden doğabilirsin.' });
    }
  }

  nearestTarget(): Target | null {
    const p = this.state.player;
    if (p.dead) return null;
    const targets: Target[] = [];
    const add = (type: Target['type'], id: string, x: number, z: number, label: string, reach: number) => {
      const d = distance(p.x, p.z, x, z); if (d <= reach) targets.push({ type, id, x, z, label, distance: d });
    };
    for (const r of this.state.resources) if (!r.depleted) add('resource', r.id, r.x, r.z,
      r.type === 'tree' ? 'Ağaç · Balta ile kes' : r.type === 'rock' ? 'Kaya · Kazma ile kır' : r.type === 'crystal' ? 'Kristal · Kazma ile kır' :
        r.type === 'berry' ? 'Orman meyvesi · Topla' : r.type === 'wood' ? 'Odun · Topla' : r.type === 'stone' ? 'Taş · Topla' : 'Lif · Topla', 3.4);
    for (const relic of RELICS) if (!this.state.quests.relics.includes(relic.id)) add('relic', relic.id, relic.x, relic.z, `${relic.label} · Al`, 3.8);
    if (!this.state.quests.lighthouseRepaired) add('lighthouse', 'lighthouse', 0, 0, 'Feneri onar · 24 odun + 18 taş', 6);
    if (!this.state.quests.templeOpen) add('temple', 'temple', 0, -36, 'Kül Tapınağı · 3 antik mühür gerekiyor', 5);
    for (const b of this.state.builds) {
      if (b.kind === 'door') add('door', b.id, b.x, b.z, b.open ? 'Kapıyı kapat' : 'Kapıyı aç', 3.2);
      if (b.kind === 'campfire') add('campfire', b.id, b.x, b.z, 'Kamp ateşi · Yakınında dinlen', 2.7);
    }
    for (const e of this.state.enemies) if (e.alive) add('enemy', e.id, e.x, e.z, e.type === 'dragon' ? 'Kül Ejderhası · Saldır' : e.type === 'shade' ? 'Gece Gölgesi · Saldır' : 'Yaban Kurdu · Saldır', 3.5);
    targets.sort((a, b) => a.distance - b.distance);
    return targets[0] || null;
  }

  interact(): ActionResult {
    if (this.state.player.dead) return this.result(false, 'Önce kıyıda yeniden doğ.');
    const target = this.nearestTarget();
    if (!target) return this.result(false, 'Etkileşim için biraz daha yaklaş.');
    if (target.type === 'resource') {
      const r = this.state.resources.find(r => r.id === target.id)!;
      if (r.type === 'tree' || r.type === 'rock' || r.type === 'crystal') return this.attackResource(r);
      return this.harvest(r);
    }
    if (target.type === 'relic') {
      this.state.quests.relics.push(target.id);
      const message = `${target.label.split(' · ')[0]} alındı. ${this.state.quests.relics.length}/3 mühür.`;
      this.emit('relic', target.x, target.z, { id: target.id, message });
      if (this.state.quests.relics.length === 3) {
        this.state.quests.templeOpen = true;
        const boss = createEnemy('dragon-boss', 'dragon', 0, -48);
        this.state.enemies.push(boss);
        this.emit('temple-open', 0, -36, { message: 'Üç mühür birleşti. Kül Tapınağı açıldı!' });
        this.emit('boss-spawn', 0, -48, { id: boss.id, enemyType: 'dragon' });
      }
      return this.result(true, message);
    }
    if (target.type === 'lighthouse') return this.repair();
    if (target.type === 'temple') return this.result(false, 'Adanın üç bölgesindeki antik mühürleri bul.');
    if (target.type === 'door') {
      const b = this.state.builds.find(b => b.id === target.id)!;
      // Closing a doorway around a character is blocked to prevent entrapment.
      if (b.open && this.insideWall(this.state.player.x, this.state.player.z, b.x, b.z, b.rotation, .4)) return this.result(false, 'Kapıyı kapatmak için bir adım uzaklaş.');
      b.open = !b.open; this.emit('door', b.x, b.z, { id: b.id });
      return this.result(true, b.open ? 'Kapı açıldı.' : 'Kapı kapandı.');
    }
    if (target.type === 'campfire') return this.result(true, 'Ateşin yakınında canın yenileniyor.');
    return this.attack();
  }

  attack(): ActionResult {
    const p = this.state.player;
    if (p.dead) return this.result(false, 'Önce kıyıda yeniden doğ.');
    if (p.attackTimer > 0) return this.result(false, '');
    const range = this.state.tool === 'sword' ? 3.35 : 2.9;
    const enemies = this.state.enemies.filter(e => e.alive && distance(p.x, p.z, e.x, e.z) <= range + (e.type === 'dragon' ? 1.2 : 0) &&
      this.clearAttackLine(p.x, p.z, e.x, e.z));
    enemies.sort((a, b) => distance(p.x, p.z, a.x, a.z) - distance(p.x, p.z, b.x, b.z));
    if (enemies.length) {
      if (p.stamina < 7) return this.result(false, 'Saldırmak için biraz nefeslen.');
      const e = enemies[0];
      const damage = this.state.tool === 'sword' && this.state.equipment.sword ? this.state.equipment.emberSword ? 42 : 26 : this.state.tool === 'axe' ? this.state.upgrades.axe ? 15 : 10 : 8;
      p.stamina -= 7; p.attackTimer = this.state.tool === 'sword' ? .46 : .6;
      p.rotation = Math.atan2(e.x - p.x, e.z - p.z);
      e.hp = Math.max(0, e.hp - damage); e.stagger = e.type === 'dragon' ? .09 : .2;
      this.emit('attack', p.x, p.z, { id: e.id });
      this.emit('hit', e.x, e.z, { id: e.id, amount: damage, enemyType: e.type });
      if (e.hp <= 0) {
        e.alive = false; this.state.stats.killed++;
        if (e.type === 'dragon') {
          this.state.quests.bossDefeated = true;
          this.credit('crystal', 8);
          this.emit('boss-defeated', e.x, e.z, { message: 'Kül Ejderhası yenildi. Tapınağın laneti kırıldı!' });
          this.checkWin();
        } else {
          this.credit('berries', e.type === 'shade' ? 2 : 1);
          this.credit('fiber', 2);
          if (e.type === 'shade') this.credit('crystal', 1);
          this.emit('harvest', e.x, e.z, { message: 'Yaratık yenildi. Lif ve yiyecek toplandı.', id: e.id });
        }
      }
      return this.result(true, '');
    }
    const resources = this.state.resources.filter(r => !r.depleted && distance(p.x, p.z, r.x, r.z) < 3.4);
    resources.sort((a, b) => distance(p.x, p.z, a.x, a.z) - distance(p.x, p.z, b.x, b.z));
    if (resources[0]) return this.attackResource(resources[0]);
    p.attackTimer = .45; this.emit('attack', p.x, p.z);
    return this.result(false, 'Hedefe yaklaş.');
  }

  private attackResource(r: Resource): ActionResult {
    const p = this.state.player;
    if (p.attackTimer > 0) return this.result(false, '');
    if (r.type !== 'tree' && r.type !== 'rock' && r.type !== 'crystal') return this.harvest(r);
    const neededTool = r.type === 'tree' ? 'axe' : 'pickaxe';
    if (this.state.tool !== neededTool) return this.result(false, neededTool === 'axe' ? 'Ağaç için baltayı seç.' : 'Kaya için kazmayı seç.');
    if (p.stamina < 4) return this.result(false, 'Toplamak için biraz nefeslen.');
    const damage = neededTool === 'axe' ? this.state.upgrades.axe ? 40 : 23 : this.state.upgrades.pickaxe ? 38 : 22;
    r.hp = Math.max(0, r.hp - damage); p.stamina -= 4; p.attackTimer = .48;
    p.rotation = Math.atan2(r.x - p.x, r.z - p.z);
    this.emit('attack', p.x, p.z, { id: r.id });
    this.emit('hit', r.x, r.z, { id: r.id, amount: damage });
    if (r.hp <= 0) return this.harvest(r);
    return this.result(true, '');
  }

  private harvest(r: Resource): ActionResult {
    if (r.depleted) return this.result(false, 'Bu kaynak tükendi.');
    r.depleted = true; r.hp = 0;
    const resource: ResourceKind = r.type === 'tree' || r.type === 'wood' ? 'wood' : r.type === 'rock' || r.type === 'stone' ? 'stone' : r.type === 'berry' ? 'berries' : r.type === 'crystal' ? 'crystal' : 'fiber';
    this.credit(resource, r.yield);
    if (r.type === 'tree') this.credit('fiber', 2);
    const message = `+${r.yield} ${RESOURCE_LABELS[resource]}${r.type === 'tree' ? ' · +2 lif' : ''}`;
    this.emit('harvest', r.x, r.z, { id: r.id, resource, amount: r.yield, message });
    return this.result(true, message);
  }

  craft(id: CraftId): ActionResult {
    if (this.state.player.dead) return this.result(false, 'Önce yeniden doğ.');
    if (!Object.hasOwn(RECIPES, id)) return this.result(false, 'Geçersiz üretim tarifi.');
    const recipe = RECIPES[id];
    if ((id === 'axe' || id === 'pickaxe') && this.state.upgrades[id]) return this.result(false, 'Bu araç zaten geliştirilmiş.');
    if (id === 'sword' && this.state.equipment.sword) return this.result(false, 'Zaten bir kılıcın var.');
    if (!this.spend(recipe.cost)) return this.result(false, 'Üretim için yeterli kaynak yok.');
    if (id === 'axe' || id === 'pickaxe') this.state.upgrades[id] = true;
    else if (id === 'sword') this.state.equipment.sword = true;
    else this.state.craftedCampfires++;
    const p = this.state.player, message = `${recipe.label} üretildi.`;
    this.emit('craft', p.x, p.z, { id, message });
    return this.result(true, message);
  }

  /** Ground-anchored pieces; floors/roofs may share centres, doors sit on a wall edge. */
  build(kind: BuildKind, x: number, z: number, rotation = 0): ActionResult {
    const p = this.state.player;
    if (p.dead) return this.result(false, 'Önce yeniden doğ.');
    if (!Object.hasOwn(BUILD_COSTS, kind) || !finite(x) || !finite(z) || !finite(rotation)) return this.result(false, 'Geçersiz yapı konumu.');
    x = Math.round(x * 2) / 2; z = Math.round(z * 2) / 2;
    rotation = Math.round(rotation / (Math.PI / 2)) * Math.PI / 2;
    if (distance(p.x, p.z, x, z) > 8) return this.result(false, 'Yapıyı daha yakına yerleştir.');
    if (Math.hypot(x, z) > 58 || terrainHeight(x, z) < 1) return this.result(false, 'Kıyıya çok yakın; sağlam bir zemin seç.');
    if (distance(x, z, 0, 0) < 8 || distance(x, z, 0, -43) < 15 || RELICS.some(r => distance(x, z, r.x, r.z) < 4)) return this.result(false, 'Antik alanlara yapı yerleştirilemez.');
    if (this.state.builds.length >= 160) return this.result(false, 'Ada için yapı sınırına ulaşıldı.');
    if (kind !== 'roof' && this.state.resources.some(r => !r.depleted && ['tree', 'rock', 'crystal'].includes(r.type) && distance(x, z, r.x, r.z) < 1.8)) return this.result(false, 'Önce buradaki kaynağı temizle.');
    if (kind === 'wall' || kind === 'door') {
      if (this.insideWall(p.x, p.z, x, z, rotation, .4)) return this.result(false, 'Duvarın içinden bir adım uzaklaş.');
      if (this.state.enemies.some(e => e.alive && distance(x, z, e.x, e.z) < 1.8)) return this.result(false, 'Bir yaratık bu alanı engelliyor.');
    }
    if (this.state.builds.some(b => b.kind === kind && distance(x, z, b.x, b.z) < (kind === 'wall' || kind === 'door' ? 1 : 2.7) &&
      (kind !== 'wall' || Math.abs(Math.sin(rotation - b.rotation)) < .5))) return this.result(false, 'Bu yapı için alan dolu.');
    if (kind === 'campfire' && this.state.builds.some(b => b.kind !== 'roof' && b.kind !== 'floor' && distance(x, z, b.x, b.z) < 1.2)) return this.result(false, 'Ateş için açık bir alan seç.');
    if ((kind === 'wall' || kind === 'door') && this.state.builds.some(b => (b.kind === 'wall' || b.kind === 'door') && distance(x, z, b.x, b.z) < .85 && Math.abs(Math.sin(rotation - b.rotation)) < .5)) return this.result(false, 'Burada zaten bir duvar veya kapı var.');
    if (kind === 'roof' && !this.state.builds.some(b => b.kind === 'floor' && distance(x, z, b.x, b.z) < 1.7)) return this.result(false, 'Çatı için önce bir zemin yerleştir.');
    const fireKit = kind === 'campfire' && this.state.craftedCampfires > 0;
    if (!fireKit && !this.spend(BUILD_COSTS[kind])) return this.result(false, 'İnşa için yeterli kaynak yok.');
    if (fireKit) this.state.craftedCampfires--;
    const piece: BuildPiece = { id: `build-${this.buildSerial++}`, kind, x, y: terrainHeight(x, z), z, rotation, hp: 100, open: false };
    this.state.builds.push(piece); this.state.stats.buildings++;
    const labels: Record<BuildKind, string> = { floor: 'Zemin', wall: 'Duvar', door: 'Kapı', roof: 'Çatı', campfire: 'Kamp ateşi' };
    this.emit('build', x, z, { id: piece.id, message: `${labels[kind]} yerleştirildi.` });
    return this.result(true, `${labels[kind]} yerleştirildi.`);
  }

  eat(): ActionResult {
    const p = this.state.player;
    if (p.dead) return this.result(false, 'Önce yeniden doğ.');
    if (this.state.inventory.berries <= 0) return this.result(false, 'Yiyecek yok; ormandan meyve topla.');
    if (p.hunger >= 99 && p.health >= 99) return this.result(false, 'Henüz aç değilsin.');
    this.state.inventory.berries--; p.hunger = Math.min(100, p.hunger + 30); p.health = Math.min(100, p.health + 10);
    this.emit('eat', p.x, p.z, { message: 'Meyve yedin. +30 tokluk, +10 can.' });
    return this.result(true, 'Meyve yedin.');
  }

  repair(): ActionResult {
    if (this.state.player.dead) return this.result(false, 'Önce yeniden doğ.');
    if (distance(this.state.player.x, this.state.player.z, 0, 0) > 6) return this.result(false, 'Deniz fenerine yaklaş.');
    if (this.state.quests.lighthouseRepaired) return this.result(false, 'Fener zaten onarıldı.');
    if (!this.spend(LIGHTHOUSE_COST)) return this.result(false, 'Onarım için 24 odun ve 18 taş gerekiyor.');
    this.state.quests.lighthouseRepaired = true;
    this.state.equipment.sword = true; this.state.equipment.emberSword = true; this.state.tool = 'sword';
    this.emit('repair', 0, 0, { message: 'Fener yeniden ışıldıyor! Fırtına Kılıcı ödülün: 42 hasar.' });
    this.checkWin();
    return this.result(true, 'Fener onarıldı. Fırtına Kılıcı kazanıldı!');
  }

  private checkWin() {
    if (this.state.quests.lighthouseRepaired && this.state.quests.bossDefeated && !this.state.quests.completed) {
      this.state.quests.completed = true;
      this.emit('win', this.state.player.x, this.state.player.z, { message: 'Ada kurtuldu! Ejderha yenildi ve deniz feneri yeniden yanıyor.' });
    }
  }

  respawn(): ActionResult {
    const p = this.state.player;
    if (!p.dead) return this.result(false, 'Hâlâ hayattasın.');
    for (const resource of ['wood', 'stone', 'crystal', 'fiber'] as ResourceKind[]) this.state.inventory[resource] = Math.floor(this.state.inventory[resource] * .8);
    p.x = 0; p.z = 34; p.y = terrainHeight(0, 34); p.health = 100; p.stamina = 100; p.hunger = 70;
    p.dead = false; p.grounded = true; p.verticalVelocity = 0; p.attackTimer = 0;
    this.state.enemies = this.state.enemies.filter(e => e.type === 'dragon' || distance(e.x, e.z, 0, 34) > 13);
    const boss = this.state.enemies.find(e => e.type === 'dragon' && e.alive);
    if (boss) { boss.x = 0; boss.z = -48; boss.y = terrainHeight(0, -48); boss.hp = boss.maxHp; boss.phase = 'idle'; boss.windup = 0; }
    this.emit('respawn', 0, 34, { message: 'Kıyıda uyandın. Kaynaklarının %20’si kayboldu; ekipmanın ve görevlerin duruyor.' });
    return this.result(true, 'Yeniden doğdun.');
  }

  save(): string { return JSON.stringify({ version: 1, state: this.state }); }

  /** Validate into a fresh state before replacing the running game; failed loads are atomic. */
  load(raw: string): ActionResult {
    try {
      if (typeof raw !== 'string' || raw.length > 1_500_000) throw new Error('size');
      const data = JSON.parse(raw);
      if (!data || data.version !== 1 || !data.state || typeof data.state !== 'object') throw new Error('version');
      const incoming = data.state;
      if (!finite(incoming.seed) || !finite(incoming.time) || incoming.time < 0 || incoming.time > DAY_LENGTH * 10000) throw new Error('time');
      const fresh = new Game(incoming.seed), next = fresh.state;
      const p = incoming.player;
      if (!p || ![p.x, p.y, p.z, p.health, p.stamina, p.hunger, p.rotation].every(finite) || Math.hypot(p.x, p.z) > 67) throw new Error('player');
      next.time = incoming.time; next.day = Math.floor(next.time / DAY_LENGTH) + 1; next.dayPhase = next.time % DAY_LENGTH / DAY_LENGTH;
      next.isNight = next.dayPhase >= .67 || next.dayPhase < .055;
      next.player = { ...next.player, x: p.x, z: p.z, y: Math.max(terrainHeight(p.x, p.z), p.y), rotation: p.rotation,
        health: clamp(p.health, 0, 100), stamina: clamp(p.stamina, 0, 100), hunger: clamp(p.hunger, 0, 100), dead: p.health <= 0 || !!p.dead,
        grounded: true, verticalVelocity: 0, attackTimer: 0 };
      // A restored character always settles onto the terrain, never stays airborne in a save.
      next.player.y = terrainHeight(p.x, p.z);
      if (!incoming.inventory || typeof incoming.inventory !== 'object') throw new Error('inventory');
      for (const key of Object.keys(next.inventory) as ResourceKind[]) {
        if (!finite(incoming.inventory[key]) || incoming.inventory[key] < 0) throw new Error('inventory');
        next.inventory[key] = Math.floor(clamp(incoming.inventory[key], 0, 999));
      }
      if (!incoming.quests || !Array.isArray(incoming.quests.relics) || incoming.quests.relics.some((id: unknown) => !RELICS.some(r => r.id === id))) throw new Error('quests');
      next.quests.relics = [...new Set<string>(incoming.quests.relics)];
      next.quests.templeOpen = next.quests.relics.length === 3;
      next.quests.lighthouseRepaired = !!incoming.quests.lighthouseRepaired;
      next.quests.bossDefeated = next.quests.templeOpen && !!incoming.quests.bossDefeated;
      next.quests.completed = next.quests.bossDefeated && next.quests.lighthouseRepaired;
      if (!incoming.equipment || !incoming.upgrades) throw new Error('equipment');
      next.equipment = { axe: true, pickaxe: true, sword: !!incoming.equipment.sword || next.quests.lighthouseRepaired,
        emberSword: next.quests.lighthouseRepaired };
      next.upgrades = { axe: !!incoming.upgrades.axe, pickaxe: !!incoming.upgrades.pickaxe };
      next.craftedCampfires = finite(incoming.craftedCampfires) ? Math.floor(clamp(incoming.craftedCampfires, 0, 160)) : 0;
      next.tool = HOTBAR.includes(incoming.tool) && (incoming.tool !== 'sword' || next.equipment.sword) ? incoming.tool : 'axe';
      if (!Array.isArray(incoming.resources) || incoming.resources.length !== next.resources.length) throw new Error('resources');
      const savedResources = new Map<string, any>(incoming.resources.map((r: any) => [r?.id, r]));
      for (const resource of next.resources) {
        const saved = savedResources.get(resource.id);
        if (!saved || !finite(saved.hp)) throw new Error('resource');
        resource.hp = clamp(saved.hp, 0, resource.maxHp); resource.depleted = saved.depleted === true || resource.hp <= 0;
        if (resource.depleted) resource.hp = 0;
      }
      if (!Array.isArray(incoming.builds) || incoming.builds.length > 160) throw new Error('builds');
      const buildIds = new Set<string>();
      next.builds = incoming.builds.map((b: any) => {
        if (!b || !Object.hasOwn(BUILD_COSTS, b.kind) || ![b.x, b.z, b.rotation, b.hp].every(finite) || Math.hypot(b.x, b.z) > 59 ||
          typeof b.id !== 'string' || !/^build-\d+$/.test(b.id) || buildIds.has(b.id)) throw new Error('build');
        buildIds.add(b.id);
        return { id: b.id, kind: b.kind as BuildKind, x: b.x, y: terrainHeight(b.x, b.z), z: b.z, rotation: b.rotation, hp: clamp(b.hp, 1, 100), open: b.kind === 'door' && !!b.open };
      });
      if (!Array.isArray(incoming.enemies) || incoming.enemies.length > 36) throw new Error('enemies');
      const enemyIds = new Set<string>();
      next.enemies = incoming.enemies.map((e: any) => {
        if (!e || !['wolf', 'shade', 'dragon'].includes(e.type) || ![e.x, e.z, e.hp].every(finite) || Math.hypot(e.x, e.z) > 70 ||
          typeof e.id !== 'string' || !/^(enemy-\d+|dragon-boss)$/.test(e.id) || enemyIds.has(e.id) ||
          (e.type === 'dragon' && (!next.quests.templeOpen || e.id !== 'dragon-boss'))) throw new Error('enemy');
        enemyIds.add(e.id);
        const result = createEnemy(e.id, e.type, e.x, e.z);
        result.hp = clamp(e.hp, 0, result.maxHp); result.alive = result.hp > 0 && e.alive !== false;
        if (!result.alive) result.hp = 0;
        if (e.type === 'dragon' && next.quests.bossDefeated) { result.hp = 0; result.alive = false; }
        return result;
      });
      if (next.quests.templeOpen && !next.quests.bossDefeated && !next.enemies.some(e => e.type === 'dragon' && e.alive)) next.enemies.push(createEnemy('dragon-boss', 'dragon', 0, -48));
      for (const key of Object.keys(next.stats) as (keyof GameState['stats'])[]) next.stats[key] = finite(incoming.stats?.[key]) ? Math.floor(clamp(incoming.stats[key], 0, 100000)) : 0;
      this.state = next; this.random = randomGenerator(next.seed ^ Math.floor(next.time) ^ 0x8917);
      this.buildSerial = Math.max(0, ...next.builds.map(b => Number(b.id.slice(6)) + 1));
      this.enemySerial = Math.max(5, ...next.enemies.filter(e => e.id.startsWith('enemy-')).map(e => Number(e.id.slice(6)) + 1));
      this.events = []; this.spawnTimer = 20; this.jumpHeld = false;
      return this.result(true, 'Kayıt yüklendi.');
    } catch {
      return this.result(false, 'Kayıt bozuk veya bu sürümle uyumsuz. Yeni oyun güvenle başlatılabilir.');
    }
  }
}
