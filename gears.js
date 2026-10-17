(() => {
const svg=document.querySelector('#gear-illustration');if(!svg)return;
// A single continuous gear chain: first meshes with second, second meshes with third.
// Alternating rotation directions preserve the mechanical relationship.
function gearPath(r,n){
 const pts=[];const step=Math.PI*2/n;
 for(let i=0;i<n;i++){
   const a=i*step-Math.PI/2;
   [[-.47,r-7],[-.31,r+3],[.31,r+3],[.47,r-7]].forEach(([f,rr])=>{
      const t=a+f*step;pts.push([Math.cos(t)*rr,Math.sin(t)*rr]);
   });
 }
 return pts.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')+' Z';
}
svg.querySelectorAll('.gear-teeth').forEach(p=>p.setAttribute('d',gearPath(78,16)));
const stages=[
 {label:'01 / MARKET INTELLIGENCE',items:['ICP Refinement','Category Positioning','Competitive Battlecards','Messaging']},
 {label:'02 / BRAND BUILDING',items:['Consistent Look & Feel','Content Arcs','Website Copy','Sales Assets','Investor Pitch Decks']},
 {label:'03 / GTM AUTOMATION',items:['ICP Builder','Pipeline Generation','Outreach','Engagement','Conversion']}
];
const units=[...svg.querySelectorAll('.gear-unit')],title=document.querySelector('#gear-step'),count=document.querySelector('#gear-count'),reveal=document.querySelector('#gear-reveal'),pause=document.querySelector('#gear-pause');
let active=0,timer=null,revealTimers=[],playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
function clear(){clearTimeout(timer);revealTimers.forEach(clearTimeout);revealTimers=[]}
function show(index){
 clear();active=index;
 units.forEach((u,i)=>u.classList.toggle('is-active',i===index));
 title.textContent=stages[index].label;count.textContent=`${index+1} OF 3`;reveal.replaceChildren();
 stages[index].items.forEach((item,i)=>{
  const add=()=>{const pill=document.createElement('span');pill.className='gear-pill';pill.textContent=item;reveal.appendChild(pill)};
  if(!playing || i===0)add();else revealTimers.push(setTimeout(add,i*330));
 });
 if(playing)timer=setTimeout(()=>show((active+1)%3),3200);
}
units.forEach((u,i)=>{
 u.addEventListener('click',()=>show(i));
 u.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(i)}});
});
pause.addEventListener('click',()=>{
 playing=!playing;pause.textContent=playing?'Ⅱ':'▶';pause.setAttribute('aria-label',playing?'Pause animation':'Play animation');
 document.querySelectorAll('.gear-rotor').forEach(r=>r.style.animationPlayState=playing?'running':'paused');
 show(active);
});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){clear();document.querySelectorAll('.gear-rotor').forEach(r=>r.style.animationPlayState='paused')}
 else{document.querySelectorAll('.gear-rotor').forEach(r=>r.style.animationPlayState=playing?'running':'paused');show(active)}
});
if(!playing){pause.textContent='▶';pause.setAttribute('aria-label','Play animation');document.querySelectorAll('.gear-rotor').forEach(r=>r.style.animationPlayState='paused')}
show(0);
})();