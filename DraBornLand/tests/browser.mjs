/** Browser QA. Build first, run preview, then: node tests/browser.mjs.
 * Optional tooling: npm install --prefix /tmp/drabornland-qa playwright
 * QA relocates the player for long journeys; inventory, quest rewards and combat
 * are earned through game actions. No resource or enemy-health grants are used.
 */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const evidence = resolve(project, process.env.QA_EVIDENCE || 'evidence');
const url = process.env.QA_URL || 'http://127.0.0.1:4173/DraBornGames/DraBornLand/?qa=1';
const mobileOnly = process.env.QA_MOBILE_ONLY === '1';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch {
  try { ({ chromium } = createRequire('/tmp/drabornland-qa/package.json')('playwright')); }
  catch { throw new Error('Browser QA needs Playwright. Install: npm install --prefix /tmp/drabornland-qa playwright'); }
}
await mkdir(evidence, { recursive: true });
const results = { started: new Date().toISOString(), url, environment: 'Headless Chromium / software WebGL; Android hardware not available', checks: [], errors: [], metrics: {}, notes: ['Long travel is accelerated with the qa=1 relocation hook. Actual input and normal survival rules are exercised.', 'Attack cooldowns and extended survival time are advanced through regular .05-second simulation ticks to keep software-renderer testing practical. No inventory grants or enemy/player damage overrides are used.'] };
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
let beforeNightSave;
page.on('pageerror', error => results.errors.push({ kind: 'pageerror', message: error.message }));
page.on('console', message => { if (message.type() === 'error') results.errors.push({ kind: 'console', message: message.text() }); });
page.on('response', response => { if (response.status() >= 400) results.errors.push({ kind: 'http', status: response.status(), url: response.url() }); });
const state = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__DRABORN_TEST__.game.state)));
const hook = (fn, arg) => page.evaluate(fn, arg);
const snap = name => page.screenshot({ path: resolve(evidence, `${name}.png`), fullPage: true });
const tick = seconds => hook(seconds => { const h = window.__DRABORN_TEST__; for (let i = 0; i < Math.ceil(seconds / .05); i++) h.game.tick(.05, { moveX: 0, moveZ: 0, sprint: false, jump: false }); }, seconds);
async function check(name, fn) {
  const started = Date.now();
  try { const detail = await fn(); results.checks.push({ name, passed: true, ms: Date.now() - started, detail }); console.log(`PASS ${name}`); return detail; }
  catch (error) { results.checks.push({ name, passed: false, ms: Date.now() - started, error: error.message }); console.error(`FAIL ${name}: ${error.message}`); throw error; }
}
async function press(code, seconds = .7) { await page.keyboard.press(code); await tick(seconds); }
async function moveTo(x, z) { await hook(({ x, z }) => window.__DRABORN_TEST__.teleport(x, z), { x, z }); await page.waitForTimeout(60); }
async function gather(type, minimum) {
  const resource = { tree: 'wood', rock: 'stone', berry: 'berries', crystal: 'crystal', fiber: 'fiber', wood: 'wood', stone: 'stone' }[type];
  for (let attempt = 0; (await state()).inventory[resource] < minimum && attempt < 180; attempt++) {
    const s = await state();
    const node = s.resources.filter(node => node.type === type && !node.depleted).sort((a, b) => Math.hypot(a.x, a.z - 34) - Math.hypot(b.x, b.z - 34))[0];
    assert.ok(node, `No ${type} nodes remain`);
    // Pick a clear approach so a neighbouring plant does not steal the E prompt.
    for (const angle of [0, Math.PI / 2, Math.PI, -Math.PI / 2, .8, - .8]) {
      await moveTo(node.x + Math.cos(angle) * 1.1, node.z + Math.sin(angle) * 1.1);
      if (await hook(id => window.__DRABORN_TEST__.game.nearestTarget()?.id === id, node.id)) break;
    }
    if (['tree', 'rock', 'crystal'].includes(type)) { await page.keyboard.press(type === 'tree' ? 'Digit1' : 'Digit2'); await press('KeyF'); }
    else await press('KeyE', .1);
    if ((await state()).player.hunger < 70 && (await state()).inventory.berries) await press('KeyR', .1);
    assert.equal((await state()).player.dead, false, `Died gathering ${type}`);
  }
  assert.ok((await state()).inventory[resource] >= minimum, `Gathered insufficient ${resource}`);
}

