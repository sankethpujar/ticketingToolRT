import Desk from '../../desk';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Desk initialTab="Plays" initialPlayId={id}/>}
