/** Focused construction and WebAudio verification with genuinely harvested stock. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Game, terrainHeight } from '../game/simulation.ts';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = createRequire('/tmp/drabornland-qa/package.json')('playwright')); }
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..'), evidence = resolve(project, 'evidence');
await mkdir(evidence, { recursive: true });
const game = new Game(73), idle = { moveX: 0, moveZ: 0, sprint: false, jump: false };
const tick = seconds => { for (let i = 0; i < Math.ceil(seconds / .05); i++) game.tick(.05, idle); };
for (const [type, kind, minimum] of [['tree', 'wood', 35], ['rock', 'stone', 12]]) {
  const nodes = game.state.resources.filter(r => r.type === type).sort((a, b) => Math.hypot(a.x, a.z - 34) - Math.hypot(b.x, b.z - 34));
  for (const node of nodes) {
    if (game.state.inventory[kind] >= minimum) break;
    game.setTool(type === 'tree' ? 'axe' : 'pickaxe');
    for (const angle of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
      game.state.player.x = node.x + Math.cos(angle) * 1.1; game.state.player.z = node.z + Math.sin(angle) * 1.1;
      game.state.player.y = terrainHeight(game.state.player.x, game.state.player.z);
      if (game.nearestTarget()?.id === node.id) break;
    }
    for (let attempt = 0; !node.depleted && attempt < 8; attempt++) { tick(.55); game.interact(); }
    assert.equal(node.depleted, true); assert.equal(game.state.player.dead, false);
    if (game.state.player.health < 75 && game.state.inventory.berries) game.eat();
  }
  assert.ok(game.state.inventory[kind] >= minimum);
}
game.state.player.x = 0; game.state.player.z = 38; game.state.player.y = terrainHeight(0, 38);
game.tick(.1, { ...idle, moveZ: 1 }); // Set camera-facing orientation through normal movement.
const earnedSave = game.save();
await writeFile(resolve(evidence, 'shelter-earned-save.json'), earnedSave);
const report = { started: new Date().toISOString(), checks: [], errors: [], notes: ['Stock comes from actual Game.interact harvests; no inventory, player health or enemy HP grants. Audio oscillator execution is verified; human listening and physical speaker output are not available.'] };
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem('drabornland-quality', 'low');
    window.__AUDIO_AUDIT__ = { contexts: [], oscillatorStarts: 0 };
    const Original = window.AudioContext;
    window.AudioContext = class extends Original {
      constructor(...args) { super(...args); window.__AUDIO_AUDIT__.contexts.push(this); }
      createOscillator() { const oscillator = super.createOscillator(), start = oscillator.start; oscillator.start = (...args) => { window.__AUDIO_AUDIT__.oscillatorStarts++; return start.apply(oscillator, args); }; return oscillator; }
    };
  });
  const page = await context.newPage(); page.on('pageerror', e => report.errors.push(e.message));
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:4173/DraBornGames/DraBornLand/?qa=1', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.__DRABORN_TEST__, null, { timeout: 60000 });
  await page.locator('[data-action="start"][data-value="new"]').click();
  await page.keyboard.press('KeyF');
  await page.waitForFunction(() => window.__AUDIO_AUDIT__.oscillatorStarts > 0, null, { timeout: 15000 });
  assert.equal(await page.evaluate(() => window.__AUDIO_AUDIT__.contexts[0].state), 'running');
  report.checks.push('Actual attack event creates sound oscillators in a running WebAudio context');
  await page.evaluate(save => window.__DRABORN_TEST__.action('import', save), earnedSave);
  const built = await page.evaluate(() => {
    const h = window.__DRABORN_TEST__; h.teleport(0, 36); h.look(0);
    const pieces = [['floor', 0, 31, 0], ['wall', -1.5, 31, Math.PI / 2], ['wall', 1.5, 31, Math.PI / 2], ['wall', 0, 29.5, 0], ['door', 0, 32.5, 0], ['roof', 0, 31, 0], ['campfire', 4.5, 34, 0]];
    return pieces.map(([kind, x, z, rotation]) => ({ kind, result: h.game.build(kind, x, z, rotation) }));
  });
  for (const piece of built) assert.equal(piece.result.ok, true, `${piece.kind}: ${piece.result.message}`);
  await page.evaluate(() => { const h = window.__DRABORN_TEST__; h.teleport(0, 34.2); h.action('tool', 'axe'); });
  await page.keyboard.press('KeyE');
  assert.equal(await page.evaluate(() => window.__DRABORN_TEST__.game.state.builds.find(p => p.kind === 'door').open), true);
  await page.waitForFunction(() => Math.abs(window.__DRABORN_TEST__.scene.getObjectByName('doorPanel')?.rotation.y || 0) > 1, null, { timeout: 30000 });
  report.checks.push('One floor, three edge walls, door, roof and campfire form a coherent modular shelter; door mesh hinge visibly opens');
  await page.evaluate(() => { const h = window.__DRABORN_TEST__; h.teleport(0, 38); h.look(0); h.action('quality', 'medium'); });
  await page.waitForFunction(() => window.__DRABORN_TEST__.getCamera().z > 43, null, { timeout: 30000 });
  await page.screenshot({ path: resolve(evidence, '16-enclosed-shelter.png') });
  const medium = await page.evaluate(() => window.__DRABORN_TEST__.metrics());
  await page.evaluate(() => window.__DRABORN_TEST__.action('quality', 'low'));
  await page.evaluate(() => window.__DRABORN_TEST__.night());
  await page.screenshot({ path: resolve(evidence, '17-shelter-night.png') });
  report.metrics = { medium, low: await page.evaluate(() => window.__DRABORN_TEST__.metrics()) };
  report.remainingInventory = await page.evaluate(() => window.__DRABORN_TEST__.game.state.inventory);
  assert.deepEqual(report.errors, []); report.passed = true; console.log(`PASS ${report.checks.length} focused scene contracts`);
} catch (error) { report.passed = false; report.failure = error.stack; console.error(error); process.exitCode = 1; }
finally { report.finished = new Date().toISOString(); await writeFile(resolve(evidence, 'focused-scene-report.json'), JSON.stringify(report, null, 2)); await browser.close(); }
