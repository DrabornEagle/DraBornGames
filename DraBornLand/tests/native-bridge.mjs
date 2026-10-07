/** Verify the shared game's Android WebView JavaScript bridge in Chromium.
 * This validates the message contract, not Android hardware or AsyncStorage.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Game, terrainHeight } from '../game/simulation.ts';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = createRequire('/tmp/drabornland-qa/package.json')('playwright')); }
const evidence = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'evidence');
await mkdir(evidence, { recursive: true });
const seed = new Game(73), node = seed.state.resources.find(r => r.type === 'wood');
seed.state.player.x = node.x + 1; seed.state.player.z = node.z; seed.state.player.y = terrainHeight(node.x + 1, node.z);
assert.equal(seed.interact().ok, true);
const snapshot = JSON.parse(seed.save());
const report = { started: new Date().toISOString(), environment: 'Chromium emulation of ReactNativeWebView message contract; native Android/AsyncStorage not exercised', checks: [], errors: [] };
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const context = await browser.newContext({ viewport: { width: 915, height: 412 } });
  await context.addInitScript(save => {
    window.__NATIVE_SAVE__ = save;
    window.__NATIVE_PLATFORM__ = 'android';
    window.__BRIDGE_MESSAGES__ = [];
    window.ReactNativeWebView = { postMessage: message => window.__BRIDGE_MESSAGES__.push(JSON.parse(message)) };
    localStorage.setItem('drabornland-quality', 'low');
    localStorage.setItem('drabornland-audio', 'off');
  }, snapshot);
  const page = await context.newPage(); page.on('pageerror', e => report.errors.push(e.message));
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:4173/DraBornGames/DraBornLand/?qa=1', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__DRABORN_TEST__ && window.__BRIDGE_MESSAGES__.some(m => m.type === 'ready'), null, { timeout: 60000 });
  assert.equal(await page.evaluate(() => window.__DRABORN_TEST__.game.state.inventory.wood), 2);
  assert.equal(await page.evaluate(() => window.__DRABORN_TEST__.metrics().quality), 'low');
  report.checks.push('Native saved object loads before the inline game; ready message sent; saved quality applies');
  await page.locator('[data-action="start"][data-value="continue"]').click();
  await page.evaluate(() => window.__DRABORN_TEST__.action('save'));
  const saved = await page.evaluate(() => window.__BRIDGE_MESSAGES__.filter(m => m.type === 'save').at(-1));
  assert.equal(saved.data.version, 1); assert.equal(saved.data.state.inventory.wood, 2); assert.equal(Number.isSafeInteger(saved.id), true);
  await page.evaluate(id => window.dispatchEvent(new CustomEvent('draborn:save-result', { detail: { ok: true, id } })), saved.id);
  assert.match(await page.locator('#toast').innerText(), /kaydedildi/i);
  report.checks.push('Save bridge posts complete versioned state and accepts storage acknowledgement');
  await page.evaluate(() => window.__DRABORN_TEST__.action('export'));
  const exported = await page.evaluate(() => window.__BRIDGE_MESSAGES__.filter(m => m.type === 'export').at(-1));
  assert.equal(exported.data.state.inventory.wood, 2); assert.equal(exported.data.version, 1);
  report.checks.push('Native export posts the same portable save format');
  await page.evaluate(() => window.__DRABORN_NATIVE_EVENT__('back'));
  assert.equal(await page.evaluate(() => window.__DRABORN_TEST__.ui.blocked), true);
  await page.evaluate(() => window.__DRABORN_NATIVE_EVENT__('back'));
  assert.equal(await page.evaluate(() => window.__DRABORN_TEST__.ui.blocked), false);
  await page.evaluate(() => window.__DRABORN_NATIVE_EVENT__('pause'));
  const time = await page.evaluate(() => window.__DRABORN_TEST__.game.state.time); await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.__DRABORN_TEST__.game.state.time), time);
  await page.evaluate(() => window.__DRABORN_NATIVE_EVENT__('resume'));
  report.checks.push('Android back toggles pause panel; background pauses simulation; resume is accepted');
  assert.deepEqual(report.errors, []); report.passed = true;
  console.log(`PASS ${report.checks.length} native bridge contracts`);
} catch (error) { report.passed = false; report.failure = error.stack; console.error(error); process.exitCode = 1; }
finally { report.finished = new Date().toISOString(); await writeFile(resolve(evidence, 'native-bridge-report.json'), JSON.stringify(report, null, 2)); await browser.close(); }
