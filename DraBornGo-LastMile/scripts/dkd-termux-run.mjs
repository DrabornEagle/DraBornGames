import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import { createHash as dkd_createHash } from 'node:crypto';
import { spawn as dkd_spawn, execFileSync as dkd_execFileSync } from 'node:child_process';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
process.chdir(dkd_root);
const dkd_gitDir = dkd_execFileSync('git', ['rev-parse', '--absolute-git-dir'], { encoding: 'utf8' }).trim();
const dkd_lock = dkd_path.join(dkd_gitDir, 'dkd-lastmile-launcher.pid');
const dkd_installMarker = dkd_path.join(dkd_gitDir, 'dkd-lastmile-installed-sha256');
let dkd_metro = null;
let dkd_busy = false;
let dkd_stopping = false;
let dkd_poll = null;
let dkd_install = null;
let dkd_sync = null;

if (dkd_fs.existsSync(dkd_lock)) {
  const dkd_pid = Number(dkd_fs.readFileSync(dkd_lock, 'utf8'));
  let dkd_running = false;
  if (Number.isInteger(dkd_pid) && dkd_pid > 1) { try { process.kill(dkd_pid, 0); dkd_running = true; } catch {} }
  if (dkd_running) { console.error('LAST MILE başlatıcısı zaten açık. Önce mevcut oturumda Ctrl+C kullan.'); process.exit(1); }
  dkd_fs.unlinkSync(dkd_lock);
}
dkd_fs.writeFileSync(dkd_lock, String(process.pid), { flag: 'wx' });
const dkd_git = (...dkd_args) => dkd_execFileSync('git', dkd_args, { cwd: dkd_root, encoding: 'utf8' }).trim();
const dkd_killGroup = (dkd_child, dkd_signal = 'SIGTERM') => { if (!dkd_child || dkd_child.exitCode !== null) return; try { process.kill(-dkd_child.pid, dkd_signal); } catch { try { dkd_child.kill(dkd_signal); } catch {} } };
const dkd_wait = dkd_child => new Promise(dkd_resolve => { dkd_child.once('error', () => dkd_resolve(1)); dkd_child.once('exit', dkd_code => dkd_resolve(dkd_code ?? 1)); });
async function dkd_syncOnce() {
  dkd_sync = dkd_spawn('bash', ['scripts/dkd-sync.sh', 'once'], { cwd: dkd_root, stdio: 'inherit', detached: true });
  const dkd_code = await dkd_wait(dkd_sync); dkd_sync = null; return dkd_code;
}
async function dkd_dependencies() {
  const dkd_hash = dkd_createHash('sha256').update(dkd_fs.readFileSync('package-lock.json')).update(process.version).update(process.platform).update(process.arch).digest('hex');
  const dkd_previous = dkd_fs.existsSync(dkd_installMarker) ? dkd_fs.readFileSync(dkd_installMarker, 'utf8') : '';
  if (dkd_previous === dkd_hash && dkd_fs.existsSync('node_modules/expo/bin/cli')) return;
  console.log('Kilitli paketler kuruluyor. İlk kurulum birkaç dakika sürebilir.');
  dkd_install = dkd_spawn('npm', ['ci', '--no-audit', '--no-fund'], { stdio: 'inherit', detached: true });
  const dkd_code = await dkd_wait(dkd_install); dkd_install = null;
  if (dkd_code !== 0) throw new Error('npm ci tamamlanamadı. Ağ bağlantısını kontrol edip başlatıcıyı yeniden çalıştır.');
  dkd_fs.writeFileSync(dkd_installMarker, dkd_hash);
}
function dkd_startMetro() {
  if (dkd_stopping) return;
  console.log('\nLAST MILE / Expo Go: exp://127.0.0.1:8081\nGitHub main her 30 saniyede kontrol edilir. Çıkış: Ctrl+C.');
  dkd_metro = dkd_spawn(process.execPath, ['node_modules/expo/bin/cli', 'start', '--go', '--localhost', '--port', '8081'], { stdio: 'inherit', detached: true, env: { ...process.env, REACT_NATIVE_PACKAGER_HOSTNAME: '127.0.0.1', CI: '1' } });
  const dkd_child = dkd_metro;
  dkd_child.once('error', dkd_error => { console.error(dkd_error.message); void dkd_stop(1); });
  dkd_child.once('exit', dkd_code => { if (dkd_metro === dkd_child && !dkd_busy && !dkd_stopping) void dkd_stop(dkd_code || 0); });
}
async function dkd_stopMetro() {
  const dkd_child = dkd_metro; dkd_metro = null;
  if (!dkd_child || dkd_child.exitCode !== null) return;
  const dkd_done = dkd_wait(dkd_child);
  dkd_killGroup(dkd_child);
  const dkd_timeout = setTimeout(() => dkd_killGroup(dkd_child, 'SIGKILL'), 5000);
  await dkd_done; clearTimeout(dkd_timeout);
}
async function dkd_update() {
  if (dkd_busy || dkd_stopping) return;
  dkd_busy = true;
  try {
    const dkd_before = dkd_git('rev-parse', 'HEAD');
    const dkd_syncCode = await dkd_syncOnce();
    if (dkd_stopping) return;
    if (dkd_syncCode === 0 && dkd_before !== dkd_git('rev-parse', 'HEAD')) {
      console.log('Yeni sürüm geldi. Metro yeniden başlatılıyor; açık teslimat yeniden denenmelidir.');
      await dkd_stopMetro(); await dkd_dependencies(); dkd_startMetro();
    }
  } catch (dkd_error) { console.error(dkd_error.message); if (!dkd_metro) await dkd_stop(1); }
  finally { dkd_busy = false; }
}
async function dkd_stop(dkd_code = 0) {
  if (dkd_stopping) return;
  dkd_stopping = true; clearInterval(dkd_poll);
  dkd_killGroup(dkd_sync); dkd_killGroup(dkd_install); await dkd_stopMetro();
  try { if (dkd_fs.readFileSync(dkd_lock, 'utf8') === String(process.pid)) dkd_fs.unlinkSync(dkd_lock); } catch {}
  process.exit(dkd_code);
}
process.once('SIGINT', () => void dkd_stop());
process.once('SIGTERM', () => void dkd_stop());
try {
  dkd_busy = true;
  const dkd_syncCode = await dkd_syncOnce();
  if (![0, 5].includes(dkd_syncCode)) throw new Error('Eşitleme tamamlanmadı. Yukarıdaki Git uyarısını çözerek tekrar aç.');
  if (dkd_syncCode === 5) console.log('Çevrimdışı: cihazdaki son sürüm açılacak.');
  await dkd_dependencies(); dkd_busy = false;
  dkd_startMetro(); dkd_poll = setInterval(() => void dkd_update(), 30000);
} catch (dkd_error) { console.error(dkd_error.message); await dkd_stop(1); }
