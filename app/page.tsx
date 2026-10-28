import Desk from "./desk";
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{section?:string}>}){const {section}=await searchParams;const allowed=["Events","Reservations","Counter desk","Reports","Settings","User management"];return <Desk initialTab={section&&allowed.includes(section)?section:"Events"}/>;}
