import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import * as dkd_os from 'node:os';
import { execFileSync as dkd_exec } from 'node:child_process';
import { fileURLToPath as dkd_fileURL } from 'node:url';
const dkd_source = dkd_fileURL(new URL('../scripts/dkd-sync.sh', import.meta.url));
const dkd_url = 'https://github.com/DrabornEagle/DraBornGames.git';
function dkd_fixture(dkd_context) {
  const dkd_root = dkd_fs.mkdtempSync(dkd_path.join(dkd_os.tmpdir(), 'dkd-sync-'));
  dkd_context.after(() => dkd_fs.rmSync(dkd_root, { recursive: true, force: true }));
  const dkd_bare = dkd_path.join(dkd_root, 'remote.git');
  const dkd_author = dkd_path.join(dkd_root, 'author');
  const dkd_local = dkd_path.join(dkd_root, 'local');
  const dkd_git = (dkd_cwd, ...dkd_args) => dkd_exec('git', dkd_args, { cwd: dkd_cwd, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
  dkd_git(dkd_root, 'init', '--bare', '--initial-branch=main', dkd_bare);
  dkd_git(dkd_root, 'clone', dkd_bare, dkd_author);
  for (const dkd_pair of [['user.name','DKD Test'],['user.email','dkd-test@invalid.example']]) dkd_git(dkd_author,'config',...dkd_pair);
  dkd_fs.mkdirSync(dkd_path.join(dkd_author,'LastMile/scripts'), { recursive: true });
  dkd_fs.copyFileSync(dkd_source, dkd_path.join(dkd_author,'LastMile/scripts/dkd-sync.sh'));
  dkd_fs.writeFileSync(dkd_path.join(dkd_author,'version.txt'),'one');
  dkd_git(dkd_author,'add','.'); dkd_git(dkd_author,'commit','-m','initial'); dkd_git(dkd_author,'push','origin','main');
  dkd_git(dkd_root,'clone',dkd_bare,dkd_local);
  dkd_git(dkd_local,'remote','set-url','origin',dkd_url);
  dkd_git(dkd_local,'config',`url.${dkd_bare}.insteadOf`,dkd_url);
  for (const dkd_pair of [['user.name','DKD Test'],['user.email','dkd-test@invalid.example']]) dkd_git(dkd_local,'config',...dkd_pair);
  const dkd_publish = () => { dkd_fs.writeFileSync(dkd_path.join(dkd_author,'version.txt'),'two'); dkd_git(dkd_author,'add','.'); dkd_git(dkd_author,'commit','-m','remote update'); dkd_git(dkd_author,'push','origin','main'); return dkd_git(dkd_author,'rev-parse','HEAD'); };
  const dkd_sync = () => dkd_exec('bash',['LastMile/scripts/dkd-sync.sh'],{cwd:dkd_local,encoding:'utf8',stdio:['ignore','pipe','pipe']});
  return { dkd_git, dkd_local, dkd_author, dkd_publish, dkd_sync };
}
dkd_test('sync fast-forwards to remote and becomes a no-op when equal', dkd_context => {
  const dkd_f = dkd_fixture(dkd_context); const dkd_remote = dkd_f.dkd_publish(); dkd_f.dkd_sync();
  dkd_assert.equal(dkd_f.dkd_git(dkd_f.dkd_local,'rev-parse','HEAD'),dkd_remote);
  dkd_assert.equal(dkd_f.dkd_git(dkd_f.dkd_local,'status','--porcelain'),''); dkd_assert.equal(dkd_f.dkd_sync(),'');
});
dkd_test('sync preserves divergent commits, modified files and untracked files', dkd_context => {
  const dkd_f = dkd_fixture(dkd_context); const dkd_local = dkd_f.dkd_local;
  dkd_fs.writeFileSync(dkd_path.join(dkd_local,'local-commit.txt'),'local committed work');
  dkd_f.dkd_git(dkd_local,'add','.'); dkd_f.dkd_git(dkd_local,'commit','-m','local work');
  const dkd_previous = dkd_f.dkd_git(dkd_local,'rev-parse','HEAD');
  dkd_fs.writeFileSync(dkd_path.join(dkd_local,'version.txt'),'unsaved edit');
  dkd_fs.writeFileSync(dkd_path.join(dkd_local,'draft.txt'),'untracked draft');
  const dkd_remote = dkd_f.dkd_publish(); dkd_f.dkd_sync();
  dkd_assert.equal(dkd_f.dkd_git(dkd_local,'rev-parse','HEAD'),dkd_remote);
  dkd_assert.ok(dkd_f.dkd_git(dkd_local,'for-each-ref','--format=%(objectname)','refs/heads/dkd-preserved/').includes(dkd_previous));
  dkd_assert.equal(dkd_f.dkd_git(dkd_local,'show','stash@{0}:version.txt'),'unsaved edit');
  dkd_assert.equal(dkd_f.dkd_git(dkd_local,'show','stash@{0}^3:draft.txt'),'untracked draft');
  dkd_assert.equal(dkd_f.dkd_git(dkd_local,'status','--porcelain'),'');
});
dkd_test('sync refuses an unrelated remote and an unfinished merge', dkd_context => {
  const dkd_f=dkd_fixture(dkd_context);
  dkd_f.dkd_git(dkd_f.dkd_local,'remote','set-url','origin','https://github.com/example/unrelated.git');
  dkd_assert.throws(()=>dkd_f.dkd_sync(),/yalnızca/);
  dkd_f.dkd_git(dkd_f.dkd_local,'remote','set-url','origin',dkd_url);
  dkd_fs.writeFileSync(dkd_path.join(dkd_f.dkd_local,'.git/MERGE_HEAD'),dkd_f.dkd_git(dkd_f.dkd_local,'rev-parse','HEAD'));
  dkd_assert.throws(()=>dkd_f.dkd_sync(),/Devam eden Git/);
});