try {
  if (!mobileOnly) {
  await check('Boot / WebGL / no broken HTTP references', async () => {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__DRABORN_TEST__ && document.querySelector('#world'), null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('#world').count(), 1);
    await snap('01-desktop-menu');
    return hook(() => window.__DRABORN_TEST__.metrics());
  });
  await check('Menu starts a fresh playable scene', async () => {
    const start = page.locator('[data-action="start"][data-value="new"]');
    assert.ok(await start.isVisible(), 'Start button not visible');
    await start.click(); await page.waitForTimeout(500);
    assert.equal((await state()).player.dead, false);
    await snap('02-desktop-play');
  });
  await check('Keyboard walk, sprint, jump and smooth camera', async () => {
    // Headless software WebGL can render far slower than a hardware device.
    // Hold input until simulation time advances rather than assuming wall-clock FPS.
    await hook(() => window.__DRABORN_TEST__.action('quality', 'low'));
    await moveTo(0, 34); await hook(() => window.__DRABORN_TEST__.look(0));
    const before = await state();
    await page.keyboard.down('KeyW'); await page.waitForFunction(time => window.__DRABORN_TEST__.game.state.time > time + .4, before.time, { timeout: 45000 }); await page.keyboard.up('KeyW');
    const walked = await state();
    const walk = Math.hypot(walked.player.x - before.player.x, walked.player.z - before.player.z);
    assert.ok(walk > .3, `Walk did not move: ${walk}`);
    await page.keyboard.down('ShiftLeft'); await page.keyboard.down('KeyW'); await page.waitForFunction(time => window.__DRABORN_TEST__.game.state.time > time + .4, walked.time, { timeout: 45000 }); await page.keyboard.up('KeyW'); await page.keyboard.up('ShiftLeft');
    const ran = await state();
    const run = Math.hypot(ran.player.x - walked.player.x, ran.player.z - walked.player.z);
    assert.ok(run > walk * 1.15, `Sprint ${run} did not exceed walk ${walk}`);
    await page.keyboard.press('Space'); await page.waitForFunction(() => !window.__DRABORN_TEST__.game.state.player.grounded, null, { timeout: 15000 });
    assert.ok(!(await state()).player.grounded || (await state()).player.verticalVelocity > 0, 'Jump did not leave ground');
    await tick(1.2);
    const cameraBefore = await hook(() => window.__DRABORN_TEST__.getCamera());
    await page.mouse.move(800, 420); await page.mouse.down(); await page.mouse.move(970, 460, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(200);
    const cameraAfter = await hook(() => window.__DRABORN_TEST__.getCamera());
    assert.ok(Math.abs(cameraAfter.yaw - cameraBefore.yaw) > .3, 'Drag did not rotate chase camera');
    return { walkMetres: walk, sprintMetres: run, cameraYawChange: cameraAfter.yaw - cameraBefore.yaw };
  });
  await check('Real resource gathering, upgraded tools and food', async () => {
    await gather('berry', 8); await gather('wood', 4); await gather('stone', 4);
    const pre = await state(); await page.keyboard.press('KeyC'); await page.locator('[data-action="craft"][data-value="axe"]').click(); await page.keyboard.press('Escape');
    assert.equal((await state()).upgrades.axe, true); assert.ok((await state()).inventory.wood < pre.inventory.wood);
    await gather('tree', 12); await gather('rock', 10);
    await page.keyboard.press('KeyC'); await page.locator('[data-action="craft"][data-value="pickaxe"]').click(); await page.keyboard.press('Escape'); assert.equal((await state()).upgrades.pickaxe, true);
    const hungerBefore = (await state()).player.hunger; await press('KeyR', .1); assert.ok((await state()).player.hunger >= hungerBefore);
    return { inventory: (await state()).inventory, upgrades: (await state()).upgrades };
  });
  await check('Inventory, crafting and build panels remain dismissible', async () => {
    await page.keyboard.press('Tab'); await page.waitForTimeout(100); await snap('03-inventory');
    assert.ok(await page.locator('.game-panel').isVisible(), 'Inventory panel missing');
    await page.keyboard.press('Escape');
    await page.keyboard.press('KeyC'); await page.waitForTimeout(100); await snap('04-crafting');
    await page.keyboard.press('Escape');
    await page.keyboard.press('KeyB'); await page.waitForTimeout(100); await snap('05-building');
    await page.keyboard.press('Escape');
    assert.equal(await hook(() => window.__DRABORN_TEST__.ui.blocked), false);
  });
  await check('Shelter floor, wall, door, roof and campfire', async () => {
    await gather('tree', 38); await gather('rock', 24); await gather('fiber', 6);
    await moveTo(0, 34); await hook(() => window.__DRABORN_TEST__.look(0));
    const place = async (kind, x, z, yaw = 0) => { await moveTo(x, z); await hook(a => window.__DRABORN_TEST__.look(a), yaw); await page.keyboard.press('KeyB'); await page.locator(`[data-action="buildKind"][data-value="${kind}"]`).click(); await press('KeyE', .1); };
    await place('floor', 0, 34);
    await place('wall', -3, 34); await place('door', 3, 34); await place('roof', 0, 34); await place('campfire', 6, 34);
    const s = await state(); for (const kind of ['floor', 'wall', 'door', 'roof', 'campfire']) assert.ok(s.builds.some(piece => piece.kind === kind), `${kind} was not placed`);
    const door = s.builds.find(piece => piece.kind === 'door'); await page.keyboard.press('Digit1'); await moveTo(door.x, door.z + 1); await press('KeyE', .1); assert.equal((await state()).builds.find(piece => piece.id === door.id).open, true);
    await moveTo(0, 38); await snap('06-built-shelter');
    return { pieces: s.builds.map(piece => ({ kind: piece.kind, x: piece.x, z: piece.z })) };
  });
  await check('Local save survives browser reload', async () => {
    await hook(() => window.__DRABORN_TEST__.save()); const before = await state();
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForFunction(() => window.__DRABORN_TEST__);
    const after = await state(); assert.deepEqual(after.inventory, before.inventory); assert.equal(after.builds.length, before.builds.length); assert.equal(after.stats.gathered, before.stats.gathered);
    await page.locator('[data-action="start"][data-value="continue"]').click();
    return { persistedGathered: after.stats.gathered, persistedBuildings: after.builds.length };
  });
  await check('Night changes lighting and spawns additional threats', async () => {
    await moveTo(0, 34); beforeNightSave = await hook(() => window.__DRABORN_TEST__.game.save()); const before = await state(); await hook(() => window.__DRABORN_TEST__.night()); await tick(24); await page.waitForTimeout(250);
    const after = await state(); assert.equal(after.isNight, true); assert.ok(after.enemies.filter(e => e.alive).length > before.enemies.filter(e => e.alive).length);
    await snap('07-night'); return { daytimeEnemies: before.enemies.filter(e => e.alive).length, nightEnemies: after.enemies.filter(e => e.alive).length };
  });
  await check('Enemy damage, death overlay, respawn and resource penalty', async () => {
    const threat = (await state()).enemies.find(enemy => enemy.alive && enemy.type !== 'dragon'); assert.ok(threat);
    await moveTo(threat.x, threat.z); const before = await state(); await tick(60); await page.waitForTimeout(150);
    assert.equal((await state()).player.dead, true); assert.equal((await state()).stats.deaths, before.stats.deaths + 1); await snap('07b-death');
    await page.locator('[data-action="respawn"]').click();
    const after = await state(); assert.equal(after.player.dead, false); assert.equal(after.player.health, 100); assert.ok(Math.hypot(after.player.x, after.player.z - 34) < 1);
    for (const resource of ['wood', 'stone', 'crystal', 'fiber']) assert.equal(after.inventory[resource], Math.floor(before.inventory[resource] * .8));
    assert.equal(after.builds.length, before.builds.length); assert.deepEqual(after.upgrades, before.upgrades);
    // Exercise normal import of the genuine pre-night snapshot for an independent boss run.
    await hook(save => window.__DRABORN_TEST__.action('import', save), beforeNightSave);
    return { deathsObserved: after.stats.deaths, resourceRetention: '80%', restoredOwnSaveForIndependentProgression: true };
  });
  await check('Normal enemy combat with real keyboard attacks', async () => {
    await gather('rock', 30); await gather('tree', 40); await gather('crystal', 3);
    await page.keyboard.press('KeyC'); await page.locator('[data-action="craft"][data-value="sword"]').click(); await page.keyboard.press('Escape'); assert.equal((await state()).equipment.sword, true);
    const enemy = (await state()).enemies.find(enemy => enemy.alive && enemy.type === 'wolf'); assert.ok(enemy);
    await page.keyboard.press('Digit3');
    for (let i = 0; i < 8 && (await state()).enemies.find(e => e.id === enemy.id)?.alive; i++) {
      const e = (await state()).enemies.find(e => e.id === enemy.id); await moveTo(e.x, e.z + 1.7); await press('KeyF');
    }
    assert.equal((await state()).enemies.find(e => e.id === enemy.id)?.alive, false); assert.ok((await state()).stats.killed >= 1);
  });
  await check('Lighthouse repair consumes gathered wood and stone; rewards sword', async () => {
    await gather('tree', 24); await gather('rock', 18); const before = await state(); await moveTo(0, 5); await press('KeyE', .1);
    const after = await state(); assert.equal(after.quests.lighthouseRepaired, true); assert.equal(after.equipment.emberSword, true); assert.equal(before.inventory.wood - after.inventory.wood, 24); assert.equal(before.inventory.stone - after.inventory.stone, 18);
    await moveTo(0, 10); await snap('08-repaired-lighthouse');
  });
  await check('Three regional relics open temple', async () => {
    for (const relic of [{ x: -38, z: -12 }, { x: 37, z: -20 }, { x: 29, z: 35 }]) { await moveTo(relic.x, relic.z + 1); await press('KeyE', .1); }
    const s = await state(); assert.equal(s.quests.relics.length, 3); assert.equal(s.quests.templeOpen, true);
    await moveTo(0, -32); await snap('09-temple-open');
  });
  await check('Temple boss telegraphs, can be fought, and full quest loop completes', async () => {
    await moveTo(0, -40); await press('KeyE', .1); await tick(.3);
    let dragon = (await state()).enemies.find(e => e.type === 'dragon' && e.alive); assert.ok(dragon, 'Temple boss did not spawn');
    await moveTo(dragon.x, dragon.z + 3); await page.keyboard.press('Digit3'); await snap('10-dragon-boss');
    let telegraph = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      const s = await state(); dragon = s.enemies.find(e => e.type === 'dragon' && e.alive); if (!dragon) break;
      assert.equal(s.player.dead, false, 'Player died during normal boss fight');
      if (dragon.phase === 'windup') { telegraph = true; await moveTo(dragon.attackX + 6, dragon.attackZ + 2); await tick(dragon.windup + .15); }
      else { await moveTo(dragon.x, dragon.z + 2); await press('KeyF', .65); }
      if ((await state()).player.health < 65 && (await state()).inventory.berries) await press('KeyR', .1);
    }
    const final = await state(); assert.equal(final.quests.bossDefeated, true); assert.equal(final.quests.completed, true);
    await page.waitForTimeout(250); await snap('11-victory');
    return { telegraphObserved: telegraph, health: final.player.health, kills: final.stats.killed, relics: final.quests.relics.length };
  });
  results.metrics.desktop = await hook(() => window.__DRABORN_TEST__.metrics());
  }
  // Release the desktop WebGL context before mobile QA. Software GPU contexts
  // in constrained headless runners otherwise compete while compiling shaders.
  await page.close();
  await check('Mobile landscape viewport, actual touch action and joystick', async () => {
    const mobileContext = await browser.newContext({ viewport: { width: 915, height: 412 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await mobileContext.addInitScript(() => localStorage.setItem('drabornland-quality', 'low'));
    const mobile = await mobileContext.newPage(); mobile.on('pageerror', e => results.errors.push({ kind: 'mobile', message: e.message }));
    await mobile.goto(url, { waitUntil: 'networkidle' }); await mobile.waitForFunction(() => !!window.__DRABORN_TEST__, null, { timeout: 60000 }); await mobile.screenshot({ path: resolve(evidence, '12-mobile-menu.png') });
    await mobile.locator('[data-action="start"][data-value="new"]').tap(); await mobile.waitForTimeout(300);
    await mobile.screenshot({ path: resolve(evidence, '13-mobile-play.png') });
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'Mobile horizontal overflow');
    await mobile.evaluate(() => window.__DRABORN_TEST__.action('quality', 'low'));
    const client = await mobileContext.newCDPSession(mobile);
    const joystick = await mobile.locator('#joystick').boundingBox(); assert.ok(joystick, 'Joystick not visible');
    const touch = [{ x: joystick.x + joystick.width / 2, y: joystick.y + joystick.height / 2, id: 1 }];
    const before = await mobile.evaluate(() => ({ ...window.__DRABORN_TEST__.game.state.player, time: window.__DRABORN_TEST__.game.state.time }));
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: touch });
    const runButton = await mobile.locator('#touch-run').boundingBox(); assert.ok(runButton);
    touch.push({ x: runButton.x + runButton.width / 2, y: runButton.y + runButton.height / 2, id: 2 });
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: touch });
    assert.equal(await mobile.evaluate(() => window.__DRABORN_TEST__.ui.input.sprint), true, 'Multi-touch run button did not activate');
    touch[0].x += 35; await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: touch });
    await mobile.waitForFunction(time => window.__DRABORN_TEST__.game.state.time > time + .2, before.time, { timeout: 30000 });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const after = await mobile.evaluate(() => ({ ...window.__DRABORN_TEST__.game.state.player }));
    assert.ok(Math.hypot(after.x - before.x, after.z - before.z) > .25, 'Touch joystick did not move player');
    assert.equal(await mobile.evaluate(() => window.__DRABORN_TEST__.ui.input.moveX), 0, 'Joystick did not release');
    assert.equal(await mobile.evaluate(() => window.__DRABORN_TEST__.ui.input.sprint), false, 'Run button did not release');
    await mobile.locator('#touch-jump').tap(); await mobile.waitForFunction(() => !window.__DRABORN_TEST__.game.state.player.grounded, null, { timeout: 15000 });
    await mobile.locator('[data-action="panel"][data-value="inventory"]').tap(); await mobile.screenshot({ path: resolve(evidence, '14-mobile-inventory.png') });
    await mobile.locator('[data-action="close"]').first().tap();
    const yawBefore = await mobile.evaluate(() => window.__DRABORN_TEST__.getCamera().yaw);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 460, y: 180, id: 3 }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 540, y: 200, id: 3 }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert.ok(Math.abs(await mobile.evaluate(() => window.__DRABORN_TEST__.getCamera().yaw) - yawBefore) > .2, 'Touch drag did not rotate camera');
    await mobile.evaluate(() => window.__DRABORN_TEST__.teleport(-2, 30));
    await mobile.locator('[data-action="interact"]').last().tap();
    assert.equal(await mobile.evaluate(() => window.__DRABORN_TEST__.game.state.inventory.wood), 2, 'Touch interaction did not collect wood');
    await mobile.setViewportSize({ width: 412, height: 915 }); await mobile.screenshot({ path: resolve(evidence, '15-mobile-portrait.png') });
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'Portrait horizontal overflow');
    const overlap = await mobile.evaluate(() => {
      const intersects = (first, second) => { const a=document.querySelector(first).getBoundingClientRect(), b=document.querySelector(second).getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; };
      return { jumpVsBuild: intersects('#touch-jump','[data-action="tool"][data-value="build"]'), joystickVsAxe: intersects('#joystick','[data-action="tool"][data-value="axe"]') };
    });
    assert.equal(overlap.jumpVsBuild, false, 'Portrait jump button obstructs build hotbar slot');
    assert.equal(overlap.joystickVsAxe, false, 'Portrait joystick obstructs axe hotbar slot');
    results.metrics.mobile = await mobile.evaluate(() => window.__DRABORN_TEST__.metrics());
    await mobileContext.close();
  });
  await check('QA hooks are absent from the normal shipped URL', async () => {
    const clean = await context.newPage(); await clean.goto(url.replace(/\?qa=1/, ''), { waitUntil: 'networkidle' }); assert.equal(await clean.evaluate(() => '__DRABORN_TEST__' in window), false); await clean.close();
  });
  await check('Runtime remains free of JavaScript, WebGL and missing-file errors', async () => { assert.deepEqual(results.errors, []); });
} catch (error) { results.failure = error.stack; process.exitCode = 1; await snap('failure').catch(() => {}); }
finally { results.finished = new Date().toISOString(); const name=mobileOnly?'mobile-report.json':'browser-report.json'; await writeFile(resolve(evidence, name), JSON.stringify(results, null, 2)); await browser.close(); console.log(`QA report: ${resolve(evidence, name)}`); }
