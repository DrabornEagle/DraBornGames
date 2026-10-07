/** DraBornLand's offline art set. All pivots are in metres; creatures face +Z.
 * Shared materials and batched vegetation keep the island usable on phone GPUs. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { terrainHeight } from './simulation';

type BuildKind = 'floor' | 'wall' | 'door' | 'roof' | 'campfire';
type EnvironmentCollider = { x: number; z: number; radius: number };
type OccupiedPosition = { x: number; z: number; type?: string };
type Part = { geometry: THREE.BufferGeometry; x?: number; y?: number; z?: number; sx?: number; sy?: number; sz?: number; rx?: number; ry?: number; rz?: number };
const TAU = Math.PI * 2;
function rng(seed: number) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function noise(x: number, y: number) { return (Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1; }
function fractal(x: number, y: number) { return Math.abs(noise(x, y)) * .55 + Math.abs(noise(x * .25, y * .25)) * .3 + Math.abs(noise(x * .0625, y * .0625)) * .15; }

const library: { materials: Record<string, THREE.MeshStandardMaterial>; textures: THREE.Texture[] } = { materials: {}, textures: [] };
function texture(kind: 'stone' | 'masonry' | 'scales' | 'wood' | 'cloth' | 'leaf' | 'ground' | 'metal', size = 128): THREE.DataTexture {
  const bytes = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let n = fractal(x, y), v = .74 + n * .25;
    if (kind === 'masonry') {
      const course = (y + 3 * Math.sin(x / 27)) % 32, joint = (x + (Math.floor(y / 32) % 2) * 28) % 56;
      v = course < 1.4 || (joint < 1.6 && course > 2) ? .37 + n * .2 : .67 + n * .32;
      v *= 1 - .2 * Math.max(0, Math.sin(x * .37 + Math.sin(y * .09) * 3)) ** 18;
    } else if (kind === 'stone') {
      v = .63 + .28 * n + .08 * Math.sin(x * .21 + Math.sin(y * .04) * 4);
      const crack = Math.sin(x * .087 + Math.sin(y * .061) * 3.8);
      if (crack > .992) v *= .72;
    } else if (kind === 'scales') {
      const row = Math.floor(y / 16), xx = ((x + row % 2 * 8) % 16 - 8) / 8, yy = (y % 16) / 16;
      const rim = Math.abs(yy - .32 - Math.sqrt(Math.max(0, 1 - xx * xx)) * .5);
      v = rim < .065 ? .40 + .16 * n : .62 + .2 * n + .14 * (1 - yy);
    } else if (kind === 'wood') {
      v = .56 + .22 * n + .19 * Math.abs(Math.sin(x * .48 + Math.sin(y * .06) * 1.2));
      if (Math.sin(x * .29 + Math.sin(y / 15)) > .965) v *= .48;
    } else if (kind === 'cloth') v = .73 + .2 * n + .05 * ((x + y) % 2);
    else if (kind === 'leaf') v = .62 + .34 * n + .04 * Math.sin(x * .2);
    else if (kind === 'ground') v = .75 + .22 * n;
    else v = .66 + .24 * n + .06 * Math.sin(x * .45);
    const i = (y * size + x) * 4;
    const tint = kind === 'wood' ? [1, .88, .73] : kind === 'stone' ? [.94, .98, 1] : [1, 1, 1];
    bytes[i] = Math.min(255, v * 255 * tint[0]); bytes[i + 1] = Math.min(255, v * 255 * tint[1]); bytes[i + 2] = Math.min(255, v * 255 * tint[2]); bytes[i + 3] = 255;
  }
  const tex = new THREE.DataTexture(bytes, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true; tex.needsUpdate = true; library.textures.push(tex); return tex;
}
function material(name: string, color: number, kind?: Parameters<typeof texture>[0], options: THREE.MeshStandardMaterialParameters = {}) {
  if (!library.materials[name]) {
    const map = kind ? texture(kind) : null;
    library.materials[name] = new THREE.MeshStandardMaterial({ color, roughness: .92, map, ...options });
    if (map && kind !== 'leaf' && kind !== 'ground') {
      library.materials[name].bumpMap = map;
      library.materials[name].bumpScale = kind === 'cloth' ? .007 : kind === 'metal' ? .008 : .04;
    }
  }
  return library.materials[name];
}
function mats() {
  return {
    bark: material('bark', 0x594535, 'wood'), wood: material('cutWood', 0xa9814f, 'wood'),
    leaf: material('pineNeedles', 0x345e42, 'leaf'), darkLeaf: material('deepPine', 0x193d2d, 'leaf'), youngLeaf: material('youngLeaf', 0x668154, 'leaf'),
    stone: material('weatheredStone', 0x8c9590, 'stone'), darkStone: material('wetSlate', 0x454f50, 'stone'), paleStone: material('oldLimestone', 0xb7baa8, 'stone'),
    metal: material('wroughtIron', 0x393e3c, 'metal', { metalness: .76, roughness: .48 }), gold: material('oldGold', 0xbca56a, 'metal', { metalness: .74, roughness: .38 }),
    rune: material('templeRune', 0x86f6df, undefined, { emissive: 0x45dbc6, emissiveIntensity: 1.6 }),
    leather: material('saddleLeather', 0x715044, 'cloth'), cloth: material('coatWool', 0x425f60, 'cloth'), red: material('travelScarf', 0x985e45, 'cloth'),
    skin: material('skin', 0xc89e7c, undefined, { roughness: .76 }), black: material('black', 0x171d1b), blade: material('bladeSteel', 0xc2d5d5, 'metal', { metalness: .88, roughness: .27 }),
    moss: material('softMoss', 0x677048, 'leaf'), berry: material('berries', 0xb64645, undefined, { roughness: .44 }),
    fur: material('wolfFur', 0x535853, 'cloth'), cream: material('wolfChest', 0xa49e88, 'cloth'), eye: material('enemyEyes', 0xffae54, undefined, { emissive: 0xf96923, emissiveIntensity: 2.1 }),
    dragon: material('dragonScales', 0x354e4b, 'scales', { roughness: .58, metalness: .15 }), wing: material('wingMembrane', 0x665e49, 'cloth', { side: THREE.DoubleSide }),
  };
}
function mesh(geometry: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Mesh(geometry, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; m.receiveShadow = true; return m;
}
function batch(parts: Part[], mat: THREE.Material) {
  const geometries = parts.map(p => {
    // Primitive and sculpted buffers have different indexing; normalize before merging.
    const g = p.geometry.index ? p.geometry.toNonIndexed() : p.geometry.clone(); const matrix = new THREE.Matrix4().compose(new THREE.Vector3(p.x || 0, p.y || 0, p.z || 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(p.rx || 0, p.ry || 0, p.rz || 0)), new THREE.Vector3(p.sx ?? 1, p.sy ?? 1, p.sz ?? 1));
    g.applyMatrix4(matrix); return g;
  });
  const result = mergeGeometries(geometries, false);
  geometries.forEach(g => g.dispose());
  if (!result) throw new Error('Art batch has incompatible geometry attributes.');
  return mesh(result, mat);
}
/** Merge the painted surfaces of a repeated prop into one mobile draw call. */
function paintedProp(group: THREE.Group) {
  const geometries: THREE.BufferGeometry[] = [];
  for (const object of group.children) if (object instanceof THREE.Mesh) {
    const source = object.geometry; const geometry = source.index ? source.toNonIndexed() : source.clone(); object.updateMatrix(); geometry.applyMatrix4(object.matrix);
    const mat = object.material as THREE.MeshStandardMaterial, c = mat.color; const p = geometry.getAttribute('position'); const colors = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) { const grain = .94 + Math.abs(noise(p.getX(i) * 12, p.getY(i) * 9)) * .08; colors[i * 3] = c.r * grain; colors[i * 3 + 1] = c.g * grain; colors[i * 3 + 2] = c.b * grain; }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); geometries.push(geometry);
  }
  const merged = mergeGeometries(geometries, false); if (!merged) throw new Error('Repeated prop cannot be batched.');
  geometries.forEach(g => g.dispose());
  // These source buffers have just been authored and are not referenced elsewhere.
  for (const object of group.children) if (object instanceof THREE.Mesh) object.geometry.dispose();
  const surface = material('paintedProp', 0xffffff, 'ground', { vertexColors: true, roughness: .94 });
  group.clear(); group.add(mesh(merged, surface)); return group;
}
const sphere = (r = 1, segments = 10) => new THREE.SphereGeometry(r, segments, Math.max(6, Math.floor(segments * .75)));
const box = (x: number, y: number, z: number) => new THREE.BoxGeometry(x, y, z);
const cylinder = (top: number, bottom: number, height: number, n = 9) => new THREE.CylinderGeometry(top, bottom, height, n);
const cone = (r: number, h: number, n = 9) => new THREE.ConeGeometry(r, h, n);

