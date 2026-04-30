// Updates every element with [data-tz="<IANA timezone>"] every second.
// Inside the element, ".clock" gets the time and ".tz-abbr" gets the
// short timezone abbreviation (handles DST automatically).

(function () {
  function formatTime(timeZone) {
    const f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const parts = f.formatToParts(new Date());
    let h = '', m = '', s = '', ap = '';
    for (const p of parts) {
      if (p.type === 'hour') h = p.value;
      else if (p.type === 'minute') m = p.value;
      else if (p.type === 'second') s = p.value;
      else if (p.type === 'dayPeriod') ap = p.value;
    }
    return h + ':' + m + ':' + s + ' ' + ap;
  }

  function getAbbr(timeZone) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' });
    const part = f.formatToParts(new Date()).find(p => p.type === 'timeZoneName');
    return part ? part.value : '';
  }

  function tick() {
    document.querySelectorAll('[data-tz]').forEach(el => {
      const tz = el.getAttribute('data-tz');
      const clock = el.querySelector('.clock');
      const abbr = el.querySelector('.tz-abbr');
      if (clock) clock.textContent = formatTime(tz);
      if (abbr) abbr.textContent = getAbbr(tz);
    });
  }

  tick();
  setInterval(tick, 1000);
})();
