import {insidePolygon} from './arenas.js';
import {drawAgent,drawHero} from './sprites.js';

// Rasterize original art on the logical pixel grid; no external image assets.
function painter(c){
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const line=(ax,ay,bx,by,color,width=1)=>{const n=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)));for(let i=0;i<=n;i++)r(ax+(bx-ax)*i/n,ay+(by-ay)*i/n,width,width,color);};
 const ellipse=(x,y,rx,ry,color)=>{for(let row=-Math.ceil(ry);row<=ry;row++){const span=Math.floor(rx*Math.sqrt(Math.max(0,1-row*row/(ry*ry))));r(x-span,y+row,span*2+1,1,color);}};
 const ring=(x,y,rx,ry,outer,inner,width=2)=>{ellipse(x,y,rx,ry,outer);ellipse(x,y,rx-width,Math.max(1,ry-width),inner);};
 const polygon=(points,color)=>{
  const min=Math.floor(Math.min(...points.map(p=>p[1]))),max=Math.ceil(Math.max(...points.map(p=>p[1])));
  for(let y=min;y<max;y++){
   const crossings=[];for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [ax,ay]=points[i],[bx,by]=points[j];if((ay>y+.5)!==(by>y+.5))crossings.push(ax+(y+.5-ay)*(bx-ax)/(by-ay));
   }
   crossings.sort((a,b)=>a-b);for(let i=0;i<crossings.length;i+=2)r(Math.ceil(crossings[i]),y,Math.floor(crossings[i+1])-Math.ceil(crossings[i]),1,color);
  }
 };
 const glow=(x,y,radius,color)=>{const g=c.createRadialGradient(x,y,0,x,y,radius);g.addColorStop(0,color+'44');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(x-radius,y-radius,radius*2,radius*2);};
 const text=(label,x,y,color,size=5,align='center')=>{c.fillStyle=color;c.textAlign=align;c.font=size+'px monospace';c.fillText(label,x,y);};
 return {r,line,ellipse,ring,polygon,glow,text};
}

function neonBackground(p,t,a){
 p.r(0,0,432,216,a.palette.void);p.glow(216,32,120,'#a34ea5');p.ring(323,37,21,21,'#66517e','#21223d',1);
 // Layered city spires, antennae, and a suspended transit line.
 for(let i=0;i<22;i++){
  const x=i*21-8,h=17+(i*31)%53,y=112-h;p.r(x,y,17,h+90,i%2?'#14233d':'#1b2946');p.r(x+3,y-4,11,4,'#263858');
  if(i%3===0)p.line(x+8,y-14,x+8,y,'#466388');
  for(let row=y+6;row<121;row+=7)for(let col=x+3;col<x+15;col+=5)if((col+row+i)%3!==0)p.r(col,row,2,3,i%4===0?'#af638e':'#426d86');
 }
 p.line(0,63,432,63,'#4c466c');p.line(0,65,432,65,'#19283d');
 const train=((t*.016)%500)-45;p.r(train,56,34,5,'#657298');p.r(train+3,57,24,2,'#96d6e8');
 p.r(22,83,25,34,'#8c4e95');p.r(24,85,21,30,'#281d40');p.text('3021',34,95,'#f397db',5);p.line(29,102,39,102,'#ee76cf',2);p.line(34,99,34,110,'#ee76cf',2);
 p.r(391,68,26,43,'#26607d');p.r(393,70,22,39,'#122c43');p.text('AI',404,82,'#9ceaff',7);p.text('OPEN',404,98,'#ee8ed5',5);
}

