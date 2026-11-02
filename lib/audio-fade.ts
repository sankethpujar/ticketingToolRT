// Fade only the supplied player; cancellation restores its original volume.
export function fadeOutAndStop(player:HTMLAudioElement,onStopped:()=>void,duration=1000,getVolume?:()=>number){
const volume=player.volume,restoreVolume=()=>getVolume?getVolume():volume,started=Date.now();let finished=false;
const tick=setInterval(()=>{player.volume=restoreVolume()*Math.max(0,1-(Date.now()-started)/duration)},16);
const end=setTimeout(()=>{if(finished)return;finished=true;clearInterval(tick);player.pause();player.currentTime=0;player.volume=restoreVolume();onStopped()},duration);
return ()=>{if(finished)return;finished=true;clearInterval(tick);clearTimeout(end);player.volume=volume};
}