function ruggedGeometry(radius = 1, detail = 1, seed = 11) {
  const geo = new THREE.IcosahedronGeometry(radius, detail); const p = geo.getAttribute('position');
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const n = .88 + .2 * Math.abs(noise(x * 5 + seed, z * 8 + y)); p.setXYZ(i, x * n, y * n, z * n); }
  geo.computeVertexNormals(); return geo;
}

/** A tapered trunk, branches and a hand-shaped irregular canopy, batched by material. */
export function createTree(variant = 0) {
  const group = new THREE.Group(); const m = mats(); const rand = rng(102 + variant * 17); const height = 5.5 + rand() * 2;
  group.name = 'Harvestable tree';
  const bark: Part[] = [{ geometry: cylinder(.12, .39, height), y: height * .5 }];
  for (let i = 0; i < 5; i++) {
    const angle = i * 2.4 + rand();
    bark.push({ geometry: cylinder(.025, .105, 1.8, 6), x: Math.cos(angle) * .5, y: height * (.46 + i * .06), z: Math.sin(angle) * .5, rz: Math.sin(angle) * .65, rx: Math.cos(angle) * .65 });
  }
  for (let i = 0; i < 5; i++) { const angle = i * TAU / 5; bark.push({ geometry: cone(.16, 1.1, 5), x: Math.sin(angle) * .26, y: .2, z: Math.cos(angle) * .26, rx: Math.cos(angle) * 1.15, rz: -Math.sin(angle) * 1.15 }); }
  group.add(batch(bark, m.bark));
  const leaves: Part[] = [];
  if (variant % 3 !== 1) {
    for (let i = 0; i < 5; i++) leaves.push({ geometry: cone(1.7 - i * .27, 2.65 - i * .15, 10), x: (rand() - .5) * .22, y: height * .46 + i * .69, z: (rand() - .5) * .2, ry: i * .7 });
    group.add(batch(leaves, variant % 2 ? m.darkLeaf : m.leaf));
  } else {
    for (let i = 0; i < 9; i++) { const a = i * 2.399; leaves.push({ geometry: ruggedGeometry(1.2, 1, i + 1), x: Math.cos(a) * (i === 0 ? 0 : 1.15), y: height * .8 + Math.sin(i * 1.8) * .65, z: Math.sin(a) * 1.15, sx: 1.3, sy: .87, sz: 1.15 }); }
    group.add(batch(leaves, m.leaf));
  }
  group.userData.asset = 'tree'; return paintedProp(group);
}

export function createRock() {
  const group = new THREE.Group(); const m = mats(); group.name = 'Stone outcrop';
  group.add(mesh(ruggedGeometry(1.18, 1), m.darkStone, 0, .73, 0, 1.25, .96, 1.05));
  group.add(batch([{ geometry: ruggedGeometry(.45, 0), x: -.9, y: .27, z: .1 }, { geometry: ruggedGeometry(.38, 0), x: .7, y: .17, z: .65 }, { geometry: ruggedGeometry(.55, 0), x: .34, y: .65, z: -.43 }], m.stone));
  group.add(mesh(ruggedGeometry(.55, 0), m.moss, -.38, .77, -.33, 1, .2, .8)); return paintedProp(group);
}

export function createBerryBush() {
  const group = new THREE.Group(); const m = mats(); group.name = 'Wild berries';
  const leaves: Part[] = [], fruit: Part[] = [];
  for (let i = 0; i < 6; i++) { const a = i * 2.399; leaves.push({ geometry: ruggedGeometry(.45, 0, i), x: Math.cos(a) * .33, y: .42 + Math.sin(i) * .15, z: Math.sin(a) * .33, sy: .78 }); }
  for (let i = 0; i < 15; i++) { const a = i * 2.399; fruit.push({ geometry: sphere(.065, 6), x: Math.cos(a) * .52, y: .44 + Math.sin(i * 3.1) * .17, z: Math.sin(a) * .52 }); }
  group.add(batch(leaves, m.youngLeaf), batch(fruit, m.berry)); return paintedProp(group);
}

/** Ground loot has a readable real-world silhouette rather than a generic gem. */
export function createResourcePickup(kind: 'wood' | 'stone' | 'fiber' | 'crystal') {
  const group = new THREE.Group(), m = mats(); group.name = `Loose ${kind}`;
  if (kind === 'wood') {
    const logs: Part[] = [], ends: Part[] = [], rope: Part[] = [];
    for (let i = 0; i < 3; i++) {
      const y = i === 2 ? .3 : .13, z = i === 2 ? 0 : i === 0 ? -.11 : .11;
      logs.push({ geometry: cylinder(.095, .1, .87, 9), y, z, rz: Math.PI / 2 });
      for (const side of [-1, 1]) ends.push({ geometry: new THREE.CircleGeometry(.087, 9), x: side * .441, y, z, ry: side * Math.PI / 2 });
    }
    for (const side of [-1, 1]) rope.push({ geometry: new THREE.TorusGeometry(.197, .014, 5, 14), x: side * .24, y: .2, ry: Math.PI / 2, sz: .93 });
    group.add(batch(logs, m.bark), batch(ends, m.wood), batch(rope, material('hempRope', 0xb8a981, 'cloth')));
  } else if (kind === 'stone') {
    group.add(batch([{ geometry: ruggedGeometry(.25, 0, 4), x: -.17, y: .14, z: .1, sy: .65 }, { geometry: ruggedGeometry(.22, 1, 8), x: .19, y: .15, z: .03, sy: .72 }, { geometry: ruggedGeometry(.2, 0, 11), x: -.03, y: .16, z: -.17, sy: .8 }, { geometry: ruggedGeometry(.16, 0, 6), x: .06, y: .34, z: .05, sy: .7 }], m.stone));
    group.add(mesh(ruggedGeometry(.14, 0), m.paleStone, -.29, .09, -.18, 1, .55, 1));
  } else if (kind === 'fiber') {
    const stems: Part[] = [], leaves: Part[] = [], bindings: Part[] = [];
    for (let i = 0; i < 13; i++) {
      const a = i * 2.399, r = Math.sqrt(i / 13) * .12;
      stems.push({ geometry: cylinder(.013, .012, .66 + .04 * Math.sin(i), 5), x: Math.sin(a) * r, y: .37, z: Math.cos(a) * r, rz: Math.cos(a) * .1, rx: Math.sin(a) * .1 });
      leaves.push({ geometry: cone(.03, .31, 5), x: Math.sin(a) * (r + .05), y: .67 + Math.sin(i * 1.5) * .045, z: Math.cos(a) * (r + .05), rz: -Math.sin(a) * .3, rx: Math.cos(a) * .3 });
    }
    bindings.push({ geometry: new THREE.TorusGeometry(.115, .025, 5, 12), y: .35, rx: Math.PI / 2 }, { geometry: new THREE.TorusGeometry(.11, .018, 5, 12), y: .44, rx: Math.PI / 2 });
    group.add(batch(stems, m.wood), batch(leaves, m.youngLeaf), batch(bindings, m.leather)); group.rotation.z = .25;
  } else {
    const crystals: Part[] = [];
    for (let i = 0; i < 5; i++) { const a = i * 2.399, r = i === 0 ? 0 : .22; crystals.push({ geometry: new THREE.OctahedronGeometry(1), x: Math.sin(a) * r, y: i === 0 ? .68 : .4, z: Math.cos(a) * r, sx: i === 0 ? .18 : .12, sy: i === 0 ? .66 : .39, sz: i === 0 ? .18 : .12, rz: i === 0 ? .08 : Math.sin(a) * .35, rx: i === 0 ? -.07 : Math.cos(a) * .35 }); }
    const quartz = material('islandQuartz', 0x89ccbd, 'ground', { emissive: 0x1b514a, emissiveIntensity: .48, roughness: .25, metalness: .34 });
    group.add(batch(crystals, quartz)); return group;
  }
  return paintedProp(group);
}

