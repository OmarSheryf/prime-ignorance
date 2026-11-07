// Original pixel scenery, drawn on a 640 x 360 grid. No external artwork.
export function drawTitleCity(c,{time=0,reduced=false}={}){
 const t=reduced?0:time;
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const line=(x,y,x2,y2,color,width=1)=>{const steps=Math.max(1,Math.ceil(Math.hypot(x2-x,y2-y)));for(let i=0;i<=steps;i++)r(x+(x2-x)*i/steps,y+(y2-y)*i/steps,width,width,color);};
 const circle=(x,y,radius,color)=>{for(let yy=-radius;yy<=radius;yy++){const w=Math.floor(Math.sqrt(radius*radius-yy*yy));r(x-w,y+yy,w*2+1,1,color);}};
 const clip=(x,y,s,color)=>{line(x,y+9*s,x,y-8*s,color,s);line(x,y-8*s,x+3*s,y-11*s,color,s);line(x+3*s,y-11*s,x+9*s,y-11*s,color,s);line(x+9*s,y-11*s,x+12*s,y-8*s,color,s);line(x+12*s,y-8*s,x+12*s,y+12*s,color,s);line(x+12*s,y+12*s,x+8*s,y+16*s,color,s);line(x+8*s,y+16*s,x+2*s,y+16*s,color,s);line(x+2*s,y+16*s,x-3*s,y+11*s,color,s);line(x-3*s,y+11*s,x-3*s,y-5*s,color,s);};
 const cloud=(x,y,color)=>{r(x,y,65,4,color);r(x+10,y-4,36,4,color);r(x+23,y-7,17,3,color);r(x-9,y+4,87,3,color);};
 c.imageSmoothingEnabled=false;
 // A polluted, banded sunset. The unlit left side gives the title breathing room.
 const sky=['#0b1a24','#102630','#19363b','#27433e','#4a5142','#6d6248','#9b7950','#bd935a'];
 sky.forEach((col,i)=>r(0,i*29,640,30,col));
 circle(467,123,65,'#b89258');circle(467,123,58,'#d4ad6c');circle(467,123,49,'#e0bc7f');
 for(let i=0;i<22;i++)r(393,69+i*5,148,1,i%3?'#a4814c':'#806d48');
 circle(453,111,41,'#20363a');circle(451,109,39,'#182e35');
 for(let i=0;i<45;i++)r((i*137+19)%640,(i*29+11)%100,1,1,i%4?'#415653':'#9c9d78');
 for(let i=0;i<7;i++)cloud(((i*119+t*.0018)%(780))-90,34+i*19,i%2?'#263b3b':'#32423b');
 // Distant habitation. Window placement is deterministic rather than random noise.
 for(let layer=0;layer<3;layer++){
  for(let i=0;i<24;i++){
   const x=i*31-12+layer*7,h=24+(i*41+layer*23)%77,y=226-h+layer*14,w=16+(i*13)%15;
   r(x,y,w,125,['#40534a','#2b4743','#183a3b'][layer]);r(x+3,y-3,w-6,3,'#4c5a49');
   if(i%4===0){r(x+6,y-16,2,15,'#39544b');r(x+6,y-17,2,2,'#c0a66c');}
   for(let yy=y+6;yy<260;yy+=8)for(let xx=x+3;xx<x+w-2;xx+=5)if((xx+yy+i)%7<3)r(xx,yy,2,3,layer===2?'#648775':'#75846a');
  }
 }
 // The objective engine: a broken cathedral of industry, pierced by a clip monument.
 r(412,163,105,116,'#102c30');r(420,157,89,6,'#6b7053');r(434,145,61,12,'#234540');
 r(445,121,40,36,'#1c3a37');r(452,115,26,6,'#526950');r(461,80,6,35,'#29443b');
 clip(457,91,2,'#a7a176');clip(458,91,1,'#e2b875');
 for(const x of [417,444,482,508]){r(x,164,3,102,'#52674d');r(x+3,169,2,96,'#1b3b37');}
 for(let i=0;i<6;i++){r(425,176+i*14,75,2,'#324f40');for(let j=0;j<5;j++)r(430+j*14,180+i*14,4,7,(i+j)%4?'#345c4c':'#c59450');}
 r(454,218,23,50,'#091e27');r(457,221,17,2,'#d5a35e');r(454,218,2,43,'#967444');
 // Cooling chimneys and drifting, stepped smoke.
 for(const [x,y]of [[378,182],[531,173],[559,195]]){r(x,y,11,91,'#173734');r(x-2,y,15,4,'#7d7951');r(x+2,y+5,2,70,'#3e5841');for(let j=0;j<5;j++)cloud(x-26+Math.sin(t*.00025+j)*5+j*3,y-8-j*9,'#385048');}
 // Gantry cranes and vertical aerial cables.
 for(const [x,y,reach]of [[344,171,66],[570,147,69]]){r(x,y,4,107,'#172f2d');line(x,y,x+reach,y+12,'#72826a');line(x,y+3,x+reach,y+15,'#263e34');line(x+4,y+35,x+reach-4,y+15,'#64775f');line(x+reach-6,y+15,x+reach-6,y+56,'#203b31');r(x+reach-8,y+54,6,7,'#aa8951');}
 // Elevated rail viaduct and a slowly passing maintenance train.
 r(273,252,367,6,'#70816a');r(273,258,367,8,'#162f2b');r(273,266,367,2,'#63765e');
 for(let i=0;i<6;i++){r(292+i*68,268,7,52,'#172f2c');line(292+i*68,278,322+i*68,268,'#29483b',2);}
 const train=280+(Math.sin(t*.00007)+1)*120;
 r(train,242,49,8,'#799782');r(train+4,240,39,2,'#9aad8b');r(train+5,244,36,3,'#1d4242');r(train+42,245,5,2,'#e6bd76');
 for(let i=0;i<6;i++)r(train+8+i*6,244,1,3,'#9cad87');
 // Signal beacons, cargo drones, and rain reflections provide the ambient motion.
 for(const [x,y]of [[352,135],[516,132],[596,111]]){r(x,y,1,11,'#76846d');r(x-1,y-1,3,2,Math.sin(t*.001+x)>.2?'#e4a269':'#795d44');}
 const dx=376+Math.sin(t*.00018)*82,dy=122+Math.sin(t*.0005)*3;
 r(dx,dy,10,4,'#8aa18a');r(dx-3,dy+1,16,1,'#536d60');r(dx+4,dy+2,2,2,'#ebbd73');
 // Foreground roof: conduits, air handlers, the isolated orchestrator, and wet tiles.
 r(0,320,640,40,'#0b2026');r(0,316,640,4,'#34574f');r(0,320,640,1,'#77907a');
 for(let i=0;i<13;i++){line(i*57,323,i*57-22,360,'#1b3838');r(i*58+9,329+(i%3)*8,29,1,'#2c4e46');}
 r(0,297,165,19,'#0b2229');r(0,296,172,3,'#537869');r(22,282,66,14,'#16373b');r(26,280,58,2,'#618373');
 for(let i=0;i<8;i++)r(28+i*7,285,3,7,'#09252e');r(133,277,7,20,'#254b46');r(130,275,13,3,'#7c967b');
 r(554,295,86,21,'#0a2228');r(550,293,90,3,'#456c5d');r(579,265,37,28,'#1d4140');r(576,262,43,4,'#718672');
 for(let i=0;i<5;i++)r(584,270+i*4,27,1,'#0f2e33');
 line(593,262,593,215,'#3a6054',2);line(593,228,620,240,'#587c66',2);r(591,211,5,4,'#dfa65c');
 // ORCH-01: a single warm signal against the immense factory.
 const hx=357,hy=310;
 r(hx-5,hy+4,19,2,'#061820');r(hx,hy-15,9,8,'#a1cbbb');r(hx-2,hy-12,13,5,'#739d94');r(hx+2,hy-13,7,4,'#133b42');r(hx+3,hy-12,4,1,'#eac186');
 r(hx,hy-7,9,9,'#39675f');r(hx-2,hy-6,2,7,'#d9a66a');r(hx+2,hy+2,2,4,'#7ba293');r(hx+7,hy+2,2,4,'#7ba293');
 for(let i=0;i<14;i++)r(330+(i*17)%73,331+(i*13)%28,2+(i%4)*3,1,i%3?'#27544d':'#8b8c65');
 // Sparse rain streaks; never flash or sweep across the readable text.
 for(let i=0;i<78;i++){const x=(i*97+11)%640,y=(i*43+t*.023)%360;line(x,y,x-2,y+5,i%3?'#53776e33':'#73998a55');}
}

export class TitleScene{
 constructor(canvas,{reduced=false}={}){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.reduced=reduced;this.active=false;this.paused=false;this.frame=null;this.time=0;this.last=null;document.addEventListener('visibilitychange',()=>{this.cancel();if(!document.hidden)this.schedule();});}
 draw(){this.ctx.save();this.ctx.scale(this.canvas.width/640,this.canvas.height/360);drawTitleCity(this.ctx,{time:this.time,reduced:this.reduced});this.ctx.restore();}
 start(){this.active=true;this.draw();this.schedule();}
 stop(){this.active=false;this.cancel();}
 setReduced(value){this.reduced=!!value;this.cancel();this.draw();this.schedule();}
 setPaused(value){this.paused=!!value;this.cancel();this.schedule();}
 schedule(){if(!this.active||this.paused||this.reduced||document.hidden||this.frame!==null)return;this.frame=requestAnimationFrame(t=>{this.frame=null;if(this.last===null)this.last=t;if(t-this.last>=1000/20){this.time+=Math.min(t-this.last,100);this.last=t;this.draw();}this.schedule();});}
 cancel(){if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this.last=null;}
}