function foundryBackground(p,t,a){
 p.r(0,0,432,216,a.palette.void);p.r(0,28,432,139,'#231a1e');
 for(const x of [14,43,382,411]){p.r(x,17,7,181,'#594137');p.r(x+2,17,2,181,'#86604a');p.r(x-2,42,11,5,'#98744c');p.r(x-2,165,11,5,'#98744c');}
 for(const x of [84,131,292,339]){p.r(x,18,10,37,'#332c2c');p.r(x+2,20,6,31,'#4e4138');p.r(x-3,51,16,7,'#70513b');}
 // The contained sun is framed by mechanical iris blades.
 p.glow(216,37,70,'#ff8c38');p.ring(216,37,44,34,'#5d4540','#181b24',4);p.ring(216,37,35,27,'#b37945','#46362c',3);
 p.ellipse(216,37,26,22,'#e16835');p.ellipse(216,37,20,18,'#ffb54e');p.ellipse(216,37,13,13,'#fff0b0');
 for(let i=0;i<8;i++){const angle=i*Math.PI/4;p.line(216+Math.cos(angle)*29,37+Math.sin(angle)*23,216+Math.cos(angle)*39,37+Math.sin(angle)*31,'#e8a35c',3);}
 p.line(177,14,163,14,'#66504a',3);p.line(255,14,269,14,'#66504a',3);
 for(const y of [197,203]){p.r(24,y,384,4,'#722e27');p.r(26,y+1,380,2,'#ee7840');}
 for(let i=0;i<39;i++){const x=26+(i*19+Math.floor(t*.014))%380;p.r(x,199+(i%2)*5,5,1,i%3?'#ffb74e':'#ffe5a0');}
 for(const x of [31,393]){p.r(x,93,9,93,'#663c2c');p.r(x+2,96,5,88,'#ef8241');p.r(x+4,96,1,88,'#ffe7a0');}
 p.text('HELIOS // FUSION 04',216,15,'#ffe3a0',5);
}

function verdantBackground(p,t,a){
 p.r(0,0,432,216,a.palette.void);p.glow(216,72,119,'#367c6b');
 // Glass dome, carbon-fibre ribs, and a circuit-rooted tree.
 p.ellipse(216,108,181,101,'#102c32');p.ellipse(216,108,176,97,'#13383a');p.ring(216,108,171,92,'#3a6863','#153a3b',1);
 for(const x of [98,157,216,275,334])p.line(x,26+Math.abs(x-216)*.18,x,80,'#32615d');for(const y of [35,51,70])p.line(90,y,342,y,'#315957');
 p.line(216,87,216,29,'#65a18a',9);p.line(210,69,186,43,'#65a18a',5);p.line(220,66,247,39,'#65a18a',5);p.line(214,46,201,24,'#7dbea0',3);p.line(222,47,231,19,'#7dbea0',3);
 for(const [x,y,rx,ry]of [[181,35,25,12],[199,21,25,13],[226,18,27,12],[251,31,26,14],[218,40,43,14]]){p.ellipse(x,y,rx,ry,'#286a55');p.ellipse(x,y-2,rx-4,ry-4,'#63ae7b');p.r(x-6,y-5,10,2,'#c4eb9b');}
 p.r(212,28,3,58,'#a7ef88');p.r(221,35,2,41,'#68ded2');
 for(const x of [40,369]){p.r(x,107,23,60,'#285c58');p.r(x+3,110,17,51,'#183f42');p.line(x+11,154,x+11,124,'#82b778',2);p.line(x+11,136,x+5,130,'#a1d78b',2);p.line(x+11,144,x+16,137,'#a1d78b',2);p.r(x+5,113,13,2,'#6acfc3');p.r(x+4,163,15,3,'#96ba7a');}
 for(let i=0;i<21;i++){const x=22+(i*73)%390,y=37+(i*37)%159;p.r(x,y,1,2,i%3?'#6bcca1':'#adeeb2');}p.text('BOTANICAL MEMORY RESERVE',216,205,'#72a998',5);
}