export function createRelic(index: number) {
  const group = new THREE.Group(); const m = mats(); group.name = `Ancient relic ${index + 1}`;
  const pedestal = mesh(cylinder(.58, .76, .45, 8), m.darkStone, 0, .225, 0); group.add(pedestal);
  group.add(mesh(cylinder(.62, .62, .08, 8), m.gold, 0, .47, 0));
  const core = mesh(new THREE.OctahedronGeometry(.35), m.rune, 0, 1.15, 0); core.name = 'relicCrystal'; core.scale.set(.75, 1.4, .75); group.add(core);
  const ring = mesh(new THREE.TorusGeometry(.48, .035, 5, 28), m.gold, 0, 1.15, 0); ring.rotation.x = .38; ring.rotation.y = index * .8; ring.name = 'relicRing'; group.add(ring);
  const glow = new THREE.PointLight(0x5cdfd6, 2.2, 5, 2); glow.position.y = 1.5; group.add(glow);
  group.userData.float = core; group.userData.spin = ring; return group;
}

/** Articulated explorer with wool coat, cuirass, scarf, bedroll and working axe. */
export function createCharacter() {
  const g = new THREE.Group(); const m = mats(); g.name = 'Explorer';
  const torso = mesh(cylinder(.27, .32, .66, 10), m.cloth, 0, 1.15, 0, 1.1, 1, .68); g.add(torso);
  g.add(mesh(cylinder(.28, .29, .39, 10), m.leather, 0, 1.25, .016, 1.08, 1, .72));
  g.add(mesh(cylinder(.3, .31, .055, 10), m.black, 0, .94, 0, 1.08, 1, .76));
  g.add(mesh(box(.08, .06, .035), m.gold, 0, .94, .245));
  const coat = new THREE.ConeGeometry(.4, .4, 10, 1, true); g.add(mesh(coat, m.cloth, 0, .87, 0, 1, 1, .71));
  const head = new THREE.Group(); head.position.y = 1.62; head.name = 'head';
  head.add(mesh(sphere(.19, 12), m.skin, 0, .04, .01, .85, 1.12, .9));
  head.add(mesh(sphere(.197, 12), m.leather, 0, .12, -.028, .9, .82, .86));
  head.add(mesh(box(.13, .045, .05), m.leather, 0, .165, .136));
  head.add(batch([{ geometry: sphere(.025, 6), x: -.065, y: .065, z: .168, sy: .57 }, { geometry: sphere(.025, 6), x: .065, y: .065, z: .168, sy: .57 }], m.black));
  head.add(mesh(sphere(.038, 7), m.skin, 0, .008, .183, .65, .9, .8)); g.add(head);
  g.add(mesh(new THREE.TorusGeometry(.17, .059, 5, 14), m.red, 0, 1.5, 0)); g.children[g.children.length - 1].rotation.x = Math.PI / 2;
  g.add(mesh(box(.085, .29, .04), m.red, -.14, 1.34, .232));
  const pack = mesh(box(.31, .4, .16), m.leather, 0, 1.17, -.25); g.add(pack);
  g.add(mesh(cylinder(.075, .075, .4, 9), m.cloth, 0, 1.44, -.25)); g.children[g.children.length - 1].rotation.z = Math.PI / 2;
  g.add(batch([{ geometry: box(.035, .56, .035), x: -.18, y: 1.23, z: .196, rz: -.16 }, { geometry: box(.035, .56, .035), x: .18, y: 1.23, z: .196, rz: .16 }], m.leather));
  for (const side of [-1, 1]) {
    const leg = new THREE.Group(); leg.name = side < 0 ? 'leftLeg' : 'rightLeg'; leg.position.set(side * .145, .83, 0);
    leg.add(mesh(cylinder(.1, .085, .43, 7), m.leather, 0, -.2, 0));
    leg.add(mesh(cylinder(.085, .075, .25, 7), m.black, 0, -.51, 0));
    leg.add(mesh(box(.17, .13, .3), m.leather, 0, -.73, .065));
    leg.add(mesh(box(.175, .035, .305), m.black, 0, -.8, .065));
    g.add(leg);
    const arm = new THREE.Group(); arm.name = side < 0 ? 'leftArm' : 'rightArm'; arm.position.set(side * .335, 1.43, 0);
    arm.add(mesh(sphere(.13, 8), m.cloth, 0, -.035, 0, 1, .86, 1));
    arm.add(mesh(cylinder(.085, .072, .39, 7), m.cloth, side * .035, -.24, .025));
    arm.add(mesh(cylinder(.077, .073, .17, 7), m.leather, side * .035, -.48, .025));
    arm.add(mesh(sphere(.078, 8), m.skin, side * .035, -.59, .025, .8, 1, .85));
    g.add(arm);
  }
  const weapon = new THREE.Group(); weapon.name = 'weapon'; weapon.position.set(.04, -.55, .08);
  const axeModel = new THREE.Group(); axeModel.name = 'axeModel';
  axeModel.add(mesh(cylinder(.022, .025, .6, 6), m.wood, 0, .1, .045));
  const axe = mesh(box(.23, .19, .055), m.darkStone, -.073, .37, .045); axe.rotation.z = -.13; axe.name = 'axeHead'; axeModel.add(axe); weapon.add(axeModel);
  const pickaxeModel = new THREE.Group(); pickaxeModel.name = 'pickaxeModel'; pickaxeModel.visible = false;
  pickaxeModel.add(mesh(cylinder(.022, .025, .65, 6), m.wood, 0, .1, .045));
  const pickPath = new THREE.CatmullRomCurve3([new THREE.Vector3(-.28, .35, .045), new THREE.Vector3(-.17, .43, .045), new THREE.Vector3(0, .47, .045), new THREE.Vector3(.2, .41, .045), new THREE.Vector3(.31, .33, .045)]);
  pickaxeModel.add(mesh(new THREE.TubeGeometry(pickPath, 8, .025, 5, false), m.darkStone)); weapon.add(pickaxeModel);
  const sword = new THREE.Group(); sword.name = 'swordModel'; sword.visible = false;
  sword.add(mesh(cylinder(.025, .026, .21, 6), m.leather, 0, .13, .045));
  sword.add(mesh(sphere(.044, 6), m.gold, 0, .035, .045));
  const shape = new THREE.Shape(); shape.moveTo(-.048, 0); shape.lineTo(-.048, .58); shape.lineTo(0, .77); shape.lineTo(.048, .58); shape.lineTo(.048, 0); shape.closePath();
  const blade = mesh(new THREE.ExtrudeGeometry(shape, { depth: .028, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .009, bevelThickness: .009 }), m.blade, 0, .25, .023); sword.add(blade);
  sword.add(mesh(box(.23, .035, .06), m.gold, 0, .245, .038)); weapon.add(sword);
  g.getObjectByName('rightArm')!.add(weapon); g.userData.asset = 'explorer'; return g;
}

