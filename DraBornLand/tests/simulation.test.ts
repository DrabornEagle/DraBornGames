import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, terrainHeight, DAY_LENGTH, RELICS, BUILD_COSTS, type Game, type Resource, type Input } from '../game/simulation.ts';

const idle: Input = { moveX: 0, moveZ: 0, sprint: false, jump: false };
function advance(game: Game, seconds: number, input: Input = idle) {
  for (let elapsed = 0; elapsed < seconds; elapsed += .1) game.tick(Math.min(.1, seconds - elapsed), input);
}
function moveTo(game: Game, x: number, z: number) {
  Object.assign(game.state.player, { x, z, y: terrainHeight(x, z), grounded: true, verticalVelocity: 0 });
}
function collect(game: Game, resource: Resource) {
  moveTo(game, resource.x + 1.15, resource.z);
  if (resource.type === 'tree') assert.equal(game.setTool('axe').ok, true);
  if (resource.type === 'rock' || resource.type === 'crystal') assert.equal(game.setTool('pickaxe').ok, true);
  for (let i = 0; !resource.depleted && i < 8; i++) {
    advance(game, .5);
    const action = game.interact();
    assert.equal(action.ok, true, `${resource.id}: ${action.message}`);
  }
  assert.equal(resource.depleted, true, `${resource.id} was harvested`);
}
function gather(game: Game, kind: 'tree' | 'rock' | 'crystal', wanted: number) {
  const inventoryKind = kind === 'tree' ? 'wood' : kind === 'rock' ? 'stone' : 'crystal';
  const resources = game.state.resources.filter(r => r.type === kind && !r.depleted)
    .sort((a, b) => Math.hypot(a.x, a.z - 34) - Math.hypot(b.x, b.z - 34));
  for (const resource of resources) {
    if (game.state.inventory[inventoryKind] >= wanted) return;
    collect(game, resource);
  }
  assert.ok(game.state.inventory[inventoryKind] >= wanted, 'island has enough resources');
}

test('seeded island has every material, safe landing and consistent landmark terrain', () => {
  const a = createGame(712), b = createGame(712), c = createGame(713);
  assert.deepEqual(a.state.resources, b.state.resources);
  assert.notDeepEqual(a.state.resources, c.state.resources);
  for (const type of ['tree', 'rock', 'berry', 'crystal', 'wood', 'stone', 'fiber']) assert.ok(a.state.resources.some(r => r.type === type));
  assert.equal(terrainHeight(0, 34), 1.6);
  assert.equal(terrainHeight(0, 0), 2.2);
  assert.equal(terrainHeight(0, -42), 3);
  assert.ok(terrainHeight(71, 0) < 0);
  assert.equal(a.state.enemies.some(e => Math.hypot(e.x, e.z - 34) < 10), false);
});

test('movement, sprint, jump, boundaries and hunger are simulated without browser dependencies', () => {
  const game = createGame();
  advance(game, 1, { ...idle, moveX: 1 });
  const walking = game.state.player.x;
  assert.ok(walking > 4 && walking < 4.5);
  moveTo(game, 0, 34);
  advance(game, 1, { ...idle, moveX: 1, sprint: true });
  assert.ok(game.state.player.x > walking + 2);
  assert.ok(game.state.player.stamina < 90);
  assert.ok(game.state.player.hunger < 100);
  const ground = game.state.player.y;
  game.tick(.1, { ...idle, jump: true });
  assert.equal(game.state.player.grounded, false);
  assert.ok(game.state.player.y > ground);
  advance(game, 1);
  assert.equal(game.state.player.grounded, true);
  moveTo(game, 65.5, 0);
  advance(game, 2, { ...idle, moveX: 1 });
  assert.ok(game.state.player.x <= 66);
  const snapshot = game.save();
  game.tick(Number.NaN, idle);
  assert.equal(game.save(), snapshot);
});

