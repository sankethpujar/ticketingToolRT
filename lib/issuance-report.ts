import {paymentReceived} from './payments';
import type {ReportCell} from './reports';
export function buildIssuanceReport(data:any,eventId:string,reference='ALL',query=''){
const headers=['Booking Reference','Booking Name','Reference','Phone Number','Tickets Booked','Tickets Issued','Tickets Not Issued','Issuance Status','Payment Status','Payment Received','Remarks'];
const search=query.toLowerCase();
const rows:ReportCell[][]=data.bookings.filter((b:any)=>b.eventId===eventId&&(reference==='ALL'||b.reference===reference)&&[b.name,b.ref,b.phone].join(' ').toLowerCase().includes(search)).map((b:any)=>{
const booked=Number(b.quantity),issued=Number(b.issued),remaining=Math.max(0,booked-issued);
return [b.ref,b.name,b.reference,b.phone||'',booked,issued,remaining,issued===0?'NOT ISSUED':'ISSUED',b.payment,paymentReceived(b),b.remarks||''];
});return {headers,rows};
}
