import ts from 'typescript';import fs from 'node:fs';import assert from 'node:assert/strict';
async function module(path){const s=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'))}
const {buildReport}=await module('lib/reports.ts'),{reportXlsx}=await module('lib/report-xlsx.ts');
const data={events:[{id:'1',name:'First show',date:'2026-11-28'},{id:'2',name:'Second show',date:'2026-12-01'}],bookings:[{eventId:'1',name:'=SUM(1,2)',reference:'SANKETH',phone:'+919001234567',price:250,payment:'PAID'},{eventId:'2',name:'A & B <guests>',reference:'DIRECT',phone:'',price:300,payment:'COLLECT AT VENUE'}]};
const event=buildReport(data,'1');assert.deepEqual(event.headers,['Booking Name','Reference','Phone Number','Payment status']);assert.equal(event.rows.length,1);assert.equal(event.rows[0][3],'PAID');
const all=buildReport(data,'ALL');assert.equal(all.rows.length,2);assert.equal(all.rows[1][2],'');assert.equal(all.rows[0][3],250);assert.deepEqual(all.rows[0][5],{date:'2026-11-28'});
assert.equal(buildReport({...data,bookings:[]},'ALL').rows.length,0);
fs.writeFileSync('/tmp/rangatantra-report-test.xlsx',reportXlsx(all.headers,all.rows));fs.writeFileSync('/tmp/rangatantra-event-report-test.xlsx',reportXlsx(event.headers,event.rows));fs.writeFileSync('/tmp/rangatantra-empty-report-test.xlsx',reportXlsx(event.headers,[]));
console.log('Report columns, event isolation, overall rows, optional phones and empty reports passed.');
