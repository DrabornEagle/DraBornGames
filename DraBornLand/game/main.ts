import * as THREE from 'three';
import {Game, terrainHeight, RELICS, LANDMARKS, type BuildKind, type Tool, type CraftId} from './simulation';
import {createWorld, createTree, createRock, createBerryBush, createResourcePickup, createRelic, createCharacter, createEnemy, createBuildPiece} from './world';
import {UI} from './ui';
import {Soundscape} from './audio';

declare global { interface Window { __NATIVE_SAVE__?: unknown; ReactNativeWebView?: {postMessage(s:string):void}; __DRABORN_NATIVE_EVENT__?: (event:string)=>void; __DRABORN_TEST__?: any; } }
const SAVE_KEY = 'drabornland-save-v1';
const root = document.getElementById('app')!;
const canvas = document.createElement('canvas'); canvas.id = 'world'; canvas.setAttribute('aria-label','DraBornLand üç boyutlu ada dünyası'); root.appendChild(canvas);
let renderer: THREE.WebGLRenderer;
try { renderer = new THREE.WebGLRenderer({canvas,antialias:devicePixelRatio < 2,powerPreference:'high-performance'}); }
catch { root.innerHTML = '<div class="fatal"><h1>Bu cihazda 3D başlatılamadı</h1><p>WebGL destekli güncel Chrome veya Android System WebView kullanın.</p><button onclick="location.reload()">Yeniden dene</button></div>'; throw new Error('WebGL unavailable'); }
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(56,1,.1,240);
const game = new Game(73);
let hasSave = false;
try { const native = window.__NATIVE_SAVE__; const saved = native ? (typeof native==='string'?native:JSON.stringify(native)) : localStorage.getItem(SAVE_KEY); if (saved) hasSave = game.load(saved).ok; } catch {}
const world = createWorld(scene,game.state.seed,game.state.resources);
game.setEnvironmentColliders(world.colliders);
const playerMesh = createCharacter(); scene.add(playerMesh);
const resources = new Map<string, THREE.Group>();
const enemies = new Map<string, THREE.Group>();
const builds = new Map<string, THREE.Group>();
const relics = new Map<string, THREE.Group>();
const audio = new Soundscape();
let running=false,paused=false, yaw = 0,pitch=.31, cameraDistance=7.6,buildKind:BuildKind='floor',buildRotation=0, quality='medium';
try{quality=localStorage.getItem('drabornland-quality')||'medium';audio.setEnabled(localStorage.getItem('drabornland-audio')!=='off');}catch{}
let waypoint: {x:number,z:number,name:string}|null = null;
let frames=0, lastFpsTime=0,fps=0,frameMs=0,visualTime=80;
let lastSave=0,stepTime=0,walkTime=0,flash=0,attackVfx=0;
let awaitingManualSave:number|null=null,nextSaveId=0;
const keys = new Set<string>();
const ghost = new THREE.Group(); scene.add(ghost);
const ghostMat = new THREE.MeshBasicMaterial({color:0x9be9ab,transparent:true,opacity:.3,depthWrite:false});
let ghostKind='';
const particles: {mesh:THREE.Mesh,velocity:THREE.Vector3,life:number}[]=[];
const particleGeo = new THREE.IcosahedronGeometry(.065,0);
const particleMaterials = [0xd1af68,0xb9b8a7,0x75e7be,0xff853c].map(color=>new THREE.MeshBasicMaterial({color}));
const dangerMaterial = new THREE.MeshBasicMaterial({color:0xff733c,side:THREE.DoubleSide,transparent:true,opacity:.65,depthWrite:false});
const dangerGeometry = new THREE.RingGeometry(.85,1,48);
const telegraphs = new Map<string,THREE.Mesh>();
const fallingTrees = new Map<string,{time:number,direction:number}>();
const resourceHits = new Map<string,number>();
function burst(x:number,y:number,z:number,color=0) { for(let i=0;i<9;i++){const mesh=new THREE.Mesh(particleGeo,particleMaterials[color]);mesh.position.set(x,y,z);scene.add(mesh);particles.push({mesh,velocity:new THREE.Vector3((Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3),life:.7});} }

function save(show=false) {
  const data=game.save();let stored=false;
  try {localStorage.setItem(SAVE_KEY,data);stored=true;}catch{}
  if(window.ReactNativeWebView){const id=++nextSaveId;if(show)awaitingManualSave=id;window.ReactNativeWebView.postMessage(JSON.stringify({type:'save',id,data:JSON.parse(data)}));}
  if(stored||window.ReactNativeWebView){hasSave=true;ui.setHasSave(true);if(show&&!window.ReactNativeWebView)ui.toast('Oyun bu cihaza kaydedildi.');}
  else ui.toast('Kayıt alanı dolu. Kaydını dışa aktar.');
}
function exportSave() {
  const data=game.save();
  if(window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(JSON.stringify({type:'export',data:JSON.parse(data)})); return; }
  const url=URL.createObjectURL(new Blob([data],{type:'application/json'})); const a=document.createElement('a');a.href=url;a.download='DraBornLand-kayit.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);ui.toast('Kayıt dosyası indirildi. Diğer cihazda içe aktarabilirsin.');
}
function result(r:any) { if(r?.message)ui.toast(r.message); if(r?.ok)save(); }
function resetEntityViews(){for(const map of [resources,enemies,builds,relics]){map.forEach(mesh=>scene.remove(mesh));map.clear();}telegraphs.forEach(mesh=>scene.remove(mesh));telegraphs.clear();fallingTrees.clear();resourceHits.clear();}
function action(name:string,value?:string) {
  switch(name) {
    case 'attack': if(game.state.tool==='food'){result(game.eat());break;}if(game.state.tool==='build'){action('place');break;}result(game.attack()); attackVfx=.28; break;
    case 'interact': result(game.interact()); break;
    case 'jump': ui.input.jump=true; break;
    case 'eat': result(game.eat()); break;
    case 'tool': result(game.setTool(value as Tool)); break;
    case 'craft': result(game.craft(value as CraftId)); break;
    case 'buildKind': buildKind=value as BuildKind;game.setTool('build');break;
    case 'place': { const {x,z}=buildPosition(); result(game.build(buildKind,x,z,buildRotation));break; }
    case 'rotate': buildRotation+=Math.PI/2; break;
    case 'save': save(true);break;
    case 'export': exportSave();break;
    case 'import': { const loaded=game.load(value || '');result(loaded);if(loaded.ok) {resetEntityViews();running=true;paused=false;ui.setRunning(true);resetCamera();audio.start();} break; }
    case 'respawn': result(game.respawn());ui.setRunning(true);paused=false;resetCamera();audio.start();break;
    case 'quality': quality=value||'medium';applyQuality();break;
    case 'audio': audio.setEnabled(value==='on');try{localStorage.setItem('drabornland-audio',value!);}catch{}break;
    case 'waypoint': { const list:any[]=[...RELICS, {id:'lighthouse',x:0,z:0,name:'Deniz Feneri'},{id:'temple',x:0,z:-42,name:'Antik Tapınak'}];const l=list.find(l=>l.id===value);if(l)waypoint={x:l.x,z:l.z,name:l.name||l.label||'Hedef'};break; }
  }
}
function resetCamera(){ const p=game.state.player; yaw=p.rotation+Math.PI; camera.position.set(p.x+Math.sin(yaw)*cameraDistance,p.y+4,p.z+Math.cos(yaw)*cameraDistance); }
const ui = new UI(game, {start(newGame){
  if(newGame) { game.load(new Game(73).save());resetEntityViews(); }
  running=true;paused=false;ui.setRunning(true);resetCamera();audio.start();save();
},pause(value){paused=value;keys.clear();save(); if(value)audio.suspend();else audio.start();},action});
ui.setHasSave(hasSave);
function applyQuality() { renderer.setPixelRatio(Math.min(devicePixelRatio, quality==='low'?1:quality==='high'?2:1.4));renderer.shadowMap.enabled=quality!=='low';world.sun.shadow.mapSize.set(quality==='high'?2048:1024,quality==='high'?2048:1024);resize(); }
function resize() { const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix(); }
addEventListener('resize',resize);applyQuality();
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;save();ui.toast('Grafik bağlantısı kesildi. Yenileniyor…');});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
let pointer: {id:number,x:number,y:number,moved:number,mouse:boolean}|null=null;
canvas.addEventListener('pointerdown',e=>{ if(!running||ui.blocked)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,moved:0,mouse:e.pointerType==='mouse'&&e.button===0};canvas.setPointerCapture(e.pointerId);audio.start(); });
canvas.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId||ui.blocked)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer.moved+=Math.hypot(dx,dy);yaw-=dx*.005;pitch=THREE.MathUtils.clamp(pitch+dy*.004,-.1,.85);pointer.x=e.clientX;pointer.y=e.clientY;});
canvas.addEventListener('pointerup',()=>{if(pointer?.mouse&&pointer.moved<5&&!ui.blocked)action(game.state.tool==='build'?'place':'attack');pointer=null;});canvas.addEventListener('pointercancel',()=>{pointer=null;});
canvas.addEventListener('wheel',e=>{e.preventDefault();cameraDistance=THREE.MathUtils.clamp(cameraDistance+e.deltaY*.008,4,11);},{passive:false});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{
 if((e.target as HTMLElement)?.matches?.('input,textarea,select'))return;
 if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();
 if(!running||ui.blocked)return;
 keys.add(e.code);if(e.repeat)return;
 if(e.code==='KeyE')action(game.state.tool==='build'?'place':'interact');if(e.code==='KeyF')action('attack');if(e.code==='Space')ui.input.jump=true;
 if(/^Digit[1-5]$/.test(e.code))action('tool',['axe','pickaxe','sword','food','build'][Number(e.code.at(-1))-1]);
 if(e.code==='KeyR')action(game.state.tool==='build'?'rotate':'eat');if(e.code==='Enter'&&game.state.tool==='build')action('place');
});
function clearInput(){keys.clear();ui.input.moveX=ui.input.moveZ=0;ui.input.sprint=ui.input.jump=false;pointer=null;const thumb=ui.root.querySelector<HTMLElement>('#joystick-thumb');if(thumb)thumb.style.transform='translate(0,0)';ui.root.querySelector('#touch-run')?.classList.remove('pressed');}
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',clearInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){clearInput();save();paused=true;audio.suspend();}else if(running&&!ui.blocked){paused=false;audio.start();}});
addEventListener('pagehide',()=>{if(running)save();});
window.__DRABORN_NATIVE_EVENT__=event=>{if(event==='resume'){if(!ui.blocked){paused=false;audio.start();}}else{clearInput();save();paused=true;audio.suspend();if(event==='back')document.dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',key:'Escape',bubbles:true}));}};

function buildPosition(){ const p=game.state.player;return {x:Math.round((p.x-Math.sin(yaw)*3.2)*2)/2,z:Math.round((p.z-Math.cos(yaw)*3.2)*2)/2}; }
function updateGhost(){ghost.visible=running&&!ui.blocked&&game.state.tool==='build';if(!ghost.visible)return;if(ghostKind!==buildKind){ghost.clear();const mesh=createBuildPiece(buildKind);mesh.traverse(o=>{if(o instanceof THREE.Mesh)o.material=ghostMat;});ghost.add(mesh);ghostKind=buildKind;}const {x,z}=buildPosition();ghost.position.set(x,terrainHeight(x,z),z);ghost.rotation.y=buildRotation;}

function updateEntities(dt:number) {
  const s=game.state,p=s.player;
  for(const node of s.resources as any[]){let mesh=resources.get(node.id);const alive=!node.depleted && (node.amount===undefined||node.amount>0) && (node.health===undefined||node.health>0);
    if(!alive){if(mesh){const fall=fallingTrees.get(node.id);if(fall){fall.time+=dt;mesh.visible=fall.time<1.3;mesh.rotation.z=fall.direction*Math.min(1,fall.time/1.1)**2*1.48;if(fall.time>=1.3)fallingTrees.delete(node.id);}else mesh.visible=false;}continue;}
    if(!mesh){if(node.type==='tree')mesh=createTree(Number(node.id.replace(/\D/g,''))||0);else if(node.type==='rock'||node.type==='stone')mesh=createRock();else if(node.type==='berry')mesh=createBerryBush();else mesh=createResourcePickup(node.type);
      mesh.position.set(node.x,terrainHeight(node.x,node.z),node.z);scene.add(mesh);resources.set(node.id,mesh);}
    const distance=Math.hypot(node.x-p.x,node.z-p.z);mesh.visible=distance<(quality==='low'?40:quality==='high'?95:58);mesh.traverse(o=>{if(o instanceof THREE.Mesh)o.castShadow=quality!=='low'&&distance<23;});const hit=resourceHits.get(node.id)||0;if(hit>0)resourceHits.set(node.id,Math.max(0,hit-dt));if(mesh.visible&&node.type==='tree')mesh.rotation.z=Math.sin(visualTime*.6+node.x)*.009+Math.sin(hit*50)*hit*.12;
  }
  for(const relic of RELICS){let mesh=relics.get(relic.id);if(!mesh){mesh=createRelic(relics.size);mesh.position.set(relic.x,terrainHeight(relic.x,relic.z),relic.z);scene.add(mesh);relics.set(relic.id,mesh);}mesh.visible=!s.quests.relics.includes(relic.id);mesh.rotation.y+=dt*.4;}
  const enemyIds=new Set(s.enemies.map(e=>e.id));
  for(const [id,mesh]of enemies){if(!enemyIds.has(id)){scene.remove(mesh);enemies.delete(id);const ring=telegraphs.get(id);if(ring)scene.remove(ring);telegraphs.delete(id);}}
  for(const enemy of s.enemies as any[]){let mesh=enemies.get(enemy.id);if(!mesh){mesh=createEnemy(enemy.type);scene.add(mesh);enemies.set(enemy.id,mesh);}
    mesh.visible=enemy.alive;mesh.position.set(enemy.x,terrainHeight(enemy.x,enemy.z),enemy.z);mesh.rotation.y=Math.atan2(p.x-enemy.x,p.z-enemy.z);
    const wing=mesh.getObjectByName('leftWing'),wing2=mesh.getObjectByName('rightWing');if(wing)wing.rotation.z=Math.sin(s.time*2)*.2;if(wing2)wing2.rotation.z=-Math.sin(s.time*2)*.2;
    for(const [name,sign] of [['leftLeg',1],['rightLeg',-1]]as const){const limb=mesh.getObjectByName(name);if(limb)limb.rotation.x=Math.sin(s.time*7)*.3*sign;}
    mesh.position.y+=Math.sin(s.time*4+enemy.x)*.03;
    if(enemy.type==='dragon'&&enemy.alive){(window as any).__dragon=enemy;}
    let ring=telegraphs.get(enemy.id);if(!ring){ring=new THREE.Mesh(dangerGeometry,dangerMaterial);ring.rotation.x=-Math.PI/2;scene.add(ring);telegraphs.set(enemy.id,ring);}
    ring.visible=enemy.alive&&enemy.phase==='windup';const radius=enemy.type==='dragon'?(enemy.attackKind==='fire'?4.7:3.8):1.8;
    ring.position.set(enemy.attackX,terrainHeight(enemy.attackX,enemy.attackZ)+.08,enemy.attackZ);ring.scale.setScalar(radius*(1+Math.sin(s.time*22)*.03));
  }
  for(const piece of s.builds as any[]){let mesh=builds.get(piece.id);if(!mesh){mesh=createBuildPiece(piece.kind);mesh.position.set(piece.x,terrainHeight(piece.x,piece.z),piece.z);mesh.rotation.y=piece.rotation;scene.add(mesh);builds.set(piece.id,mesh);}const door=mesh.getObjectByName('doorPanel');if(door)door.rotation.y=THREE.MathUtils.damp(door.rotation.y,piece.open?Math.PI*.6:0,12,dt);const flame=mesh.getObjectByName('flame');if(flame){flame.scale.set(1+Math.sin(visualTime*11)*.09,1+Math.sin(visualTime*15)*.17,1);}}
  playerMesh.position.set(p.x,p.y,p.z);const delta=THREE.MathUtils.euclideanModulo(p.rotation-playerMesh.rotation.y+Math.PI,Math.PI*2)-Math.PI;playerMesh.rotation.y+=delta*(1-Math.exp(-dt*14));
  const moving=(keys.size>0||Math.hypot(ui.input.moveX,ui.input.moveZ)>.1)&&!ui.blocked&&!paused;walkTime+=moving?dt*(ui.input.sprint||keys.has('ShiftLeft')?13:8):dt*2;
  for(const [name,sign]of [['leftLeg',1],['rightLeg',-1],['leftArm',-1],['rightArm',1]]as const){const limb=playerMesh.getObjectByName(name);if(limb)limb.rotation.x=moving?Math.sin(walkTime)*.5*sign:Math.sin(walkTime)*.025;}
  const rightArm=playerMesh.getObjectByName('rightArm');if(rightArm&&attackVfx>0)rightArm.rotation.x=-Math.sin(attackVfx/.28*Math.PI)*1.8;
  playerMesh.visible=!p.dead;const weapon=playerMesh.getObjectByName('weapon');if(weapon)weapon.visible=s.tool!=='food'&&s.tool!=='build';
  for(const [name,tool] of [['axeModel','axe'],['pickaxeModel','pickaxe'],['swordModel','sword']] as const){const model=playerMesh.getObjectByName(name);if(model)model.visible=s.tool===tool;}
  if(moving&&p.grounded){stepTime+=dt;if(stepTime>.42){audio.sound('step');stepTime=0;}}
}
function cameraUpdate(dt:number){
  const p=game.state.player;
  if(!running){ const a=visualTime*.018;camera.position.set(Math.sin(a)*15,9,32+Math.cos(a)*7);camera.lookAt(0,3,1);return; }
  const target=new THREE.Vector3(p.x,p.y+1.4,p.z), dist=cameraDistance*Math.cos(pitch);
  const desired=new THREE.Vector3(p.x+Math.sin(yaw)*dist,p.y+2.1+Math.sin(pitch)*cameraDistance,p.z+Math.cos(yaw)*dist);
  desired.y=Math.max(desired.y,terrainHeight(desired.x,desired.z)+1.1);
  // Prevent the chase camera passing through resource and built collision proxies.
  const offset=desired.clone().sub(target);let factor=1;
  for(const obj of [...world.colliders,...game.state.resources.filter((r:any)=>r.type==='tree'&&!r.depleted),...game.state.builds.filter((b:any)=>b.kind==='wall'||b.kind==='roof')]){
    const to=new THREE.Vector3(obj.x,target.y,obj.z).sub(target), t=THREE.MathUtils.clamp(to.dot(offset)/offset.lengthSq(),0,1), closest=target.clone().addScaledVector(offset,t);
    if(Math.hypot(closest.x-obj.x,closest.z-obj.z)<.8 && t>.12)factor=Math.min(factor,Math.max(.25,t-.12));
  }
  desired.copy(target).addScaledVector(offset,factor);desired.y=Math.max(desired.y,terrainHeight(desired.x,desired.z)+.6);camera.position.lerp(desired,1-Math.exp(-dt*9));camera.lookAt(target);
}
function updateEvents(){for(const event of game.drainEvents() as any[]){audio.sound(event.enemyType==='dragon'&&event.attackKind==='fire'?'dragon-fire':event.type);if(event.message)ui.toast(event.message);if(event.type==='hit'&&resources.has(event.id))resourceHits.set(event.id,.35);if(event.type==='harvest'&&game.state.resources.find(r=>r.id===event.id)?.type==='tree')fallingTrees.set(event.id,{time:0,direction:event.x>game.state.player.x?-1:1});if(event.x!==undefined)burst(event.x,terrainHeight(event.x,event.z)+1,event.z,/relic|repair/.test(event.type)?2:/fire|dragon/.test(event.type)?3:/stone/.test(event.message||'')?1:0);if(/hurt|damage/.test(event.type))flash=.4;}}
function frame(now:number) {
  requestAnimationFrame(frame);const dt=Math.min((now-(frame as any).last||16)/1000,.05);(frame as any).last=now;frames++;if(now-lastFpsTime>1000){fps=frames;frames=0;lastFpsTime=now;}
  const start=performance.now();visualTime+=dt;
  if(running&&!paused&&!ui.blocked){
    let mx=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+ui.input.moveX;
    let mz=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)+ui.input.moveZ;
    const norm=Math.max(1,Math.hypot(mx,mz));mx/=norm;mz/=norm;
    game.tick(dt,{moveX:mx*Math.cos(yaw)+mz*Math.sin(yaw),moveZ:-mx*Math.sin(yaw)+mz*Math.cos(yaw),sprint:keys.has('ShiftLeft')||keys.has('ShiftRight')||ui.input.sprint,jump:ui.input.jump});ui.input.jump=false;
    if(now-lastSave>10000){save();lastSave=now;}
  }
  updateEntities(dt);updateGhost();cameraUpdate(dt);updateEvents();
  const phase=game.state.dayPhase;const daylight=THREE.MathUtils.clamp(Math.sin(phase*Math.PI*2)*.7+.48,.08,1);
  world.sun.target.position.set(game.state.player.x,0,game.state.player.z);world.sun.position.set(game.state.player.x-35,62,game.state.player.z+18);world.update(visualTime,daylight,game.state.quests.lighthouseRepaired,game.state.quests.templeOpen);audio.update(game.state.time,game.state.isNight);
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.velocity.y-=dt*5;p.mesh.position.addScaledVector(p.velocity,dt);p.mesh.scale.setScalar(Math.max(0,p.life));if(p.life<=0){scene.remove(p.mesh);particles.splice(i,1);}}
  flash=Math.max(0,flash-dt);attackVfx=Math.max(0,attackVfx-dt);document.documentElement.style.setProperty('--damage',String(flash));
  if(running){const target=game.nearestTarget();let prompt=target?target.label:'';if(waypoint&&!prompt)prompt=`${waypoint.name} · ${Math.round(Math.hypot(waypoint.x-game.state.player.x,waypoint.z-game.state.player.z))} m`;ui.setPrompt(prompt);}
  ui.update();renderer.render(scene,camera);frameMs=performance.now()-start;
}
resetCamera();requestAnimationFrame(frame);window.ReactNativeWebView?.postMessage(JSON.stringify({type:'ready'}));
window.addEventListener('draborn:save-result',e=>{const detail=(e as CustomEvent).detail;if(!detail?.ok)ui.toast('Android kaydı yazılamadı. Kaydını dışa aktar.');else if(awaitingManualSave===detail.id)ui.toast('Oyun bu cihaza kaydedildi.');if(awaitingManualSave===detail?.id)awaitingManualSave=null;});
// Test hooks are deliberately absent from the normal shipped URL.
if(new URLSearchParams(location.search).get('qa')==='1')window.__DRABORN_TEST__={game,ui,action,save,start:()=>{running=true;paused=false;ui.setRunning(true);resetCamera();},getCamera:()=>({x:camera.position.x,y:camera.position.y,z:camera.position.z,yaw,pitch}),look:(a:number)=>{yaw=a;},teleport:(x:number,z:number)=>{game.state.player.x=x;game.state.player.z=z;game.state.player.y=terrainHeight(x,z);resetCamera();},metrics:()=>({fps,frameMs,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,meshes:resources.size+enemies.size+builds.size,quality}),night:()=>{game.state.time=480*.72;game.tick(.01,{moveX:0,moveZ:0,sprint:false,jump:false});},scene};
