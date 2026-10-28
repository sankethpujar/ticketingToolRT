export type PropsExportMode='saved'|'save'|'unsaved';
export async function exportPropsWithMode<T>({mode,draft,loadSaved,saveDraft,download}:{mode:PropsExportMode,draft:T,loadSaved:()=>Promise<T>,saveDraft:()=>Promise<T|null>,download:(plan:T)=>void}):Promise<boolean>{
 const plan=mode==='saved'?await loadSaved():mode==='save'?await saveDraft():draft;
 if(plan===null)return false;
 download(plan);return true;
}
