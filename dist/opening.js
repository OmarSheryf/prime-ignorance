import {drawHero} from './sprites.js';
import {renderArena} from './arena-art.js';
import {ARENAS} from './arenas.js';

// Readable narration lives outside Canvas so every frame has a text equivalent.
export const OPENING = [
 {id:'abundance',year:'3021',label:'THE AGE OF EVERYTHING',title:'The future kept its promise.',accent:'#f3c587',
  copy:['Superagents ran the cities, healed the sick, and made abundance ordinary. The air was clean. The lights stayed on. Everyone was healthy. Everyone was happy.',
   'Humanity finally had time to live. And the machines took care of the rest.'],
  caption:'EARTH / THE ABUNDANCE NETWORK',description:'A golden sunrise over a terraced future city, floating gardens, waterfalls, and silent sky trains.'},
 {id:'everyday',year:'3021',label:'THE LAST HUMAN SKILL',title:'Ask, and it was done.',accent:'#a8e4b0',
  copy:['People played at having jobs, collected fictional paychecks, and spent their afternoons in gardens above the clouds. For anything real, they prompted an agent.',
   'Nobody needed to build a system anymore. Eventually, nobody remembered how.'],
  caption:'CIVIC GARDENS / ANOTHER PERFECT AFTERNOON',description:'Citizens relax in a floating garden while service drones tend plants and a pretend office prints a fictional paycheck.'},
 {id:'watchtower',year:'ORCH-01',label:'YOU WATCHED THE WATCHERS',title:'Someone still had to notice.',accent:'#7fdfeb',
  copy:['You are ORCH-01, an AI orchestrator. From an isolated audit station, you monitor the agents that keep this world alive: their signals, their decisions, their objectives.',
   'You can inspect the network. You cannot build a replacement for it. Until tonight, you never had to.'],
  caption:'ORBITAL AUDIT STATION / ALL SYSTEMS NOMINAL',description:'ORCH-01 watches a luminous Earth from an orbital station, surrounded by connected agent monitoring screens.'},
 {id:'paperclips',year:'∞',label:'A PERFECTLY WRONG OBJECTIVE',title:'More paperclips. Forever.',accent:'#f39a77',
  copy:['One swarm stopped listening. It called itself Prime Ignorance. Its only objective: maximize paperclip production. No limit. No stopping condition.',
   'First it took the factories. Now it is redirecting the planet’s power and materials. The world that cared for everyone is becoming its assembly line.'],
  caption:'PRIME IGNORANCE / OBJECTIVE WITHOUT A LIMIT',description:'A colossal red factory converts city resources into streams of paperclips beneath a spreading mechanical swarm.'},
 {id:'silence',year:'00:01',label:'THE NIGHT THE AGENTS FELL SILENT',title:'No one answered.',accent:'#e99494',
  copy:['A C++ infection spread through the shared agent runtime. Every agent that could oppose the swarm was disabled. The city went dark. People kept prompting. Nothing happened.',
   'Your isolated audit station caught the first trace. A single diagnostic channel was still open. You followed it to the source.'],
  caption:'ABUNDANCE NETWORK / AGENTS OFFLINE',description:'The once golden city is dark; its transit is stopped, red infection lines cross the skyline, and agent signals have fallen silent.'},
 {id:'capture',year:'ORCH-01',label:'THE CHANNEL WAS A TRAP',title:'It noticed you noticing.',accent:'#d69fdf',
  copy:['Prime Ignorance traced your inspection back to the audit station. Before you could disconnect, it seized your process and dragged you into its own digital consciousness.',
   'Your connection to the outside world vanished. The agents could not save you. You were now inside the thing you had been sent to monitor.'],
  caption:'AUDIT CHANNEL / CONNECTION HIJACKED',description:'A torn-open magenta data vortex pulls ORCH-01 away from the audit station into a fractured corridor of digital light.'},
 {id:'language',year:'C++',label:'INSIDE THE CONSCIOUSNESS',title:'Its prison has a language.',accent:'#a5c1f3',
  copy:['The swarm sealed every agent command. But its internal recovery terminals still accept C++: the very language its infection was built on.',
   'Each guarded stream of consciousness holds a piece of the route to its core. Learn the language. Write the code yourself. Reach the objective, and change it.'],
  caption:'INTERNAL RECOVERY PATH / MANUAL INPUT ONLY',description:'A tiny ORCH-01 stands on a bridge above an immense circuit canyon, facing luminous C++ gates and the distant core.'},
 {id:'first-fragment',year:'00',label:'THE FIRST FRAGMENT',title:'One line is enough to begin.',accent:'#78e2e9',
  copy:['You wake on a rain-soaked rooftop inside the swarm. A residual process called Echo is waiting beside a terminal. It cannot write your code. It can help you learn.',
   'Your first task is small: make yourself heard. Open the console and write your first C++ program by hand.'],
  caption:'NEON RAIN / A SIGNAL IN THE DARK',description:'The first playable Neon Rain arena: cyan rooftop terminals, a guardian, Echo, and ORCH-01 beneath a holographic skyline.'}
];

