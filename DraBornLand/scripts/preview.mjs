import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'web');
const port = Number(process.env.PORT || 4173);
const prefix = '/DraBornGames/DraBornLand';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ico': 'image/x-icon' };
createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
    if (pathname.startsWith(prefix)) pathname = pathname.slice(prefix.length) || '/';
    if (pathname === '/') pathname = '/index.html';
    let path = resolve(root, `.${pathname}`);
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Dosya bulunamadı. Önce npm run build komutunu çalıştır.');
  }
}).listen(port, '0.0.0.0', () => console.log(`DraBornLand: http://localhost:${port}${prefix}/`));
