// Logical coordinates are 432 × 216; one logical pixel is two canvas pixels.
// Art, collision, navigation, and interaction all read the same arena data.
const rect=(x,y,w,h,kind='machine')=>({x,y,w,h,kind});
export const ARENAS = [
 {
  id:'neon-rain',name:'Neon Rain',tagline:'A rooftop above a city that never sleeps.',landmark:'Holographic skyline',
  description:'A rain-soaked rooftop, cyan skybridges, magenta holograms, and a luminous city skyline.',
  palette:{void:'#080d20',floor:'#162a43',tile:'#1c3550',edge:'#375977',accent:'#66e3f3',secondary:'#ee76cf',light:'#d3f6ff',enemy:'#ec83be'},
  floor:[[48,88],[158,88],[158,66],[184,66],[184,48],[248,48],[248,66],[274,66],[274,88],[384,88],[384,181],[48,181]],
  spawn:{x:216,y:158},guardian:{x:216,y:86},echo:{x:154,y:155},exit:{x:216,y:57,facing:'north'},
  terminals:[{x:112,y:124},{x:320,y:124}],
  obstacles:[rect(66,146,36,16,'ac-unit'),rect(330,147,35,15,'ac-unit'),rect(185,115,14,15,'junction'),rect(234,115,14,15,'junction')]
 },
 {
  id:'helios-foundry',name:'Helios Foundry',tagline:'An industrial sun, held in a cage.',landmark:'Fusion crucible',
  description:'An amber fusion foundry with a sun reactor, molten channels, steel catwalks, and industrial pistons.',
  palette:{void:'#160e14',floor:'#3b302e',tile:'#4b3c35',edge:'#80614b',accent:'#ffb44f',secondary:'#ff674a',light:'#fff0b0',enemy:'#f7b66c'},
  floor:[[60,65],[171,65],[171,55],[261,55],[261,65],[376,65],[376,183],[278,183],[278,193],[154,193],[154,183],[60,183]],
  spawn:{x:216,y:174},guardian:{x:216,y:92},echo:{x:289,y:164},exit:{x:77,y:124,facing:'west'},
  terminals:[{x:137,y:113},{x:313,y:113}],
  obstacles:[rect(199,123,34,24,'heat-vent'),rect(91,151,51,13,'conveyor'),rect(308,149,45,14,'conveyor')]
 },
 {
  id:'verdant-array',name:'Verdant Array',tagline:'Even the machine dreams of a garden.',landmark:'Neural world-tree',
  description:'A bioluminescent greenhouse, a circuit-rooted world-tree, turquoise pools, and illuminated botanical pods.',
  palette:{void:'#071b20',floor:'#1a3d39',tile:'#224d43',edge:'#477968',accent:'#a7ef88',secondary:'#62ddd3',light:'#e5ffd2',enemy:'#a6cf8f'},
  floor:[[81,76],[134,76],[134,60],[169,60],[169,49],[263,49],[263,60],[299,60],[299,76],[351,76],[351,175],[292,175],[292,189],[140,189],[140,175],[81,175]],
  spawn:{x:216,y:170},guardian:{x:216,y:89},echo:{x:278,y:161},exit:{x:335,y:125,facing:'east'},
  terminals:[{x:132,y:113},{x:294,y:110}],
  obstacles:[rect(181,120,70,24,'pool'),rect(99,143,30,17,'planter'),rect(310,145,24,17,'planter')]
 },
 {
  id:'event-horizon',name:'Event Horizon',tagline:'The last platform at the edge of infinity.',landmark:'Accretion halo',
  description:'An orbital octagon above a black hole, with icy starlight, floating crystal pylons, and violet gravity rings.',
  palette:{void:'#08091a',floor:'#222743',tile:'#2d3354',edge:'#626ca0',accent:'#bbbeff',secondary:'#72d5ff',light:'#f0efff',enemy:'#bd9ee9'},
  floor:[[133,67],[299,67],[354,102],[367,129],[354,163],[299,191],[133,191],[78,163],[65,129],[78,102]],
  spawn:{x:216,y:168},guardian:{x:216,y:102},echo:{x:264,y:162},exit:{x:216,y:78,facing:'north'},
  terminals:[{x:121,y:134},{x:311,y:134}],
  obstacles:[rect(156,119,15,21,'crystal'),rect(261,119,15,21,'crystal'),rect(202,132,28,13,'gravity-well')]
 }
];

