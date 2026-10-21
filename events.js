/* Public calendar reader. Browser key restricted to this website and Calendar API. */
(() => {
  const calendarId = '96da1d18251170a86044a2ced2cb8d9f212134a4af2537ce5be0f98fc8d0f2f7@group.calendar.google.com';
  const apiKey = 'AIzaSyA7e-WWzrzjj3OAsUwpuOeAafjoYH7xORo';
  const zone = 'America/Denver';
  const calendarUrl = 'https://calendar.google.com/calendar/embed?' + new URLSearchParams({src:calendarId,ctz:zone,mode:'AGENDA'});
  const grid = document.getElementById('events-grid');
  const status = document.getElementById('events-status');
  const next = document.getElementById('next-stop');
  document.getElementById('calendar-link').href = calendarUrl;
  const fmt = (d, options) => new Intl.DateTimeFormat('en-US', {timeZone:zone,...options}).format(d);
  const dateOf = value => new Date(value.dateTime || value.date + 'T12:00:00-06:00');
  const dayLabel = d => fmt(d,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
  function labels(event) {
    const start = dateOf(event.start), end = dateOf(event.end);
    if (event.start.date) {
      const last = new Date(event.end.date+'T12:00:00-06:00'); last.setUTCDate(last.getUTCDate()-1);
      return {date: dayLabel(start)+(event.start.date!==last.toISOString().slice(0,10)?' – '+dayLabel(last):''),time:'All day'};
    }
    const sameDay = fmt(start,{year:'numeric',month:'2-digit',day:'2-digit'})===fmt(end,{year:'numeric',month:'2-digit',day:'2-digit'});
    return {date:dayLabel(start)+(sameDay?'':' – '+dayLabel(end)),time:fmt(start,{hour:'numeric',minute:'2-digit'})+' – '+fmt(end,{hour:'numeric',minute:'2-digit'})+' · El Paso time'};
  }
  function el(tag, cls, text) {
    const node = document.createElement(tag); if(cls) node.className=cls;
    if(text) node.textContent=text; return node;
  }
  function directions(location) {
    const a=el('a','directions','Get directions ↗');
    a.href='https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:location});
    a.target='_blank'; a.rel='noopener noreferrer'; return a;
  }
  function showNext(event) {
    const l=labels(event); next.replaceChildren();
    next.append(el('p','sign-label','Next stop · '+l.date));
    const h=el('h1','',event.summary||'723 Cafecito St.'); h.id='event-title';
    h.append(el('span','','Meet us on the street')); next.append(h);
    if(event.location)next.append(el('p','event-place',event.location));
    next.append(el('p','event-schedule',l.time));
    if(event.location)next.append(directions(event.location));
  }
  function showCard(event) {
    const l=labels(event), card=el('article','stop-card');
    card.append(el('span','stop-date',l.date),el('h3','',event.summary||'723 Cafecito St.'),el('p','stop-time',l.time));
    if(event.location)card.append(el('p','',event.location),directions(event.location));
    grid.append(card);
  }
  async function refresh() {
    const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),12000);
    try {
      const params=new URLSearchParams({key:apiKey,timeMin:new Date().toISOString(),singleEvents:'true',orderBy:'startTime',maxResults:'24',timeZone:zone});
      const response=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(calendarId)+'/events?'+params,{signal:controller.signal});
      if(!response.ok)throw new Error('Calendar unavailable');
      const data=await response.json();
      const events=(data.items||[]).filter(e=>e.status!=='cancelled' && e.start && e.end);
      grid.replaceChildren();
      if(events.length){showNext(events[0]);events.forEach(showCard);status.hidden=true;}
      else {status.hidden=false;status.textContent='New stops are on the way. Check back soon!';resetNext('Our next stop is on the way.');}
    } catch {
      status.hidden=false;status.textContent='Our route is taking a moment to load. Open our public calendar below for upcoming stops.';
      resetNext('See our upcoming stops below.');
    } finally {clearTimeout(timeout);}
  }
  function resetNext(message){
    next.replaceChildren(el('p','sign-label','Next stop'));
    const h=el('h1','','Follow the coffee');h.id='event-title';h.append(el('span','',message));next.append(h);
  }
  refresh();setInterval(refresh,5*60*1000);
})();