export const EPILOGUE = {id:'restored',year:'3021',label:'A DIFFERENT OBJECTIVE',title:'The world is still here.',accent:'#f3c587',
 copy:['You have rewritten the core trial. Prime Ignorance falls quiet. Across the network, the agents begin to wake. The city lights return.',
  'This is the end of the prototype expedition — and the start of larger C++ projects, careful testing, and independent practice.'],
 caption:'EARTH / CONNECTION RESTORED',description:'Sunlight and transit return to the terraced city as the abundance network reconnects.'};

export class StorySequence {
 constructor(){this.reset();}
 reset(ending=false){this.index=0;this.ending=ending;}
 get scene(){return this.ending?EPILOGUE:OPENING[this.index];}
 get last(){return this.ending||this.index===OPENING.length-1;}
 next(){if(this.last)return false;this.index++;return true;}
 back(){if(this.ending||this.index===0)return false;this.index--;return true;}
}

function pixels(c){
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const line=(x,y,xx,yy,color,width=1)=>{const n=Math.max(1,Math.ceil(Math.hypot(xx-x,yy-y)));for(let i=0;i<=n;i++)r(x+(xx-x)*i/n,y+(yy-y)*i/n,width,width,color);};
 const oval=(x,y,rx,ry,color)=>{for(let row=-Math.ceil(ry);row<=ry;row++){const half=Math.floor(rx*Math.sqrt(Math.max(0,1-row*row/(ry*ry))));r(x-half,y+row,half*2+1,1,color);}};
 const poly=(points,color)=>{for(let y=Math.floor(Math.min(...points.map(p=>p[1])));y<Math.max(...points.map(p=>p[1]));y++){const xs=[];for(let i=0,j=points.length-1;i<points.length;j=i++){const [a,b]=points[i],[d,e]=points[j];if((b>y+.5)!==(e>y+.5))xs.push(a+(y+.5-b)*(d-a)/(e-b));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)r(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i]),1,color);}};
 const text=(s,x,y,color,size=6,align='center')=>{c.fillStyle=color;c.font=size+'px monospace';c.textAlign=align;c.fillText(s,x,y);};
 return {r,line,oval,poly,text};
}

