// Shared behaviour for every project page (load with <script src="../project.js" defer>).
(() => {
  // every project, in the USB stick's order — the end of each page shows them all (keep in sync with FILES in ../../index.html)
  const PROJECTS = [
    { dir: 'tedx-duth',            file: 'tedx_duth.pdf',            img: 'tedx-duth',  title: 'TEDxDUTh',                 tag: 'art direction · identity' },
    { dir: 'saudade',              file: 'saudade.mp4',              img: 'saudade',    title: 'Saudade',                  tag: 'photoroman' },
    { dir: 'pursuit-of-the-ideal', file: 'pursuit_of_the_ideal.mp4', img: 'pursuit',    title: 'The Pursuit of the Ideal', tag: 'video installation' },
    { dir: 'open-house',           file: 'open_house.jpg',           img: 'open-house', title: 'Open House',               tag: 'poster' },
    { dir: 'i-feel-a-connection',  file: 'i_feel_a_connection.mp4',  img: 'connection', title: 'I feel a connection',      tag: 'video' },
    { dir: 'olfabooth',            file: 'olfabooth.pptx',           img: 'olfabooth',  title: 'OLFABOOTH',                tag: 'concept · L’Oréal Brandstorm' },
    { dir: 'ate',                  file: 'ati.mp4',                  img: 'ate',        title: 'Άτη',                      tag: 'short film' },
    { dir: 'elysium',              file: 'elysium.mp4',              img: 'elysium',    title: 'Elysium',                  tag: 'spatial installation' },
    { dir: '38780-118',            file: '38780-118.jpg',            img: '38780-118',  title: '38780-118',                tag: 'installation · Tsepelovo' },
    { dir: 'drt',                  file: 'drt_argo.png',             img: 'drt',        title: 'DRT — Argo',               tag: 'graphic design · formula student' },
  ];
  const here = location.pathname.split('/').filter(Boolean).pop();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // one line under the cover: format · year · my role (read from the notes, so it never disagrees with them)
  const fact = name => [...document.querySelectorAll('.facts dt')].find(dt => dt.textContent.trim().toLowerCase() === name)?.nextElementSibling?.textContent.trim();
  const hero = document.querySelector('.hero');
  if (hero && fact('year')) {
    const s = document.createElement('p'); s.className = 'strip caps';
    s.innerHTML = [fact('format'), fact('year'), fact('my role') && `my role: ${fact('my role')}`].filter(Boolean).map(esc).join('<i>✦</i>');
    hero.after(s);
  }

  // all work, at the end of every page
  const endLinks = document.querySelector('.end .links');
  if (endLinks) {
    const all = document.createElement('nav'); all.className = 'all-work'; all.setAttribute('aria-label', 'All projects');
    all.innerHTML = `<p class="caps">all work</p><ul>${PROJECTS.map(p => p.dir === here
      ? `<li class="here"><span><img src="../../thumbs/${p.img}.jpg" alt=""><b>${esc(p.title)}</b><small>you are here</small></span></li>`
      : `<li><a class="next" href="../${p.dir}/" data-file="${esc(p.file)}" data-img="${esc(p.img)}"><img src="../../thumbs/${p.img}.jpg" alt="" loading="lazy"><b>${esc(p.title)}</b><small>${esc(p.tag)}</small></a></li>`).join('')}</ul>`;
    endLinks.after(all);   // next / back first, then the catalogue of every project
  }

  // reveal sections as they scroll into view
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  // the floating "← back" bows out once the footer's own "← back to my work" is on screen
  const back = document.querySelector('.back'), links = document.querySelector('.end .links');
  if (back && links) new IntersectionObserver(([e]) => back.classList.toggle('away', e.isIntersecting)).observe(links);

  // ☾ / ☀ — the same dark/light switch as on the home page (shared through localStorage 'pf-theme')
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>';
  const tb = document.createElement('button'); tb.className = 'theme-toggle'; document.body.appendChild(tb);
  const drawTheme = () => { const dark = document.documentElement.dataset.theme === 'dark'; tb.innerHTML = dark ? SUN : MOON; tb.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); tb.title = 'Dark / light mode'; };
  drawTheme();
  tb.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    if (dark) document.documentElement.dataset.theme = 'dark'; else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('pf-theme', dark ? 'dark' : 'light'); } catch (e) {}
    drawTheme();
  });

  // silent loops: <video data-loop muted playsinline loop preload="none" poster="…"> — they only play while on screen
  const loops = document.querySelectorAll('video[data-loop]');
  if (loops.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: .25 });
    loops.forEach(v => { v.muted = true; lio.observe(v); });
  }

  // films load from YouTube only when you press play (lighter, and no cookies before that):
  // <div class="player"><button data-yt="VIDEO_ID" data-title="…">…</button></div>
  document.querySelectorAll('.player button[data-yt=""]').forEach(b => { b.disabled = true; b.querySelector('.play').lastChild.textContent = 'video coming soon'; });   // no link yet
  document.querySelectorAll('.player button[data-yt]:not([data-yt=""])').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;
    f.title = b.dataset.title || 'Film'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
    b.replaceWith(f);
  }));

  // back to the bag: the page fades into the portfolio's loading screen (turning ✦), which then opens on the USB stick
  const STAR = '<span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" fill="currentColor"/></svg></span>';
  document.querySelectorAll('a[href="../../#work"]').forEach(a => a.addEventListener('click', e => {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    try { sessionStorage.setItem('pf-return', '1'); } catch (err) {}
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    const c = document.createElement('div');
    c.className = 'curtain' + (document.documentElement.dataset.theme === 'dark' ? ' dark' : ''); c.innerHTML = STAR; document.body.appendChild(c);
    c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: 'ease', fill: 'both' }).finished.then(() => { location.href = a.href; });
  }));
  // next project: the same "opening <file>…" overlay as from the USB stick, straight into the next page
  //   <a class="next" href="../other/" data-file="other.jpg" data-img="other">next project — Other →</a>
  document.querySelectorAll('a.next[data-file]').forEach(a => a.addEventListener('click', e => {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    try { sessionStorage.setItem('pf-morph', JSON.stringify({ img: a.dataset.img })); sessionStorage.removeItem('pf-return'); } catch (err) {}   // "back" from there reopens the stick on that file
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    const m = document.createElement('div'); m.className = 'opening';
    const s = document.createElement('span'); s.textContent = `opening ${a.dataset.file}…`; m.appendChild(s); document.body.appendChild(m);
    s.animate([{ opacity: 0 }, { opacity: 1, offset: .35 }, { opacity: 1, offset: .7 }, { opacity: .85 }], { duration: 950, fill: 'both' });
    m.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 950, easing: 'ease', fill: 'both' }).finished.then(() => { location.href = a.href; });
  }));

  // flipbook: a booklet you can leaf through (click the right/left page, arrows, swipe, or the buttons)
  //   <div class="flipbook" data-flipbook data-pages="img/p-1.jpg img/p-2.jpg …" data-ratio="2481/1749" aria-label="…"></div>
  document.querySelectorAll('[data-flipbook]').forEach(fb => {
    const pages = fb.dataset.pages.trim().split(/\s+/), n = pages.length, leaves = Math.ceil(n / 2);
    const maxState = n % 2 ? (n - 1) / 2 : n / 2;   // odd n: the last page stays on the right; even n: it ends on the left
    fb.style.setProperty('--ratio', fb.dataset.ratio || '1.414');
    fb.tabIndex = 0;
    const book = document.createElement('div'); book.className = 'fb-book';
    const ls = [];
    for (let i = 0; i < leaves; i++) {
      const leaf = document.createElement('div'); leaf.className = 'fb-leaf';
      const f = pages[2 * i], b = pages[2 * i + 1];
      leaf.innerHTML = `<div class="fb-face fb-front"><img src="${f}" alt="Page ${2 * i + 1}" loading="lazy" draggable="false"></div>` +
        `<div class="fb-face fb-back">${b ? `<img src="${b}" alt="Page ${2 * i + 2}" loading="lazy" draggable="false">` : ''}</div>`;
      book.appendChild(leaf); ls.push(leaf);
    }
    const nav = document.createElement('div'); nav.className = 'fb-nav';
    nav.innerHTML = '<button type="button" class="fb-prev" aria-label="Previous page">←</button><span class="fb-count caps"></span><button type="button" class="fb-next" aria-label="Next page">→</button>';
    fb.append(book, nav);
    const count = nav.querySelector('.fb-count'), prev = nav.querySelector('.fb-prev'), next = nav.querySelector('.fb-next');
    let state = 0;
    const render = () => {
      ls.forEach((leaf, i) => {
        const turned = i < state;
        leaf.classList.toggle('turned', turned);
        leaf.style.zIndex = turned ? i + 1 : leaves - i;
      });
      fb.classList.toggle('closed', state === 0);
      fb.classList.toggle('end', state === maxState && n % 2 === 0);
      count.textContent = state === 0 ? `1 / ${n}` : (2 * state + 1 <= n && !(state === maxState && n % 2 === 0) ? `${2 * state}–${2 * state + 1} / ${n}` : `${2 * state} / ${n}`);
      prev.disabled = state === 0; next.disabled = state === maxState;
    };
    const go = d => {
      const s = Math.max(0, Math.min(maxState, state + d)); if (s === state) return;
      const leaf = ls[d > 0 ? state : s];
      leaf.style.zIndex = 100; state = s;
      setTimeout(render, 450);   // swap the stacking half-way through the turn
      leaf.classList.toggle('turned', d > 0);
      fb.classList.toggle('closed', state === 0);
      count.textContent = '…';
      prev.disabled = state === 0; next.disabled = state === maxState;
    };
    prev.addEventListener('click', () => go(-1)); next.addEventListener('click', () => go(1));
    book.addEventListener('click', e => { const r = book.getBoundingClientRect(); go(e.clientX - r.left > r.width / 2 ? 1 : -1); });
    fb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { go(1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); } });
    let x0 = null;
    book.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    book.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); x0 = null; });
    render();
  });

  // restored from the browser cache (forward / back button): drop the overlays
  addEventListener('pageshow', e => { if (e.persisted) document.querySelectorAll('.curtain, .opening').forEach(c => c.remove()); });
})();
