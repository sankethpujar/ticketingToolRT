import {currentUser,authReply} from '../../../rt-auth';
export const dynamic='force-dynamic';
export async function POST(req:Request){if(!await currentUser(req))return authReply({error:'Sign in required'},401);return authReply({error:'Server audio uploads are disabled. Choose local audio in Soundboard.'},410)}
export async function GET(req:Request){if(!await currentUser(req))return authReply({error:'Sign in required'},401);return authReply({error:'Server audio playback is disabled. Load the original file on this device.'},410)}
