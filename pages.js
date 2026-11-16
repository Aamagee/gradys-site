// ===== Gradys — Game Day, Events, Our Story =====
// Loaded after script.js on the sub-pages.
// The party planner emails requests to gradysmidvale@gmail.com via FormSubmit (formsubmit.co).
// The Game Day request form still composes a message and opens an Instagram DM to @gradys_midvale.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IG_DM = 'https://ig.me/m/gradys_midvale';
  const PARTY_EMAIL = 'gradysmidvale@gmail.com';
  const PARTY_ENDPOINT = `https://formsubmit.co/ajax/${PARTY_EMAIL}`;

  /* ---------- Current page in nav ---------- */
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('.site-nav a[data-nav="page"]').forEach(a => a.classList.toggle('current-page', a.getAttribute('href') === here));

  /* ---------- Toast (shares the element script.js uses) ---------- */
  const toastEl = $('[data-toast]');
  let tt;
  const toast = msg => { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 3200); };

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove(); return ok;
    }
  }
  async function sendDM(text, { open = true } = {}) {
    const ok = await copy(text);
    toast(ok ? (open ? 'Message copied ✓ Paste it in the DM' : 'Message copied ✓') : 'Copy failed — select the preview text instead');
    if (open) window.open(IG_DM, '_blank', 'noopener');
  }

  /* ---------- Mountain Time "now" ---------- */
  function mt() {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const g = t => p.find(x => x.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday'));
    const h = +g('hour'), m = +g('minute');
    const late = h < 1;                                   // 12–1 AM belongs to the previous bar day
    return { day: late ? (day + 6) % 7 : day, h: late ? h + 24 : h, m };
  }

  /* =========================================================
     GAME DAY
     ========================================================= */
  // Typical broadcast windows in Mountain Time. Matchups change weekly.
  // Slot = [time, teams[], text]. Teams render as colored badges (team colors + short name;
  // official logos are trademarks, so we don't use them).
  const TEAMS = {
    nfl:     { t: 'NFL',  name: 'NFL',               bg: '#013369', fg: '#ffffff', ring: '#d50a0a' },
    nba:     { t: 'NBA',  name: 'NBA',               bg: '#1d428a', fg: '#ffffff', ring: '#c8102e' },
    nhl:     { t: 'NHL',  name: 'NHL',               bg: '#111111', fg: '#ffffff', ring: '#a2aaad' },
    ncaa:    { t: 'NCAA', name: 'College',           bg: '#005eb8', fg: '#ffffff', ring: '#ffffff' },
    jazz:    { t: 'JAZZ', name: 'Utah Jazz',         bg: '#4b2a85', fg: '#ffffff', ring: '#111111' },
    mammoth: { t: 'UTA',  name: 'Utah Mammoth',      bg: '#0b0b0b', fg: '#71afe5', ring: '#71afe5' },
    utes:    { t: 'U',    name: 'Utah Utes',         bg: '#cc0000', fg: '#ffffff', ring: '#ffffff' },
    byu:     { t: 'BYU',  name: 'BYU Cougars',       bg: '#002e5d', fg: '#ffffff', ring: '#ffffff' }
  };
  const WEEK = [
    { d: 1, name: 'Monday', special: 'Meaty Monday', slots: [['11a', [], 'Doors open · lunch'], ['6:15p', ['nfl'], 'Monday Night Football'], ['All night', [], 'Meaty Monday feature until it’s gone']] },
    { d: 2, name: 'Tuesday', special: 'Full menu', slots: [['11a', [], 'Doors open'], ['Evening', ['jazz', 'nba'], 'Jazz & NBA games'], ['Evening', ['mammoth', 'nhl'], 'Mammoth & NHL games']] },
    { d: 3, name: 'Wednesday', special: 'Full menu', slots: [['11a', [], 'Doors open'], ['Evening', ['jazz', 'nba'], 'Hoops on the big screens'], ['Evening', ['mammoth', 'nhl'], 'Hockey on the side screens']] },
    { d: 4, name: 'Thursday', special: '$13 Burger Thursday', slots: [['11a', [], 'Every burger $13 (bison excluded)'], ['6:15p', ['nfl'], 'Thursday Night Football'], ['All day', [], 'New feature burger each week']] },
    { d: 5, name: 'Friday', special: 'Full menu', slots: [['11a', [], 'Doors open'], ['Evening', ['utes', 'byu'], 'College hoops & Friday football'], ['Evening', ['jazz', 'nba'], 'Late games till close']] },
    { d: 6, name: 'Saturday', special: 'Brunch 11–3', slots: [['11a', [], 'Brunch, beer & the early games'], ['All day', ['utes', 'byu', 'ncaa'], 'College football, every screen'], ['Big games', ['utes', 'byu'], 'We open early (10 AM for the Holy War)']] },
    { d: 0, name: 'Sunday', special: 'Brunch 11–3', slots: [['11a', ['nfl'], 'Early slate + brunch'], ['2:05p', ['nfl'], 'Late games'], ['6:20p', ['nfl'], 'Sunday Night Football']] }
  ];
  const badges = teams => teams.length ? `<span class="badges">${teams.map(k => {
    const t = TEAMS[k]; if (!t) return '';
    return `<span class="team-badge" title="${t.name}" aria-label="${t.name}" style="--bg:${t.bg};--fg:${t.fg};--ring:${t.ring}">${t.t}</span>`;
  }).join('')}</span>` : '';

  const rail = $('[data-rail]');
  if (rail) {
    const now = mt();
    rail.innerHTML = WEEK.map(w => `
      <article class="day-card${w.d === now.day ? ' today' : ''}" data-day="${w.d}">
        <header><h3>${w.name.slice(0, 3)}</h3><span class="day-special">${esc(w.special)}</span></header>
        <ul>${w.slots.map(([t, teams, txt]) => `<li><time>${t}</time><span class="slot-body">${badges(teams || [])}<span class="slot-text">${esc(txt)}</span></span></li>`).join('')}</ul>
      </article>`).join('');
    const today = $('.day-card.today', rail);
    if (today) requestAnimationFrame(() => rail.scrollTo({ left: today.offsetLeft - rail.offsetLeft - 2, behavior: 'auto' }));
    const step = () => ($('.day-card', rail)?.offsetWidth || 280) + 16;
    $('[data-rail-prev]')?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    $('[data-rail-next]')?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));

    // "On now / tonight" pill in the hero
    const pill = $('[data-now-pill]');
    if (pill) {
      const t = now.h + now.m / 60;
      const open = t >= 11 || now.h >= 24;
      let live = false, msg;
      if (!open) msg = `Doors open at <b>11 AM</b> · ${esc(WEEK.find(w => w.d === now.day).special)}`;
      else if ((now.day === 1 || now.day === 4) && t >= 18 && t < 22.5) { live = true; msg = `<b>${now.day === 1 ? 'Monday' : 'Thursday'} Night Football</b> is on now`; }
      else if (now.day === 0 && t >= 11 && t < 22.5) { live = true; msg = `<b>NFL Sunday</b> is on now`; }
      else if (now.day === 6 && t >= 11) { live = true; msg = `<b>College football</b> on every screen`; }
      else if (now.day === 1 || now.day === 4) msg = `Tonight: <b>${now.day === 1 ? 'MNF' : 'TNF'}</b> at 6:15 PM`;
      else msg = `Open now · <b>whatever game you want</b> on the screens`;
      pill.innerHTML = `<span class="dot"></span><span>${msg}</span>`;
      pill.classList.toggle('calm', !live);
    }
  }

  // Feature board (flip cards) from menu-data.js
  const board = $('[data-features]');
  if (board && window.GRADYS_FEATURES) {
    const FLIP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/></svg>';
    const now = mt();
    const nextName = now.day >= 2 && now.day <= 4 ? 'Burger Thursday' : 'Meaty Monday';
    board.innerHTML = `
      <article class="feat next">
        <div class="feat-inner"><div class="feat-face feat-front">
          <p class="feat-day">Coming up · ${nextName}</p>
          <h3>This week’s drop</h3>
          <p class="feat-line">We post every new feature on Instagram first.</p>
          <div class="feat-meta"><span>@gradys_midvale</span><a class="btn btn-dark btn-small" href="https://www.instagram.com/gradys_midvale/" target="_blank" rel="noopener">See it</a></div>
        </div></div>
      </article>` + GRADYS_FEATURES.map((f, i) => `
      <article class="feat" data-feat="${i}">
        <div class="feat-inner">
          <div class="feat-face feat-front">
            <p class="feat-day">${esc(f.day)} · ${esc(f.date)}</p>
            <h3>${esc(f.name)}</h3>
            <p class="feat-line">${esc(f.line)}</p>
            <div class="feat-meta"><span>Past feature</span>${f.price ? `<b>$${esc(f.price)}</b>` : '<span>Ask us</span>'}</div>
            <button type="button" class="feat-flip" aria-label="Show what was on the ${esc(f.name)}">${FLIP}</button>
          </div>
          <div class="feat-face feat-back" aria-hidden="true">
            <h3>${esc(f.name)}</h3>
            <p>${esc(f.d)}</p>
            <button type="button" class="btn btn-small" data-bring="${i}">Bring it back</button>
            <button type="button" class="feat-flip" aria-label="Flip back">${FLIP}</button>
          </div>
        </div>
      </article>`).join('');
    board.addEventListener('click', e => {
      const bring = e.target.closest('[data-bring]');
      if (bring) {
        const f = GRADYS_FEATURES[+bring.dataset.bring];
        sendDM(`Hey Gradys! Any chance you'd bring back the ${f.name} (${f.day})? It was a banger.`);
        return;
      }
      const card = e.target.closest('.feat:not(.next)');
      if (!card || e.target.closest('a')) return;
      const flipped = card.classList.toggle('flipped');
      $('.feat-front', card).setAttribute('aria-hidden', flipped);
      $('.feat-back', card).setAttribute('aria-hidden', !flipped);
      $$('button', $('.feat-back', card)).forEach(b => { b.tabIndex = flipped ? 0 : -1; });
      $('.feat-front .feat-flip', card).tabIndex = flipped ? -1 : 0;
      (flipped ? $('.feat-back [data-bring]', card) : $('.feat-front .feat-flip', card))?.focus({ preventScroll: true });
    });
    $$('.feat-back button', board).forEach(b => { b.tabIndex = -1; });
  }

  // Request-a-game form
  const req = $('[data-request]');
  if (req) {
    const dateIn = $('input[type="date"]', req);
    if (dateIn) dateIn.min = new Date().toISOString().slice(0, 10);
    req.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(req);
      const game = (fd.get('game') || '').trim();
      if (!game) { toast('Tell us which game first'); $('[name="game"]', req).focus(); return; }
      const when = fd.get('date') ? new Date(fd.get('date') + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'soon';
      const crew = fd.get('crew');
      sendDM(`Hey Gradys! Can you put the ${fd.get('league')} game ${game} on ${when}?${crew ? ` We'll have about ${crew} people.` : ''} Thanks!`);
    });
  }

  /* =========================================================
     EVENTS — party planner
     ========================================================= */
  const planner = $('[data-planner]');
  if (planner) {
    const size = $('[name="size"]', planner);
    const sizeOut = $('[data-size-out]', planner);
    const sizeHint = $('[data-size-hint]', planner);
    const date = $('[name="date"]', planner);
    const preview = $('[data-preview]');
    const steps = $$('.steps span', planner);
    date.min = new Date().toISOString().slice(0, 10);
    const sum = k => $(`[data-sum="${k}"]`);
    const last = {};

    const hint = n => n <= 8 ? 'A couple of tables near the screens.' : n <= 20 ? 'Tables together near the big screens.' : n <= 40 ? 'A good chunk of the room. DM early.' : 'That’s a takeover. Let’s talk details.';

    function read() {
      const fd = new FormData(planner);
      const n = +size.value;
      return {
        occasion: fd.get('occasion') || '',
        date: fd.get('date') ? new Date(fd.get('date') + 'T12:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '',
        time: fd.get('time') || '',
        size: n >= 60 ? '60+' : String(n),
        extras: fd.getAll('extras'),
        name: (fd.get('name') || '').trim(),
        contact: (fd.get('contact') || '').trim(),
        notes: (fd.get('notes') || '').trim(),
        honey: fd.get('_honey') || ''
      };
    }
    function message(s) {
      const lines = [`Hi Gradys! I'd like to book a ${s.occasion ? s.occasion.toLowerCase() : 'party'}${s.name ? ` (this is ${s.name})` : ''}.`];
      if (s.date || s.time) lines.push(`When: ${[s.date, s.time].filter(Boolean).join(', ')}`);
      lines.push(`Group size: about ${s.size} people (all 21+)`);
      if (s.extras.length) lines.push(`Interested in: ${s.extras.join(', ')}`);
      if (s.notes) lines.push(`Notes: ${s.notes}`);
      if (s.contact) lines.push(`Reach me at: ${s.contact}`);
      lines.push('What do you have available?');
      return lines.join('\n');
    }
    function render() {
      const s = read();
      size.style.setProperty('--fill', `${((size.value - size.min) / (size.max - size.min)) * 100}%`);
      sizeOut.textContent = s.size;
      sizeHint.textContent = hint(+size.value);
      const set = (k, v, empty) => {
        const el = sum(k); if (!el) return;
        const txt = v || empty;
        if (el.textContent !== txt) {
          el.textContent = txt;
          el.classList.toggle('empty', !v);
          if (last[k] !== undefined && v && !reduceMotion) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
        }
        last[k] = v;
      };
      set('occasion', s.occasion, 'Pick an occasion');
      set('when', [s.date, s.time].filter(Boolean).join(' · '), 'Pick a date');
      set('size', `${s.size} guests`, '');
      set('extras', s.extras.join(', '), 'Nothing extra yet');
      set('name', s.name, 'Add your name');
      set('contact', s.contact, 'Add email or phone');
      const title = $('[data-sum-title]');
      if (title) title.textContent = s.occasion || 'Your party';
      preview.textContent = message(s);
      const done = [!!s.occasion, !!s.date, true, !!s.name && !!s.contact];
      steps.forEach((el, i) => el.classList.toggle('on', done[i]));
      return s;
    }
    planner.addEventListener('input', render);
    planner.addEventListener('change', render);
    // Send the request by email (FormSubmit). If that fails, open the guest's email app instead.
    const sendBtn = $('[data-send-btn]', planner);
    const looksLikeContact = v => /@.+\./.test(v) || v.replace(/\D/g, '').length >= 7;
    planner.addEventListener('submit', async e => {
      e.preventDefault();
      const s = render();
      if (!s.occasion) { toast('Pick an occasion first'); $('[name="occasion"]', planner).focus(); return; }
      if (!s.date) { toast('Pick a date so we can check availability'); date.focus(); return; }
      if (!s.name) { toast('Add your name'); $('[name="name"]', planner).focus(); return; }
      if (!looksLikeContact(s.contact)) { toast('Add an email or phone so we can reply'); $('[name="contact"]', planner).focus(); return; }
      if (s.honey) return;                                   // bot filled the hidden trap field

      const body = message(s);
      const label = sendBtn.textContent;
      sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
      try {
        const res = await fetch(PARTY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `Party request: ${s.occasion} · ${s.date}${s.size ? ` · ${s.size} people` : ''}`,
            _template: 'table',
            _captcha: 'false',
            ...(s.contact.includes('@') ? { _replyto: s.contact } : {}),
            Name: s.name,
            'Email or phone': s.contact,
            Occasion: s.occasion,
            Date: s.date,
            'Time of day': s.time || 'Any time',
            'Group size': `${s.size} (all 21+)`,
            'Add-ons': s.extras.join(', ') || 'None',
            Notes: s.notes || '—',
            Message: body
          })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false || data.success === 'false') throw new Error(data.message || 'send failed');
        sendBtn.textContent = 'Sent ✓';
        toast('Request sent ✓ We’ll get back to you soon');
        setTimeout(() => { sendBtn.disabled = false; sendBtn.textContent = label; }, 4000);
      } catch (err) {
        sendBtn.disabled = false; sendBtn.textContent = label;
        toast('Opening your email app to send it…');
        location.href = `mailto:${PARTY_EMAIL}?subject=${encodeURIComponent(`Party request: ${s.occasion} · ${s.date}`)}&body=${encodeURIComponent(body)}`;
      }
    });
    // Backup: copy the message and open an Instagram DM
    $('[data-copy-only]')?.addEventListener('click', () => sendDM(message(render())));

    // Deep links like events.html?type=Watch%20Party pre-select an occasion
    const pre = new URLSearchParams(location.search).get('type');
    if (pre) { const r = $$('[name="occasion"]', planner).find(x => x.value.toLowerCase() === pre.toLowerCase()); if (r) r.checked = true; }
    $$('[data-pick]').forEach(a => a.addEventListener('click', () => {
      const r = $$('[name="occasion"]', planner).find(x => x.value === a.dataset.pick);
      if (r) { r.checked = true; render(); }
    }));
    render();
  }

  /* =========================================================
     OUR STORY — manifesto lights up, timeline fills, photos drift
     ========================================================= */
  const lines = $$('.manifesto p');
  if (lines.length) {
    if (reduceMotion) lines.forEach(l => l.classList.add('lit'));
    else {
      const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('lit', e.isIntersecting || e.boundingClientRect.top < 0)), { rootMargin: '0px 0px -45% 0px' });
      lines.forEach(l => io.observe(l));
    }
  }

  const tl = $('.timeline');
  const tlFill = $('.tl-fill');
  const tlItems = $$('.tl-item');
  const photos = $$('.story-photos img');
  if (tl || photos.length) {
    let ticking = false;
    const onScroll = () => {
      if (tl) {
        const r = tl.getBoundingClientRect();
        const mid = innerHeight * 0.6;
        const pct = Math.max(0, Math.min(1, (mid - r.top) / r.height));
        tlFill.style.setProperty('--tl', `${pct * 100}%`);
        tlItems.forEach(it => it.classList.toggle('on', it.getBoundingClientRect().top < mid));
      }
      if (photos.length && !reduceMotion && scrollY < innerHeight * 1.2) {
        photos.forEach((p, i) => { p.style.translate = `0 ${scrollY * (0.12 + i * 0.08) * -1}px`; });
      }
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    onScroll();
  }

  /* ---------- Reveal for sub-page blocks (script.js handles shared ones) ---------- */
  const extra = $$('.day-card, .feat, .playbook li, .rules div, .bento-card, .planner > *, .gift > *, .faq details, .tl-item, .scratch div, .row-head');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    extra.forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', `${(i % 4) * 0.07}s`); });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.08 });
    extra.forEach(el => io.observe(el));
  }
})();