function spaceBackground(p,t,a){
 p.r(0,0,432,216,a.palette.void);
 for(let i=0;i<80;i++){const x=(i*73+11)%432,y=(i*47+7)%216;p.r(x,y,i%13===0?2:1,1,i%3===0?'#c0c6ed':'#364663');if(i%13===0){p.r(x,y-1,1,3,'#c0c6ed');p.r(x-1,y,3,1,'#c0c6ed');}}
 p.glow(214,73,126,'#5757a1');
 // A black core and its accretion halo sit behind the floating orbital deck.
 p.ring(216,66,155,37,'#39345d','#101228',2);p.ring(216,66,144,31,'#71658d','#13162d',2);p.ring(216,66,125,24,'#b18aaa','#17162a',1);p.ring(216,66,101,17,'#e5becd','#121124',2);
 p.ellipse(216,53,38,36,'#0a0b1a');p.ring(216,53,40,38,'#b1a9e7','#080b1b',2);p.ring(216,53,45,41,'#4b4875','#0a0b1a',1);p.ring(216,53,37,35,'#d7d8f5','#080b1b',1);
 p.ellipse(389,42,15,15,'#424966');p.ellipse(385,39,10,12,'#747c9a');p.r(380,35,5,2,'#a5aec1');
 for(const [x,y]of [[37,129],[390,157],[61,64]]){p.polygon([[x,y-9],[x+11,y],[x,y+8],[x-11,y]],'#414b77');p.line(x-9,y,x,y+6,'#a7b5e0');p.r(x-3,y-1,6,2,'#8293cc');}
 p.text('CAUSALITY ANCHOR // 03',216,207,'#8992b8',5);
}

function deck(p,a){
 const q=a.palette,shift=amount=>a.floor.map(([x,y])=>[x,y+amount]);p.polygon(shift(8),'#080c17');p.polygon(shift(5),q.edge);p.polygon(a.floor,q.floor);
 for(let y=51;y<193;y+=9)for(let x=50;x<383;x+=12)if([[0,0],[11,0],[0,8],[11,8]].every(([dx,dy])=>insidePolygon(a.floor,x+dx,y+dy))){p.r(x,y,11,8,(x*13+y*7)%5===0?q.tile:q.floor);p.r(x,y,11,1,q.edge+'66');if((x+y)%7===0)p.r(x+2,y+5,2,1,q.edge);}
 for(let i=0;i<a.floor.length;i++){const from=a.floor[i],to=a.floor[(i+1)%a.floor.length];p.line(...from,...to,q.edge,2);if(i%2===0)p.line(from[0]+2,from[1]+2,to[0]-2,to[1]+2,q.accent,1);}
 for(const terminal of a.terminals){p.line(terminal.x,terminal.y+13,terminal.x,a.spawn.y-3,q.edge);p.line(terminal.x,a.spawn.y-3,a.spawn.x,a.spawn.y-3,q.edge);p.r(terminal.x-1,a.spawn.y-4,3,3,q.accent);}
 const g=a.guardian;p.ellipse(g.x,g.y+10,26,10,'#080d19');p.r(g.x-21,g.y-7,42,19,q.edge);p.r(g.x-18,g.y-6,36,15,q.floor);p.r(g.x-21,g.y+11,42,2,q.accent);p.r(g.x-14,g.y-4,28,1,q.secondary);p.text('CONSCIOUSNESS NODE',g.x,g.y+26,q.light,4);
}

