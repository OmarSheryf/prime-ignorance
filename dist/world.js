import {arenaForRegion,findArenaPath,moveWithinArena} from './arenas.js';
import {renderArena} from './arena-art.js';
export {drawAgent,drawHero} from './sprites.js';

export class World{
 constructor(canvas,onInteract,onPortal){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.ctx.imageSmoothingEnabled=false;
  this.onInteract=onInteract;this.onPortal=onPortal;this.keys=new Set();this.region=0;this.arena=arenaForRegion(0);
  this.x=this.arena.spawn.x*2;this.y=this.arena.spawn.y*2;this.complete=false;this.time=0;
  this.last=performance.now();this.running=true;this.target=null;this.path=[];this.paused=false;this.reduced=false;this.moving=false;
  if(typeof requestAnimationFrame==='function')this.frame=requestAnimationFrame(t=>this.tick(t));
 }
 setRegion(region,complete){
  if(region!==this.region){this.arena=arenaForRegion(region);this.x=this.arena.spawn.x*2;this.y=this.arena.spawn.y*2;this.target=null;this.path=[];this.keys.clear();}
  this.region=region;this.complete=complete;
 }
 nearTerminal(){return [...this.arena.terminals,this.arena.guardian].some(p=>Math.hypot(this.x/2-p.x,this.y/2-p.y)<43);}
 nearPortal(){return Math.hypot(this.x/2-this.arena.exit.x,this.y/2-this.arena.exit.y)<23;}
 interact(){
  if(this.complete&&this.nearPortal())this.onPortal();else if(this.nearTerminal())this.onInteract();else return false;return true;
 }
 click(event){
  if(this.paused)return;
  const bounds=this.canvas.getBoundingClientRect(),x=(event.clientX-bounds.left)*432/bounds.width,y=(event.clientY-bounds.top)*216/bounds.height;
  if([...this.arena.terminals,this.arena.guardian].some(p=>Math.hypot(x-p.x,y-(p.y-8))<16)){this.onInteract();return;}
  if(this.complete&&Math.hypot(x-this.arena.exit.x,y-(this.arena.exit.y-7))<18){this.onPortal();return;}
  this.path=findArenaPath(this.arena,{x:this.x/2,y:this.y/2},{x,y});this.target=this.path[0]??null;this.canvas.focus();
 }
 tick(t){
  const dt=Math.min(Math.max(0,(t-this.last)/1000),.04);this.last=t;this.time=t;
  if(!this.paused){
   let dx=(this.keys.has('d')||this.keys.has('arrowright')?1:0)-(this.keys.has('a')||this.keys.has('arrowleft')?1:0);
   let dy=(this.keys.has('s')||this.keys.has('arrowdown')?1:0)-(this.keys.has('w')||this.keys.has('arrowup')?1:0);
   const keyboard=dx!==0||dy!==0;if(keyboard){this.path=[];this.target=null;}
   else if(this.target){dx=this.target.x-this.x/2;dy=this.target.y-this.y/2;if(Math.hypot(dx,dy)<1){this.path.shift();this.target=this.path[0]??null;dx=dy=0;}}
   const distance=Math.hypot(dx,dy),step=Math.min(62.5*dt,keyboard?Infinity:distance);
   const next=distance?moveWithinArena(this.arena,{x:this.x/2,y:this.y/2},dx/distance*step,dy/distance*step):{x:this.x/2,y:this.y/2};
   this.moving=Math.hypot(this.x/2-next.x,this.y/2-next.y)>.001;this.x=next.x*2;this.y=next.y*2;
  }else this.moving=false;
  this.draw(t);if(this.running&&typeof requestAnimationFrame==='function')this.frame=requestAnimationFrame(time=>this.tick(time));
 }
 draw(t){
  const c=this.ctx;c.save();c.scale(this.canvas.width/432,this.canvas.height/216);
  renderArena(c,this.arena,{time:t,region:this.region,player:{x:this.x/2,y:this.y/2},moving:this.moving,recovered:this.complete,reduced:this.reduced});c.restore();
 }
 stop(){this.running=false;if(this.frame&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(this.frame);}
}
