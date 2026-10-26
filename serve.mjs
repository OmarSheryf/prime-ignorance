import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.md':'text/plain; charset=utf-8','.ttf':'font/ttf','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const requested=decodeURIComponent(url.pathname);const target=path.resolve(root,'.'+(requested==='/'?'/index.html':requested));if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}const bytes=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'}).end(bytes);}catch{res.writeHead(404).end('Not found');}});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Prime Ignorance ready: http://127.0.0.1:'+(server.address().port)));
