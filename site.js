(function () {
  var header = document.querySelector('.topbar');
  var toggle = document.getElementById('menuToggle');
  var links = document.getElementById('navLinks');
  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', function () { setMenu(!header.classList.contains('menu-open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var bar = document.getElementById('threadBar');
  var wa = document.getElementById('waFloat');
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ')';
    if (wa) wa.classList.toggle('show', scrollY > innerHeight * 0.6);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var targets = document.querySelectorAll('.b3-card, .beliefs3 article, .steps3 article, .case, .benefit, .figure, .beliefs li, .section-head, .problem-card, .step-card, .offer, .timeline, .live-webs, .price-card, .contact, .service, .skill, .projects-list li, .study article, .faq, .cta-band');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();

/* Webs en directo (móvil) */
(function () {
  var frame = document.getElementById('phoneFrame');
  if (!frame) return;
  var loading = document.getElementById('phoneLoading');
  var open = document.getElementById('phoneOpen');
  var picks = document.querySelectorAll('.web-pick');
  var view = document.getElementById('phoneView');
  function show(btn) {
    picks.forEach(function (b) { b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
    var src = btn ? btn.getAttribute('data-src') : frame.getAttribute('data-src');
    loading.classList.remove('hide');
    frame.src = src; open.href = src;
  }
  function fit() {
    var s = view.clientWidth / 390;
    frame.style.transform = 'scale(' + s + ')';
    frame.style.height = (view.clientHeight / s) + 'px';
  }
  fit(); addEventListener('resize', fit);
  frame.addEventListener('load', function () { if (frame.src) loading.classList.add('hide'); });
  picks.forEach(function (b) { b.addEventListener('click', function () { show(b); }); });
  if ('IntersectionObserver' in window) {
    var once = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { show(picks[0] || null); once.disconnect(); } }, { rootMargin: '300px' });
    once.observe(frame);
  } else { show(picks[0] || null); }
})();

/* Chat con IA en directo */
(function () {
  var log = document.getElementById('demoLog');
  if (!log) return;
  var msgs = document.getElementById('demoMsgs');
  var form = document.getElementById('demoForm');
  var input = document.getElementById('demoInput');
  var chips = document.querySelectorAll('.sample-questions .chip');
  var PROXY_URL = 'https://lace-chat-proxy.lacespaindev.workers.dev';
  var FALLBACK = 'Perdona, ahora mismo no puedo responder bien. Escríbeme por WhatsApp al +34 614 44 38 90 y te contesto en el momento.';
  var history = [];
  var sessionId = null;
  try { sessionId = sessionStorage.getItem('laceChatSession'); } catch (e) {}
  if (!sessionId) {
    sessionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('s' + Date.now() + Math.random().toString(36).slice(2, 10));
    try { sessionStorage.setItem('laceChatSession', sessionId); } catch (e) {}
  }
  function scrollBottom() { msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' }); }
  function timeNow() { var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function addBubble(text, cls) {
    var div = document.createElement('div');
    div.className = 'bubble' + (cls ? ' ' + cls : '');
    div.textContent = text;
    var t = document.createElement('span'); t.className = 't'; t.textContent = timeNow();
    div.appendChild(t); log.appendChild(div); scrollBottom();
  }
  function ask(q) {
    q = (q || '').trim(); if (!q) return;
    addBubble(q, 'out'); input.value = '';
    history.push({ role: 'user', content: q });
    var typing = document.createElement('div');
    typing.className = 'bubble typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(typing); scrollBottom();
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 20000);
    fetch(PROXY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8), sessionId: sessionId }), signal: ctrl.signal })
      .finally(function () { clearTimeout(timer); })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) { var reply = (data && data.reply) ? data.reply : FALLBACK; typing.remove(); addBubble(reply, ''); history.push({ role: 'assistant', content: reply }); })
      .catch(function () { typing.remove(); addBubble(FALLBACK, ''); history.push({ role: 'assistant', content: FALLBACK }); });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  chips.forEach(function (chip) { chip.addEventListener('click', function () { ask(chip.getAttribute('data-q')); }); });
})();

/* Formulario de contacto -> WhatsApp */
(function () {
  var f = document.getElementById('contact-form');
  if (!f) return;
  f.addEventListener('submit', function (event) {
    event.preventDefault();
    var form = new FormData(f);
    var name = String(form.get('name') || '').trim();
    var email = String(form.get('email') || '').trim();
    var service = String(form.get('service') || '').trim();
    var message = String(form.get('message') || '').trim();
    var body = 'Hola, soy ' + name + '.' + (email ? ' Mi email es ' + email + '.' : '') + (service ? ' Me interesa: ' + service + '.' : '') + '\n\n' + message;
    window.open('https://wa.me/34614443890?text=' + encodeURIComponent(body), '_blank', 'noopener,noreferrer');
  });
})();

/* Gancho de la portada: muestra gratis -> WhatsApp */
(function () {
  var f = document.getElementById('hookForm');
  if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('hookName').value.trim();
    var text = 'Hola Rubén, quiero una muestra gratis para mi negocio' + (name ? ': ' + name : '') + '.';
    window.location.href = 'https://wa.me/34614443890?text=' + encodeURIComponent(text);
  });
})();

/* Desplegable de servicios (escritorio) */
(function () {
  var drop = document.getElementById('navDrop');
  var btn = document.getElementById('navDropBtn');
  if (!drop || !btn) return;
  function set(open) { drop.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(!drop.classList.contains('open')); });
  if (window.matchMedia('(hover: hover)').matches) {
    drop.addEventListener('mouseenter', function () { set(true); });
    drop.addEventListener('mouseleave', function () { set(false); });
  }
  document.addEventListener('click', function (e) { if (!drop.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();

/* Pestañas de beneficios */
(function () {
  var tabs = document.querySelectorAll('.tabs .tab');
  if (!tabs.length) return;
  function select(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(n); n.focus();
      }
    });
  });
})();
