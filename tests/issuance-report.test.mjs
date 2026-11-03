import ts from 'typescript';import fs from 'node:fs';import assert from 'node:assert/strict';
async function module(path){let source=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;source=source.replace("import { paymentReceived } from './payments';",fs.readFileSync('lib/payments.ts','utf8'));source=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))}
const {buildIssuanceReport}=await module('lib/issuance-report.ts'),{reportXlsx}=await module('lib/report-xlsx.ts');
const base={eventId:'event',quantity:3,price:100,reference:'DIRECT',payment:'COLLECT AT VENUE',remarks:''};
const data={bookings:[{...base,ref:'A',name:'Alice',issued:0},{...base,ref:'B',name:'Bob',issued:1,reference:'SANKETH',payment:'PARTIALLY PAID',phone:'9876543210'},{...base,ref:'C',name:'Chandra',issued:3,payment:'PAID'},{...base,ref:'D',name:'Other event',issued:0,eventId:'other'}]};
const report=buildIssuanceReport(data,'event');assert.equal(report.rows.length,3);assert.deepEqual(report.rows.map(r=>r.slice(4,8)),[[3,0,3,'NOT ISSUED'],[3,1,2,'ISSUED'],[3,3,0,'ISSUED']]);assert.equal(report.rows[0][3],'');assert.equal(report.rows[1][8],'PARTIALLY PAID');assert.equal(buildIssuanceReport(data,'event','SANKETH','BOB').rows.length,1);assert.equal(buildIssuanceReport(data,'event','DIRECT','9876').rows.length,0);assert.equal(buildIssuanceReport(data,'event','ALL','9876').rows.length,1);assert.equal(buildIssuanceReport(data,'missing').rows.length,0);
fs.writeFileSync('/tmp/issuance-report-qa.xlsx',reportXlsx(report.headers,report.rows,{sheetName:'Ticket issuance'}));console.log('Passed issued/unissued/partial counts, filters, event isolation, optional phones and payment status.');

const exampleReport=buildIssuanceReport({bookings:[{...base,quantity:5,issued:3,price:200,amountReceived:600,payment:"PARTIALLY PAID",name:"Example",ref:"EX"}]},"event");assert.equal(exampleReport.rows[0][7],"ISSUED");assert.equal(exampleReport.rows[0][9],600);
// Regression: ticket counts must use integer formatting; amounts remain currency.
const workbookText=Buffer.from(reportXlsx(report.headers,report.rows)).toString('utf8');
for(const column of ['E','F','G'])assert.match(workbookText,new RegExp('<c r="'+column+'2" s="5"><v>\\d+</v></c>'));
assert.match(workbookText,/<c r="J2" s="2"><v>0<\/v><\/c>/);
assert.match(workbookText,/<xf numFmtId="1"[^>]*applyNumberFormat="1"/);
console.log('Count columns are numeric integers, with currency only for monetary columns.');
