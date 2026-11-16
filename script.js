// ===== Gradys — interactions =====
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* =========================================================
     Toast
     ========================================================= */
  const toastEl = $('[data-toast]');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* =========================================================
     Header: solid after scroll, hides on scroll down, shows on scroll up
     + scroll progress bar + back-to-top + hero parallax
     ========================================================= */
  const header = $('.site-header');
  const progress = $('.progress span');
  const toTop = $('[data-to-top]');
  const heroCopy = $('.hero-copy');
  const nav = $('#site-nav');
  let lastY = scrollY, ticking = false;

  function onScroll() {
    const y = scrollY;
    header.classList.toggle('scrolled', y > 40);
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (!nav.classList.contains('open')) {
      if (goingDown && y > 500) { header.classList.add('hidden'); document.body.classList.add('header-hidden'); }
      if (goingUp || y < 200) { header.classList.remove('hidden'); document.body.classList.remove('header-hidden'); }
    }
    lastY = y;

    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    toTop.classList.toggle('show', y > innerHeight * 1.2);

    if (heroCopy && !reduceMotion && y < innerHeight) {
      heroCopy.style.transform = `translateY(${y * 0.25}px)`;
      heroCopy.style.opacity = Math.max(0, 1 - y / (innerHeight * 0.75));
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* =========================================================
     Mobile menu
     ========================================================= */
  const toggle = $('.nav-toggle');
  const setNav = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) header.classList.remove('hidden');
  };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });

  /* =========================================================
     Router: Home page  <->  Full menu page (#full-menu, #full-menu/brunch)
     ========================================================= */
  const pages = { home: $('[data-page="home"]'), menu: $('[data-page="menu"]') };
  let currentPage = 'home';

  function showPage(name) {
    if (currentPage === name) return;
    Object.entries(pages).forEach(([k, el]) => { el.hidden = k !== name; });
    currentPage = name;
    document.title = name === 'menu' ? 'Menu | Gradys, Midvale UT' : 'Gradys | Scratch Kitchen & Bar in Midvale, Utah';
    $$('.site-nav a[data-nav="menu"]').forEach(a => a.classList.toggle('current', name === 'menu' && a.getAttribute('href') === '#full-menu'));
  }

  function scrollToEl(el, extra = 0) {
    const top = el.getBoundingClientRect().top + scrollY - extra;
    scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function route(hash, { instant = false } = {}) {
    hash = hash || '#home';
    if (hash.startsWith('#full-menu')) {
      if (!pages.menu) { location.href = 'index.html' + hash; return; }
      const wasHome = currentPage !== 'menu';
      showPage('menu');
      const cat = hash.split('/')[1];
      const band = cat && $(`[data-cat-band="${cat}"]`);
      clearSearch();
      if (band) {
        requestAnimationFrame(() => {
          if (wasHome) scrollTo(0, 0);
          scrollToEl(band, 110);
        });
      } else scrollTo(0, 0);
      return;
    }
    if (hash === '#home' || hash === '#top') {
      if (currentPage !== 'home') { showPage('home'); scrollTo(0, 0); }
      else scrollTo({ top: 0, behavior: instant || reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    const switching = !!pages.menu && !pages.menu.hidden && pages.home.contains(target);
    if (switching) showPage('home');
    requestAnimationFrame(() => {
      if (switching || instant) scrollTo(0, target.getBoundingClientRect().top + scrollY - 70);
      else scrollToEl(target, 70);
    });
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#' || href === '#main') return;
    e.preventDefault();
    setNav(false);
    if (location.hash !== href) history.pushState(null, '', href === '#top' ? location.pathname : href);
    route(href);
  });
  addEventListener('popstate', () => route(location.hash, { instant: true }));

  // Highlight nav link for the home section in view
  const navLinks = $$('.site-nav a[href^="#"]:not([data-nav])');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting || currentPage !== 'home') return;
      navLinks.forEach(a => a.classList.toggle('current', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => { const t = document.getElementById(a.getAttribute('href').slice(1)); if (t) spy.observe(t); });

  /* =========================================================
     Hours, live status, "today", dial & countdowns (Mountain Time)
     Daily 11:00–01:00 · Brunch Sat–Sun 11:00–15:00 (per Instagram, Nov 2026)
     ========================================================= */
  const OPEN = { 0: 11, 1: 11, 2: 11, 3: 11, 4: 11, 5: 11, 6: 11 };
  const CLOSE = 1; // 1 AM next day
  const BRUNCH = [11, 15];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const SPECIALS = {
    0: 'Weekend brunch 11 AM – 3 PM + NFL Sunday.',
    1: 'Meaty Monday + Monday Night Football.',
    2: 'Full menu, 11 AM – 1 AM. Entrées after 4 PM.',
    3: 'Full menu, 11 AM – 1 AM. Entrées after 4 PM.',
    4: 'Burger Thursday: every burger $13 (bison excluded).',
    5: 'Full menu, 11 AM – 1 AM. Entrées after 4 PM.',
    6: 'Weekend brunch 11 AM – 3 PM + college game day.'
  };
  const fmt = h => (h % 12 || 12) + (h % 24 < 12 ? ' AM' : ' PM');
  const isWeekend = d => d === 0 || d === 6;

  function mountainNow() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', weekday: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    const h = +get('hour'), m = +get('minute'), s = +get('second');
    return { day, h, m, s, secs: h * 3600 + m * 60 + s };
  }

  // --- Dial geometry (24h ring, midnight at top) ---
  const CX = 150, CY = 150, R = 118;
  const pt = (hour, r = R) => { const a = (hour / 24) * 2 * Math.PI - Math.PI / 2; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
  const arc = (h1, h2) => { const [x1, y1] = pt(h1), [x2, y2] = pt(h2); const large = (h2 - h1) > 12 ? 1 : 0; return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`; };
  const ticks = $('[data-dial-ticks]');
  if (ticks) {
    let g = '';
    [0, 3, 6, 9, 12, 15, 18, 21].forEach(h => {
      const [tx, ty] = pt(h, R - 30);
      const [a1, b1] = pt(h, R - 14), [a2, b2] = pt(h, R - 20);
      const label = h === 0 ? '12a' : h === 12 ? '12p' : (h % 12) + (h < 12 ? 'a' : 'p');
      g += `<line x1="${a1.toFixed(1)}" y1="${b1.toFixed(1)}" x2="${a2.toFixed(1)}" y2="${b2.toFixed(1)}"/><text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}">${label}</text>`;
    });
    ticks.innerHTML = g;
  }

  function untilNext(now, targetDay, targetHour) {
    let d = (targetDay - now.day + 7) % 7;
    let secs = d * 86400 + targetHour * 3600 - now.secs;
    if (secs <= 0) secs += 7 * 86400;
    return secs;
  }
  function setClock(el, secs) {
    const d = Math.floor(secs / 86400), h = Math.floor(secs % 86400 / 3600), m = Math.floor(secs % 3600 / 60), s = secs % 60;
    $('[data-d]', el).textContent = d;
    $('[data-h]', el).textContent = String(h).padStart(2, '0');
    $('[data-m]', el).textContent = String(m).padStart(2, '0');
    $('[data-s]', el).textContent = String(s).padStart(2, '0');
  }

  let lastMinute = -1;
  function tick() {
    const now = mountainNow();
    const lateNight = now.h < CLOSE;                 // 12–1 AM still counts as previous bar day
    const barDay = lateNight ? (now.day + 6) % 7 : now.day;
    const open = lateNight || now.h >= OPEN[now.day];

    // Countdowns (every second)
    const burger = $('[data-countdown="burger"]');
    if (burger) {
      const live = barDay === 4 && open;
      burger.classList.toggle('live', live);
      $('.cd-clock', burger).hidden = live;
      $('.cd-live', burger).hidden = !live;
      if (!live) setClock(burger, untilNext(now, 4, OPEN[4]));
    }
    const brunch = $('[data-countdown="brunch"]');
    if (brunch) {
      const live = isWeekend(now.day) && now.h >= BRUNCH[0] && now.h < BRUNCH[1];
      brunch.classList.toggle('live', live);
      $('.cd-clock', brunch).hidden = live;
      $('.cd-live', brunch).hidden = !live;
      if (!live) setClock(brunch, Math.min(untilNext(now, 6, BRUNCH[0]), untilNext(now, 0, BRUNCH[0])));
    }

    if (now.m === lastMinute) return;
    lastMinute = now.m;

    // Status pills
    const text = open ? 'Open now · until 1 AM' : `Closed right now · opens today at ${fmt(OPEN[now.day])}`;
    $$('[data-status]').forEach(el => {
      el.classList.toggle('closed', !open);
      $('[data-status-text]', el).textContent = text;
    });

    // Today highlights
    $$('.week li, .hours tr').forEach(el => el.classList.toggle('today', +el.dataset.day === barDay));
    const tn = $('[data-today-name]'); if (tn) tn.textContent = DAYS[barDay];
    const tt = $('[data-today-text]'); if (tt) tt.textContent = SPECIALS[barDay];
    const vt = $('[data-visit-title]'); if (vt) vt.textContent = open ? 'Come see us tonight.' : 'Come see us today.';

    // Dial
    const openD = $('[data-dial-open]');
    if (openD) {
      openD.setAttribute('d', arc(OPEN[barDay], 24 + CLOSE));
      const br = $('[data-dial-brunch]');
      br.setAttribute('d', isWeekend(barDay) ? arc(BRUNCH[0], BRUNCH[1]) : '');
      $('[data-dial-day]').textContent = DAYS[barDay];
      $('[data-dial-hours]').textContent = `${fmt(OPEN[barDay])} – 1 AM`;
      $('[data-dial-extra]').textContent = isWeekend(barDay) ? 'Brunch 11 AM – 3 PM' : (barDay === 4 ? '$13 Burger Thursday' : barDay === 1 ? 'Meaty Monday' : '');
      const [nx, ny] = pt(now.h + now.m / 60);
      ['[data-dial-now]', '[data-dial-glow]'].forEach(s => { const c = $(s); c.setAttribute('cx', nx.toFixed(1)); c.setAttribute('cy', ny.toFixed(1)); });
    }
  }
  tick();
  setInterval(tick, 1000);

  /* =========================================================
     Favorites: hover/tap list, arrows, swipe, progress bar
     ========================================================= */
  const favs = $$('.fav');
  const favImg = $('[data-fav-img]');
  const favCap = $('[data-fav-cap]');
  const favCount = $('[data-fav-count]');
  const favBar = $('[data-fav-bar]');
  favs.forEach(f => { const i = new Image(); i.src = f.dataset.img; });
  let favIndex = 0, favTimer;

  function activate(i) {
    i = (i + favs.length) % favs.length;
    if (i === favIndex && favImg.dataset.ready) return;
    favImg.dataset.ready = 1;
    favIndex = i;
    const f = favs[i];
    favs.forEach(x => x.classList.toggle('active', x === f));
    favImg.classList.add('swap');
    clearTimeout(favTimer);
    favTimer = setTimeout(() => {
      favImg.src = f.dataset.img;
      favImg.alt = f.dataset.cap.replace('&amp;', '&');
      favImg.classList.remove('swap');
    }, 200);
    favCap.innerHTML = f.dataset.cap;
    favCount.textContent = `${i + 1} of ${favs.length}`;
    favBar.style.width = `${((i + 1) / favs.length) * 100}%`;
  }
  favs.forEach((f, i) => {
    f.addEventListener('mouseenter', () => activate(i));
    f.addEventListener('click', () => activate(i));
    f.addEventListener('focus', () => activate(i));
    f.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' && favs[i + 1]) { e.preventDefault(); favs[i + 1].focus(); }
      if (e.key === 'ArrowUp' && favs[i - 1]) { e.preventDefault(); favs[i - 1].focus(); }
    });
  });
  $('[data-fav-prev]')?.addEventListener('click', e => { e.stopPropagation(); activate(favIndex - 1); });
  $('[data-fav-next]')?.addEventListener('click', e => { e.stopPropagation(); activate(favIndex + 1); });
  favBar && (favBar.style.width = `${100 / favs.length}%`);
  favImg && (favImg.alt = favs[0]?.dataset.cap || '');

  // Swipe helper (used by favorites + lightbox)
  function onSwipe(el, left, right) {
    let x0 = null, y0 = null;
    el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? left : right)();
      x0 = null;
    });
  }
  const favPhoto = $('.fav-photo');
  if (favPhoto) onSwipe(favPhoto, () => activate(favIndex + 1), () => activate(favIndex - 1));

  // ---- Autoplay: walk down the dishes on its own ----
  // Pauses while a mouse is over the list/photo (hover still pulls up a dish),
  // only runs while the section is on screen, and restarts after taps/swipes.
  const FAV_MS = 4000;
  const favGrid = $('.fav-grid');
  let favAuto = null, favInView = false, favHover = false;
  function favSchedule() {
    clearTimeout(favAuto);
    favs.forEach(f => f.classList.remove('autoplay'));
    if (!favs.length || !favInView || favHover || document.hidden || reduceMotion) return;
    const cur = favs[favIndex];
    void cur.offsetWidth;                       // restart the timer-line animation
    cur.classList.add('autoplay');
    favAuto = setTimeout(() => { activate(favIndex + 1); favSchedule(); }, FAV_MS);
  }
  if (favGrid) {
    new IntersectionObserver(([en]) => { favInView = en.isIntersecting; favSchedule(); }, { threshold: 0.35 }).observe(favGrid);
    favGrid.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { favHover = true; favSchedule(); } });
    favGrid.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { favHover = false; favSchedule(); } });
    // Touch: after a tap or swipe, keep going from the chosen dish
    favGrid.addEventListener('touchend', () => setTimeout(favSchedule, 0), { passive: true });
    document.addEventListener('visibilitychange', favSchedule);
  }

  /* =========================================================
     Mosaic: clickable tiles that keep moving
     - each photo gets a zoom badge + caption + gold ring on hover
     - rows keep scrolling; on hover they ease down to a slow crawl
       (easy to click) and speed back up when you leave
     ========================================================= */
  const ZOOM_ICON = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5M11 8v6M8 11h6"/></svg>';
  const mosaicRows = $$('.mosaic-row').map(row => {
    const track = $('.mosaic-track', row);
    [...track.children].forEach(img => {
      const fig = document.createElement('figure');
      fig.className = 'tile';
      img.replaceWith(fig);
      fig.append(img);
      fig.insertAdjacentHTML('beforeend', `<span class="tile-zoom" aria-hidden="true">${ZOOM_ICON}</span><figcaption>${esc(img.alt)}</figcaption>`);
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Open photo: ${img.alt}`);
    });
    // Clone the set so the loop is seamless
    [...track.children].forEach(fig => {
      const c = fig.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      const ci = $('img', c);
      ci.dataset.clone = '1'; ci.tabIndex = -1; ci.removeAttribute('role'); ci.removeAttribute('aria-label');
      track.append(c);
    });
    const state = { row, track, dir: row.dataset.dir === 'right' ? 1 : -1, x: null, speed: 1, target: 1, base: row.dataset.dir === 'right' ? 0.42 : 0.5 };
    row.addEventListener('mouseenter', () => { state.target = 0.18; });
    row.addEventListener('mouseleave', () => { state.target = 1; });
    row.addEventListener('focusin', () => { state.target = 0; });
    row.addEventListener('focusout', () => { state.target = 1; });
    return state;
  });

  if (mosaicRows.length && !reduceMotion) {
    let last = performance.now();
    const step = t => {
      const dt = Math.min(250, t - last); last = t;          // time-based, so speed is the same at any frame rate
      const ease = 1 - Math.pow(0.94, dt / 16.67);
      const lbOpen = $('[data-lightbox]').open;
      mosaicRows.forEach(s => {
        const half = s.track.scrollWidth / 2;
        if (!half) return;
        if (s.x === null) s.x = s.dir > 0 ? -half : 0;
        const goal = lbOpen ? 0 : s.target;
        s.speed += (goal - s.speed) * ease;                 // ease toward goal speed
        s.x += s.dir * s.base * s.speed * (dt / 16.67);
        if (s.x <= -half) s.x += half;
        if (s.x > 0) s.x -= half;
        s.track.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
      });
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Keyboard: Enter/Space opens a focused photo
  document.addEventListener('keydown', e => {
    const img = e.target.closest?.('img[data-zoom][role="button"]');
    if (img && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); img.click(); }
  });

  /* =========================================================
     Lightbox for any [data-zoom] image (grouped by section)
     ========================================================= */
  const lb = $('[data-lightbox]');
  const lbImg = $('[data-lb-img]');
  const lbCap = $('[data-lb-cap]');
  const lbCount = $('[data-lb-count]');
  let lbGroup = [], lbIndex = 0;

  function lbShow(i) {
    lbIndex = (i + lbGroup.length) % lbGroup.length;
    const img = lbGroup[lbIndex];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lbCount.textContent = lbGroup.length > 1 ? `${lbIndex + 1} / ${lbGroup.length}` : '';
    $('[data-lb-prev]').hidden = $('[data-lb-next]').hidden = lbGroup.length < 2;
  }
  document.addEventListener('click', e => {
    const img = e.target.closest('img[data-zoom]');
    if (!img || e.target.closest('button')) return;
    const scope = img.closest('section') || document;
    const seen = new Set();
    lbGroup = $$('img[data-zoom]', scope).filter(i => !i.dataset.clone && !seen.has(i.src) && seen.add(i.src));
    const original = img.dataset.clone ? lbGroup.find(i => i.src === img.src) : img;
    const tile = img.closest('.tile');
    if (tile) { tile.classList.remove('pop'); void tile.offsetWidth; tile.classList.add('pop'); }
    lb.showModal();
    lbShow(Math.max(0, lbGroup.indexOf(original)));
  });
  $('[data-lb-close]').addEventListener('click', () => lb.close());
  $('[data-lb-prev]').addEventListener('click', () => lbShow(lbIndex - 1));
  $('[data-lb-next]').addEventListener('click', () => lbShow(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
  });
  onSwipe(lb, () => lbShow(lbIndex + 1), () => lbShow(lbIndex - 1));

  /* =========================================================
     Ticket tilt (pointer devices only)
     ========================================================= */
  if (matchMedia('(hover: hover)').matches && !reduceMotion) {
    $$('.ticket').forEach(t => {
      const base = t.classList.contains('ticket-gold') ? 'translateY(-14px) ' : '';
      t.addEventListener('mousemove', e => {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = `${base}perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
      });
      t.addEventListener('mouseleave', () => { t.style.transform = ''; });
    });
  }

  /* =========================================================
     Copy address
     ========================================================= */
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    toast('Address copied ✓');
  }));

  /* =========================================================
     Full menu: search + category bar spy
     ========================================================= */
  // Render menu bands from menu-data.js (single source shared with print.html)
  const bandsHost = $('[data-menu-bands]');
  if (bandsHost && window.GRADYS_MENU) {
    const TAGS = { V: 'Vegetarian', VG: 'Vegan' };
    bandsHost.innerHTML = GRADYS_MENU.map((c, i) => `
      <section class="mband${i % 2 ? ' alt' : ''}" id="cat-${c.id}" data-cat-band="${c.id}">
        <div class="container mband-grid">
          <div class="mband-head">
            <h2>${esc(c.title)}</h2>
            <p>${esc(c.note)}</p>
            <img src="${c.img}" alt="${esc(c.alt)}" loading="lazy" data-zoom>
          </div>
          <div class="mband-items">${c.items.map(it => `
            <div class="item${it.callout ? ' callout' : ''}">
              <div class="item-head"><h4>${esc(it.n)}${it.tag ? ` <abbr class="diet" title="${TAGS[it.tag]}">${it.tag}</abbr>` : ''}</h4><span class="leader"></span><span class="price">${esc(it.p)}</span></div>
              <p>${esc(it.d)}</p>${it.add ? `<p class="add">${esc(it.add)}</p>` : ''}${it.sauces ? `<ul class="sauces">${it.sauces.map(([s, k]) => `<li class="${k}">${esc(s)}</li>`).join('')}</ul>` : ''}
            </div>`).join('')}
          </div>
        </div>
      </section>`).join('');
  }

  const search = $('[data-menu-search]');
  const clearBtn = $('[data-search-clear]');
  const results = $('[data-menu-results]');
  const resultsList = $('[data-results-list]');
  const resultsCount = $('[data-results-count]');
  const bands = $('[data-menu-bands]');
  const menuIndex = $$('.mband').flatMap(band => {
    const cat = $('h2', band).textContent.trim();
    return $$('.mband-items .item', band).map(item => ({
      cat,
      name: $('h4', item).textContent.trim(),
      price: $('.price', item).textContent.trim(),
      desc: $$('p, .sauces li', item).map(p => p.textContent.trim()).join(' · '),
      callout: item.classList.contains('callout')
    }));
  });

  function highlight(text, q) {
    const safe = esc(text);
    if (!q) return safe;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  }
  function runSearch() {
    const q = search.value.trim().toLowerCase();
    clearBtn.hidden = !q;
    if (!q) { results.hidden = true; bands.hidden = false; return; }
    const hits = menuIndex.filter(it => (it.name + ' ' + it.desc + ' ' + it.cat).toLowerCase().includes(q));
    results.hidden = false; bands.hidden = true;
    resultsCount.textContent = `${hits.length} ${hits.length === 1 ? 'dish' : 'dishes'} matching “${search.value.trim()}”`;
    resultsList.innerHTML = hits.length ? hits.map(it => `
      <div class="item">
        <span class="cat-label">${esc(it.cat)}</span>
        <div class="item-head"><h4>${highlight(it.name, q)}</h4><span class="leader"></span><span class="price">${esc(it.price)}</span></div>
        <p>${highlight(it.desc, q)}</p>
      </div>`).join('') : `
      <div class="mresults-empty">
        <h3>Nothing on the menu for that</h3>
        <p>Try “burger”, “short rib”, “wings” or “brunch”.</p>
      </div>`;
  }
  function clearSearch() { if (search && search.value) { search.value = ''; runSearch(); } }
  if (search) {
    let t; search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(runSearch, 90); });
    search.addEventListener('keydown', e => { if (e.key === 'Escape') { clearSearch(); search.blur(); } });
    clearBtn.addEventListener('click', () => { clearSearch(); search.focus(); });
  }

  const catLinks = $$('.cat-bar a');
  const catSpy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const cat = en.target.dataset.catBand;
      catLinks.forEach(a => {
        const on = a.dataset.cat === cat;
        a.classList.toggle('active', on);
        if (on) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('.mband').forEach(b => catSpy.observe(b));
  // Only show the sticky category bar once the hero pills scroll out of view
  const catBar = $('.cat-bar'), heroPills = $('.cat-pills');
  if (catBar && heroPills) {
    new IntersectionObserver(([en]) => {
      catBar.classList.toggle('show', !en.isIntersecting);
      catBar.setAttribute('aria-hidden', en.isIntersecting);
    }, { rootMargin: '-70px 0px 0px 0px' }).observe(heroPills);
  }

  /* =========================================================
     Scroll reveal
     ========================================================= */
  const revealSel = '.section-head, .value, .fav-list-wrap > *, .week li, .ticket, .today-line, .countdown, .photo-band-inner > *, .strip-head > *, .mosaic, .collage, .parties-grid > div:last-child, .visit-grid > *, .cta .container > *, .footer-grid > *, .mband-head, .mband-items .item';
  const revealEls = $$(revealSel);
  revealEls.forEach(el => {
    el.classList.add('reveal');
    const sibs = [...el.parentElement.children].filter(c => c.matches(revealSel));
    el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 6) * 0.07}s`);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Initial route (deep links like #full-menu/brunch) ---------- */
  if (location.hash) route(location.hash, { instant: true });
})();
