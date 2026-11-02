export type CuePosition={id:string,x:number,y:number};
export function nextCueInDirection(cues:CuePosition[],selected:string|null,key:string):string|null{
const current=cues.find(c=>c.id===selected);if(!current)return null;
const direction:Record<string,[number,number]>={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowDown:[0,1],ArrowUp:[0,-1]};
const vector=direction[key];if(!vector)return null;let nearest:string|null=null,best=Infinity;
for(const cue of cues){const dx=cue.x-current.x,dy=cue.y-current.y,forward=dx*vector[0]+dy*vector[1];if(forward<=1)continue;const sideways=Math.abs(dx*vector[1]-dy*vector[0]),score=forward+sideways*3;if(score<best){best=score;nearest=cue.id}}
return nearest;
}
