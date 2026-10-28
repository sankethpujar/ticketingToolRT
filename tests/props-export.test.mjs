import ts from 'typescript';import fs from 'node:fs';import assert from 'node:assert/strict';
async function module(path){const s=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'))}
const {propsExportRows,propsExportHeaders,propsExportFilename}=await module('lib/props-export.ts');const {reportXlsx}=await module('lib/report-xlsx.ts');
const plan={labels:[{id:'a',name:'Bench'},{id:'b',name:'ಮರ & road'},{id:'c',name:'Unused prop'}],scenes:[{description:'Scene 1 - Park & Road',propIds:['a','b'],remarks:'Bring two\nStage left'},{description:'=SUM(1,2)',propIds:['a'],remarks:''}]};
const rows=propsExportRows(plan);assert.deepEqual(rows[0],['Scene 1 - Park & Road','Bench\nಮರ & road','Bring two\nStage left']);assert.deepEqual(rows[4],['Bench','','']);assert.deepEqual(rows[6],['Unused prop','','']);
assert.equal(propsExportFilename(' My play '),'My play.xlsx');assert.equal(propsExportFilename('My play.XLSX'),'My play.xlsx');for(const value of ['','../evil','CON','bad:name','bad/name'])assert.throws(()=>propsExportFilename(value));
fs.writeFileSync('/tmp/props-export-test.xlsx',reportXlsx(propsExportHeaders,rows,{sheetName:'Props',widths:[38,40,48],wrapText:true,filterLastRow:3}));
console.log('Passed props row mapping, unused master props and filename validation.');
