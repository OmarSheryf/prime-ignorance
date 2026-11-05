import {lessons} from './dist/curriculum.js';
import {requestFor,evaluateResult,COMPILER_URL} from './dist/judge.js';
import {solutions} from './reference-solutions.mjs';
// Default: representative service smoke check. Use native verification for all content.
const ids=['read-input','concepts','header-contract','score-project','capstone-project'];
const requested=process.argv.find(x=>x.startsWith('--lesson='))?.slice(9);
const selected=requested?lessons.filter(l=>l.id===requested):process.argv.includes('--all')?lessons:lessons.filter(l=>ids.includes(l.id));if(!selected.length)throw Error('Unknown lesson.');let passed=0;
for(const l of selected){
 const workspace=l.files?{...l.files,...solutions[l.id]}:{[l.id+'.cpp']:solutions[l.id]};
 for(const c of l.cases||[{stdin:'',expected:l.expected}]){
  const response=await fetch(COMPILER_URL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(requestFor(l,workspace,c.stdin)),signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  const result=evaluateResult(await response.json(),c.expected);
  if(!result.passed)throw Error(l.id+': '+result.issue+'\n'+result.diagnostics+'\n'+JSON.stringify(result.output));
 }
 passed++;console.log('PASS '+l.id);
}
console.log(passed+'/'+selected.length+' remote C++20 encounters passed.');