export function createEnemy(type: 'wolf' | 'shade' | 'dragon') {
  const g = new THREE.Group(); const m = mats(); g.name = type;
  if (type === 'wolf') {
    g.add(mesh(sphere(.57, 12), m.fur, 0, .74, -.1, .67, .72, 1.7));
    g.add(mesh(sphere(.37, 10), m.cream, 0, .82, .47, .91, 1.1, 1));
    const head = new THREE.Group(); head.name = 'head'; head.position.set(0, 1.13, .62);
    head.add(mesh(sphere(.28, 10), m.fur, 0, 0, .075, .85, .96, 1.12));
    head.add(mesh(cylinder(.13, .19, .39, 7), m.cream, 0, -.06, .31)); head.children[1].rotation.x = Math.PI / 2;
    head.add(mesh(sphere(.105, 7), m.black, 0, -.05, .5, 1, .75, .6));
    head.add(batch([{ geometry: cone(.115, .28, 5), x: -.18, y: .26, z: .025, rz: -.18 }, { geometry: cone(.115, .28, 5), x: .18, y: .26, z: .025, rz: .18 }], m.fur));
    head.add(batch([{ geometry: sphere(.035, 6), x: -.19, y: .045, z: .255 }, { geometry: sphere(.035, 6), x: .19, y: .045, z: .255 }], m.eye)); g.add(head);
    for (let i = 0; i < 4; i++) { const leg = new THREE.Group(); leg.name = ['leftLeg', 'rightLeg', 'backLeftLeg', 'backRightLeg'][i]; leg.position.set(i % 2 ? .25 : -.25, .67, i < 2 ? .43 : -.57); leg.add(mesh(cylinder(.085, .055, .55, 7), m.fur, 0, -.26, 0)); leg.add(mesh(sphere(.11, 6), m.black, 0, -.6, .04, .85, .5, 1.4)); g.add(leg); }
    const tail = mesh(cone(.16, .83, 7), m.fur, 0, .7, -.95); tail.rotation.x = -1.2; tail.name = 'tail'; g.add(tail);
  } else if (type === 'shade') {
    g.add(mesh(cone(.45, 1.4, 10), m.black, 0, .79, 0, 1, 1, .7));
    const hood = mesh(sphere(.3, 10), m.darkStone, 0, 1.6, 0, 1, 1.15, .85); g.add(hood);
    g.add(mesh(sphere(.235, 9), m.black, 0, 1.59, .135, 1, 1, .6));
    g.add(batch([{ geometry: sphere(.04, 6), x: -.082, y: 1.64, z: .272, sy: .46 }, { geometry: sphere(.04, 6), x: .082, y: 1.64, z: .272, sy: .46 }], m.rune));
    for (const side of [-1, 1]) { const arm = new THREE.Group(); arm.name = side < 0 ? 'leftArm' : 'rightArm'; arm.position.set(side * .28, 1.32, 0); arm.add(mesh(cone(.125, .75, 7), m.darkStone, side * .12, -.29, .06)); g.add(arm); }
    const tatters: Part[] = []; for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; tatters.push({ geometry: cone(.09, .7, 4), x: Math.cos(a) * .28, y: .18, z: Math.sin(a) * .19, rz: .1 * Math.sin(a) }); } g.add(batch(tatters, m.darkStone));
    g.add(new THREE.PointLight(0x45dcc0, .7, 3));
  } else {
    g.add(mesh(sphere(1, 14), m.dragon, 0, 1.85, -.22, .86, .95, 1.75));
    g.add(mesh(sphere(.72, 12), m.cream, 0, 1.65, .72, .85, 1.17, 1.05));
    const neck = mesh(cylinder(.34, .62, 1.65, 12), m.dragon, 0, 2.6, 1.02); neck.rotation.x = .54; g.add(neck);
    const head = new THREE.Group(); head.name = 'head'; head.position.set(0, 3.38, 1.58);
    head.add(mesh(sphere(.57, 12), m.dragon, 0, 0, .1, 1, .67, 1.35));
    head.add(mesh(box(.69, .22, .75), m.dragon, 0, -.18, .62));
    const jaw = mesh(box(.66, .12, .69), m.darkStone, 0, -.32, .6); jaw.name = 'jaw'; head.add(jaw);
    head.add(batch([{ geometry: sphere(.065, 7), x: -.48, y: .015, z: .36 }, { geometry: sphere(.065, 7), x: .48, y: .015, z: .36 }], m.eye));
    head.add(batch([{ geometry: cone(.11, .7, 7), x: -.4, y: .46, z: -.22, rx: -.7, rz: -.3 }, { geometry: cone(.11, .7, 7), x: .4, y: .46, z: -.22, rx: -.7, rz: .3 }], m.paleStone));
    const teeth: Part[] = []; for (let i = 0; i < 8; i++) teeth.push({ geometry: cone(.032, .11, 5), x: i < 4 ? -.28 : .28, y: -.26, z: .32 + (i % 4) * .16, rx: Math.PI }); head.add(batch(teeth, m.paleStone)); g.add(head);
    for (let i = 0; i < 4; i++) { const limb = new THREE.Group(); limb.name = ['leftLeg', 'rightLeg', 'backLeftLeg', 'backRightLeg'][i]; limb.position.set(i % 2 ? .7 : -.7, 1.42, i < 2 ? .75 : -1.19); const leg = mesh(cylinder(.22, .33, 1.2, 9), m.dragon, i % 2 ? .13 : -.13, -.47, .12); leg.rotation.z = i % 2 ? -.2 : .2; limb.add(leg); limb.add(mesh(sphere(.31, 9), m.dragon, i % 2 ? .22 : -.22, -1.12, .35, 1, .45, 1.5)); const claws: Part[] = []; for (let j = 0; j < 3; j++) claws.push({ geometry: cone(.06, .3, 6), x: (i % 2 ? .22 : -.22) + (j - 1) * .14, y: -1.15, z: .78, rx: Math.PI / 2 }); limb.add(batch(claws, m.paleStone)); g.add(limb); }
    for (const side of [-1, 1]) {
      const wing = new THREE.Group(); wing.name = side < 0 ? 'leftWing' : 'rightWing'; wing.position.set(side * .64, 2.5, -.25);
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(side * 1.35, 1.4, -.1), new THREE.Vector3(side * 3.9, .47, -.52), new THREE.Vector3(side * 2.6, -.3, -1.32), new THREE.Vector3(side * 1.5, -.42, -1.68), new THREE.Vector3(0, -.4, -.72)];
      const geometry = new THREE.BufferGeometry(); const positions: number[] = [], uvs: number[] = [];
      for (let i = 1; i < points.length - 1; i++) for (const p of [points[0], points[i], points[i + 1]]) { positions.push(p.x, p.y, p.z); uvs.push(Math.abs(p.x) / 4, -p.z / 2); }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.computeVertexNormals(); wing.add(mesh(geometry, m.wing));
      for (let i = 1; i < points.length; i++) { const start = i === 2 ? points[1] : points[0]; const end = points[i]; const direction = new THREE.Vector3().subVectors(end, start); const rib = mesh(cylinder(.035, .07, direction.length(), 6), m.dragon); rib.position.copy(start).add(end).multiplyScalar(.5); rib.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()); wing.add(rib); }
      g.add(wing);
    }
    const tail = new THREE.Group(); tail.name = 'tail'; tail.position.set(0, 1.54, -1.55); const path = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(.17, -.2, -1), new THREE.Vector3(.55, -.62, -2), new THREE.Vector3(1.16, -.9, -3)]); tail.add(mesh(new THREE.TubeGeometry(path, 12, .18, 7, false), m.dragon)); tail.add(mesh(cone(.27, .55, 6), m.paleStone, 1.16, -.9, -3)); tail.children[1].rotation.x = -Math.PI / 2; g.add(tail);
    const ridge: Part[] = []; for (let i = 0; i < 9; i++) ridge.push({ geometry: cone(.13, .48 - i * .024, 5), x: 0, y: 2.69 - i * .05, z: 1.15 - i * .36, rx: -.33 }); g.add(batch(ridge, m.paleStone));
    g.userData.asset = 'bossDragon';
  }
  return g;
}

