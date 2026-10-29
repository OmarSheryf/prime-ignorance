import {OPENING,StorySequence,renderOpening} from './opening.js';

export class Cinematic {
 constructor(root,{onExit,onMotionChange,reduced=false,resuming=false}={}){
  this.root=root;this.onExit=onExit;this.onMotionChange=onMotionChange;this.reduced=reduced;this.resuming=resuming;
  this.sequence=new StorySequence();this.active=false;this.paused=false;this.elapsed=0;this.last=null;this.frame=null;
  const el=id=>root.querySelector('#'+id);this.canvas=el('story-canvas');this.ctx=this.canvas.getContext('2d');
  this.ui=Object.fromEntries(['year','label','title','copy','pages','next','back','caption','pause','motion','skip','progress'].map(k=>[k,el('story-'+k)]));
  this.ui.next.onclick=()=>this.next();this.ui.back.onclick=()=>this.back();this.ui.skip.onclick=()=>this.exit();
  this.ui.pause.onclick=()=>{this.paused=!this.paused;this.syncMotion();};
  this.ui.motion.onchange=()=>{this.setReduced(this.ui.motion.checked);this.onMotionChange?.(this.reduced);};
  root.addEventListener('keydown',e=>{
   if(e.altKey||e.ctrlKey||e.metaKey||e.repeat)return;
   if(e.key==='ArrowRight'){e.preventDefault();this.next();}
   if(e.key==='ArrowLeft'){e.preventDefault();this.back();}
  });
  root.addEventListener('cancel',e=>{e.preventDefault();this.exit();});
  root.addEventListener('close',()=>this.stop());
  document.addEventListener('visibilitychange',()=>{this.last=null;if(document.hidden)this.cancel();else this.schedule();});
 }
 start({ending=false,resuming=this.resuming}={}){
  this.resuming=resuming;this.sequence.reset(ending);this.paused=false;this.active=true;this.renderPage();
  this.ui.next.focus({preventScroll:true});
 }
 renderPage(){
  this.elapsed=0;this.last=null;const s=this.sequence.scene,u=this.ui;
  this.root.dataset.scene=s.id;this.root.style.setProperty('--story-accent',s.accent);
  u.year.textContent=s.year;u.label.textContent=s.label;u.title.textContent=s.title;u.caption.textContent=s.caption;
  u.copy.replaceChildren(...s.copy.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
  u.pages.textContent=this.sequence.ending?'EXPEDITION COMPLETE':String(this.sequence.index+1).padStart(2,'0')+' / '+String(OPENING.length).padStart(2,'0');
  u.progress.style.width=this.sequence.ending?'100%':(this.sequence.index+1)/OPENING.length*100+'%';
  u.back.disabled=this.sequence.ending||this.sequence.index===0;
  u.next.textContent=this.sequence.ending?'RETURN TO THE WORLD →':this.sequence.last?(this.resuming?'RESUME EXPEDITION →':'ENTER NEON RAIN →'):'CONTINUE →';
  u.skip.textContent=this.sequence.ending||this.resuming?'RETURN TO GAME ×':'SKIP INTRO ×';
  this.canvas.setAttribute('aria-label',s.description);this.draw();this.syncMotion();
  // A short upward settle marks the cut. No flashing, shake, or timed narration.
  this.transition?.cancel();
  if(!this.reduced&&this.canvas.animate)this.transition=this.canvas.animate([{opacity:.45,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'cubic-bezier(0.2,0,0.2,1)'});
 }
 next(){if(!this.active)return;if(this.sequence.next())this.renderPage();else this.exit();}
 back(){if(this.active&&this.sequence.back())this.renderPage();}
 exit(){if(!this.active)return;this.stop();this.onExit?.();}
 setReduced(value){this.reduced=!!value;if(this.reduced)this.transition?.cancel();this.syncMotion();this.draw();}
 syncMotion(){
  this.ui.motion.checked=this.reduced;this.ui.pause.disabled=this.reduced;
  this.ui.pause.textContent=this.reduced?'MOTION REDUCED':this.paused?'▶ PLAY ANIMATION':'Ⅱ PAUSE ANIMATION';
  this.ui.pause.setAttribute('aria-pressed',String(this.paused||this.reduced));
  if(this.paused||this.reduced)this.cancel();else this.schedule();
 }
 draw(){
  this.ctx.save();this.ctx.scale(this.canvas.width/512,this.canvas.height/256);
  renderOpening(this.ctx,this.sequence.scene,{time:this.elapsed,reduced:this.reduced});this.ctx.restore();
 }
 schedule(){if(!this.active||this.paused||this.reduced||document.hidden||this.frame!==null)return;this.frame=requestAnimationFrame(t=>this.tick(t));}
 tick(t){
  this.frame=null;if(!this.active||this.paused||this.reduced||document.hidden){this.last=null;return;}
  if(this.last===null)this.last=t;
  if(t-this.last>=1000/24){this.elapsed+=Math.min(100,t-this.last);this.last=t;this.draw();}
  this.schedule();
 }
 cancel(){if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this.last=null;}
 stop(){this.active=false;this.cancel();this.transition?.cancel();}
}
