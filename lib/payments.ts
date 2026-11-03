export const moneyAmount=(value:number)=>Math.round(value*100)/100;
export function bookingTotal(booking:any){return moneyAmount(Number(booking.quantity||0)*Number(booking.price||0))}
export function paymentReceived(booking:any){const total=bookingTotal(booking);if(Number.isFinite(booking.amountReceived))return Math.min(total,Math.max(0,moneyAmount(booking.amountReceived)));if(booking.payment==='PAID')return total;if(booking.payment==='PARTIALLY PAID')return Math.min(total,moneyAmount(Number(booking.issued||0)*Number(booking.price||0)));return 0}
export function paymentRemaining(booking:any){return moneyAmount(Math.max(0,bookingTotal(booking)-paymentReceived(booking)))}
export function receiveIssuePayment(booking:any,quantity:number){const total=bookingTotal(booking),received=booking.payment==='PAID'?total:Math.min(total,moneyAmount(paymentReceived(booking)+quantity*Number(booking.price)));return {amountReceived:received,payment:received>=total?'PAID':'PARTIALLY PAID'}}