export function createBuildPiece(kind: BuildKind) {
  const g = new THREE.Group(); const m = mats(); g.name = kind;
  const planks: Part[] = [], beams: Part[] = [];
  if (kind === 'floor') {
    for (let i = 0; i < 10; i++) planks.push({ geometry: box(2.98, .11, .297), x: 0, y: .11, z: -1.35 + i * .3 });
    beams.push({ geometry: box(.14, .22, 3), x: -1.1, y: 0 }, { geometry: box(.14, .22, 3), x: 1.1, y: 0 });
  } else if (kind === 'wall') {
    for (let i = 0; i < 10; i++) planks.push({ geometry: box(.298, 2.25, .1), x: -1.35 + i * .3, y: 1.25 });
    beams.push({ geometry: box(3, .16, .15), y: .27 }, { geometry: box(3, .16, .15), y: 2.35 }, { geometry: box(.14, 2.4, .17), x: -1.44, y: 1.2 }, { geometry: box(.14, 2.4, .17), x: 1.44, y: 1.2 });
  } else if (kind === 'door') {
    beams.push({ geometry: box(.12, 2.4, .2), x: -.73, y: 1.2 }, { geometry: box(.12, 2.4, .2), x: .73, y: 1.2 }, { geometry: box(3, .18, .2), y: 2.35 }, { geometry: box(.12, 2.4, .2), x: -1.44, y: 1.2 }, { geometry: box(.12, 2.4, .2), x: 1.44, y: 1.2 });
    for (const side of [-1, 1]) for (let i = 0; i < 3; i++) planks.push({ geometry: box(.22, 2.25, .1), x: side * (.84 + i * .23), y: 1.25 });
    const panel = new THREE.Group(); panel.name = 'doorPanel'; panel.position.set(-.67, 0, 0);
    const doorPlanks: Part[] = []; for (let i = 0; i < 5; i++) doorPlanks.push({ geometry: box(.259, 2.16, .09), x: .135 + i * .26, y: 1.17 });
    panel.add(batch(doorPlanks, m.wood));
    panel.add(mesh(sphere(.055, 6), m.metal, 1.14, 1.17, .08));
    panel.add(batch([{ geometry: box(1.31, .07, .08), x: .66, y: .63, z: .06 }, { geometry: box(1.31, .07, .08), x: .66, y: 1.76, z: .06 }], m.metal));
    g.add(panel);
  } else if (kind === 'roof') {
    const roofMat = material('roofThatch', 0x84795b, 'wood');
    for (const side of [-1, 1]) { const roof = mesh(box(1.97, .12, 3.3), roofMat, side * .81, 2.94, 0); roof.rotation.z = -side * .57; g.add(roof); }
    beams.push({ geometry: box(.15, .15, 3.35), y: 3.48 }, { geometry: box(3.3, .12, .12), y: 2.4, z: -1.5 }, { geometry: box(3.3, .12, .12), y: 2.4, z: 1.5 });
  } else {
    const stones: Part[] = []; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; stones.push({ geometry: ruggedGeometry(.2, 0), x: Math.sin(a) * .51, y: .12, z: Math.cos(a) * .51, sy: .7 }); }
    g.add(batch(stones, m.darkStone));
    for (let i = 0; i < 3; i++) { const log = mesh(cylinder(.09, .1, .75, 7), m.bark, 0, .15, 0); log.rotation.set(Math.PI / 2, 0, i * Math.PI / 3); g.add(log); }
    const flameMat = material('campfireFlame', 0xffb34c, undefined, { emissive: 0xff7b23, emissiveIntensity: 2.4, transparent: true, opacity: .88 });
    const flame = mesh(cone(.25, .71, 8), flameMat, 0, .53, 0); flame.name = 'flame'; g.add(flame);
    const light = new THREE.PointLight(0xffb46a, 2.5, 9, 2); light.position.y = 1; g.add(light); g.userData.flame = flame;
  }
  if (planks.length) g.add(batch(planks, m.wood)); if (beams.length) g.add(batch(beams, m.bark)); return g;
}

function createLighthouse() {
  const g = new THREE.Group(); g.name = 'Old lighthouse'; const m = mats();
  g.add(mesh(cylinder(2.28, 2.6, .55, 16), m.darkStone, 0, .27, 0));
  const towerMasonry = material('lighthouseMasonry', 0xbfc3b1, 'masonry'); towerMasonry.map!.repeat.set(2, 5);
  g.add(mesh(cylinder(1.12, 1.98, 9.5, 20), towerMasonry, 0, 5.17, 0));
  const rings: Part[] = []; for (let i = 0; i < 5; i++) rings.push({ geometry: cylinder(1.93 - i * .16, 1.95 - i * .16, .14, 20), y: .81 + i * 1.67 }); g.add(batch(rings, m.stone));
  const windows: Part[] = []; for (let i = 0; i < 4; i++) windows.push({ geometry: box(.31, .7, .1), y: 2.3 + i * 1.7, z: 1.83 - i * .145 }); g.add(batch(windows, m.black));
  const door = mesh(box(.91, 1.9, .2), m.bark, 0, 1.48, 1.87); g.add(door);
  g.add(mesh(box(1.12, .16, .38), m.stone, 0, 2.5, 1.84));
  g.add(mesh(cylinder(1.7, 1.55, .22, 20), m.darkStone, 0, 10, 0));
  const rail: Part[] = []; for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; rail.push({ geometry: cylinder(.025, .025, .73, 5), x: Math.cos(a) * 1.6, y: 10.44, z: Math.sin(a) * 1.6 }); }
  g.add(batch(rail, m.metal)); const balcony = mesh(new THREE.TorusGeometry(1.61, .035, 5, 32), m.metal, 0, 10.81, 0); balcony.rotation.x = Math.PI / 2; g.add(balcony);
  const pillars: Part[] = []; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; pillars.push({ geometry: cylinder(.04, .05, 1.75, 6), x: Math.cos(a), y: 11.02, z: Math.sin(a) }); } g.add(batch(pillars, m.metal));
  const roof = mesh(cone(1.47, .7, 16), material('copperRoof', 0x516b62, 'metal', { metalness: .57, roughness: .52 }), 0, 12.17, 0); g.add(roof);
  g.add(mesh(cone(.11, .55, 6), m.gold, 0, 12.73, 0));
  const lantern = mesh(cylinder(.38, .38, 1, 12), material('lantern', 0xfbc57f, undefined, { emissive: 0xffb468, emissiveIntensity: 2.8 }), 0, 11.1, 0); lantern.name = 'lantern'; lantern.visible = false; g.add(lantern);
  const glow = new THREE.PointLight(0xffc98b, 0, 30, 2); glow.position.y = 11.1; g.add(glow);
  const beamMaterial = new THREE.MeshBasicMaterial({ color: 0xffd6a2, transparent: true, opacity: .075, depthWrite: false, side: THREE.DoubleSide });
  const beam = mesh(cone(8, 60, 20), beamMaterial); beam.rotation.z = Math.PI / 2; beam.position.set(30, 11.1, 0); beam.visible = false; beam.castShadow = false;
  const beamGroup = new THREE.Group(); beamGroup.add(beam); g.add(beamGroup);
  const rubble = new THREE.Group(); rubble.name = 'repairDebris';
  for (let i = 0; i < 7; i++) { const a = i * 2.399; rubble.add(mesh(ruggedGeometry(.32, 0), m.paleStone, Math.cos(a) * (2.4 + i * .07), .15, Math.sin(a) * (2.4 + i * .07), 1, .65, 1)); } g.add(rubble);
  g.userData.lantern = lantern; g.userData.light = glow; g.userData.beam = beam; g.userData.beamGroup = beamGroup; g.userData.debris = rubble;
  return g;
}

