import {audioTypes} from './soundboard';
export const sceneSoundLimitMessage='One scene can have a maximum of six audio files configured.';
export function sceneSoundNames(existing:number,files:ReadonlyArray<{name:string,size:number}>){
if(existing+files.length>6)throw Error(sceneSoundLimitMessage);
if(!files.length)throw Error('Drop at least one audio file.');
return files.map(file=>{if(!file.size||!audioTypes[file.name.split('.').pop()?.toLowerCase()||''])throw Error('Choose nonempty MP3, WAV, OGG, M4A, AAC, FLAC or WebM audio files.');return file.name.replace(/\.[^.]+$/,'').trim().slice(0,80)||file.name.slice(0,80)});
}
