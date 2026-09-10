import * as dkd_fs from 'node:fs';
import * as dkd_crypto from 'node:crypto';
import { XMLParser as dkd_XMLParser } from 'fast-xml-parser';

// Public road geometry only. No addresses, names of residents or private POIs.
const dkd_input = process.argv[2];
if (!dkd_input) throw new Error('Kullanım: node scripts/dkd-import-osm.mjs dosya.osm');
const dkd_xml = dkd_fs.readFileSync(dkd_input, 'utf8');
const dkd_source = new dkd_XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: false }).parse(dkd_xml).osm;
const dkd_array = dkd_value => !dkd_value ? [] : Array.isArray(dkd_value) ? dkd_value : [dkd_value];
const dkd_origin = [39.9195, 32.854];
const dkd_nodes = new Map(dkd_array(dkd_source.node).map(dkd_node => [dkd_node.id, dkd_node]));
const dkd_used = new Map();
const dkd_points = [];
const dkd_roads = [];
const dkd_allowed = new Set(['primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link', 'residential', 'living_street', 'unclassified', 'service']);
function dkd_index(dkd_id) {
  if (dkd_used.has(dkd_id)) return dkd_used.get(dkd_id);
  const dkd_node = dkd_nodes.get(dkd_id);
  const dkd_point = [Math.round((Number(dkd_node.lon) - dkd_origin[1]) * 111320 * Math.cos(dkd_origin[0] * Math.PI / 180) * 10) / 10, Math.round((dkd_origin[0] - Number(dkd_node.lat)) * 111320 * 10) / 10];
  dkd_used.set(dkd_id, dkd_points.length);
  dkd_points.push(dkd_point);
  return dkd_points.length - 1;
}
for (const dkd_way of dkd_array(dkd_source.way)) {
  const dkd_tags = Object.fromEntries(dkd_array(dkd_way.tag).map(dkd_tag => [dkd_tag.k, dkd_tag.v]));
  if (!dkd_allowed.has(dkd_tags.highway) || ['private', 'no'].includes(dkd_tags.access) || dkd_tags.motor_vehicle === 'no' || dkd_tags.tunnel === 'yes') continue;
  const dkd_refs = dkd_array(dkd_way.nd).map(dkd_node => dkd_node.ref);
  for (let dkd_offset = 1; dkd_offset < dkd_refs.length; dkd_offset++) {
    const dkd_pair = [dkd_refs[dkd_offset - 1], dkd_refs[dkd_offset]];
    if (dkd_pair.some(dkd_id => { const dkd_node = dkd_nodes.get(dkd_id); return !dkd_node || Number(dkd_node.lat) < 39.912 || Number(dkd_node.lat) > 39.927 || Number(dkd_node.lon) < 32.845 || Number(dkd_node.lon) > 32.863; })) continue;
    const dkd_width = dkd_tags.highway.startsWith('primary') ? 12 : dkd_tags.highway.startsWith('secondary') ? 10 : dkd_tags.highway === 'service' ? 6 : 8;
    const dkd_direction = dkd_tags.oneway === '-1' ? -1 : (dkd_tags.oneway === 'yes' || dkd_tags.junction === 'roundabout') ? 1 : 0;
    dkd_roads.push({ dkd_from: dkd_index(dkd_pair[0]), dkd_to: dkd_index(dkd_pair[1]), dkd_width, dkd_direction, dkd_name: dkd_tags.name || 'Servis bağlantısı', dkd_kind: dkd_tags.highway, dkd_osmWay: dkd_way.id });
  }
}
const dkd_data = { dkd_origin, dkd_bbox: [32.845, 39.912, 32.863, 39.927], dkd_license: 'ODbL-1.0', dkd_attribution: '© OpenStreetMap contributors', dkd_source: 'https://api.openstreetmap.org/api/0.6/map?bbox=32.845,39.912,32.863,39.927', dkd_retrieved: '2026-09-07', dkd_sourceSha256: dkd_crypto.createHash('sha256').update(dkd_xml).digest('hex'), dkd_points, dkd_roads };
dkd_fs.writeFileSync('game/data/dkd-ankara.json', JSON.stringify(dkd_data));
dkd_fs.writeFileSync('game/data/dkd-roads.mjs', `// Derived road database: ODbL-1.0. See dkd-ankara.json and LICENSE-ODbL.md.\nexport const dkd_roadData = ${JSON.stringify(dkd_data)};\n`);
console.log(`${dkd_points.length} yol düğümü, ${dkd_roads.length} yol parçası.`);