function arenaDetails(p,a,t){
 const q=a.palette;
 if(a.id==='neon-rain'){
  for(const [x,y]of [[58,93],[367,93],[57,171],[367,171]]){p.r(x,y,9,8,'#273d56');p.r(x+2,y+2,5,3,q.secondary);p.line(x+4,y+8,x+4,y+13,q.accent);}
  p.r(65,95,28,5,'#142437');p.text('PROMPT',79,99,q.secondary,4);for(const x of [49,383])for(let y=99;y<171;y+=17){p.r(x-2,y,5,2,q.accent);p.r(x-1,y+2,3,9,'#35566c');}p.r(275,92,60,3,'#352947');p.text('WE THINK FOR YOU',305,98,'#f3a0dc',4);
 }else if(a.id==='helios-foundry'){
  for(const x of [154,276]){p.line(x,69,x,104,'#b07443',3);p.r(x-6,68,15,7,'#87715a');p.r(x-3,76,9,13,'#352b29');p.r(x-2,88,7,3,q.accent);}
  for(let x=88;x<348;x+=12){p.line(x,179,x+5,183,'#f2bd60',2);p.line(x+5,179,x+10,183,'#201f25',2);}for(const y of [80,174])for(const x of [70,366]){p.r(x,y,3,3,q.light);p.r(x+1,y+1,1,1,'#53342b');}p.text('THERMAL CLEARANCE',216,116,q.accent,4);
 }else if(a.id==='verdant-array'){
  for(const [x,y]of [[151,73],[281,73],[149,179],[285,179]]){p.ellipse(x,y,9,5,'#173c39');p.line(x,y,x-6,y-9,'#9bd393',2);p.line(x,y,x+5,y-13,'#77d7b0',2);p.r(x+4,y-13,3,3,'#d9edb0');}
  for(const x of [162,266]){p.line(x,89,x-8,97,'#75b37a');p.line(x-8,97,x-4,110,'#75b37a');}for(let i=0;i<9;i++)p.r(146+i*17,182,2,1,q.accent);p.text('GROW / REMEMBER',216,113,q.accent,4);
 }else{
  for(const [x,y]of [[104,100],[328,100],[104,163],[328,163]]){p.ellipse(x,y+7,9,4,'#13192f');p.r(x-5,y-2,10,9,'#535a88');p.polygon([[x,y-17],[x+5,y-6],[x,y+1],[x-5,y-6]],'#b5c4ff');p.line(x,y-14,x,y-2,'#f3f3ff');}
  p.ring(216,164,27,10,'#6777b0',q.floor,1);p.ring(216,164,20,7,'#3f4d7d',q.floor,1);p.text('GRAVITY: LOCAL',216,118,q.secondary,4);
 }
 for(const o of a.obstacles){
  p.r(o.x-1,o.y+2,o.w+2,o.h+2,'#0b1720');
  if(o.kind==='pool'){
   p.r(o.x-2,o.y-2,o.w+4,o.h+4,'#4d8a77');p.r(o.x,o.y,o.w,o.h,'#176675');for(let y=o.y+3;y<o.y+o.h;y+=5)for(let x=o.x+3;x<o.x+o.w-4;x+=11)p.r(x+Math.round(Math.sin(t*.001+y)*2),y,6,1,'#67c9c4');p.ellipse(o.x+17,o.y+8,6,2,'#83b684');p.ellipse(o.x+51,o.y+17,7,2,'#83b684');
  }else if(o.kind==='heat-vent'||o.kind==='gravity-well'){
   p.r(o.x,o.y,o.w,o.h,q.edge);p.r(o.x+2,o.y+2,o.w-4,o.h-4,'#14202d');for(let x=o.x+4;x<o.x+o.w-3;x+=5)p.r(x,o.y+4,2,o.h-8,q.secondary);
  }else if(o.kind==='crystal'){
   p.r(o.x,o.y+o.h-6,o.w,6,q.edge);p.polygon([[o.x+7,o.y-9],[o.x+14,o.y+5],[o.x+7,o.y+15],[o.x,o.y+5]],q.accent);p.line(o.x+7,o.y-6,o.x+7,o.y+11,q.light);
  }else if(o.kind==='planter'){
   p.r(o.x,o.y,o.w,o.h,q.edge);p.r(o.x+2,o.y+2,o.w-4,o.h-4,'#143a31');for(let x=o.x+5;x<o.x+o.w-3;x+=7){p.line(x,o.y+o.h-4,x,o.y-5,'#89cd8a',2);p.line(x,o.y+3,x-4,o.y-1,q.accent);}
  }else{p.r(o.x,o.y,o.w,o.h,q.edge);p.r(o.x+2,o.y+2,o.w-4,o.h-4,q.floor);for(let x=o.x+4;x<o.x+o.w-3;x+=5)p.r(x,o.y+4,2,o.h-8,q.secondary);}
 }
}

