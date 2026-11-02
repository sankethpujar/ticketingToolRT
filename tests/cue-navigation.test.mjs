import ts from 'typescript';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=ts.transpileModule(fs.readFileSync('lib/cue-navigation.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {nextCueInDirection:next}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const cues=[{id:'a',x:100,y:100},{id:'b',x:200,y:100},{id:'c',x:300,y:100},{id:'post',x:450,y:150},{id:'d',x:100,y:230},{id:'e',x:200,y:230},{id:'next-scene',x:100,y:400}];
assert.equal(next(cues,null,'ArrowRight'),null);assert.equal(next(cues,'missing','ArrowDown'),null);
assert.equal(next(cues,'a','ArrowRight'),'b');assert.equal(next(cues,'b','ArrowLeft'),'a');assert.equal(next(cues,'a','ArrowDown'),'d');assert.equal(next(cues,'d','ArrowUp'),'a');assert.equal(next(cues,'d','ArrowDown'),'next-scene');assert.equal(next(cues,'c','ArrowRight'),'post');assert.equal(next(cues,'post','ArrowRight'),null);assert.equal(next(cues,'a','ArrowUp'),null);assert.equal(next(cues,'a','Space'),null);
console.log('Passed initial-selection guard, spatial movement, scene transitions, post-scene navigation and edges.');
