import ts from 'typescript';import fs from 'node:fs';import assert from 'node:assert/strict';import {mock} from 'node:test';
const source=ts.transpileModule(fs.readFileSync('lib/audio-fade.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {fadeOutAndStop}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
mock.timers.enable({apis:['Date','setTimeout','setInterval'],now:0});
function player(volume=1){return {volume,currentTime:12,paused:false,pause(){this.paused=true}}}
let stopped=0;const a=player(.8);fadeOutAndStop(a,()=>stopped++);mock.timers.tick(500);assert.ok(a.volume>.38&&a.volume<.42);assert.equal(a.paused,false);assert.equal(stopped,0);mock.timers.tick(500);assert.equal(a.paused,true);assert.equal(a.currentTime,0);assert.equal(a.volume,.8);assert.equal(stopped,1);
const b=player(),c=player(.5);const cancel=fadeOutAndStop(b,()=>stopped++);fadeOutAndStop(c,()=>stopped++);mock.timers.tick(250);cancel();assert.equal(b.volume,1);mock.timers.tick(750);assert.equal(b.paused,false);assert.equal(c.paused,true);assert.equal(stopped,2);
let master=.8;const d=player(master);fadeOutAndStop(d,()=>{},1000,()=>master);mock.timers.tick(500);master=.4;mock.timers.tick(16);assert.ok(d.volume>.18&&d.volume<.21);mock.timers.tick(484);assert.equal(d.paused,true);assert.equal(d.volume,.4);
mock.timers.reset();console.log('Passed one-second fade, volume restoration, concurrent players and cancellation.');
