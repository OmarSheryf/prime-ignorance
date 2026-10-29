import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ARENAS,arenaForRegion,isWalkable,moveWithinArena,findArenaPath,clearPath} from './dist/arenas.js';
import {World} from './dist/world.js';
import {renderArena} from './dist/arena-art.js';

test('four distinct arenas cycle deterministically across all fourteen sectors',()=>{
 assert.equal(ARENAS.length,4);assert.equal(new Set(ARENAS.map(a=>a.id)).size,4);
 assert.equal(new Set(ARENAS.map(a=>JSON.stringify(a.floor))).size,4);
 for(let region=0;region<14;region++)assert.equal(arenaForRegion(region),ARENAS[region%4]);
 for(const bad of [NaN,Infinity,undefined,-1])assert.equal(arenaForRegion(bad),ARENAS[0]);
});

for(const arena of ARENAS){
 test(arena.name+': spawn, terminals, guardian, and exit are reachable',()=>{
  assert.ok(isWalkable(arena,arena.spawn.x,arena.spawn.y),'spawn is on the deck');
  const goals=[...arena.terminals.map(t=>({x:t.x,y:t.y+20})),{x:arena.guardian.x,y:arena.guardian.y+23},arena.exit];
  for(const goal of goals){
   assert.ok(isWalkable(arena,goal.x,goal.y),'interaction approach is walkable: '+JSON.stringify(goal));
   const route=findArenaPath(arena,arena.spawn,goal);assert.ok(route.length>0,'reachable: '+JSON.stringify(goal));
   let previous=arena.spawn;
   for(const waypoint of route){assert.ok(clearPath(arena,previous,waypoint),'every smoothed segment stays on the deck');previous=waypoint;}
   assert.ok(Math.hypot(previous.x-goal.x,previous.y-goal.y)<5,'path ends at the requested destination');
  }
 });
 test(arena.name+': movement cannot leave the deck or tunnel through props',()=>{
  for(const [dx,dy]of [[-500,0],[500,0],[0,-500],[0,500],[-500,-500],[500,500]]){
   const result=moveWithinArena(arena,arena.spawn,dx,dy);assert.ok(isWalkable(arena,result.x,result.y));
  }
  for(const o of arena.obstacles)assert.equal(isWalkable(arena,o.x+o.w/2,o.y+o.h/2),false);
 });
}

test('click-to-walk routes around the greenhouse pool, rather than crossing it',()=>{
 const arena=ARENAS[2],goal={x:216,y:110};
 assert.equal(clearPath(arena,arena.spawn,goal),false);
 const route=findArenaPath(arena,arena.spawn,goal);assert.ok(route.length>1);
 assert.ok(route.some(p=>p.x<177||p.x>255));
});

test('world uses each arena’s actual interaction coordinates and resets stale paths',()=>{
 let terminalCalls=0,portalCalls=0;
 const canvas={getContext:()=>({}),focus:()=>{},getBoundingClientRect:()=>({left:0,top:0,width:864,height:432}),width:864,height:432};
 const world=new World(canvas,()=>terminalCalls++,()=>portalCalls++);
 for(let region=0;region<8;region++){
  world.setRegion(region,false);const arena=arenaForRegion(region);
  assert.equal(world.arena,arena);assert.equal(world.x,arena.spawn.x*2);assert.equal(world.y,arena.spawn.y*2);
  world.x=arena.terminals[0].x*2;world.y=(arena.terminals[0].y+20)*2;assert.ok(world.nearTerminal());world.interact();
  world.x=arena.exit.x*2;world.y=arena.exit.y*2;const before=portalCalls;world.interact();assert.equal(portalCalls,before,'sealed exits cannot advance');
  world.complete=true;assert.ok(world.nearPortal());world.interact();assert.equal(portalCalls,before+1);
  world.path=[{x:1,y:1}];world.target=world.path[0];world.keys.add('w');world.setRegion(region+1,false);
  assert.deepEqual(world.path,[]);assert.equal(world.target,null);assert.equal(world.keys.size,0);
 }
 assert.ok(terminalCalls>=8);world.stop();
});

test('pointer hit tests work at responsive canvas sizes and pause during dialogs',()=>{
 let calls=0;const canvas={getContext:()=>({}),focus:()=>{},getBoundingClientRect:()=>({left:10,top:20,width:432,height:216}),width:864,height:432};
 const world=new World(canvas,()=>calls++,()=>{});
 for(let region=0;region<4;region++){
  world.setRegion(region,false);const t=world.arena.terminals[0];world.click({clientX:t.x+10,clientY:t.y-8+20});assert.equal(calls,region+1);
 }
 world.paused=true;const t=world.arena.terminals[0];world.click({clientX:t.x+10,clientY:t.y-8+20});assert.equal(calls,4);world.stop();
});

test('all arena renderers draw finite pixel geometry in recovered and reduced-motion states',()=>{
 let rectangles=0;
 const c={save(){},restore(){},translate(){},scale(){},fillText(){},createRadialGradient(){return {addColorStop(){}};},fillRect(...values){assert.ok(values.every(Number.isFinite),'finite rectangle geometry');rectangles++;}};
 for(const arena of ARENAS)for(const reduced of [false,true])for(const recovered of [false,true])renderArena(c,arena,{time:12345,reduced,recovered});
 assert.ok(rectangles>10000);
});