function createTemple(sceneRoot: THREE.Group, colliders: EnvironmentCollider[]) {
  const m = mats(); const temple = new THREE.Group(); temple.name = 'Temple of the tide'; temple.position.set(0, terrainHeight(0, -42), -42);
  const floor = mesh(box(17, .65, 19), m.darkStone, 0, -.1, -2); temple.add(floor);
  const step = mesh(box(9, .25, 4), m.paleStone, 0, -.07, 7.5); temple.add(step);
  const pillars: Part[] = [], crowns: Part[] = [];
  for (const side of [-1, 1]) for (let i = 0; i < 5; i++) {
    const height = i === 3 && side === -1 ? 2.6 : 5.5;
    pillars.push({ geometry: cylinder(.55, .66, height, 12), x: side * 6.3, y: height * .5, z: 5.5 - i * 3.4 });
    colliders.push({ x: side * 6.3, z: -36.5 - i * 3.4, radius: .67 });
    crowns.push({ geometry: box(1.65, .32, 1.65), x: side * 6.3, y: .16, z: 5.5 - i * 3.4 });
    if (height > 3) crowns.push({ geometry: box(1.65, .43, 1.65), x: side * 6.3, y: 5.5, z: 5.5 - i * 3.4 });
  }
  temple.add(batch(pillars, m.paleStone), batch(crowns, m.stone));
  temple.add(mesh(box(15.3, .8, 2.1), m.darkStone, 0, 5.76, 5.5));
  const pediment = new THREE.Shape(); pediment.moveTo(-7.6, 0); pediment.lineTo(7.6, 0); pediment.lineTo(0, 2.45); pediment.closePath(); temple.add(mesh(new THREE.ExtrudeGeometry(pediment, { depth: .65, bevelEnabled: false }), m.stone, 0, 6.15, 5.4));
  temple.add(mesh(new THREE.TorusGeometry(.85, .09, 7, 28), m.gold, 0, 7.15, 6.12));
  temple.add(mesh(new THREE.OctahedronGeometry(.46), m.rune, 0, 7.15, 6.17));
  const walls: Part[] = [{ geometry: box(17, 4.8, .8), y: 2.25, z: -11.5 }, { geometry: box(.7, 2, 8), x: -7.85, y: .85, z: -6 }, { geometry: box(.7, 3.3, 9), x: 7.85, y: 1.5, z: -5.5 }]; temple.add(batch(walls, m.darkStone));
  // Front masonry leaves a real 4.4 m doorway and matches simulation's side blockers.
  temple.add(batch([{ geometry: box(5.65, 3.4, .65), x: -5.025, y: 1.7, z: 6 }, { geometry: box(5.65, 3.4, .65), x: 5.025, y: 1.7, z: 6 }], m.stone));
  temple.add(batch([{ geometry: box(5.9, .23, .85), x: -5.025, y: 3.4, z: 6 }, { geometry: box(5.9, .23, .85), x: 5.025, y: 3.4, z: 6 }], m.paleStone));
  const door = new THREE.Group(); door.name = 'Ancient temple gate'; door.position.set(0, terrainHeight(0, -36), -36);
  door.add(mesh(box(4.4, 4.5, .6), m.darkStone, 0, 2.3, 0));
  door.add(mesh(new THREE.TorusGeometry(.69, .055, 5, 24), m.gold, 0, 2.44, .34));
  const glyphs: Part[] = []; for (let i = 0; i < 3; i++) glyphs.push({ geometry: new THREE.OctahedronGeometry(.19), x: (i - 1) * .94, y: 2.46, z: .34, sy: 1.7 }); door.add(batch(glyphs, m.rune));
  const border: Part[] = [{ geometry: box(.23, 4.4, .2), x: -1.86, y: 2.3, z: .35 }, { geometry: box(.23, 4.4, .2), x: 1.86, y: 2.3, z: .35 }, { geometry: box(3.95, .23, .2), y: 4.37, z: .35 }]; door.add(batch(border, m.gold));
  for (const side of [-1, 1]) {
    const flame = mesh(new THREE.OctahedronGeometry(.19), m.rune, side * 4.65, 2.2, 5.8); temple.add(flame); const lamp = new THREE.PointLight(0x7ae8d6, 1.3, 8, 2); lamp.position.set(side * 4.65, 2.4, 5.8); temple.add(lamp);
    temple.add(mesh(cylinder(.13, .2, 1.8, 7), m.metal, side * 4.65, 1.05, 5.8));
  }
  const altar = mesh(cylinder(1.18, 1.5, .65, 8), m.darkStone, 0, .35, -8); temple.add(altar); temple.add(mesh(new THREE.TorusGeometry(1, .045, 5, 28), m.rune, 0, .71, -8)); temple.children[temple.children.length - 1].rotation.x = Math.PI / 2;
  sceneRoot.add(temple, door); return door;
}

function terrainMesh() {
  const geo = new THREE.PlaneGeometry(156, 156, 120, 120); geo.rotateX(-Math.PI / 2);
  const p = geo.getAttribute('position'); const colors = new Float32Array(p.count * 3); const color = new THREE.Color();
  const sand = new THREE.Color(0xb9b18c), grass = new THREE.Color(0x607d53), moss = new THREE.Color(0x73866a), rock = new THREE.Color(0x797f78);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), h = terrainHeight(x, z); p.setY(i, h);
    const slope = Math.abs(terrainHeight(x + .9, z) - terrainHeight(x - .9, z)) + Math.abs(terrainHeight(x, z + .9) - terrainHeight(x, z - .9));
    color.copy(sand).lerp(grass, THREE.MathUtils.smoothstep(h, .35, 2.2));
    color.lerp(moss, Math.max(0, Math.sin(x * .11 + z * .09)) * .26);
    color.lerp(rock, Math.min(.85, THREE.MathUtils.smoothstep(slope, .65, 2.1) + Math.max(0, h - 6) * .09));
    color.multiplyScalar(.89 + fractal(x, z) * .2); color.toArray(colors, i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3)); geo.computeVertexNormals();
  const groundMap = texture('ground', 256); groundMap.repeat.set(42, 42);
  return mesh(geo, new THREE.MeshStandardMaterial({ map: groundMap, vertexColors: true, roughness: .99, metalness: 0 }));
}

