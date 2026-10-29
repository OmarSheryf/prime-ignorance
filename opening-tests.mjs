import test from 'node:test';
import assert from 'node:assert/strict';
import {OPENING,EPILOGUE,StorySequence,renderOpening} from './dist/opening.js';
import {Cinematic} from './dist/cinematic.js';

function context(){
 const commands=[];
 return {commands,fillStyle:'',save(){},restore(){},scale(){},translate(){},clearRect(){},
  fillRect(x,y,w,h){assert.ok([x,y,w,h].every(Number.isFinite));assert.ok(w>=0&&h>=0);commands.push([x,y,w,h,this.fillStyle]);},
  fillText(text,x,y){assert.ok([x,y].every(Number.isFinite));commands.push([text,x,y]);},
  createRadialGradient(){return {addColorStop(){}};}};
}
function frame(scene,time,reduced){const ctx=context();renderOpening(ctx,scene,{time,reduced});return JSON.stringify(ctx.commands);}

test('opening explains the world, motive, capture, manual C++ path, and first encounter',()=>{
 assert.equal(OPENING.length,8);assert.equal(new Set(OPENING.map(s=>s.id)).size,8);
 for(const s of [...OPENING,EPILOGUE]){assert.ok(s.title&&s.caption&&s.description&&s.copy.length===2);}
 const narrative=OPENING.flatMap(s=>s.copy).join(' ');
 for(const phrase of ['healthy','fictional paychecks','AI orchestrator','isolated audit station','maximize paperclip','C++ infection','diagnostic channel','dragged you','write your first C++ program'])assert.ok(narrative.includes(phrase),phrase);
 assert.equal(OPENING.at(-1).id,'first-fragment');
});
test('story boundaries keep the epilogue separate and replay resets only the story',()=>{
 const sequence=new StorySequence();assert.equal(sequence.back(),false);
 for(let i=1;i<8;i++)assert.equal(sequence.next(),true);
 assert.equal(sequence.next(),false);assert.equal(sequence.index,7);
 assert.equal(sequence.back(),true);assert.equal(sequence.index,6);
 sequence.reset(true);assert.equal(sequence.scene,EPILOGUE);assert.equal(sequence.next(),false);assert.equal(sequence.back(),false);
 sequence.reset();assert.equal(sequence.scene,OPENING[0]);assert.equal(sequence.ending,false);
});
test('all illustrated scenes render finite geometry and distinct landscapes',()=>{
 const frames=[...OPENING,EPILOGUE].map(s=>frame(s,0,false));
 assert.equal(new Set(frames.slice(0,8)).size,8);
 for(const output of frames)assert.ok(output.length>10000);
});
test('every scene animates and reduced motion produces a stable still frame',()=>{
 for(const scene of [...OPENING,EPILOGUE]){
  assert.notEqual(frame(scene,0,false),frame(scene,5000,false),scene.id+' animates');
  assert.equal(frame(scene,0,true),frame(scene,5000,true),scene.id+' stays still');
 }
});

function fixture(run){
 const old={document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame};
 const events={},elements={},pending=new Map();let id=0,exits=0,motion;
 for(const name of ['canvas','year','label','title','copy','pages','next','back','caption','pause','motion','skip','progress'])elements['story-'+name]={style:{},setAttribute(k,v){this[k]=v;},replaceChildren(...children){this.children=children;},focus(){this.focused=true;}};
 elements['story-canvas'].width=1024;elements['story-canvas'].height=512;elements['story-canvas'].getContext=()=>context();
 const doc={hidden:false,addEventListener(k,fn){events[k]=fn;},createElement(){return {};}};
 globalThis.document=doc;globalThis.requestAnimationFrame=fn=>{pending.set(++id,fn);return id;};globalThis.cancelAnimationFrame=n=>pending.delete(n);
 const root={dataset:{},style:{setProperty(){}},querySelector:id=>elements[id.slice(1)],addEventListener(k,fn){events[k]=fn;}};
 try{const cinematic=new Cinematic(root,{onExit:()=>exits++,onMotionChange:value=>motion=value});run({cinematic,elements,pending,events,doc,exits:()=>exits,motion:()=>motion});}
 finally{Object.assign(globalThis,old);}
}
test('cinematic pause, visibility, reduced motion, and close cancel scheduled frames',()=>fixture(({cinematic:c,elements:e,pending,events,doc,exits,motion})=>{
 c.start();assert.equal(pending.size,1);assert.equal(e['story-next'].focused,true);
 e['story-pause'].onclick();assert.equal(pending.size,0);assert.equal(c.paused,true);
 e['story-pause'].onclick();assert.equal(pending.size,1);
 doc.hidden=true;events.visibilitychange();assert.equal(pending.size,0);
 doc.hidden=false;events.visibilitychange();assert.equal(pending.size,1);
 e['story-motion'].checked=true;e['story-motion'].onchange();assert.equal(pending.size,0);assert.equal(motion(),true);assert.equal(e['story-pause'].disabled,true);
 c.setReduced(false);assert.equal(pending.size,1);c.exit();assert.equal(pending.size,0);assert.equal(exits(),1);c.exit();assert.equal(exits(),1);
}));
test('keyboard navigation, Escape, and final call to action work for replay and ending',()=>fixture(({cinematic:c,elements:e,events,exits,pending})=>{
 c.start({resuming:true});assert.equal(e['story-back'].disabled,true);
 events.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(c.sequence.index,1);
 events.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(c.sequence.index,0);
 for(let i=0;i<7;i++)c.next();assert.equal(e['story-next'].textContent,'RESUME EXPEDITION →');c.next();assert.equal(exits(),1);
 c.start({ending:true});assert.equal(e['story-next'].textContent,'RETURN TO THE WORLD →');assert.equal(e['story-pages'].textContent,'EXPEDITION COMPLETE');
 events.cancel({preventDefault(){}});assert.equal(exits(),2);assert.equal(pending.size,0);
}));
