import http from 'node:http';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const allowed = new Map([['/', ['tests/preview.html', 'text/html']], ['/dist/fazfort-discovery.js', ['dist/fazfort-discovery.js','text/javascript']]]);
http.createServer(async (req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/art.svg'){
    const hue=parseInt((url.searchParams.get('id')||'0').slice(-4),16)%360;
    res.writeHead(200,{'Content-Type':'image/svg+xml'});
    res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="394"><defs><linearGradient id="g"><stop stop-color="hsl(${hue*11%360},45%,22%)"/><stop offset="1" stop-color="hsl(${(hue*11+80)%360},35%,8%)"/></linearGradient></defs><path fill="url(#g)" d="M0 0h700v394H0z"/><circle cx="480" cy="120" r="100" fill="white" opacity=".15"/><path d="M0 330 220 100 420 394H0" fill="white" opacity=".08"/><text x="30" y="350" fill="white" font-family="Arial" font-size="24">FICTIONAL PREVIEW ART</text></svg>`);return;
  }
  const entry=allowed.get(url.pathname);if(!entry){res.writeHead(404);res.end('Not found');return;}
  try{res.writeHead(200,{'Content-Type':entry[1]});res.end(await readFile(new URL(entry[0],root)));}catch{res.writeHead(500);res.end('Run npm run build first.');}
}).listen(8088,'127.0.0.1',()=>console.log('Open http://127.0.0.1:8088 — fixture data only. Ctrl+C stops the preview.'));
