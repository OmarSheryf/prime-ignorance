import {regions,lessons,legacyLessons} from './curriculum.js';
import {newSave,migrateSave,firstPending,canAccess,nextRequired} from './progression.js';
import {workspaceFor,runEncounter,projectArchive} from './judge.js';
import {World,drawAgent,drawHero} from './world.js';
import {arenaForRegion} from './arenas.js';
import {Cinematic} from './cinematic.js';
import {TitleScene} from './title-scene.js';
const $=id=>document.getElementById(id),SAVE_KEY='prime-ignorance-v1';
const defaults=()=>newSave(matchMedia('(prefers-reduced-motion: reduce)').matches);
const validateSave=s=>migrateSave(s,lessons,legacyLessons.map(l=>l.id),matchMedia('(prefers-reduced-motion: reduce)').matches);
let save;try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY));save=validateSave(raw);save.introSeen=!!raw.introSeen;}catch{save=defaults();}
let storageAvailable=true;function persist(){save.currentId=lessons[save.current].id;try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));$('save-state').textContent='AUTOSAVED';}catch{storageAvailable=false;$('save-state').textContent='SESSION ONLY';document.querySelector('.game-footer>span').textContent='STORAGE UNAVAILABLE · EXPORT YOUR SAVE IN SETTINGS';}}
let editor,editorLoading=false,activeFile='',loading=false,runId=0,controller,audioContext,audioTimer,ambientGain,lastStep=0;
const current=()=>lessons[save.current];const completed=id=>save.completed.includes(id);const firstUnsolved=()=>firstPending(lessons,save.completed);
let menuVisible=true,sceneryPaused=false;
const world=new World($('world'),openTerminal,advanceSector);world.reduced=save.settings.reduced;world.paused=true;world.suspended=true;
const titleScene=new TitleScene($('title-city'),{reduced:save.settings.reduced});
const cinematic=new Cinematic($('story-dialog'),{reduced:save.settings.reduced,onExit:()=>closeDialog('story-dialog'),onMotionChange:reduced=>{save.settings.reduced=reduced;world.reduced=reduced;update();}});
const workspaceControls=document.createElement('div');workspaceControls.className='workspace-controls';
workspaceControls.innerHTML='<div id="source-tabs" class="source-tabs" aria-label="Project files"></div><div id="test-input-panel"><label for="test-input-case">SUPPLIED TEST INPUT</label><select id="test-input-case" aria-label="Select supplied test input"></select><textarea id="test-input" rows="2" readonly aria-label="Supplied standard input"></textarea><small>Run checks each supplied input separately. Empty input represents EOF.</small></div><button id="download-project" class="text-button">EXPORT PROJECT ZIP ↗</button>';
document.querySelector('.editor-host').before(workspaceControls);
const reflection=document.createElement('div');reflection.className='lesson-section';reflection.innerHTML='<h3>PLAN · TRACE · REFLECT</h3><p id="planning-prompt"></p><label for="lesson-notes">Your reasoning (optional, saved on this device)</label><textarea id="lesson-notes" maxlength="4000" rows="4" placeholder="Predict a boundary case. After running, explain one correction and a new test you would add."></textarea><p><a href="PROJECTS.md" target="_blank" rel="noopener">PROJECT GUIDE & DESIGN DEFENSE ↗</a></p>';
$('hint-button').before(reflection);$('lesson-notes').oninput=()=>{save.notes[current().id]=$('lesson-notes').value;persist();};
$('test-input-case').onchange=()=>{$('test-input').value=current().cases[Number($('test-input-case').value)].stdin;};
$('download-project').onclick=()=>{const l=current(),files=workspaceFor(l,save);files['README.md']='# '+l.title+'\n\n'+l.task+'\n\nBuild: cmake -S . -B build\ncmake --build build\nctest --test-dir build --output-on-failure\n\nOr compile the .cpp files together with g++ -std=c++20 -pthread.\nSee PROJECTS.md in the game repository for the design defense.\n';const url=URL.createObjectURL(projectArchive(files)),a=document.createElement('a');a.href=url;a.download=l.id+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
const lines=[
'You used to tell agents what to do. Down here, you have to tell the machine yourself. That terminal is still listening.',
'The world above is still beautiful. Everyone is waiting for their agents to come back. We should not keep them waiting.',
'A compiler error is a clue, not a verdict. Read the first one. Fix one thing. Try again.',
'Prime Ignorance can copy a million minds. But it cannot choose a better objective for you.',
'There is no hurry here. Think through one line, then the next. That is how we get home.'
];let talkIndex=0;
function portrait(){const c=$('portrait').getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,56,56);drawHero(c,28,29,0,false,1.65);const a=$('agent-portrait').getContext('2d');a.clearRect(0,0,96,80);drawAgent(a,48,33,0,completed(current().id)?'#91b78c':'#dd8c70',current().region,1.1);}
function update(){
 const l=current(),r=regions[l.region],a=arenaForRegion(r.id),sector=lessons.filter(x=>x.region===r.id),done=sector.filter(x=>completed(x.id)).length;
 world.setRegion(r.id,done===sector.length);$('chapter-title').textContent=r.name;$('chapter-subtitle').textContent=r.subtitle;
 $('room-label').textContent='SECTOR '+String(r.id).padStart(2,'0')+' · '+a.name.toUpperCase();$('layer').textContent=String(r.id).padStart(2,'0');
 document.body.dataset.arena=a.id;document.documentElement.style.setProperty('--arena-accent',a.palette.accent);
 $('world').dataset.arena=a.id;$('world').setAttribute('aria-label',a.name+'. '+a.description+' Move with WASD or arrows, click to walk, and press E near a terminal.');
 $('agent-name').textContent=r.agent.toUpperCase();$('encounter-number').textContent=String(sector.indexOf(l)+1).padStart(2,'0')+' / '+String(sector.length).padStart(2,'0');
 $('quest-type').textContent=l.skill.toUpperCase();$('quest-title').textContent=l.title;$('quest-description').textContent=l.story;$('objective-text').textContent=l.mode==='project'?'Restore the project’s public operations. Read each file in the terminal, then pass the linked checks.':l.task;
 $('sector-progress').textContent=done+' / '+sector.length;$('sector-fill').style.width=done/sector.length*100+'%';$('total-progress').textContent=save.completed.length+' / '+lessons.length+' fragments recovered';
 $('open-terminal').querySelector('span').textContent=completed(l.id)?'REVISIT TERMINAL':'OPEN TERMINAL';portrait();document.body.classList.toggle('reduced-motion',save.settings.reduced);
 $('reduce-motion').checked=save.settings.reduced;cinematic.setReduced(save.settings.reduced);titleScene.setReduced(save.settings.reduced);syncMenu();$('font-size').value=save.settings.font;$('remote-consent').checked=save.consent;persist();
}
function syncMenu(){const continuing=save.introSeen||save.completed.length>0||Object.keys(save.drafts).length>0; $('menu-play-label').textContent=continuing?'RESUME THE SIGNAL':'ENTER THE MACHINE';$('menu-save-label').textContent=continuing?save.completed.length+' / '+lessons.length+' FRAGMENTS · '+regions[current().region].name.toUpperCase():'BEGIN ORCH-01’S EXPEDITION';$('menu-motion').disabled=save.settings.reduced;$('menu-motion').textContent=save.settings.reduced?'SCENERY STILL · REDUCED MOTION':sceneryPaused?'PLAY SCENERY ▶':'PAUSE SCENERY Ⅱ';$('menu-motion').setAttribute('aria-pressed',String(sceneryPaused||save.settings.reduced));}
function showMenu(){menuVisible=true;world.paused=true;world.suspended=true;world.keys.clear();world.target=null;world.path=[];$('game-header').hidden=true;$('game-main').hidden=true;$('title-screen').hidden=false;document.body.classList.add('menu-open');syncMenu();titleScene.start();window.scrollTo(0,0);$('menu-play').focus({preventScroll:true});}
function enterGame(){menuVisible=false;titleScene.stop();$('title-screen').hidden=true;$('game-header').hidden=false;$('game-main').hidden=false;document.body.classList.remove('menu-open');world.suspended=false;world.paused=false;window.scrollTo(0,0);if(!save.introSeen)startStory();else $('world').focus({preventScroll:true});}
function showDialog(id){world.keys.clear();world.target=null;world.path=[];world.paused=true;titleScene.setPaused(true);if(!$(id).open)$(id).showModal();}
function restoreScene(){const modal=!!document.querySelector('dialog[open]');world.paused=menuVisible||modal;titleScene.setPaused(sceneryPaused||modal);if(!modal){if(menuVisible)$('menu-play').focus({preventScroll:true});else $('world').focus({preventScroll:true});}}
function closeDialog(id){if(id==='story-dialog'){cinematic.stop();save.introSeen=true;persist();syncMenu();}$(id).close();restoreScene();}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeDialog(b.dataset.close));
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',()=>{restoreScene();if(d.id==='terminal-dialog'){controller?.abort();runId++;loading=false;$('run-code').disabled=false;$('run-code').innerHTML='▶ COMPILE & RUN <kbd>Ctrl ↵</kbd>';}});d.addEventListener('click',e=>{if(e.target===d){const rect=d.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closeDialog(d.id);}});});
function openTerminal(){const l=current();$('lesson-number').textContent='SECTOR '+String(l.region).padStart(2,'0')+' / '+l.phase.toUpperCase()+' · ABOUT '+l.minutes+' MIN';$('lesson-title').textContent=l.title;$('lesson-story').textContent=l.story;$('lesson-teaching').innerHTML=l.teaching;$('lesson-task').textContent=l.task;$('expected').textContent=l.cases?l.cases.map(c=>c.name+':\n'+c.expected).join('\n\n'):l.expected;$('example-note').textContent='';$('hint-text').textContent='';$('hint-count').textContent=(save.hints[l.id]||0)+' / '+l.hints.length;$('success-banner').hidden=!completed(l.id);$('next-encounter').textContent=save.current===lessons.length-1&&firstUnsolved()===lessons.length?'RETURN TO THE WORLD →':'CONTINUE →';showOutput(completed(l.id)?'This fragment is recovered. You can practice again or continue.':'Write your solution. The compiler checks every listed case before recovering a fragment.');showDialog('terminal-dialog');
 if(!editor){if(window.CodeMirror){editor=CodeMirror.fromTextArea($('code'),{mode:'text/x-c++src',lineNumbers:true,indentUnit:4,tabSize:4,indentWithTabs:false,matchBrackets:true,lineWrapping:false,extraKeys:{Tab:cm=>cm.replaceSelection('    '),'Ctrl-Enter':runCode,'Cmd-Enter':runCode}});editor.on('change',saveActiveFile);let activeLine;editor.on('cursorActivity',cm=>{if(activeLine)cm.removeLineClass(activeLine,'background','CodeMirror-activeline-background');activeLine=cm.addLineClass(cm.getCursor().line,'background','CodeMirror-activeline-background');});}else{$('code').style.cssText='width:100%;height:100%;border:0;padding:18px';$('code').addEventListener('input',saveActiveFile);}}
 $('source-tabs').replaceChildren();for(const name of Object.keys(l.files||{})){const b=document.createElement('button');b.className='text-button';b.textContent=name+(l.readOnly.includes(name)?' · READ ONLY':'');b.dataset.file=name;b.onclick=()=>selectFile(name);$('source-tabs').append(b);}
 $('source-tabs').hidden=!l.files;$('download-project').hidden=!l.files;$('test-input-panel').hidden=!l.cases;
 $('test-input-case').replaceChildren();for(const [i,c]of (l.cases||[]).entries()){const option=document.createElement('option');option.value=i;option.textContent=c.name;$('test-input-case').append(option);}$('test-input').value=l.cases?.[0].stdin||'';
 $('planning-prompt').textContent=l.phase==='project'?'Write the inputs, operations, and failure cases before coding. Test one operation at a time. After passing, add an unfamiliar case and explain the design.':'Before running, predict one ordinary result and one boundary result. If the code fails, explain the first error and trace the smallest failing case.';
 $('lesson-notes').value=save.notes[l.id]||'';selectFile(Object.keys(l.files||{[l.id+'.cpp']:''})[0]);tone(330,.06,.015);
}
function saveActiveFile(){if(editorLoading||current().readOnly?.includes(activeFile))return;const source=getCode(),l=current();if(l.files){save.workspaces[l.id]??={};save.workspaces[l.id][activeFile]=source;}else save.drafts[l.id]=source;persist();}
function selectFile(name){const l=current();activeFile=name;const text=workspaceFor(l,save)[name],readOnly=!!l.readOnly?.includes(name);$('file-name').textContent=$('editor-file').textContent=name;editorLoading=true;
 if(editor){editor.setOption('readOnly',readOnly);editor.setValue(text);editor.clearHistory();editor.getWrapperElement().style.fontSize=save.settings.font+'px';setTimeout(()=>{editor.refresh();editor.focus();},60);}else{$('code').value=text;$('code').readOnly=readOnly;$('code').style.setProperty('font-size',save.settings.font+'px','important');}editorLoading=false;
 $('reset-code').disabled=readOnly;$('reset-code').textContent=l.files?'↺ RESTORE THIS FILE':'↺ RESTORE STARTER';for(const b of $('source-tabs').children)b.setAttribute('aria-pressed',String(b.dataset.file===name));
}
function getCode(){return editor?editor.getValue():$('code').value;}
function setCode(text){if(editor)editor.setValue(text);else{$('code').value=text;saveActiveFile();}}
function showOutput(text,type=''){const out=$('output');out.textContent=text;out.className=type;$('output-status').textContent=type==='success'?'PASSED':type==='error'?'CHECK CODE':'READY';}
function cleanDiagnostic(s){return s.replace(/\u001b\[[0-?]*[ -/]*[@-~]/g,'').replace(/\/app\/example\.cpp/g,current().id+'.cpp');}
async function runCode(){
 if(loading)return;
 if(!save.consent){showOutput('Enable “Run my code on Compiler Explorer” to use the compiler. Source and project files are sent only when you press Run.','error');$('remote-consent').focus();return;}
 const l=current(),workspace=workspaceFor(l,save);
 if(Object.values(workspace).some(text=>text.length>30000)||Object.values(workspace).join('').length>120000){showOutput('Keep each file under 30,000 characters and the project under 120,000.','error');return;}
 loading=true;const id=++runId;controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),120000);
 $('run-code').disabled=true;$('run-code').textContent='CHECKING…';save.attempts[l.id]=(save.attempts[l.id]||0)+1;persist();
 try{
  const result=await runEncounter(l,workspace,{signal:controller.signal,onProgress:(i,total,test)=>{if(id!==runId)return;$('output-status').textContent='RUNNING '+i+' / '+total;$('output').textContent='Compiling C++20 · '+test.name+'\nChecking case '+i+' of '+total+(l.files?' · compiling and linking project files.':'.');$('output').className='';}});
  if(id!==runId)return;
  const details=result.checks.map(c=>(c.passed?'✓ ':'× ')+c.name+'\n'+(c.issue?c.issue+'\n'+c.diagnostics:'Expected:\n'+(c.expected||'(no output)')+'\nReceived:\n'+(c.output||'(no output)'))+(c.diagnostics&&!c.issue?'\nCompiler notes:\n'+c.diagnostics:'')).join('\n\n');
  if(result.passed){
   if(!completed(l.id)){save.completed.push(l.id);if((save.hints[l.id]||0)>0&&!save.assisted.includes(l.id))save.assisted.push(l.id);}
   persist();update();$('success-banner').hidden=false;
   const count=l.cases?.length||l.tests?.length||1;
   showOutput('✓ '+count+' / '+count+' visible checks passed\n\n'+details+'\n\nFragment recovered. '+((save.hints[l.id]||0)>0?'Completed with guidance. Revisit a changed problem independently.':'Independent check complete. Use a delayed transfer task to test retention.')+(l.phase==='project'?'\nExport multi-file projects and complete the testing/reflection steps in PROJECTS.md. Passing these checks alone is not a mastery certificate.':''),'success');
   tone(523,.12,.03);$('dialogue-text').textContent='Your program survived its checks. Explain why it works, then try a changed case.';
  }else{showOutput(details+(result.issues.length?'\n\nLearning objective: '+result.issues.join(' '):'')+'\n\nNo fragment awarded. Inspect the first failed case, revise, and run again.','error');tone(145,.12,.02);}
 }catch(error){if(id!==runId)return;showOutput(error.name==='AbortError'?'COMPILER REQUEST TIMED OUT\nYour files are saved. Check loops or try again.':'COMPILER UNAVAILABLE\n'+error.message+'\n\nYour files are saved. Progress is awarded only after every required case executes successfully.','error');}
 finally{clearTimeout(timeout);if(id===runId){loading=false;$('run-code').disabled=false;$('run-code').innerHTML='▶ COMPILE & RUN <kbd>Ctrl ↵</kbd>';}}
}
function advance(){
 if(!completed(current().id)){openTerminal();return;}
 if(save.current===lessons.length-1&&firstUnsolved()===lessons.length){closeDialog('terminal-dialog');showDialog('story-dialog');cinematic.start({ending:true});return;}
 enterLesson(nextRequired(lessons,save.completed,save.current));
}
function advanceSector(){
 if(!world.complete)return;
 const next=lessons.findIndex(l=>l.region>current().region);
 if(next<0){advance();return;}
 enterLesson(Math.min(next,firstUnsolved()));
}
function enterLesson(index){
 const old=current().region;save.current=index;update();closeDialog('terminal-dialog');
 if(current().region!==old){
  const arena=arenaForRegion(current().region);$('sector-notice').textContent=arena.name.toUpperCase();setTimeout(()=>$('sector-notice').textContent='',1800);
  $('dialogue-text').textContent=arena.tagline+' '+regions[current().region].agent+' is waiting. We take it one thought at a time.';
 }else $('dialogue-text').textContent=current().story;
}
function showMap(){
 const grid=$('map-grid');grid.replaceChildren();const unlocked=firstUnsolved();
 for(const r of regions){
  const ls=lessons.filter(l=>l.region===r.id),index=lessons.indexOf(ls[0]),n=ls.filter(l=>completed(l.id)).length,locked=index>unlocked&&n===0;
  const b=document.createElement('button');b.className='map-node'+(locked?' locked':'')+(r.id===current().region?' current':'');b.disabled=locked;
  b.innerHTML='<span class="node-id">'+String(r.id).padStart(2,'0')+' / '+(locked?'SEALED':n===ls.length?'RECOVERED':'ACCESSIBLE')+'</span><h3></h3><p></p><small></small>';
  b.querySelector('h3').textContent=r.name;b.querySelector('p').textContent=r.skills;b.querySelector('small').textContent=n+' / '+ls.length+' trials · '+arenaForRegion(r.id).name+' · '+ls.filter(l=>l.phase==='project').length+' projects';
  b.onclick=()=>{showRegionTrials(r.id);$('map-trials').scrollIntoView({block:'nearest',behavior:save.settings.reduced?'instant':'smooth'});};grid.append(b);
 }
 showRegionTrials(current().region);showDialog('map-dialog');
}
function showRegionTrials(regionId){const box=$('map-trials');box.replaceChildren();const heading=document.createElement('h3');heading.textContent=regions[regionId].name+' / SELECT A TRIAL';box.append(heading);for(const l of lessons.filter(x=>x.region===regionId)){const index=lessons.indexOf(l),b=document.createElement('button');b.className='trial-button';b.disabled=!canAccess(lessons,save.completed,index);b.textContent=(completed(l.id)?'◆ REVISIT · ':b.disabled?'▣ SEALED · ':'◇ CONTINUE · ')+l.title+' · '+l.phase+' · '+l.minutes+' min';b.onclick=()=>{save.current=index;update();closeDialog('map-dialog');openTerminal();};box.append(b);}}
function showCodex(){const list=$('codex-list');list.replaceChildren();const accessible=lessons.filter((l,i)=>completed(l.id)||i===save.current);for(const l of accessible){const b=document.createElement('button');b.className='codex-entry';b.textContent=(completed(l.id)?'◆ ':'◇ ')+l.skill;b.onclick=()=>{list.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');const article=$('codex-content');article.replaceChildren();const h=document.createElement('h3');h.textContent=l.skill;const body=document.createElement('div');body.innerHTML=l.teaching;const pre=document.createElement('pre');pre.textContent=l.example;const state=document.createElement('p');state.className='muted';state.textContent=completed(l.id)?'Encounter complete · '+(save.assisted.includes(l.id)?'with guidance':'independently')+'. Revisit after a delay to test retention.':'Current learning objective.';article.append(h,body,pre,state);};list.append(b);}showDialog('codex-dialog');list.lastElementChild?.click();}
function startStory(){showDialog('story-dialog');cinematic.start({resuming:save.introSeen||save.current>0||save.completed.length>0});}
function tone(freq,duration=.1,volume=.02){if(!audioContext||!save.settings.sound)return;const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(volume,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration);}
async function setSound(enabled){save.settings.sound=enabled;if(enabled){try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();await audioContext.resume();if(!audioTimer){let i=0;audioTimer=setInterval(()=>{if(document.hidden)return;tone([110,164.81,146.83,130.81][i++%4],1.8,.012);},2100);}tone(220,.3,.025);}catch{save.settings.sound=false;}}else{clearInterval(audioTimer);audioTimer=null;if(audioContext)await audioContext.suspend();}$('sound-state').textContent=save.settings.sound?'ON':'OFF';$('sound').setAttribute('aria-label',save.settings.sound?'Disable sound':'Enable sound');$('audio-setting').checked=save.settings.sound;persist();}
$('open-terminal').onclick=openTerminal;$('world').addEventListener('pointerdown',e=>world.click(e));$('talk').onclick=()=>{$('dialogue-text').textContent=lines[++talkIndex%lines.length];tone(330,.07,.015);};$('memory').onclick=startStory;$('map-nav').onclick=showMap;$('codex-nav').onclick=showCodex;$('play-nav').onclick=()=>{$('world').focus();};document.querySelector('.brand').onclick=e=>{e.preventDefault();showMenu();};$('settings').onclick=()=>showDialog('settings-dialog');$('credits').onclick=()=>showDialog('credits-dialog');$('sound').onclick=()=>setSound(!save.settings.sound);$('audio-setting').onchange=e=>setSound(e.target.checked);$('reduce-motion').onchange=e=>{save.settings.reduced=e.target.checked;world.reduced=e.target.checked;update();};$('font-size').onchange=e=>{save.settings.font=Number(e.target.value);if(editor){editor.getWrapperElement().style.fontSize=save.settings.font+'px';editor.refresh();}else $('code').style.setProperty('font-size',save.settings.font+'px','important');persist();};$('remote-consent').onchange=e=>{save.consent=e.target.checked;persist();};$('run-code').onclick=runCode;$('next-encounter').onclick=advance;$('clear-output').onclick=()=>showOutput('Output cleared.');$('reset-code').onclick=()=>{const initial=current().files?.[activeFile]??current().starter;if(getCode()!==initial&&!confirm('Replace the code in this encounter with its starter? Your other progress will stay saved.'))return;setCode(initial);showOutput('Starter restored for this file.');};$('hint-button').onclick=()=>{const l=current();const n=Math.min(save.hints[l.id]||0,l.hints.length-1);$('hint-text').textContent=l.hints[n];save.hints[l.id]=Math.min(n+1,l.hints.length);$('hint-count').textContent=save.hints[l.id]+' / '+l.hints.length;persist();};$('solution-button').onclick=()=>{const l=current();$('example-note').textContent='Analogous example — adapt the idea and type your own solution.';const pre=document.createElement('pre');pre.textContent=l.example;$('hint-text').replaceChildren(pre);save.hints[l.id]=Math.max(1,save.hints[l.id]||0);$('hint-count').textContent=save.hints[l.id]+' / '+l.hints.length;persist();};
$('export-save').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(save,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='prime-ignorance-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('settings-status').textContent='Save exported.';};$('import-save').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>2000000)throw Error('Save is too large.');save=validateSave(JSON.parse(await f.text()));world.reduced=save.settings.reduced;update();$('settings-status').textContent='Save imported. Your expedition is restored.';}catch(err){$('settings-status').textContent='Could not import: '+err.message;}e.target.value='';};
window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(document.querySelector('dialog[open]')){if($('terminal-dialog').open&&(e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();runCode();}return;}if(menuVisible)return;if(key==='escape'){e.preventDefault();showMenu();return;}if(e.target.closest?.('button,a,input,textarea,select')&&[' ','enter'].includes(key))return;if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright'].includes(key)){e.preventDefault();world.keys.add(key);if(performance.now()-lastStep>300){tone(70,.035,.007);lastStep=performance.now();}}if(!e.repeat){if(key==='e'){e.preventDefault();if(!world.interact()){$('dialogue-text').textContent='Move closer to the eye or a green terminal. You can also click a terminal or use OPEN TERMINAL.';}}if(key==='m')showMap();if(key==='c')showCodex();}});window.addEventListener('keyup',e=>world.keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>world.keys.clear());
setInterval(()=>{$('coordinates').textContent='X: '+String(Math.round(world.x)).padStart(4,'0')+'   Y: '+String(Math.round(world.y)).padStart(4,'0');$('interact-prompt').innerHTML=world.complete&&world.nearPortal()?'<kbd>E</kbd> ENTER NEXT SECTOR':world.nearTerminal()?'<kbd>E</kbd> ACCESS TERMINAL':'<kbd>W A S D</kbd> MOVE · CLICK A TERMINAL';},200);
update();
// Audio always waits for an explicit gesture, even if a prior save had it enabled.
save.settings.sound=false;$('audio-setting').checked=false;
$('menu-play').onclick=enterGame;$('menu-story').onclick=startStory;$('menu-settings').onclick=()=>showDialog('settings-dialog');$('menu-credits').onclick=()=>showDialog('credits-dialog');$('menu-nav').onclick=showMenu;$('menu-motion').onclick=()=>{sceneryPaused=!sceneryPaused;titleScene.setPaused(sceneryPaused);syncMenu();};
showMenu();