function terminal(p,{x,y},a,recovered){
 const q=a.palette;p.r(x-10,y-20,20,26,q.edge);p.r(x-8,y-18,16,17,'#0b2030');p.r(x-6,y-16,12,12,recovered?'#57aa8b':q.accent);p.r(x-4,y-13,7,1,'#123445');p.r(x-4,y-10,4,1,'#123445');p.r(x-4,y-7,8,1,'#123445');p.r(x-9,y+6,18,3,'#152134');p.r(x-6,y+1,11,2,q.light);p.r(x+6,y+1,2,2,q.secondary);
}
function portal(p,{x,y,facing},a,recovered){
 const q=a.palette,light=recovered?'#a3f1bf':q.secondary;p.ellipse(x,y+9,16,6,'#0c1424');p.r(x-12,y-20,24,28,q.edge);p.r(x-10,y-18,20,25,'#0b1728');p.r(x-8,y-16,16,22,recovered?'#245d65':'#332a49');
 if(recovered){for(let i=0;i<3;i++)p.r(x-6+i*5,y-14,1,18,light);}else{for(let i=0;i<3;i++)p.r(x-7,y-12+i*6,14,2,light);}
 p.r(x-12,y+8,24,2,q.accent);p.r(x-13,y-22,26,3,q.accent);p.text(facing==='west'?'<':facing==='east'?'>':'^',x,y-24,q.light,6);
}

export function renderArena(c,a,{time=0,region=0,player=a.spawn,moving=false,recovered=false,reduced=false}={}){
 const t=reduced?0:time,p=painter(c);c.save();
 ({'neon-rain':neonBackground,'helios-foundry':foundryBackground,'verdant-array':verdantBackground,'event-horizon':spaceBackground}[a.id])(p,t,a);
 deck(p,a);arenaDetails(p,a,t);for(const terminalPosition of a.terminals)terminal(p,terminalPosition,a,recovered);portal(p,a.exit,a,recovered);
 const entities=[
  {y:a.guardian.y,draw:()=>drawAgent(c,a.guardian.x,a.guardian.y-9,t,recovered?'#91b78c':a.palette.enemy,region,.7)},
  {y:a.echo.y,draw:()=>{const x=a.echo.x,y=a.echo.y+(reduced?0:Math.round(Math.sin(t*.002)));p.ellipse(x,y+8,10,3,'#10292b');p.r(x-6,y-8,12,15,'#769b86');p.r(x-4,y-11,8,4,'#b3d9ba');p.r(x-4,y-4,8,5,'#234a43');p.r(x-3,y-3,2,2,'#daf4cc');p.r(x+1,y-3,2,2,'#daf4cc');p.r(x-8,y+3,16,4,'#769b86');p.text('ECHO',x,y+18,a.palette.light,4);}},
  {y:player.y,draw:()=>drawHero(c,player.x,player.y-11,t,moving,1)}
 ];entities.sort((x,y)=>x.y-y.y);entities.forEach(e=>e.draw());
 if(!reduced){if(a.id==='neon-rain')for(let i=0;i<43;i++){const x=(i*53+Math.floor(t*.012))%432,y=(i*29+Math.floor(t*.05))%216;p.line(x,y,x-2,y+5,'#7dabc04d');}else for(let i=0;i<17;i++){const x=40+(i*67)%350,y=35+((i*29-t*.006)%158+158)%158;p.r(x,y,1,1,i%3?a.palette.accent:a.palette.light);}}
 c.restore();
}
