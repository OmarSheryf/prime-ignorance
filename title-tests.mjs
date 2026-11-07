import test from 'node:test';
import assert from 'node:assert/strict';
import {drawTitleCity,TitleScene} from './dist/title-scene.js';
import {newSave,migrateSave} from './dist/progression.js';
import {lessons,legacyLessons} from './dist/curriculum.js';

function context(){const commands=[];return {commands,save(){},restore(){},scale(){},fillRect(...values){assert.ok(values.every(Number.isFinite));assert.ok(values[2]>=0&&values[3]>=0);commands.push([...values,this.fillStyle]);}};}
function frame(time,reduced){const ctx=context();drawTitleCity(ctx,{time,reduced});return JSON.stringify(ctx.commands);}
test('title city animates finite pixel geometry and supplies a deterministic reduced-motion still',()=>{
 assert.notEqual(frame(0,false),frame(5000,false));assert.equal(frame(0,true),frame(5000,true));
});
test('title scenery cancels work while paused, reduced, hidden, and outside the menu',()=>{
 const old={document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame};
 const pending=new Map(),events={};let n=0;const ctx=context();
 globalThis.document={hidden:false,addEventListener:(name,fn)=>events[name]=fn};globalThis.requestAnimationFrame=fn=>{pending.set(++n,fn);return n;};globalThis.cancelAnimationFrame=id=>pending.delete(id);
 try{const scene=new TitleScene({width:1280,height:720,getContext:()=>ctx});scene.start();assert.equal(pending.size,1);scene.setPaused(true);assert.equal(pending.size,0);scene.setPaused(false);assert.equal(pending.size,1);scene.setReduced(true);assert.equal(pending.size,0);scene.setReduced(false);assert.equal(pending.size,1);document.hidden=true;events.visibilitychange();assert.equal(pending.size,0);document.hidden=false;events.visibilitychange();assert.equal(pending.size,1);scene.stop();assert.equal(pending.size,0);events.visibilitychange();assert.equal(pending.size,0);}
 finally{Object.assign(globalThis,old);}
});
test('larger editor defaults and preferences survive save migration without losing legacy sizes',()=>{
 assert.equal(newSave().settings.font,18);
 for(const size of [13,15,18,21,24]){const save=newSave();save.settings.font=size;assert.equal(migrateSave(save,lessons,legacyLessons.map(l=>l.id)).settings.font,size);}
});
