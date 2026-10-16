export type ReportCell = string | number | {date: string};
export function buildReport(data: any, eventId: string) {
 const overall=eventId==='ALL';
 const headers=overall?['Booking Name','Reference','Phone Number','Ticket Price','Event Name','Date']:['Booking Name','Reference','Phone Number','Payment status'];
 const events=new Map<string,any>(data.events.map((e:any)=>[e.id,e]));
 const rows:ReportCell[][]=data.bookings.filter((b:any)=>overall||b.eventId===eventId).map((b:any)=>{
  const e=events.get(b.eventId);
  return overall?[b.name,b.reference,b.phone||'',Number(b.price),e?.name||'',e?.date?{date:e.date}:'']:[b.name,b.reference,b.phone||'',b.payment];
 });
 return {headers,rows};
}
