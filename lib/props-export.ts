export const propsExportHeaders=['Scene # / Description','Props','Remarks'];
export function propsExportRows(plan:{labels:{id:string,name:string}[],scenes:{description:string,propIds:string[],remarks:string}[]}) {
 const names=new Map(plan.labels.map(label=>[label.id,label.name]));
 const scenes=plan.scenes.map(scene=>[scene.description,scene.propIds.map(id=>names.get(id)||'').filter(Boolean).join('\n'),scene.remarks]);
 return [...scenes,['','',''],['Master prop list','',''],...plan.labels.map(label=>[label.name,'',''])];
}
export function propsExportFilename(input:string){const name=input.trim().replace(/\.xlsx$/i,'').trim();if(!name||name.length>120||/[<>:"/\\|?*\u0000-\u001F]/.test(name)||/[. ]$/.test(name)||/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i.test(name))throw Error('Enter a filename of 1–120 characters without slashes or special filename characters.');return name+'.xlsx'}