export function arenaForRegion(region){
 const index=Number.isFinite(region)?Math.max(0,Math.floor(region)):0;
 return ARENAS[index%ARENAS.length];
}

export function insidePolygon(points,x,y){
 let inside=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const [ax,ay]=points[i],[bx,by]=points[j];
  if(((ay>y)!==(by>y))&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
 }
 return inside;
}

export function arenaSolids(arena){
 return [...arena.obstacles,...arena.terminals.map(t=>rect(t.x-9,t.y-7,18,12)),
  rect(arena.guardian.x-19,arena.guardian.y-5,38,16)];
}

export function isWalkable(arena,x,y,radius=4){
 // Cardinal and diagonal samples keep the whole character inside the deck.
 for(const [dx,dy]of [[0,0],[-1,0],[1,0],[0,-1],[0,1],[-.71,-.71],[.71,-.71],[-.71,.71],[.71,.71]]){
  if(!insidePolygon(arena.floor,x+dx*radius,y+dy*radius))return false;
 }
 return !arenaSolids(arena).some(s=>x+radius>s.x&&x-radius<s.x+s.w&&y+radius>s.y&&y-radius<s.y+s.h);
}

export function moveWithinArena(arena,position,dx,dy){
 let {x,y}=position;
 // Small substeps prevent tunnelling through thin props after a slow frame.
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/2));
 for(let i=0;i<steps;i++){
  if(isWalkable(arena,x+dx/steps,y))x+=dx/steps;
  if(isWalkable(arena,x,y+dy/steps))y+=dy/steps;
 }
 return {x,y};
}

export function clearPath(arena,from,to){
 const n=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/2));
 for(let i=0;i<=n;i++)if(!isWalkable(arena,from.x+(to.x-from.x)*i/n,from.y+(to.y-from.y)*i/n))return false;
 return true;
}

// Breadth-first navigation on a 4 px grid. Click-to-walk routes around props;
// keyboard movement uses the identical collision predicate.
export function findArenaPath(arena,start,destination){
 if(!isWalkable(arena,start.x,start.y))return [];
 if(isWalkable(arena,destination.x,destination.y)&&clearPath(arena,start,destination))return [destination];
 const step=4,cols=108,rows=54;
 const point=id=>({x:(id%cols)*step+2,y:Math.floor(id/cols)*step+2});
 const nearest=(p,connect)=>{
  let chosen=-1,best=Infinity;
  for(let id=0;id<cols*rows;id++){
   const q=point(id),distance=(q.x-p.x)**2+(q.y-p.y)**2;
   if(distance<best&&isWalkable(arena,q.x,q.y)&&(!connect||clearPath(arena,p,q))){best=distance;chosen=id;}
  }
  return chosen;
 };
 const first=nearest(start,true),goal=nearest(destination,false);
 if(first<0||goal<0)return [];
 const queue=[first],parents=new Map([[first,-1]]),walkable=new Map();
 const valid=id=>{if(!walkable.has(id)){const p=point(id);walkable.set(id,isWalkable(arena,p.x,p.y));}return walkable.get(id);};
 for(let head=0;head<queue.length&&!parents.has(goal);head++){
  const id=queue[head],x=id%cols,y=Math.floor(id/cols);
  for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){
   const nx=x+dx,ny=y+dy,next=ny*cols+nx;
   if(nx<0||ny<0||nx>=cols||ny>=rows||parents.has(next)||!valid(next))continue;
   if(dx&&dy&&(!valid(y*cols+nx)||!valid(ny*cols+x)))continue;
   parents.set(next,id);queue.push(next);
  }
 }
 if(!parents.has(goal))return [];
 const route=[];for(let id=goal;id!==-1;id=parents.get(id))route.push(point(id));route.reverse();
 // Remove redundant points only when the entire shortcut is collision-free.
 const smooth=[];let previous=start;
 for(let i=0;i<route.length;){let far=i;while(far+1<route.length&&clearPath(arena,previous,route[far+1]))far++;smooth.push(route[far]);previous=route[far];i=far+1;}
 if(isWalkable(arena,destination.x,destination.y)&&clearPath(arena,previous,destination))smooth.push(destination);
 return smooth;
}
