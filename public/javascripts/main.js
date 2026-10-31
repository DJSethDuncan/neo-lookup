(() => {
  const clock = document.querySelector('#clock');
  const timezoneSelect = document.querySelector('#timezone-select');
  const unitsSelect = document.querySelector('#units-select');
  const selectedZone = () => timezoneSelect?.value === 'local' ? undefined : (timezoneSelect?.value || 'UTC');
  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: selectedZone() }).format(new Date());
  };
  updateClock();
  setInterval(updateClock, 1000);
  timezoneSelect?.addEventListener('change', updateClock);

  const source = document.querySelector('#neo-data');
  if (!source) return;
  let feed;
  try { feed = JSON.parse(source.textContent); } catch { return; }

  const objects = Object.values(feed.near_earth_objects || {}).flat();
  const summary = document.querySelector('#summary');
  const list = document.querySelector('#encounters');
  const number = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const distance = (neo) => Number(neo.close_approach_data[0].miss_distance.miles);
  const days = Object.keys(feed.near_earth_objects || {}).length;
  const hazardous = objects.filter((neo) => neo.is_potentially_hazardous_asteroid).length;
  const grouped = feed.near_earth_objects || {};

  function render() {
    const metric = unitsSelect?.value === 'metric';
    const distanceUnit = metric ? 'km' : 'mi';
    const speedUnit = metric ? 'km/h' : 'mph';
    const diameterUnit = metric ? 'm' : 'ft';
    const convertDistance = (miles) => miles * (metric ? 1.609344 : 1);
    const convertSpeed = (mph) => mph * (metric ? 1.609344 : 1);
    const convertDiameter = (feet) => feet * (metric ? 0.3048 : 1);
    summary.innerHTML = `<div class="stat"><span>TRACKED OBJECTS</span><strong>${objects.length}</strong><small>across ${days} days</small></div><div class="stat"><span>POTENTIALLY HAZARDOUS</span><strong>${hazardous.toString().padStart(2, '0')}</strong><small>NASA classification</small></div><div class="stat"><span>CLOSEST APPROACH</span><strong>${objects.length ? number(convertDistance(Math.min(...objects.map(distance)))) : '—'}</strong><small>${distanceUnit} from Earth</small></div>`;

    list.innerHTML = Object.keys(grouped).sort().map((date) => {
      const entries = grouped[date].slice().sort((a, b) => distance(a) - distance(b));
      const zone = selectedZone();
      const dateLabel = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', timeZone: zone });
      const max = Math.max(238900, ...entries.map(distance));
      const rows = entries.map((neo) => {
        const pass = neo.close_approach_data[0];
        const miles = distance(neo);
        const diameter = neo.estimated_diameter.feet;
        const hazardous = neo.is_potentially_hazardous_asteroid;
        const position = Math.max(3, Math.min(97, miles / max * 100));
        const velocity = convertSpeed(Number(pass.relative_velocity.miles_per_hour));
        const speedLevel = Math.max(1, Math.min(5, Math.ceil(velocity / (metric ? 8046.72 : 5000))));
        const diameterMid = (Number(diameter.estimated_diameter_min) + Number(diameter.estimated_diameter_max)) / 2;
        const asteroidSize = Math.max(5, Math.min(48, diameterMid / 40));
        const distanceLabel = `${number(convertDistance(miles))} ${distanceUnit}`;
        const passDate = new Date(pass.close_approach_date_full.replace(/^(\d{4})-([A-Za-z]{3})-(\d{2}) (.+)$/, '$2 $3, $1 $4 UTC'));
        const passLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: zone, timeZoneName: 'short' }).format(passDate);
        const name = neo.name.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        return `<article class="object-card"><div class="object-main"><div class="object-name"><span class="object-symbol">✦</span><div><a href="${neo.nasa_jpl_url}" target="_blank" rel="noopener">${name}</a></div></div><div class="object-meta"><small>PASS ${passLabel}</small>${hazardous ? '<span class="badge badge-warn">POTENTIALLY HAZARDOUS</span>' : ''}</div></div><div class="orbit-track" aria-label="${distanceLabel} from Earth"><span class="distance-measure" style="left:8px;width:calc(${position}% - 8px)" aria-label="Miss distance: ${distanceLabel}"><span class="distance-measure-label">${distanceLabel}</span></span><svg class="track-earth" viewBox="0 0 16 16" role="img" aria-label="Earth"><circle cx="8" cy="8" r="7" fill="#78d9e8"/><path d="M3 4 5 3l2 1-.5 2L5 7 4 6 2.5 6ZM9 2.5 11 3l1 2-1 1-1.5-.5L8 4ZM9 9l2-1 2 1-.5 2-2 2-1.5-1Z" fill="#8fca82"/><path d="m4 9 2-.7 1.5 1L6 11l-1.5.5ZM10 6l2-.5 1.5 1-1 1.2-2-.3Z" fill="#fff" opacity=".85"/></svg><span class="track-moon" style="left:${Math.max(5, Math.min(95, 238900 / max * 100))}%"></span><span class="track-object" style="left:${position}%" aria-label="Asteroid"></span></div><div class="object-data"><div class="velocity-metric"><span>VELOCITY</span><div class="velocity-gauge" role="img" aria-label="Relative speed: ${speedLevel} of 5"><span class="speed-bars">${[1,2,3,4,5].map((level) => `<i class="${level <= speedLevel ? 'active' : ''}"></i>`).join('')}</span></div><strong>${number(velocity)} <small>${speedUnit}</small></strong></div><div class="diameter-metric"><span>EST. DIAMETER</span><svg class="asteroid-icon" width="${asteroidSize}" height="${asteroidSize}" viewBox="0 0 48 48" role="img" aria-label="Asteroid illustration scaled to estimated diameter"><path d="M10 13 20 7 31 10 40 18 37 30 29 39 17 37 8 29 6 20Z M10 13l9 8 11-11M19 21l-2 16m2-16 18 9m-8-19 1 12-12-2m20-7-9 7 8 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="13" cy="25" r="1.3" fill="currentColor"/><circle cx="31" cy="31" r="1.5" fill="currentColor"/></svg><strong>${number(convertDiameter(Number(diameter.estimated_diameter_min)))}–${number(convertDiameter(Number(diameter.estimated_diameter_max)))} <small>${diameterUnit}</small></strong></div></div></article>`;
      }).join('');
      return `<section class="day-group"><header class="day-heading"><span class="day-index">${date.slice(8, 10)}</span><div><h3>${dateLabel}</h3><span>${entries.length} OBJECT${entries.length === 1 ? '' : 'S'} IN RANGE</span></div><span class="day-line"></span></header><div class="day-objects">${rows}</div></section>`;
    }).join('') || '<p class="empty">No close approaches in the current tracking window.</p>';
  }
  unitsSelect?.addEventListener('change', render);
  timezoneSelect?.addEventListener('change', render);
  render();
})();