test('harvest requires the right tool, spends stamina, depletes once and upgrades improve damage', () => {
  const game = createGame();
  const tree = game.state.resources.find(r => r.type === 'tree')!;
  moveTo(game, tree.x + 1.15, tree.z);
  game.setTool('pickaxe');
  assert.equal(game.interact().ok, false);
  assert.equal(tree.hp, tree.maxHp);
  game.setTool('axe');
  assert.equal(game.interact().ok, true);
  assert.equal(tree.hp, 37);
  assert.equal(game.interact().ok, false, 'cooldown prevents double hits');
  collect(game, tree);
  assert.equal(game.state.inventory.wood, 5);
  assert.equal(game.state.inventory.fiber, 2);
  const rock = game.state.resources.find(r => r.type === 'rock')!;
  collect(game, rock);
  assert.equal(game.state.inventory.stone, 4);
  assert.equal(game.craft('axe').ok, true);
  assert.equal(game.state.inventory.wood, 1);
  assert.equal(game.state.inventory.stone, 1);
  assert.equal(game.craft('axe').ok, false);
  const otherTree = game.state.resources.find(r => r.type === 'tree' && !r.depleted)!;
  moveTo(game, otherTree.x + 1.15, otherTree.z); game.setTool('axe'); advance(game, .5);
  assert.equal(game.interact().ok, true);
  assert.equal(otherTree.hp, 20);
  assert.ok(game.drainEvents().some(e => e.type === 'harvest' && e.resource === 'wood'));
});

test('build costs, rejection atomicity, all five pieces, doors and shelter healing', () => {
  const game = createGame();
  Object.assign(game.state.inventory, { wood: 100, stone: 100, fiber: 100 });
  moveTo(game, -2, 36);
  const before = { ...game.state.inventory };
  assert.equal(game.build('floor', 0, 0).ok, false);
  assert.deepEqual(game.state.inventory, before);
  assert.equal(game.build('roof', -2, 36).ok, false, 'roof needs a floor');
  assert.equal(game.build('floor', -2, 36).ok, true);
  assert.equal(game.state.inventory.wood, before.wood - BUILD_COSTS.floor.wood!);
  assert.equal(game.build('floor', -2, 36).ok, false, 'duplicate floor rejected');
  assert.equal(game.build('roof', -2, 36).ok, true);
  assert.equal(game.build('wall', -2, 37.5, 0).ok, true);
  assert.equal(game.build('door', -.5, 36, Math.PI / 2).ok, true);
  const door = game.state.builds.find(b => b.kind === 'door')!;
  moveTo(game, -1.8, 36);
  assert.equal(game.nearestTarget()?.type, 'door');
  assert.equal(game.interact().ok, true);
  assert.equal(door.open, true);
  const x = game.state.player.x;
  advance(game, .5, { ...idle, moveX: 1 });
  assert.ok(game.state.player.x > x + .5, 'open doorway permits movement');
  moveTo(game, -1.8, 36);
  assert.equal(game.interact().ok, true);
  assert.equal(door.open, false);
  advance(game, .5, { ...idle, moveX: 1 });
  assert.ok(game.state.player.x < -.8, 'closed doorway blocks movement');
  moveTo(game, -2, 36);
  game.state.player.health = 50;
  advance(game, 2);
  assert.ok(game.state.player.health > 53, 'roof and two sides provide shelter healing');
  assert.equal(game.craft('campfire').ok, true);
  const woodAfterCraft = game.state.inventory.wood;
  assert.equal(game.state.craftedCampfires, 1);
  assert.equal(game.build('campfire', -4.5, 36).ok, true);
  assert.equal(game.state.craftedCampfires, 0);
  assert.equal(game.state.inventory.wood, woodAfterCraft, 'crafted kit is used instead of charging twice');
  assert.equal(new Set(game.state.builds.map(b => b.kind)).size, 5);
});

test('night announces danger, creates more enemies and telegraphed attacks can be dodged', () => {
  const game = createGame();
  game.state.time = DAY_LENGTH * .67 - .1;
  game.tick(.2, idle);
  assert.equal(game.state.isNight, true);
  assert.ok(game.drainEvents().some(e => e.type === 'night'));
  advance(game, 2);
  assert.ok(game.state.enemies.length > 5);
  const wolf = game.state.enemies.find(e => e.type === 'wolf')!;
  moveTo(game, wolf.x + 1.5, wolf.z);
  wolf.attackTimer = 0;
  game.tick(.1, idle);
  assert.equal(wolf.phase, 'windup');
  const health = game.state.player.health;
  moveTo(game, wolf.x + 6, wolf.z);
  advance(game, .8);
  assert.equal(game.state.player.health, health, 'leaving range before the attack lands avoids damage');
});

