import {makeSubmission,checkOutput,checkRequirements} from './curriculum.js';
export const COMPILER_URL='https://godbolt.org/api/compiler/g141/compile';
export function workspaceFor(lesson,save){
 if(!lesson.files)return {[lesson.id+'.cpp']:save.drafts[lesson.id]??lesson.starter};
 return Object.fromEntries(Object.entries(lesson.files).map(([name,text])=>[name,lesson.readOnly.includes(name)?text:save.workspaces?.[lesson.id]?.[name]??text]));
}
export function requestFor(lesson,workspace,stdin=''){
 const entry=lesson.entry||lesson.id+'.cpp';
 const files=lesson.files?Object.entries(workspace).filter(([name])=>name!==entry&&name!=='CMakeLists.txt').map(([filename,contents])=>({filename,contents})):[];
 if(files.some(f=>!Object.hasOwn(lesson.files,f.filename)||!/^[-\w]+\.(cpp|hpp)$/.test(f.filename)))throw Error('Unsupported project filename.');
 const sources=files.filter(f=>f.filename.endsWith('.cpp')).map(f=>f.filename);
 return {source:makeSubmission(lesson,workspace[entry]),files,lang:'c++',allowStoreCodeDebug:false,options:{userArguments:'-std=c++20 -O0 -Wall -Wextra -pthread'+(sources.length?' '+sources.join(' '):''),compilerOptions:{executorRequest:true},filters:{execute:true},executeParameters:{args:[],stdin}}};
}
export function evaluateResult(result,expected){
 const diagnostics=[...(result.buildResult?.stderr||[]),...(result.stderr||[])].map(x=>x.text).join('\n').replace(/\u001b\[[0-?]*[ -/]*[@-~]/g,'');
 const output=(result.stdout||[]).map(x=>x.text).join('\n');
 const buildFailed=result.buildResult?.code!==undefined&&result.buildResult.code!==0;
 let issue=buildFailed?'COMPILATION FAILED':result.timedOut||result.buildResult?.timedOut?'EXECUTION TIMED OUT':result.truncated||result.buildResult?.truncated?'OUTPUT LIMIT REACHED':result.code!==0||!result.didExecute?'PROGRAM DID NOT FINISH SUCCESSFULLY':'';
 return {output,diagnostics,issue,passed:!issue&&checkOutput({expected},output)};
}
export async function runEncounter(lesson,workspace,{signal,fetchImpl=fetch,onProgress=()=>{}}={}){
 const cases=lesson.cases||[{name:lesson.mode==='project'?'Linked project checks':'Encounter checks',stdin:'',expected:lesson.expected}];
 const checks=[];
 for(const [i,test] of cases.entries()){
  onProgress(i+1,cases.length,test);
  const response=await fetchImpl(COMPILER_URL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(requestFor(lesson,workspace,test.stdin)),signal});
  if(!response.ok)throw Error('Compiler service returned HTTP '+response.status+'. Your code is saved; try again later.');
  const result=evaluateResult(await response.json(),test.expected);checks.push({...result,...test,output:result.output});
  if(result.issue)break;
 }
 const editable=lesson.files?Object.entries(workspace).filter(([name])=>!lesson.readOnly.includes(name)).map(([,text])=>text).join('\n'):Object.values(workspace)[0];
 const issues=checkRequirements(lesson,editable);
 return {passed:checks.length===cases.length&&checks.every(c=>c.passed)&&!issues.length,checks,issues};
}

// Store-only ZIP: ordinary C++/header/build files, no runtime dependency.
export function projectArchive(files){
 const encoder=new TextEncoder(),parts=[],directory=[];let offset=0;
 const crc=data=>{let n=0xffffffff;for(const b of data){n^=b;for(let i=0;i<8;i++)n=n&1?(n>>>1)^0xedb88320:n>>>1;}return (n^0xffffffff)>>>0;};
 const header=(size,fields)=>{const a=new Uint8Array(size),d=new DataView(a.buffer);for(const [p,n,width]of fields)width===4?d.setUint32(p,n,true):d.setUint16(p,n,true);return a;};
 for(const [name,text]of Object.entries(files)){
  const filename=encoder.encode(name),data=encoder.encode(text),sum=crc(data),local=header(30,[[0,0x04034b50,4],[4,20,2],[6,0x800,2],[14,sum,4],[18,data.length,4],[22,data.length,4],[26,filename.length,2]]);
  const central=header(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x800,2],[16,sum,4],[20,data.length,4],[24,data.length,4],[28,filename.length,2],[42,offset,4]]);
  parts.push(local,filename,data);directory.push(central,filename);offset+=local.length+filename.length+data.length;
 }
 const length=directory.reduce((n,a)=>n+a.length,0),end=header(22,[[0,0x06054b50,4],[8,Object.keys(files).length,2],[10,Object.keys(files).length,2],[12,length,4],[16,offset,4]]);
 return new Blob([...parts,...directory,end],{type:'application/zip'});
}