function sea() {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uDaylight: { value: 1 }, uSun: { value: new THREE.Vector3(25, 45, -20) } },
    vertexShader: `varying vec3 vWorld; varying vec3 vNormal; uniform float uTime;
      void main(){ vec3 p=position; float a=p.x*.15+uTime*.65; float b=p.z*.22-uTime*.4;
      p.z+=sin(a)*.11+sin(b)*.065; vec4 w=modelMatrix*vec4(p,1.); vWorld=w.xyz;
      vNormal=normalize(vec3(-cos(a)*.0165,1.,-cos(b)*.0143)); gl_Position=projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `varying vec3 vWorld; varying vec3 vNormal; uniform float uTime; uniform float uDaylight; uniform vec3 uSun;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      void main(){vec3 n=normalize(vNormal+vec3(sin(vWorld.z*.66+uTime)*.024,0.,cos(vWorld.x*.47-uTime)*.023));
      vec3 viewDir=normalize(cameraPosition-vWorld); float fresnel=pow(1.-max(0.,dot(n,viewDir)),3.);
      vec3 deep=mix(vec3(.014,.04,.062),vec3(.045,.23,.26),uDaylight);
      vec3 reflected=mix(vec3(.09,.15,.23),vec3(.47,.68,.72),uDaylight); vec3 c=mix(deep,reflected,fresnel*.73);
      vec3 l=normalize(uSun-vWorld); float sparkle=pow(max(0.,dot(reflect(-l,n),viewDir)),160.);
      c+=vec3(1.,.86,.62)*sparkle*uDaylight*.8;
      float lines=pow(max(0.,sin(vWorld.x*.5+vWorld.z*.34+sin(vWorld.z*.2-uTime)*2.)),28.);
      c+=vec3(.10,.16,.15)*lines*.26*uDaylight;
      gl_FragColor=vec4(c,1.); }`,
  });
  const water = mesh(new THREE.PlaneGeometry(500, 500, 64, 64), mat, 0, .04, 0); water.rotation.x = -Math.PI / 2; water.castShadow = false; return water;
}

function sky() {
  const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
    uniforms: { uDaylight: { value: 1 }, uSunDirection: { value: new THREE.Vector3(.4, .65, -.6).normalize() }, uTime: { value: 0 } },
    vertexShader: `varying vec3 vDir; void main(){vDir=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec3 vDir; uniform float uDaylight; uniform vec3 uSunDirection; uniform float uTime;
      float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,85.6)))*43758.5453);}
      void main(){vec3 d=normalize(vDir); float h=max(0.,d.y); vec3 day=mix(vec3(.76,.80,.69),vec3(.22,.44,.59),pow(h,.42));
      vec3 night=mix(vec3(.095,.13,.20),vec3(.014,.028,.073),pow(h,.5)); vec3 c=mix(night,day,uDaylight);
      float glow=pow(max(0.,dot(d,uSunDirection)),14.); c+=vec3(1.,.65,.29)*glow*uDaylight*.19;
      float sun=smoothstep(.99935,.99975,dot(d,uSunDirection)); c+=vec3(1.,.92,.72)*sun*uDaylight*1.5;
      vec3 cell=floor(d*390.); float star=step(.9977,hash(cell))*pow(max(0.,1.-length(fract(d*390.)-.5)*1.7),5.);
      c+=vec3(.72,.84,1.)*star*(1.-uDaylight)*step(.05,d.y);
      float moon=smoothstep(.9992,.99965,dot(d,normalize(vec3(-.55,.58,.15)))); c+=vec3(.60,.74,.90)*moon*(1.-uDaylight);
      gl_FragColor=vec4(c,1.); }`,
  });
  const s = mesh(new THREE.SphereGeometry(220, 32, 18), mat, 0, 0, 0); s.castShadow = false; s.receiveShadow = false; s.renderOrder = -100; return s;
}

function decorate(root: THREE.Group, seed: number, colliders: EnvironmentCollider[], occupied: readonly OccupiedPosition[]) {
  const rand = rng(seed); const m = mats(); const matrix = new THREE.Matrix4(); const rotation = new THREE.Quaternion(); const scale = new THREE.Vector3(); const position = new THREE.Vector3();
  const safe = (x: number, z: number) => Math.hypot(x, z) > 9 && Math.hypot(x, z - 34) > 9 && Math.hypot(x, z + 42) > 14 && Math.hypot(x + 38, z + 12) > 5 && Math.hypot(x - 37, z + 20) > 5 && Math.hypot(x - 29, z - 35) > 5;
  const clear = (x: number, z: number, radius: number) => safe(x, z) && !occupied.some(p => Math.hypot(p.x - x, p.z - z) < radius + (p.type === 'tree' ? .5 : p.type === 'rock' ? 1.2 : .5) + .65);
  const grassGeometry = new THREE.BufferGeometry();
  grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-.13, 0, 0, .13, 0, 0, -.04, .65, .09, 0, 0, -.11, 0, 0, .11, .11, .52, 0], 3));
  grassGeometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, .3, 1, 0, 0, 1, 0, .7, 1], 2)); grassGeometry.computeVertexNormals();
  const grassMat = material('wildGrass', 0x718457, 'leaf', { side: THREE.DoubleSide });
  const count = 1450; const grass = new THREE.InstancedMesh(grassGeometry, grassMat, count); grass.receiveShadow = true;
  for (let i = 0; i < count; i++) {
    let x = (rand() - .5) * 128, z = (rand() - .5) * 128, y = terrainHeight(x, z);
    for (let tries = 0; tries < 8 && (y < 1.55 || Math.hypot(x, z) > 62 || !safe(x, z)); tries++) { x = (rand() - .5) * 126; z = (rand() - .5) * 126; y = terrainHeight(x, z); }
    if (y < 1.5 || !safe(x, z)) { scale.setScalar(0); } else { const s = .6 + rand() * .75; scale.set(s, s * (.55 + rand()), s); }
    position.set(x, y, z); rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * TAU); matrix.compose(position, rotation, scale); grass.setMatrixAt(i, matrix);
  }
  root.add(grass);
  // Understory is one draw call, rather than hundreds of individual fern leaves.
  const fronds: Part[] = [];
  for (let j = 0; j < 7; j++) {
    const a = j / 7 * TAU; const f = new THREE.PlaneGeometry(.18, .85, 1, 3); const p = f.getAttribute('position');
    for (let k = 0; k < p.count; k++) { const y = (p.getY(k) + .425); p.setX(k, p.getX(k) * Math.sin(y / .85 * Math.PI)); p.setY(k, y); p.setZ(k, -y * y * .58); }
    f.computeVertexNormals(); fronds.push({ geometry: f, ry: a, rx: -.5 });
  }
  const fernGeometry = batch(fronds, m.leaf).geometry; const ferns = new THREE.InstancedMesh(fernGeometry, material('ferns', 0x3e6348, 'leaf', { side: THREE.DoubleSide }), 140);
  for (let i = 0; i < 140; i++) { const a = rand() * TAU, r = 18 + rand() * 35, x = Math.sin(a) * r, z = Math.cos(a) * r; const s = safe(x, z) && terrainHeight(x, z) > 2 ? .6 + rand() * .7 : 0; matrix.compose(new THREE.Vector3(x, terrainHeight(x, z), z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a), new THREE.Vector3(s, s, s)); ferns.setMatrixAt(i, matrix); } root.add(ferns);
  // Distant painted trees share one buffer and one draw call via instancing.
  const tree = createTree(3); const treeMesh = tree.children[0] as THREE.Mesh;
  const forest = new THREE.InstancedMesh(treeMesh.geometry, treeMesh.material, 55); forest.castShadow = true; forest.receiveShadow = true;
  for (let i = 0; i < 55; i++) {
    const a = rand() * TAU, r = 25 + rand() * 30, x = Math.sin(a) * r, z = Math.cos(a) * r, y = terrainHeight(x, z); const s = clear(x, z, .45) && y > 1.8 && (Math.abs(x) > 12 || z < -10) ? .55 + rand() * .45 : 0;
    matrix.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a), new THREE.Vector3(s, s * (1 + rand() * .25), s)); forest.setMatrixAt(i, matrix);
    if (s > 0) colliders.push({ x, z, radius: .4 * s });
  }
  root.add(forest);
  // Shore pebbles and coastal rock formations are batched into two materials.
  const pebbleGeometry = ruggedGeometry(.24, 0); const pebbles = new THREE.InstancedMesh(pebbleGeometry, m.stone, 170); pebbles.receiveShadow = true;
  for (let i = 0; i < 170; i++) { const a = rand() * TAU, r = 58 + rand() * 10, x = Math.sin(a) * r, z = Math.cos(a) * r; const y = terrainHeight(x, z); const s = y > .15 ? .5 + rand() * 1.7 : 0; matrix.compose(new THREE.Vector3(x, y + s * .1, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(), a, rand())), new THREE.Vector3(s, s * .4, s)); pebbles.setMatrixAt(i, matrix); } root.add(pebbles);
  const boulders: Part[] = [];
  for (let i = 0; i < 17; i++) {
    const sx = 1.4 + rand() * 1.8, sy = 1.2 + rand() * 2, sz = 1.3 + rand() * 1.6, radius = Math.max(sx, sz) * .81;
    let x = 0, z = 0, found = false;
    for (let attempt = 0; attempt < 40; attempt++) { const a = .78 + rand() * 1.6, r = 48 + rand() * 13; x = Math.sin(a) * r; z = -Math.cos(a) * r; if (clear(x, z, radius) && terrainHeight(x, z) > .8 && !colliders.some(c => Math.hypot(x - c.x, z - c.z) < radius + c.radius + .3)) { found = true; break; } }
    if (!found) continue;
    boulders.push({ geometry: ruggedGeometry(1, 1, i), x, y: terrainHeight(x, z) + .8, z, sx, sy, sz }); colliders.push({ x, z, radius });
  }
  if (boulders.length) root.add(batch(boulders, m.darkStone));
  // Three distinct archaeological landmarks guide the relic search.
  const forestShrine = new THREE.Group(); forestShrine.position.set(-38, terrainHeight(-38, -12), -12);
  forestShrine.add(mesh(new THREE.TorusGeometry(2.1, .32, 7, 24, Math.PI * 1.5), m.darkStone, 0, 1.8, -1.5)); forestShrine.children[0].rotation.z = -.25 * Math.PI;
  for (const side of [-1, 1]) { forestShrine.add(mesh(cylinder(.4, .58, 3.8, 8), m.stone, side * 2.15, 1.9, -1.5)); colliders.push({ x: -38 + side * 2.15, z: -13.5, radius: .58 }); } root.add(forestShrine);
  const stoneCircle: Part[] = []; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; const x = 37 + Math.sin(a) * 3.5, z = -20 + Math.cos(a) * 3.5; if (occupied.some(p => Math.hypot(p.x - x, p.z - z) < (p.type === 'rock' ? 1.2 : .5) + 1)) continue; stoneCircle.push({ geometry: ruggedGeometry(1, 1, i), x, y: terrainHeight(x, z) + 1.15, z, sx: .62, sy: 1.55, sz: .7, rz: Math.sin(i) * .14 }); colliders.push({ x, z, radius: .69 }); } if (stoneCircle.length) root.add(batch(stoneCircle, m.darkStone));
  const wreck = new THREE.Group(); wreck.position.set(29, terrainHeight(29, 35), 35); wreck.rotation.y = .45;
  const ribs: Part[] = []; for (let i = 0; i < 5; i++) for (const side of [-1, 1]) ribs.push({ geometry: box(.1, 1.3, .14), x: side * (.85 + Math.sin(i / 4 * Math.PI) * .4), y: .55, z: -2 + i, rz: -side * .65 });
  ribs.push({ geometry: box(.15, .18, 5.4), y: .07 }, { geometry: cylinder(.085, .13, 3.8, 7), x: -.4, y: 1.6, z: -1, rz: -.34 }); wreck.add(batch(ribs, m.bark)); wreck.add(mesh(box(1.7, .15, 3.6), m.wood, 0, .1, -.1)); root.add(wreck);
  // A gently curved gravel trail provides orientation toward the lighthouse.
  const trail = new THREE.InstancedMesh(ruggedGeometry(.3, 0), m.paleStone, 42);
  for (let i = 0; i < 42; i++) { const z = 4 + i * .73, x = Math.sin(z * .15) * 1.3 + (rand() - .5) * 1.2; matrix.compose(new THREE.Vector3(x, terrainHeight(x, z) + .02, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * TAU), new THREE.Vector3(.5 + rand(), .15, .65 + rand())); trail.setMatrixAt(i, matrix); } root.add(trail);
  const mountains: Part[] = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + .08, r = 113 + rand() * 42; mountains.push({ geometry: ruggedGeometry(1, 1, i + 3), x: Math.cos(a) * r, y: -1, z: Math.sin(a) * r, sx: 9 + rand() * 12, sy: 12 + rand() * 20, sz: 7 + rand() * 13 }); } const distant = batch(mountains, material('distantIslands', 0x53696c, 'stone')); distant.castShadow = false; root.add(distant);
}

export function createWorld(scene: THREE.Scene, seed = 73, occupied: readonly OccupiedPosition[] = []) {
  const root = new THREE.Group(); root.name = 'DraBornLand island'; scene.add(root);
  const terrain = terrainMesh(); root.add(terrain); const water = sea(); root.add(water); const atmosphere = sky(); root.add(atmosphere);
  const sun = new THREE.DirectionalLight(0xffedcf, 3.1); sun.position.set(-35, 62, 18); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -38; sun.shadow.camera.right = 38; sun.shadow.camera.top = 38; sun.shadow.camera.bottom = -38; sun.shadow.camera.near = 1; sun.shadow.camera.far = 180; sun.shadow.bias = -.00035; sun.shadow.normalBias = .04;
  root.add(sun, sun.target); const ambient = new THREE.HemisphereLight(0xb9d5e3, 0x405343, 1.85); root.add(ambient);
  const rim = new THREE.DirectionalLight(0x8aa6ba, .38); rim.position.set(40, 22, -45); root.add(rim);
  const lighthouse = createLighthouse(); lighthouse.position.set(0, terrainHeight(0, 0), 0); root.add(lighthouse);
  const colliders: EnvironmentCollider[] = [];
  const templeGate = createTemple(root, colliders); const gateBaseY = templeGate.position.y; decorate(root, seed, colliders, occupied);
  const fog = new THREE.FogExp2(0x9db7b1, .0075); scene.fog = fog; scene.background = new THREE.Color(0x91afba);
  const clouds = new THREE.Group(); clouds.name = 'Sea clouds';
  const cloudMat = new THREE.MeshBasicMaterial({ color: 0xe4e5d8, transparent: true, opacity: .39, depthWrite: false }); const cloudParts: Part[] = [];
  const random = rng(seed + 5); for (let i = 0; i < 19; i++) { const a = i / 19 * TAU, r = 100 + random() * 30; for (let j = 0; j < 3; j++) cloudParts.push({ geometry: sphere(1, 9), x: Math.sin(a) * r + j * 5, y: 32 + random() * 12, z: Math.cos(a) * r, sx: 7 + random() * 9, sy: 1.2 + random() * 2.4, sz: 4 + random() * 5 }); } clouds.add(batch(cloudParts, cloudMat)); clouds.children[0].castShadow = false; root.add(clouds);
  const seaMaterial = water.material as THREE.ShaderMaterial; const skyMaterial = atmosphere.material as THREE.ShaderMaterial;
  let gateProgress = 0; let previousTime = 0;
  const daySky = new THREE.Color(0x91adb0), nightSky = new THREE.Color(0x101d30); const daySun = new THREE.Color(0xffecc9), duskSun = new THREE.Color(0x9bb7e2);
  function update(time: number, daylight: number, repaired: boolean, templeOpen: boolean) {
    const day = THREE.MathUtils.clamp(daylight, 0, 1), dt = Math.min(.1, Math.max(0, time - previousTime)); previousTime = time;
    sun.intensity = .15 + day * 2.95; sun.color.copy(duskSun).lerp(daySun, day); ambient.intensity = .38 + day * 1.32;
    ambient.color.setHex(day > .35 ? 0xb7d2df : 0x7197c6); rim.intensity = .23 + (1 - day) * .12;
    fog.color.copy(nightSky).lerp(daySky, day); fog.density = .0078 + (1 - day) * .003;
    scene.background = fog.color; skyMaterial.uniforms.uDaylight.value = day; skyMaterial.uniforms.uTime.value = time; skyMaterial.uniforms.uSunDirection.value.copy(sun.position).normalize();
    seaMaterial.uniforms.uTime.value = time; seaMaterial.uniforms.uDaylight.value = day; seaMaterial.uniforms.uSun.value.copy(sun.position);
    cloudMat.color.setHex(day > .4 ? 0xe1e6da : 0x506480); cloudMat.opacity = .12 + day * .27; clouds.rotation.y = time * .0009;
    const data = lighthouse.userData; data.lantern.visible = repaired; data.beam.visible = repaired; data.light.intensity = repaired ? 5 + (1 - day) * 7 : 0; data.beamGroup.rotation.y = time * .18; data.debris.visible = !repaired;
    gateProgress = THREE.MathUtils.damp(gateProgress, templeOpen ? 1 : 0, 2, dt); templeGate.position.y = gateBaseY - gateProgress * 4.7; templeGate.visible = gateProgress < .995;
  }
  update(0, 1, false, false);
  function dispose() {
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    root.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); const a = Array.isArray(object.material) ? object.material : [object.material]; a.forEach(mat => materials.add(mat)); } });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); root.removeFromParent(); sun.shadow.dispose();
  }
  return { sun, ambient, water, lighthouse, templeGate, colliders, update, dispose };
}