test('decorative colliders block characters, reject invalid geometry and survive save loading', () => {
  const game = createGame();
  const colliders = [{ x: 2, z: 34, radius: .75 }, { x: Number.NaN, z: 34, radius: 2 }, { x: 0, z: 34, radius: 999 }];
  game.setEnvironmentColliders(colliders);
  colliders[0].x = 50; // Callers cannot move the registered physical geometry accidentally.
  advance(game, 1, { ...idle, moveX: 1 });
  assert.ok(game.state.player.x > .5 && game.state.player.x < 1.2);
  assert.equal(game.load(game.save()).ok, true);
  advance(game, 1, { ...idle, moveX: 1 });
  assert.ok(game.state.player.x < 1.2, 'loading a save keeps the same scene colliders');
  const wolf = game.state.enemies[0];
  Object.assign(wolf, { x: 4, z: 34, homeX: 4, homeZ: 34 });
  moveTo(game, 0, 34);
  advance(game, 2);
  assert.ok(wolf.x >= 3.1, 'enemy movement also respects decorative geometry');
});

test('solid walls stop attacks in both directions and open doors restore combat visibility', () => {
  const game = createGame();
  Object.assign(game.state.inventory, { wood: 20, stone: 20 });
  moveTo(game, -2, 36);
  assert.equal(game.build('door', -2, 37.5).ok, true);
  const wolf = game.state.enemies[0];
  game.state.enemies = [wolf];
  Object.assign(wolf, { x: -2, z: 38.1, homeX: -2, homeZ: 38.1, attackTimer: 0 });
  moveTo(game, -2, 36.9);
  const health = game.state.player.health, enemyHp = wolf.hp;
  advance(game, 2);
  assert.equal(game.state.player.health, health, 'a nearby enemy cannot bite through a door');
  game.attack();
  assert.equal(wolf.hp, enemyHp, 'the player cannot attack through the same door');
  assert.equal(game.interact().ok, true);
  assert.equal(game.state.builds[0].open, true);
  advance(game, .5);
  assert.equal(game.attack().ok, true);
  assert.ok(wolf.hp < enemyHp);
});

test('an open doorway permits centre passage while its side panels still block movement and attacks', () => {
  const game = createGame();
  Object.assign(game.state.inventory, { wood: 20, stone: 20 });
  moveTo(game, -2, 36);
  assert.equal(game.build('door', -2, 37.5).ok, true);
  game.state.builds[0].open = true;
  const wolf = game.state.enemies[0];
  game.state.enemies = [wolf];
  Object.assign(wolf, { x: -.9, z: 38.1, homeX: -.9, homeZ: 38.1, attackTimer: 0 });
  moveTo(game, -.9, 36.9);
  const health = game.state.player.health, hp = wolf.hp;
  advance(game, .5, { ...idle, moveZ: 1 });
  assert.ok(game.state.player.z < 37, 'the side panel blocks a walking character');
  assert.equal(game.state.player.health, health, 'the enemy cannot attack through the open door side panel');
  game.attack();
  assert.equal(wolf.hp, hp, 'the player cannot attack through the open door side panel');
  game.state.enemies = [];
  moveTo(game, -2, 36.2);
  advance(game, .6, { ...idle, moveZ: 1 });
  assert.ok(game.state.player.z > 38, 'the 1.34m centre opening remains traversable');
});

