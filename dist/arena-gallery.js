import {ARENAS} from './arenas.js';
import {renderArena} from './arena-art.js';
const grid=document.getElementById('arena-grid'),motion=document.getElementById('archive-motion');
const preference=matchMedia('(prefers-reduced-motion: reduce)');motion.checked=preference.matches;
const previews=ARENAS.map((arena,index)=>{
 const figure=document.createElement('figure');figure.style.setProperty('--tint',arena.palette.accent);
 const head=document.createElement('header'),title=document.createElement('h2'),number=document.createElement('span');title.textContent=arena.name;number.textContent='ARENA 0'+(index+1);head.append(title,number);
 const canvas=document.createElement('canvas');canvas.width=864;canvas.height=432;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',arena.description);canvas.dataset.arena=arena.id;
 const caption=document.createElement('figcaption');caption.textContent=arena.description;const note=document.createElement('span');note.textContent='SECTORS '+ARENAS.map((_,i)=>index+i*4).filter(i=>i<14).map(i=>String(i).padStart(2,'0')).join(' / ')+' · '+arena.landmark.toUpperCase();caption.append(note);
 figure.append(head,canvas,caption);grid.append(figure);return {arena,index,canvas,c:canvas.getContext('2d')};
});
let last=-Infinity,frame;
function draw(time){
 if(time-last>=1000/24||motion.checked){
  for(const {arena,index,canvas,c}of previews){c.save();c.imageSmoothingEnabled=false;c.scale(canvas.width/432,canvas.height/216);renderArena(c,arena,{time,region:index,reduced:motion.checked});c.restore();}
  last=time;
 }
 if(!motion.checked&&!document.hidden)frame=requestAnimationFrame(draw);
}
function refresh(){cancelAnimationFrame(frame);last=-Infinity;draw(performance.now());}
motion.addEventListener('change',refresh);preference.addEventListener('change',e=>{motion.checked=e.matches;refresh();});document.addEventListener('visibilitychange',refresh);refresh();
