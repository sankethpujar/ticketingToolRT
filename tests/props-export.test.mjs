import ts from 'typescript';import fs from 'node:fs';import assert from 'node:assert/strict';
async function module(path){const s=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'))}
const {propsExportRows,propsExportHeaders,propsExportFilename}=await module('lib/props-export.ts');const {reportXlsx}=await module('lib/report-xlsx.ts');
const plan={labels:[{id:'a',name:'Bench'},{id:'b',name:'ಮರ & road'},{id:'c',name:'Unused prop'}],scenes:[{description:'Scene 1 - Park & Road',propIds:['a','b'],remarks:'Bring two\nStage left'},{description:'=SUM(1,2)',propIds:['a'],remarks:''}]};
const rows=propsExportRows(plan);assert.deepEqual(rows[0],['Scene 1 - Park & Road','Bench\nಮರ & road','Bring two\nStage left']);assert.deepEqual(rows[4],['Bench','','']);assert.deepEqual(rows[6],['Unused prop','','']);
assert.equal(propsExportFilename(' My play '),'My play.xlsx');assert.equal(propsExportFilename('My play.XLSX'),'My play.xlsx');for(const value of ['','../evil','CON','bad:name','bad/name'])assert.throws(()=>propsExportFilename(value));
fs.writeFileSync('/tmp/props-export-test.xlsx',reportXlsx(propsExportHeaders,rows,{sheetName:'Props',widths:[38,40,48],wrapText:true,filterLastRow:3}));
console.log('Passed props row mapping, unused master props and filename validation.');

const {exportPropsWithMode}=await module('lib/props-export-flow.ts');
const stored={value:'saved'},draft={value:'unsaved'},confirmed={value:'saved-after-write'};let operations=[];
const handlers={draft,loadSaved:async()=>{operations.push('read');return stored},saveDraft:async()=>{operations.push('save');return confirmed},download:value=>operations.push(value)};
assert.equal(await exportPropsWithMode({mode:'saved',...handlers}),true);assert.deepEqual(operations,['read',stored]);
operations=[];assert.equal(await exportPropsWithMode({mode:'unsaved',...handlers}),true);assert.deepEqual(operations,[draft]);
operations=[];assert.equal(await exportPropsWithMode({mode:'save',...handlers}),true);assert.deepEqual(operations,['save',confirmed]);
operations=[];assert.equal(await exportPropsWithMode({mode:'save',...handlers,saveDraft:async()=>{operations.push('failed save');return null}}),false);assert.deepEqual(operations,['failed save']);
operations=[];await assert.rejects(()=>exportPropsWithMode({mode:'saved',...handlers,loadSaved:async()=>{throw Error('Signed out')}}));assert.deepEqual(operations,[]);
console.log('Passed export flow: latest saved data, unsaved without writes, save-before-download, save failure cancellation, read failure cancellation.');
