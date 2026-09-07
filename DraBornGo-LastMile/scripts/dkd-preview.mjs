import * as dkd_http from 'node:http';
import * as dkd_fs from 'node:fs';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
const dkd_port = Number(process.env.DKD_PREVIEW_PORT || 4173);
const dkd_file = dkd_fileURLToPath(new URL('../assets/dkd-lastmile.html', import.meta.url));
dkd_http.createServer((dkd_request, dkd_response) => {
  if (dkd_request.url === '/favicon.ico') { dkd_response.writeHead(204); dkd_response.end(); return; }
  if (dkd_request.url !== '/' && !dkd_request.url?.startsWith('/?')) { dkd_response.writeHead(404); dkd_response.end('Not found'); return; }
  dkd_response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); dkd_fs.createReadStream(dkd_file).pipe(dkd_response);
}).listen(dkd_port, '0.0.0.0', () => console.log(`LAST MILE HTML5 test: http://localhost:${dkd_port}`));
