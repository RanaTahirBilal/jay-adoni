(function () {
  /* Confirmed contact details go here. Rows and buttons appear only for filled values. */
  var CONTACT = { email: '', phone: '', linkedin: '' };

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  var list = document.getElementById('channels');
  var actions = document.getElementById('contact-actions');
  if (list && actions) {
    var row = function (label, node) {
      var d = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = label;
      var dd = document.createElement('dd'); dd.appendChild(node);
      d.appendChild(dt); d.appendChild(dd); list.appendChild(d);
    };
    var link = function (href, text, cls) { var a = document.createElement('a'); a.href = href; a.textContent = text; if (cls) a.className = cls; if (/^https:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } return a; };
    if (CONTACT.email) { row('Email', link('mailto:' + CONTACT.email, CONTACT.email)); actions.appendChild(link('mailto:' + CONTACT.email, 'Write to Jay', 'btn')); }
    if (CONTACT.phone) row('Phone', link('tel:' + CONTACT.phone.replace(/[^\d+]/g, ''), CONTACT.phone));
    if (CONTACT.linkedin) row('LinkedIn', link(CONTACT.linkedin, 'LinkedIn profile'));
    if (list.children.length) { list.hidden = false; actions.hidden = !actions.children.length; document.documentElement.classList.add('has-contact'); }
  }

  var menu = document.querySelector('.menu');
  if (menu) {
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.open = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  }

  // Reveals in both scroll directions. Every decision is re-checked against the live layout.
  if (document.documentElement.classList.contains('js-motion')) {
    var items = [].slice.call(document.querySelectorAll('[data-reveal]'));
    var lastY = scrollY, dir = 1;
    var inView = function (r) { return r.top < innerHeight * 0.92 && r.bottom > innerHeight * 0.06; };
    var off = function (r) { return r.bottom <= 0 || r.top >= innerHeight; };
    var sync = function () {
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (!el.classList.contains('is-in')) {
          el.classList.toggle('from-above', dir < 0);
          if (inView(r)) requestAnimationFrame(function () { requestAnimationFrame(function () { if (inView(el.getBoundingClientRect())) el.classList.add('is-in'); }); });
        } else if (off(r)) {
          el.classList.remove('is-in');
        }
      });
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(sync, { threshold: [0, 0.1, 0.3, 0.6, 1] });
      items.forEach(function (el) { io.observe(el); });
    }
    var pending = false, idle;
    addEventListener('scroll', function () {
      var cy = scrollY; if (cy !== lastY) { dir = cy > lastY ? 1 : -1; lastY = cy; }
      if (!pending) { pending = true; requestAnimationFrame(function () { pending = false; sync(); }); }
      clearTimeout(idle); idle = setTimeout(sync, 160);
    }, { passive: true });
    addEventListener('resize', function () { clearTimeout(idle); idle = setTimeout(sync, 200); }, { passive: true });
    addEventListener('pageshow', function (e) { if (e.persisted) sync(); });
    sync();
  }

  // Back to top
  var top = document.querySelector('.to-top');
  if (top) {
    var tick = false;
    var upd = function () { tick = false; top.classList.toggle('on', scrollY > innerHeight * 0.8); };
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
    top.addEventListener('click', function (e) {
      e.preventDefault();
      scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      var t = document.querySelector('.plate'); if (t) t.focus({ preventScroll: true });
    });
  }

  window.__motionReady = true;
})();