for (const seed of [73, 42891]) test(`full progression uses gathered materials, relics, lighthouse and boss combat (seed ${seed})`, () => {
  const game = createGame(seed);
  gather(game, 'tree', 10);
  gather(game, 'rock', 12);
  assert.equal(game.craft('axe').ok, true);
  assert.equal(game.craft('pickaxe').ok, true);
  gather(game, 'tree', 24);
  gather(game, 'rock', 18);
  moveTo(game, 0, 4);
  assert.equal(game.repair().ok, true);
  assert.equal(game.state.equipment.emberSword, true);
  assert.equal(game.state.quests.completed, false, 'the lighthouse alone does not complete the game');
  for (const relic of RELICS) {
    moveTo(game, relic.x, relic.z + .4);
    assert.equal(game.nearestTarget()?.type, 'relic');
    assert.equal(game.interact().ok, true);
  }
  assert.equal(game.state.quests.templeOpen, true);
  assert.equal(game.state.quests.relics.length, 3);
  const dragon = game.state.enemies.find(e => e.type === 'dragon')!;
  assert.ok(dragon.alive);
  game.setTool('sword');
  for (let i = 0; dragon.alive && i < 20; i++) {
    moveTo(game, dragon.x + 2.5, dragon.z);
    advance(game, .5);
    assert.equal(game.attack().ok, true);
    if (game.state.player.health < 45 && game.state.inventory.berries > 0) game.eat();
  }
  assert.equal(game.state.player.dead, false);
  assert.equal(dragon.alive, false);
  assert.equal(game.state.quests.bossDefeated, true);
  assert.equal(game.state.quests.completed, true);
  assert.ok(game.drainEvents().some(e => e.type === 'win'));
  const restored = createGame(7);
  assert.equal(restored.load(game.save()).ok, true);
  assert.deepEqual(restored.state.quests, game.state.quests);
  assert.equal(restored.state.equipment.emberSword, true);
  assert.equal(restored.state.enemies.find(e => e.type === 'dragon')?.alive, false);
});

test('saving restores depletion, inventory, structures, door state and rejects corrupt input atomically', () => {
  const game = createGame(711);
  const resource = game.state.resources.find(r => r.type === 'wood')!;
  collect(game, resource);
  Object.assign(game.state.inventory, { wood: 40, stone: 20, fiber: 10 });
  moveTo(game, -2, 36);
  assert.equal(game.build('floor', -2, 36).ok, true);
  assert.equal(game.build('door', -.5, 36, Math.PI / 2).ok, true);
  game.state.builds.find(b => b.kind === 'door')!.open = true;
  const restored = createGame();
  assert.equal(restored.load(game.save()).ok, true);
  assert.equal(restored.state.seed, 711);
  assert.equal(restored.state.resources.find(r => r.id === resource.id)?.depleted, true);
  assert.deepEqual(restored.state.inventory, game.state.inventory);
  assert.equal(restored.state.builds.find(b => b.kind === 'door')?.open, true);
  const baseline = restored.save();
  for (const invalid of ['', '{', '{}', '{"version":999,"state":{}}']) {
    assert.equal(restored.load(invalid).ok, false);
    assert.equal(restored.save(), baseline);
  }
  const malicious = JSON.parse(game.save());
  malicious.state.inventory.wood = -900;
  assert.equal(restored.load(JSON.stringify(malicious)).ok, false);
  assert.equal(restored.save(), baseline);
  malicious.state.inventory.wood = 20;
  malicious.state.player.x = 1000;
  assert.equal(restored.load(JSON.stringify(malicious)).ok, false);
  assert.equal(restored.save(), baseline);
  malicious.state.player.x = -2;
  malicious.state.quests.relics = ['unknown'];
  assert.equal(restored.load(JSON.stringify(malicious)).ok, false);
  assert.equal(restored.save(), baseline);
});

test('death and respawn preserve quest progress/equipment while applying resource penalty', () => {
  const game = createGame();
  Object.assign(game.state.inventory, { wood: 25, stone: 10, crystal: 5, fiber: 5 });
  game.state.equipment.sword = true;
  game.state.quests.relics.push('forest');
  game.state.player.health = .1; game.state.player.hunger = 0;
  advance(game, .2);
  assert.equal(game.state.player.dead, true);
  assert.equal(game.state.stats.deaths, 1);
  assert.equal(game.attack().ok, false);
  assert.equal(game.respawn().ok, true);
  assert.equal(game.state.player.dead, false);
  assert.equal(game.state.player.health, 100);
  assert.equal(game.state.player.z, 34);
  assert.equal(game.state.inventory.wood, 20);
  assert.equal(game.state.equipment.sword, true);
  assert.deepEqual(game.state.quests.relics, ['forest']);
  assert.equal(game.respawn().ok, false);
});
