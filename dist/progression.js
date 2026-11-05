export function firstPending(lessons,completed){const done=new Set(completed);const i=lessons.findIndex(l=>!done.has(l.id));return i<0?lessons.length:i;}
export function canAccess(lessons,completed,index){return index>=0&&index<lessons.length&&(completed.includes(lessons[index].id)||index<=firstPending(lessons,completed));}
export function nextRequired(lessons,completed,index){return Math.min(index+1,firstPending(lessons,completed),lessons.length-1);}
export function newSave(reduced=false){return {version:2,current:0,currentId:'signal',introSeen:false,completed:[],drafts:{},workspaces:{},notes:{},hints:{},attempts:{},assisted:[],settings:{reduced,font:15,sound:false},consent:false};}
export function migrateSave(raw,lessons,legacyIds,reduced=false){
 if(!raw||![1,2].includes(raw.version)||!Array.isArray(raw.completed))throw Error('Not a supported Prime Ignorance save.');
 const result=newSave(reduced),byId=new Map(lessons.map((l,i)=>[l.id,{lesson:l,index:i}]));
 result.completed=[...new Set(raw.completed.filter(id=>byId.has(id)))];
 for(const [id,source] of Object.entries(raw.drafts||{}))if(byId.has(id)&&typeof source==='string'&&source.length<=30000)result.drafts[id]=source;
 for(const [id,files] of Object.entries(raw.workspaces||{})){
  const l=byId.get(id)?.lesson;if(!l?.files||!files||typeof files!=='object')continue;
  const draft={};for(const name of Object.keys(l.files))if(!l.readOnly.includes(name)&&typeof files[name]==='string'&&files[name].length<=30000)draft[name]=files[name];
  result.workspaces[id]=draft;
 }
 for(const [id,note] of Object.entries(raw.notes||{}))if(byId.has(id)&&typeof note==='string'&&note.length<=4000)result.notes[id]=note;
 for(const kind of ['hints','attempts'])for(const [id,n] of Object.entries(raw[kind]||{}))if(byId.has(id)&&Number.isFinite(n)&&n>=0)result[kind][id]=Math.floor(n);
 result.assisted=(Array.isArray(raw.assisted)?raw.assisted:[]).filter(id=>byId.has(id));
 result.settings={reduced:raw.settings?!!raw.settings.reduced:reduced,font:[13,15,18].includes(raw.settings?.font)?raw.settings.font:15,sound:!!raw.settings?.sound};
 result.consent=!!raw.consent;result.introSeen=!!raw.introSeen;
 const desired=raw.version===1?legacyIds[raw.current]:raw.currentId;
 const index=byId.get(desired)?.index??0;
 // Newly inserted foundations remain required; old completion and drafts survive.
 result.current=canAccess(lessons,result.completed,index)?index:Math.min(firstPending(lessons,result.completed),lessons.length-1);
 result.currentId=lessons[result.current].id;return result;
}
