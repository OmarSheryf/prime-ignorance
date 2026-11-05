import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,legacyLessons} from './dist/curriculum.js';
import {newSave,migrateSave,firstPending,canAccess,nextRequired} from './dist/progression.js';
import {workspaceFor,requestFor,evaluateResult,runEncounter,projectArchive} from './dist/judge.js';
import {solutions} from './reference-solutions.mjs';

test('101 encounters retain legacy IDs and ordered prerequisites, with projects in every world',()=>{
 assert.equal(lessons.length,101);for(const l of legacyLessons)assert.ok(lessons.some(n=>n.id===l.id));
 for(const [i,l]of lessons.entries()){
  assert.ok(Object.hasOwn(solutions,l.id),l.id+' reference');assert.ok(!Object.hasOwn(Object.prototype,l.id),'safe keyed save ID');
  assert.deepEqual(l.prerequisites,i?[lessons[i-1].id]:[]);assert.ok(l.minutes>=10);assert.ok(l.phase&&l.hints.length===3);
 }
 for(let r=0;r<14;r++)assert.ok(lessons.some(l=>l.region===r&&l.phase==='project'),'region '+r+' project');
 const index=id=>lessons.findIndex(l=>l.id===id);
 for(const [a,b]of [['destruction','raii'],['lambda','algorithm'],['optional','score-project'],['exceptions','unwind'],['iterators','erase-iterator'],['composition','combat-project'],['thread-join','atomic'],['regression-suite','capstone-project']])assert.ok(index(a)<index(b),a+' before '+b);
});
test('legacy save migration retains work and requires newly inserted foundations',()=>{
 const old={...newSave(),version:1,current:8,completed:legacyLessons.slice(0,8).map(l=>l.id),drafts:{energy:'int energy=42;'},hints:{energy:2},introSeen:true};
 const s=migrateSave(old,lessons,legacyLessons.map(l=>l.id));assert.equal(s.version,2);assert.equal(s.drafts.energy,old.drafts.energy);assert.equal(s.completed.length,8);assert.equal(s.hints.energy,2);assert.equal(s.introSeen,true);
 assert.equal(s.currentId,'terminal-project');assert.equal(firstPending(lessons,s.completed),lessons.findIndex(l=>l.id==='terminal-project'));
 const energy=lessons.findIndex(l=>l.id==='energy');assert.equal(canAccess(lessons,s.completed,energy),true);assert.equal(nextRequired(lessons,s.completed,energy),s.current);
});
test('stable current IDs survive reordering and saved project files cannot replace locked checks',()=>{
 const l=lessons.find(l=>l.id==='header-contract'),index=lessons.indexOf(l),s=newSave();s.currentId=l.id;s.current=index;s.completed=lessons.slice(0,index).map(x=>x.id);
 s.workspaces[l.id]={'power.hpp':'int restoredPower(int,int);','checks.cpp':'fake checks','../other.cpp':'bad'};s.notes[l.id]='Test zero';
 const restored=migrateSave(s,lessons,legacyLessons.map(x=>x.id)),workspace=workspaceFor(l,restored);
 assert.equal(restored.currentId,l.id);assert.equal(restored.notes[l.id],'Test zero');assert.equal(workspace['power.hpp'],s.workspaces[l.id]['power.hpp']);assert.equal(workspace['checks.cpp'],l.files['checks.cpp']);assert.equal(workspace['../other.cpp'],undefined);
});
test('compiler requests send stdin and separate cpp files but not build recipes as flags',()=>{
 const l=lessons.find(l=>l.id==='header-contract'),r=requestFor(l,workspaceFor(l,newSave()),'21\n');
 assert.equal(r.source,l.files['checks.cpp']);assert.equal(r.options.executeParameters.stdin,'21\n');assert.match(r.options.userArguments,/power\.cpp/);assert.deepEqual(r.files.map(f=>f.filename),['power.hpp','power.cpp']);assert.ok(!r.options.userArguments.includes('CMakeLists'));assert.equal(r.allowStoreCodeDebug,false);
 assert.throws(()=>requestFor(l,{...workspaceFor(l,newSave()),'../oops.cpp':'bad'}));
});
const output=(text,extra={})=>({code:0,didExecute:true,buildResult:{code:0,stderr:[]},stdout:[{text}],stderr:[],...extra});
test('failed execution, truncation, nonzero exit, and wrong output cannot pass',()=>{
 assert.equal(evaluateResult(output('42'),'42').passed,true);
 for(const r of [output('41'),output('42',{timedOut:true}),output('42',{truncated:true}),output('42',{code:1}),output('42',{didExecute:false}),output('42',{buildResult:{code:1,stderr:[{text:'error'}]}})])assert.equal(evaluateResult(r,'42').passed,false);
});
test('one correct stdin case is insufficient and all supplied inputs are executed',async()=>{
 const l=lessons.find(l=>l.id==='read-input'),workspace={[l.id+'.cpp']:solutions[l.id]},requests=[];
 const result=await runEncounter(l,workspace,{fetchImpl:async(url,options)=>{const r=JSON.parse(options.body);requests.push(r);return {ok:true,json:async()=>output(requests.length===1?'20':'wrong')};}});
 assert.equal(result.passed,false);assert.equal(requests.length,3);assert.deepEqual(requests.map(r=>r.options.executeParameters.stdin),l.cases.map(c=>c.stdin));
 const good=await runEncounter(l,workspace,{fetchImpl:async(url,options)=>{const input=JSON.parse(options.body).options.executeParameters.stdin;return {ok:true,json:async()=>output(l.cases.find(c=>c.stdin===input).expected)};}});assert.equal(good.passed,true);
});
test('compile failures stop requests and service failures cannot manufacture success',async()=>{
 const l=lessons.find(l=>l.id==='read-input');let calls=0;
 const result=await runEncounter(l,workspaceFor(l,newSave()),{fetchImpl:async()=>{calls++;return {ok:true,json:async()=>output('',{buildResult:{code:1,stderr:[{text:'syntax error'}]}})};}});
 assert.equal(result.passed,false);assert.equal(calls,1);
 await assert.rejects(()=>runEncounter(l,workspaceFor(l,newSave()),{fetchImpl:async()=>({ok:false,status:503})}),/HTTP 503/);
});
test('exported ZIP preserves ordinary UTF-8 source and build files byte-for-byte',async()=>{
 const files={'power.hpp':'// café\nint power();','power.cpp':'int power(){return 2;}','CMakeLists.txt':'project(quest)\n'};
 const bytes=new Uint8Array(await projectArchive(files).arrayBuffer()),view=new DataView(bytes.buffer),decoder=new TextDecoder();let offset=0;const found={};
 while(view.getUint32(offset,true)===0x04034b50){const length=view.getUint32(offset+18,true),nameSize=view.getUint16(offset+26,true),extra=view.getUint16(offset+28,true),start=offset+30+nameSize+extra;const name=decoder.decode(bytes.slice(offset+30,offset+30+nameSize));found[name]=decoder.decode(bytes.slice(start,start+length));offset=start+length;}
 assert.deepEqual(found,files);assert.equal(view.getUint32(offset,true),0x02014b50);assert.equal(view.getUint32(bytes.length-22,true),0x06054b50);
});
