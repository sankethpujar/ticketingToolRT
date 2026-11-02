export const soundKeys='1234567890abcdefghijklmnopqrstuvwxyz';
export const audioTypes:Record<string,string>={mp3:'audio/mpeg',wav:'audio/wav',ogg:'audio/ogg',m4a:'audio/mp4',aac:'audio/aac',flac:'audio/flac',webm:'audio/webm'};
export function cueShortcut(value:unknown){const key=String(value||'').toLowerCase();if(key&&!soundKeys.includes(key)||key.length>1)throw Error('Choose a single letter or number for the shortcut.');return key}
export function shortcutTaken(scenes:any[],key:string,exceptId=''){return !!key&&scenes.some(s=>s.cues.some((c:any)=>c.id!==exceptId&&c.shortcut===key))}
