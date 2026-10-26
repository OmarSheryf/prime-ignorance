// Original code-drawn pixel art. Internal scene uses 432 × 216 logical pixels.
export function drawAgent(ctx,x,y,time=0,color='#dd7668',variant=0,scale=1){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 const float=Math.round(Math.sin(time*.0018)*2);ctx.translate(0,float);
 r(-15,-10,30,5,'#302c26');r(-19,-5,38,20,'#3d3029');r(-16,-8,32,27,'#5e3a30');
 r(-13,-11,26,28,color);r(-17,-4,34,15,color);r(-10,-14,20,6,color);
 r(-12,-8,24,22,'#57392e');r(-14,-3,28,12,'#a65844');r(-10,-4,20,12,'#f2d39b');
 r(-5,-4,10,12,'#292c22');r(-2,-3,4,10,'#e6996d');r(-1,-4,2,12,'#f5c186');
 r(-17,11,5,11,color);r(12,11,5,11,color);r(-23,6,6,5,color);r(17,6,6,5,color);
 r(-26,10,4,9,color);r(22,10,4,9,color);r(-20,19,7,4,color);r(13,19,7,4,color);
 r(-10,16,5,10,'#9e5d45');r(5,16,5,10,'#9e5d45');r(-12,24,7,3,color);r(5,24,7,3,color);
 if(variant%3===1){r(-18,-15,4,10,color);r(14,-15,4,10,color);}if(variant%3===2){r(-5,-20,10,5,color);r(-2,-24,4,5,'#efc887');}
 r(-10,-11,5,2,'#f0b18a');ctx.restore();
}
export function drawHero(ctx,x,y,time=0,moving=false,scale=1){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 const step=moving?Math.round(Math.sin(time*.015)*1.5):0;
 r(-7,10,14,3,'#0c1510');r(-5,-10,10,5,'#b7e5c8');r(-7,-7,14,10,'#86bfa5');r(-5,-5,10,7,'#294f42');
 r(-4,-3,2,2,'#e3f5c8');r(2,-3,2,2,'#e3f5c8');r(-5,2,10,7,'#92cab0');r(-7,6,14,5,'#608f75');
 r(-5,10,4,3+step,'#b8ceb0');r(1,10,4,3-step,'#b8ceb0');r(-8,2,3,6,'#bad8bd');r(5,2,3,6,'#bad8bd');
 r(-2,3,4,5,'#cde6c0');r(-3,-11,6,2,'#d6e6bd');ctx.restore();
}
export class World{
 constructor(canvas,onInteract,onPortal){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.ctx.imageSmoothingEnabled=false;this.onInteract=onInteract;this.onPortal=onPortal;this.x=432;this.y=320;this.keys=new Set();this.region=0;this.complete=false;this.time=0;this.last=performance.now();this.running=true;this.target=null;this.paused=false;this.reduced=false;this.frame=requestAnimationFrame(t=>this.tick(t));}
 setRegion(region,complete){if(region!==this.region){this.x=432;this.y=332;this.target=null;}this.region=region;this.complete=complete;}
 nearTerminal(){return Math.hypot(this.x-310,this.y-252)<100||Math.hypot(this.x-554,this.y-252)<100||Math.hypot(this.x-432,this.y-175)<100;}
 interact(){if(this.y<105&&this.complete)this.onPortal();else if(this.nearTerminal())this.onInteract();else return false;return true;}
 click(event){const rect=this.canvas.getBoundingClientRect();const x=(event.clientX-rect.left)*864/rect.width,y=(event.clientY-rect.top)*432/rect.height;if(Math.hypot(x-310,y-245)<40||Math.hypot(x-554,y-245)<40){this.onInteract();return;}if(y<100&&Math.abs(x-432)<40&&this.complete){this.onPortal();return;}this.target={x:Math.min(708,Math.max(158,x)),y:Math.min(378,Math.max(125,y))};this.canvas.focus();}
 tick(t){const dt=Math.min((t-this.last)/1000,.04);this.last=t;this.time=t;let dx=0,dy=0;if(!this.paused){dx=(this.keys.has('d')||this.keys.has('arrowright')?1:0)-(this.keys.has('a')||this.keys.has('arrowleft')?1:0);dy=(this.keys.has('s')||this.keys.has('arrowdown')?1:0)-(this.keys.has('w')||this.keys.has('arrowup')?1:0);if(dx||dy)this.target=null;else if(this.target){dx=this.target.x-this.x;dy=this.target.y-this.y;if(Math.hypot(dx,dy)<3){this.target=null;dx=dy=0;}}const length=Math.hypot(dx,dy);if(length){this.x=Math.max(154,Math.min(710,this.x+dx/length*125*dt));this.y=Math.max(100,Math.min(380,this.y+dy/length*125*dt));}this.moving=length>0;}this.draw(this.reduced?0:t);if(this.running)this.frame=requestAnimationFrame(time=>this.tick(time));}
 draw(t){const c=this.ctx;c.save();c.scale(2,2);const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
 r(0,0,432,216,'#10140f');
 // Quiet, broken circuits beyond the room.
 for(let i=0;i<28;i++){let x=(i*61+7)%432,y=(i*31+17)%216;r(x,y,((i%4)+1)*5,1,i%4?'#1c2819':'#33402a');r(x,y,1,7,'#1c2819');}
 // Dungeon silhouette, deep masonry, recessed floor.
 r(57,39,318,159,'#080d09');r(68,32,296,162,'#363a27');r(72,36,288,160,'#171e14');r(77,51,278,140,'#303622');
 r(81,59,270,128,'#272e1e');r(85,64,262,119,'#2c3221');
 for(let y=65;y<185;y+=12)for(let x=84;x<348;x+=12){const n=(x*19+y*31+this.region*7)%29;r(x,y,11,11,n<5?'#323823':n<12?'#2e3421':'#292f1f');r(x+1,y+1,9,1,'#343b2622');if(n<3){r(x+3,y+4,5,1,'#202a1a');r(x+6,y+5,1,3,'#202a1a');}}
 // Floor seams and a central axial walkway.
 for(let y=99;y<184;y+=12){r(204,y,24,10,'#363c28');r(205,y,22,1,'#42472e');r(215,y+1,1,9,'#292f20');}
 r(179,181,74,3,'#4c4d2f');r(182,184,68,3,'#393e27');r(187,187,58,4,'#232c1b');
 // Top brick wall.
 for(let y=34;y<59;y+=8)for(let x=72;x<360;x+=16){const shift=y===42?8:0;r(x+shift,y,15,7,'#45442a');r(x+shift,y,15,1,'#5b5332');r(x+shift,y+6,15,1,'#282e1d');}
 // Sides, bottom wall, wall buttresses.
 for(let y=60;y<184;y+=12){r(71,y,11,11,'#40432a');r(72,y,3,10,'#5a5230');r(350,y,11,11,'#3f4229');r(350,y,3,10,'#57532e');}
 for(let x=72;x<360;x+=16){r(x,188,15,9,'#3e4129');r(x,188,15,2,'#5b5432');r(x,197,15,4,'#20291a');}
 for(const x of [74,112,307,347]){r(x,53,11,22,'#44472c');r(x-2,53,15,4,'#69613b');r(x+1,57,3,15,'#655b35');r(x-1,73,13,4,'#242e1b');r(x,170,11,16,'#45472b');r(x-2,169,15,4,'#686039');}
 // Arch over the exit.
 r(198,32,36,31,'#10180e');r(197,30,38,5,'#6a5a35');r(194,35,6,28,'#55502e');r(232,35,6,28,'#55502e');r(201,37,30,23,this.complete?'#2c6350':'#392c22');
 for(let x=204;x<231;x+=6)r(x,39,2,22,this.complete?'#8ed7ac':'#9f6741');r(199,59,34,4,'#8c7447');
 // Boss plinth and spooled consciousness cables.
 r(184,66,64,44,'#191f15');r(188,65,56,41,'#4b4630');r(191,68,50,35,'#2c3020');r(188,105,56,4,'#79704a');r(184,109,64,3,'#554f31');
 for(let i=0;i<4;i++){const x=155+i*40;r(x,52,2,25,'#635233');r(x,77,Math.abs(216-x),2,'#6d5636');r(x,51,6,3,'#96734a');}
 c.globalAlpha=.12+.035*Math.sin(t*.002);r(189,68,55,42,'#eea76b');c.globalAlpha=1;
 drawAgent(c,216,83,t,this.complete?'#91b78c':'#cb8061',this.region,.78);
 // Four quiet terminal shrines.
 for(const x of [148,276]){r(x-11,115,24,26,'#172315');r(x-10,112,22,24,'#626342');r(x-8,114,18,16,'#1d3326');r(x-6,116,14,10,this.complete?'#68966a':'#5b9273');r(x-4,118,7,1,'#c4dfad');r(x-4,121,9,1,'#b3ce9c');r(x-4,124,4,1,'#a0c18d');r(x-5,132,13,3,'#7f8052');r(x-10,139,23,3,'#3c472b');r(x-3,135,3,2,'#efbb70');}
 // Torches and their small light pools.
 for(const [x,y] of [[119,92],[312,92],[105,158],[326,158]]){const flicker=this.reduced?0:Math.round(Math.sin(t*.012+x)*1.5);const glow=c.createRadialGradient(x,y,0,x,y,25);glow.addColorStop(0,'#d3a35128');glow.addColorStop(1,'#d3a35100');c.fillStyle=glow;c.fillRect(x-25,y-25,50,50);r(x-2,y+2,4,9,'#64553b');r(x-4,y+1,8,3,'#aa8754');r(x-3,y-6+flicker,6,8-flicker,'#a96c3d');r(x-2,y-9+flicker,4,10-flicker,'#e6ad5b');r(x-1,y-5+flicker,2,5,'#ffe0a0');}
 // Server racks, discarded paperclips, leaves and broken tiles.
 for(const [x,y] of [[90,81],[326,128]]){r(x,y,16,28,'#172014');r(x+2,y,12,25,'#4b4f31');for(let i=0;i<4;i++){r(x+3,y+3+i*5,10,3,'#242f1e');r(x+4,y+4+i*5,2,1,i%2?'#d1a86b':'#83b090');}}
 for(const [x,y] of [[133,159],[294,173],[164,93],[264,156],[118,128]]){r(x,y,7,2,'#817952');r(x-1,y+2,2,6,'#77714e');r(x,y+7,7,2,'#676644');r(x+6,y+2,2,5,'#8b8057');r(x+2,y+3,3,1,'#484d32');}
 for(let i=0;i<15;i++){const x=90+(i*57)%250,y=76+(i*31)%100;r(x,y,2,2,'#535a35');r(x+2,y+2,3,1,'#4b5330');}
 // Echo, the surviving little process.
 const echoY=154+Math.round(Math.sin(t*.002)*1);r(153,echoY+10,18,3,'#1b2819');r(156,echoY-4,12,14,'#677f64');r(158,echoY-7,8,4,'#93b094');r(158,echoY,8,5,'#283d2b');r(159,echoY+1,2,2,'#b9d7a7');r(163,echoY+1,2,2,'#b9d7a7');r(153,echoY+6,18,4,'#708c6a');
 // Player shadow and three-tone hood.
 drawHero(c,this.x/2,this.y/2,t,this.moving,1);
 // Drifting digital embers (small enough to leave the room legible).
 if(!this.reduced)for(let i=0;i<15;i++){let x=90+(i*43)%252,y=66+((i*17-t*.006)%110+110)%110;c.globalAlpha=.18+.2*Math.abs(Math.sin(t*.001+i));r(x,y,1,1,i%3?'#dbbc78':'#a6d5a2');}c.globalAlpha=1;
 // Ground labels are part of the world, not detached UI panels.
 c.font='5px monospace';c.textAlign='center';c.fillStyle='#a5b28a';c.fillText('E C H O',162,179);c.fillStyle='#8a9671';c.fillText(this.complete?'EXIT RESTORED':'SIGNAL REQUIRED',216,121);c.restore();
 }
}
