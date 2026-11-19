(() => {
  const layer=document.getElementById('snowfall');
  if(!layer || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const svg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M12 2v20M3.34 7l17.32 10M3.34 17L20.66 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M20 14l-4 1 1 4M7 19l1-4-4-1M17 5l-1 4 4 1"/></svg>';
  for(let i=0;i<76;i++){
    const flake=document.createElement('span');flake.className='snowflake';
    // Most flakes drift along the margins; the center stays softly dusted.
    const edge=i%3!==0, x=edge?(i%2?Math.random()*13:87+Math.random()*13):Math.random()*100;
    flake.style.cssText=`--x:${x}%;--size:${6+Math.random()*13}px;--opacity:${edge?.5+Math.random()*.35:.22+Math.random()*.2};--duration:${17+Math.random()*19}s;--delay:${-Math.random()*36}s;--drift:${Math.random()*50-25}px;`;
    flake.innerHTML=svg;layer.append(flake);
  }
  document.addEventListener('visibilitychange',()=>{layer.querySelectorAll('.snowflake').forEach(f=>f.style.animationPlayState=document.hidden?'paused':'running');});
})();
