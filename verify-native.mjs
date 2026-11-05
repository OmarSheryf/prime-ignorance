import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,delimiter} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {lessons,makeSubmission,checkOutput,checkRequirements} from './dist/curriculum.js';
import {solutions} from './reference-solutions.mjs';
const exec=promisify(execFile),compiler=process.env.CXX||'g++',prefix=join(tmpdir(),'prime-ignorance-verify-'),directory=await mkdtemp(prefix);
const env={...process.env,PATH:dirname(compiler)+delimiter+process.env.PATH};
const options={cwd:directory,env,timeout:120000,maxBuffer:4*1024*1024};
const chunks=[],runs=[],cases=[];let count=0;
try{
 for(const [i,l]of lessons.entries()){
  if(!solutions[l.id])throw Error('Missing reference '+l.id);
  if(l.mode==='project')continue;
  const source=solutions[l.id],issues=checkRequirements(l,source);if(issues.length)throw Error(l.id+': '+issues.join(' '));
  const submitted=makeSubmission(l,source).replace(/#include\s*<[^>]+>/g,'').replace(/int\s+main\s*\(\s*\)/,'int run()').replace(/}\s*$/,'return 0;\n}');
  chunks.push('namespace trial_'+i+' {\n'+submitted+'\n}\n');
  for(const c of l.cases||[{stdin:'',expected:l.expected}]){
   const label=l.id+'_'+cases.length;cases.push({lesson:l,label,expected:c.expected});
   runs.push('{std::istringstream input('+JSON.stringify(c.stdin)+');std::cin.clear();auto* old=std::cin.rdbuf(input.rdbuf());std::cout<<"__START__'+label+'\\n";trial_'+i+'::run();std::cout<<"\\n__END__'+label+'\\n";std::cin.rdbuf(old);std::cin.clear();}');
  }
 }
 await writeFile(join(directory,'batch.cpp'),'#include <bits/stdc++.h>\n'+chunks.join('\n')+'\nint main(){\n'+runs.join('\n')+'\n}\n');
 await exec(compiler,['-std=c++20','-O0','-Wall','-Wextra','-pthread','batch.cpp','-o','batch.exe'],options);
 const execution=await exec(join(directory,'batch.exe'),[],{...options,timeout:20000});const stdout=execution.stdout.replace(/\r/g,'');
 for(const c of cases){const begin='__START__'+c.label+'\n',end='\n__END__'+c.label;const a=stdout.indexOf(begin),b=stdout.indexOf(end,a);const actual=a>=0&&b>=0?stdout.slice(a+begin.length,b):'MISSING';if(!checkOutput({expected:c.expected},actual))throw Error(c.label+': '+JSON.stringify(actual)+' expected '+JSON.stringify(c.expected));}
 count=lessons.filter(l=>l.mode!=='project').length;console.log(count+' single-file encounters / '+cases.length+' executions passed.');
 for(const l of lessons.filter(l=>l.mode==='project')){
  const files={...l.files,...solutions[l.id]};
  for(const [name,text]of Object.entries(files))await writeFile(join(directory,name),text);
  const cpp=Object.keys(files).filter(n=>n.endsWith('.cpp'));
  await exec(compiler,['-std=c++20','-O0','-Wall','-Wextra','-pthread',...cpp,'-o','project.exe'],options);
  const result=await exec(join(directory,'project.exe'),[],{...options,timeout:10000});
  if(!checkOutput(l,result.stdout))throw Error(l.id+': '+JSON.stringify(result.stdout)+' expected '+JSON.stringify(l.expected));
  count++;console.log('PASS separate compilation and linking: '+l.id);
 }
 console.log(count+'/'+lessons.length+' reference encounters passed with real C++20.');
}catch(error){console.error(error.stderr||error.message);process.exitCode=1;}
finally{
 // Only remove the unique directory this invocation created under the temp prefix.
 if(resolve(directory).startsWith(resolve(prefix)))await rm(directory,{recursive:true,force:true});
}
