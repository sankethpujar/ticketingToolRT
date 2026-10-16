import {env} from 'cloudflare:workers';
import {headers} from 'next/headers';
export const SESSION_COOKIE='__Host-rt_session';
export const db=()=>env.DB!;
export const hex=(bytes:ArrayBuffer|Uint8Array)=>Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,'0')).join('');
const unhex=(s:string)=>Uint8Array.from(s.match(/.{2}/g)||[],x=>parseInt(x,16));
export async function digest(s:string){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))}
export async function passwordHash(password:string,salt:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:unhex(salt),iterations:100000,hash:'SHA-256'},key,256))}
export function equal(a:string,b:string){let mismatch=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)mismatch|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return mismatch===0}
export function safeUser(u:any){return {id:u.id,username:u.username,name:u.username,role:u.role,active:!!u.active,owner:u.role==='super'}}
export async function bootstrap(){const config=env as any;if(!config.RT_BOOTSTRAP_HASH||!config.RT_BOOTSTRAP_SALT)throw Error('Login configuration unavailable.');await db().prepare('INSERT OR IGNORE INTO rt_users(id,username,username_key,role,active,salt,password_hash) VALUES(?,?,?,?,1,?,?)').bind('rt-super-user','admin_RT','admin_rt','super',config.RT_BOOTSTRAP_SALT,config.RT_BOOTSTRAP_HASH).run()}
export async function currentUser(req?:Request){const h=req?.headers??await headers();const cookie=h.get('cookie')||'';const token=cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(SESSION_COOKIE+'='))?.slice(SESSION_COOKIE.length+1);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return await db().prepare('SELECT u.* FROM rt_users u JOIN rt_sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1').bind(await digest(token),Date.now()).first<any>()}
export function originOK(req:Request){return req.headers.get('origin')===new URL(req.url).origin}
export function authReply(value:any,status=200,cookie?:string){const h:Record<string,string>={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};if(cookie)h['Set-Cookie']=cookie;return Response.json(value,{status,headers:h})}
export function sessionCookie(token:string,maxAge=28800){return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`}