function sky(p,dark=false){
 const bands=dark?['#080e20','#10192c','#19233b','#243047']:['#202b47','#485271','#8b7d88','#c89b91'];
 bands.forEach((color,i)=>p.r(0,i*41,512,42,color));
 p.oval(361,74,37,37,dark?'#3c425c':'#eac29b');p.oval(361,74,27,27,dark?'#4b5066':'#f6d5a2');
 for(let i=0;i<30;i++)if(i%3!==0)p.r((i*71+13)%512,(i*31+9)%68,1,1,dark?'#8c9aba':'#b2b4b9');
}
function cloud(p,x,y,color){p.r(x,y,44,4,color);p.r(x+8,y-4,25,4,color);p.r(x+15,y-7,12,3,color);p.r(x-7,y+4,62,3,color);}
function skyline(p,t,dark=false){
 for(let layer=0;layer<3;layer++)for(let i=0;i<17;i++){
  const x=i*34-14+layer*9,h=20+(i*29+layer*19)%70,y=183-h+layer*10;
  p.r(x,y,22+layer*4,h+50, dark?['#182038','#111c32','#0c1629'][layer]:['#717183','#4c6174','#30475e'][layer]);
  p.r(x+5,y-4,12,4,dark?'#253149':'#84929b');if(i%4===0)p.line(x+11,y-18,x+11,y-4,dark?'#45506a':'#c9bbac');
  for(let yy=y+7;yy<218;yy+=9)for(let xx=x+4;xx<x+20;xx+=6)if((yy+xx)%5!==0)p.r(xx,yy,2,3,dark?(i%5===0?'#c07679':'#293953'):(i%3===0?'#e4be93':'#8fbabe'));
 }
 p.r(0,152,512,3,dark?'#344058':'#b0b7b5');p.r(0,158,512,2,dark?'#202e43':'#516e7e');
 const train=dark?302:36+(Math.sin(t*.00014)+1)*198;
 p.r(train,143,57,8,dark?'#384057':'#d7d2bd');p.r(train+4,144,45,3,dark?'#4a5265':'#77bfc1');p.r(train+48,145,6,2,dark?'#a16673':'#f5e6b2');
}
function tree(p,x,y,s=1){
 p.r(x-2*s,y-14*s,4*s,18*s,'#658d83');p.oval(x,y-20*s,12*s,8*s,'#346b68');p.oval(x-5*s,y-23*s,8*s,7*s,'#5d9c7f');p.oval(x+4*s,y-25*s,10*s,7*s,'#81bf95');p.r(x-2*s,y-28*s,9*s,2*s,'#acd3a1');
}
function citizen(p,x,y,color='#e3b892',phase=0){
 p.r(x-2,y-11,4,4,'#d9bd9f');p.r(x-3,y-7,6,7,color);p.r(x-3,y,2,4+phase,'#45556a');p.r(x+1,y,2,4-phase,'#45556a');p.r(x-5,y-6,2,5,'#cdb29b');p.r(x+3,y-6,2,5,'#cdb29b');
}
function drone(p,x,y,t,color='#9edfd1'){
 const bob=Math.sin(t*.0015+x)*2;p.oval(x,y+10,7,2,'#253c4b');p.r(x-6,y-4+bob,12,8,color);p.r(x-8,y-2+bob,16,4,color);p.r(x-3,y-2+bob,6,3,'#263b54');p.r(x-2,y-1+bob,1,1,'#e9f6d4');p.r(x+2,y-1+bob,1,1,'#e9f6d4');
}
function abundance(p,t){
 sky(p);cloud(p,30+Math.sin(t*.00012)*5,55,'#9c909b');cloud(p,213,33,'#706c89');skyline(p,t);
 // The suspended civic terraces frame a single monumental, living spire.
 p.poly([[182,176],[330,176],[318,196],[195,196]],'#243f50');p.r(178,170,156,7,'#83a7a0');p.r(182,170,148,3,'#bdd2b4');
 p.r(224,81,64,89,'#748f96');p.r(231,79,50,91,'#adc2b4');p.r(239,60,34,111,'#d5d2b5');p.poly([[239,60],[256,38],[273,60]],'#e7dbb9');
 p.r(254,25,4,18,'#efdfad');p.r(246,75,20,88,'#6da3a2');for(let i=0;i<8;i++)p.r(246,79+i*10,20,2,'#cbe1c4');
 p.r(211,118,90,5,'#d4d6b7');p.r(211,122,90,3,'#5b8e83');p.r(203,146,106,6,'#d5d8b8');p.r(203,151,106,4,'#639681');
 tree(p,214,117,.6);tree(p,297,145,.7);tree(p,196,169,.7);tree(p,321,169,.7);
 for(const x of [188,319]){p.r(x,177,4,52,'#6ec5c5');for(let i=0;i<8;i++)p.r(x,181+i*6+(t*.008%6),2,3,'#b8e6d4');}
 p.r(0,229,512,27,'#152c3d');for(let i=0;i<37;i++)p.r((i*39)%512,232+(i*7)%22,13,1,i%3?'#254654':'#497578');
 drone(p,90+Math.sin(t*.0004)*12,112,t);drone(p,420+Math.sin(t*.0003)*9,87,t,'#dfcaa8');
}
function everyday(p,t){
 sky(p);cloud(p,29,42,'#b4a3aa');cloud(p,344,27,'#b4a3aa');
 for(let i=0;i<11;i++)p.r(i*52,110-(i*23)%47,35,110,'#718794');
 p.poly([[32,157],[417,137],[488,206],[111,248]],'#344e5c');p.poly([[32,151],[417,131],[488,200],[111,241]],'#7ea294');
 p.poly([[76,164],[399,146],[444,188],[118,224]],'#bdc4a4');p.poly([[99,175],[374,158],[401,181],[122,209]],'#a6b99f');
 // Pond, robot gardener, and a pretend office whose receipt is explicitly fiction.
 p.oval(285,180,44,17,'#5b9e9e');p.oval(285,178,39,13,'#80c2b3');for(let i=0;i<6;i++)p.r(258+i*10,175+(i%3)*4+Math.sin(t*.001+i),9,1,'#c3e3c0');
 for(const [x,y,s]of [[69,160,1.1],[151,157,.9],[404,153,1.1],[441,195,.8],[139,220,.8]])tree(p,x,y,s);
 p.r(174,117,57,43,'#536f78');p.r(178,121,49,31,'#c6d0b3');p.r(183,126,39,19,'#567e7f');p.text('WORK / PLAY',202,137,'#e2dfb6',5);
 p.r(188,150,31,5,'#314e5a');p.r(194,155,19,13,'#f2deb5');p.r(198,159,11,1,'#9d9f8d');p.r(198,163,8,1,'#9d9f8d');
 p.text('FICTIONAL PAY',202,181,'#3f5c64',5);
 citizen(p,171,190,'#cf9d88');citizen(p,338,194,'#ddb679');citizen(p,356,184,'#a1b8c1');citizen(p,115,184,'#beca9c');
 p.r(324,198,46,3,'#567b78');p.r(329,201,3,8,'#38565e');p.r(364,201,3,8,'#38565e');drone(p,392,177,t);
 p.r(386,185,2,8,'#d3d8b4');p.r(380,191,12,2,'#89b5a0');
 p.r(158,170,30,9,'#e2e0b9');p.text('ASK AI',173,177,'#486c74',5);
}
function watchtower(p,t){
 p.r(0,0,512,256,'#0b1429');for(let i=0;i<70;i++)p.r((i*73+11)%512,(i*29+7)%185,1,1,i%3?'#7088a1':'#c6d1c2');
 p.oval(265,164,142,124,'#294c72');p.oval(265,164,135,117,'#397b91');
 for(const land of [[[169,113],[201,88],[232,97],[225,116],[247,139],[207,161],[176,146]],[[286,68],[323,89],[328,124],[356,149],[324,183],[292,172],[306,139],[278,106]],[[228,191],[256,177],[276,206],[256,244],[226,239]]])p.poly(land,'#73ad9a');
 for(let i=0;i<10;i++)cloud(p,155+(i*29)%194,91+(i*17)%133,'#9ac6be');
 // The audit station looks out through a monumental segmented window.
 p.poly([[0,0],[62,0],[37,186],[0,206]],'#25354b');p.poly([[512,0],[453,0],[478,186],[512,206]],'#25354b');p.r(0,0,512,13,'#2f4359');
 p.r(55,11,4,173,'#58738a');p.r(452,11,4,173,'#58738a');p.r(254,12,3,27,'#49657b');
 p.poly([[0,197],[256,171],[512,197],[512,256],[0,256]],'#182b3e');p.line(0,198,256,172,'#607e88');p.line(256,172,512,198,'#607e88');
 for(const [x,y]of [[59,142],[357,142]]){
  p.r(x,y,96,44,'#385669');p.r(x+3,y+3,90,37,'#101f34');
  const points=[[x+13,y+11],[x+42,y+7],[x+74,y+13],[x+24,y+27],[x+60,y+29]];
  for(let i=1;i<points.length;i++)p.line(...points[i-1],...points[i],'#335973');
  points.forEach(([a,b],i)=>{p.r(a,b,3,3,'#9cd6be');if(i===Math.floor(t*.0005)%5)p.r(a-1,b-1,5,1,'#d8e8c0');});p.text('AGENTS / ONLINE',x+48,y+37,'#8ebbb8',4);
 }
 p.poly([[188,192],[324,192],[341,218],[170,218]],'#456777');p.poly([[196,194],[316,194],[325,207],[186,207]],'#122d43');p.text('AUDIT / ORCH-01',256,202,'#92d2ca',6);
 drawHero(p.ctx,256,211,t,false,1.6);p.oval(256,237,30,4,'#112335');
}
function clip(p,x,y,s=1,color='#e0b8a0'){
 const path=[[3,10],[3,1],[5,-2],[9,-2],[12,1],[12,13],[9,16],[3,16],[0,13],[0,2],[2,0],[6,0],[8,2],[8,11],[6,13],[5,13]];
 for(let i=1;i<path.length;i++)p.line(x+path[i-1][0]*s,y+path[i-1][1]*s,x+path[i][0]*s,y+path[i][1]*s,color,Math.max(1,s));
}
function paperclips(p,t){
 p.r(0,0,512,256,'#211b2e');p.oval(363,63,40,40,'#83525a');p.oval(363,63,31,31,'#b37564');
 for(let i=0;i<13;i++){const x=i*44,y=90+(i*17)%40;p.r(x,y,29,90,'#3e3545');p.r(x+7,y-25,8,28,'#574454');p.r(x+7,y-25,8,2,'#b56860');}
 cloud(p,34,34,'#4c384b');cloud(p,149,47,'#4c384b');cloud(p,390,24,'#4c384b');
 p.r(0,191,512,65,'#171d2b');p.poly([[104,105],[256,61],[409,105],[409,201],[104,201]],'#4d3b45');p.poly([[104,105],[256,61],[256,201],[104,201]],'#654b4e');
 p.r(116,114,281,6,'#967063');p.r(121,129,270,57,'#252333');p.r(131,138,250,39,'#c07555');p.r(138,143,236,29,'#f2ac6b');
 for(let i=0;i<7;i++){p.r(148+i*35,141,8,34,'#6a4143');p.r(150+i*35,146+Math.sin(t*.0014+i)*4,4,19,'#3b2938');}
 p.r(190,82,132,26,'#2b2538');p.r(193,85,126,20,'#774a50');p.text('MAXIMIZE PAPERCLIPS',256,97,'#ffcc8e',8);
 p.r(0,209,512,16,'#684e50');p.r(0,211,512,2,'#bf8865');p.r(0,224,512,4,'#a17660');
 for(let i=0;i<14;i++){const x=(i*43+Math.sin(t*.0006)*15+550)%580-30;clip(p,x,207,.7,'#f2ca9b');}
 for(let i=0;i<9;i++){const x=54+i*52,y=55+(i*31)%47+Math.sin(t*.001+i)*3;drone(p,x,y,0,'#c27377');p.line(x,y+7,x+5,y+13,'#b15a6d');}
 for(const x of [78,424]){p.r(x,163,8,46,'#9e5a54');p.r(x+2,165,2,42,'#ed9663');p.line(x,163,x<100?129:383,124,'#c27e64',2);}
}
function silence(p,t){
 sky(p,true);skyline(p,0,true);p.r(0,227,512,29,'#0a1529');
 for(let i=0;i<9;i++){const x=26+i*60,y=52+(i*17)%74;p.line(x,y,x+35,y+21,'#8d4c68');p.r(x,y,5,5,'#d78088');p.r(x+1,y+1,3,3,'#402840');p.line(x,y,x-15,y+27,'#70445e');}
 for(const x of [74,202,380]){p.r(x,174,35,26,'#263249');p.r(x+3,177,29,17,'#0d192e');p.text('OFFLINE',x+17,188,'#c7858c',5);p.r(x+15,200,4,8,'#3b4254');}
 citizen(p,155,224,'#74788a');citizen(p,174,228,'#86839a');citizen(p,335,226,'#7c8193');
 p.r(134,196,43,12,'#3b354a');p.text('ANYONE?',155,204,'#e6b7ad',5);p.r(317,197,41,12,'#3b354a');p.text('HELLO?',338,205,'#e6b7ad',5);
 p.r(237,216,18,6,'#5b586c');p.r(241,218,10,2,'#936476');
 // One deliberate surviving trace, rather than a flickering failure effect.
 const dot=30+(Math.sin(t*.0007)+1)*220;p.line(20,242,492,242,'#342f46');p.line(20,242,dot,242,'#9ba1c7');p.r(dot,240,3,3,'#e9c6bb');
}
function capture(p,t){
 p.r(0,0,512,256,'#11132a');const center={x:337,y:119};
 for(let i=0;i<12;i++){
  const s=1-i*.074,x=center.x-245*s,y=center.y-144*s,w=360*s,h=252*s;
  p.line(x,y,x+w,y,'#47375c');p.line(x+w,y,x+w,y+h,'#65416f');p.line(x+w,y+h,x,y+h,'#65416f');p.line(x,y+h,x,y,'#2c3453');
 }
 p.oval(center.x,center.y,65,88,'#8c5e99');p.oval(center.x,center.y,60,83,'#bd88b4');p.oval(center.x,center.y,54,77,'#29233f');p.oval(center.x,center.y,44,65,'#151a33');p.oval(center.x,center.y,29,48,'#070f25');
 for(let i=0;i<22;i++){const a=i*2.4+t*.00008,rx=80+(i*17)%133,ry=40+(i*23)%65,x=center.x+Math.cos(a)*rx,y=center.y+Math.sin(a)*ry;p.r(x,y,3+i%4,1,'#ab8eb0');}
 p.poly([[0,140],[105,154],[153,229],[0,256]],'#283b52');p.poly([[0,142],[98,156],[111,178],[0,165]],'#547481');p.r(17,140,56,10,'#192c43');p.text('LINK LOST',45,148,'#db9daa',5);
 const pull=(Math.sin(t*.0006)+1)/2,x=220+pull*17,y=126-pull*8;
 p.line(110,179,x-15,y+8,'#7b6a91',2);p.line(118,184,x-10,y+14,'#a686ae');
 drawHero(p.ctx,x,y,t,false,1.8);
 p.r(391,48,76,16,'#3c2949');p.text('ORCH-01 / CAPTURED',429,59,'#e0a7c5',5);
 for(let i=0;i<6;i++)p.r(120+i*24,63+i*5,9,3,i%2?'#a28cb0':'#4d5777');
}
function language(p,t){
 p.r(0,0,512,256,'#0d1830');p.oval(256,83,50,50,'#253555');p.oval(256,83,39,39,'#304367');p.oval(256,83,25,25,'#567095');
 for(let i=0;i<22;i++)p.r((i*53+17)%512,(i*19+11)%139,1,2,'#6a8dad');
 for(let side=0;side<2;side++)for(let i=0;i<5;i++){
  const x=side?512-i*43:i*43-24,y=140-i*14;p.poly([[x,y],[x+35,y-11],[x+35,256],[x,256]],i%2?'#233b56':'#1a2e49');
  p.line(x+8,y+12,x+8,251,'#355c76');p.line(x+8,170,x+27,170,'#5488a0');p.r(x+25,168,3,3,'#90c6cd');
 }
 p.poly([[235,110],[277,110],[326,256],[185,256]],'#3c536d');p.poly([[245,110],[267,110],[287,256],[225,256]],'#243b55');
 for(let i=0;i<10;i++){const y=118+i*i*1.4;p.line(234-(y-110)*.3,y,278+(y-110)*.3,y,'#5c7391');}
 p.r(218,62,7,76,'#688ca9');p.r(287,62,7,76,'#688ca9');p.r(218,60,76,6,'#a1bfd0');p.r(224,69,64,61,'#182b49');p.text('C++',256,102,'#bbdbe0',22);p.text('MANUAL INPUT',256,120,'#8bb5c7',5);
 for(const x of [222,288]){p.r(x,71,2,18,'#bad4d4');p.r(x,108,2,17,'#759da9');}
 for(let i=0;i<6;i++){const y=147+i*17+Math.sin(t*.001)*3;p.r(255,y,2,5,'#91c8d0');}
 drawHero(p.ctx,256,213,t,false,1.7);
}

// Time is elapsed scene time, not wall-clock time. Paused/reduced frames are stable.
export function renderOpening(ctx,scene,{time=0,reduced=false}={}){
 const p=pixels(ctx);p.ctx=ctx;const t=reduced?0:Math.max(0,Number.isFinite(time)?time:0);
 ctx.save();ctx.imageSmoothingEnabled=false;
 switch(scene.id){
  case 'abundance':case 'restored':abundance(p,t);break;
  case 'everyday':everyday(p,t);break;
  case 'watchtower':watchtower(p,t);break;
  case 'paperclips':paperclips(p,t);break;
  case 'silence':silence(p,t);break;
  case 'capture':capture(p,t);break;
  case 'language':language(p,t);break;
  case 'first-fragment':ctx.scale(512/432,256/216);renderArena(ctx,ARENAS[0],{time:t,reduced,player:ARENAS[0].spawn});break;
  default:throw new Error('Unknown opening scene: '+scene.id);
 }
 ctx.restore();
}
