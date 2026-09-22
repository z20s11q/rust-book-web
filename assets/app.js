(function () {
  'use strict';

  var body = document.body;
  var sidebar = document.getElementById('sidebar');
  var content = document.getElementById('content');
  var links = Array.prototype.slice.call(sidebar.querySelectorAll('a'));
  var heads = Array.prototype.slice.call(content.querySelectorAll('h1, h2'));

  /* ---------- theme ---------- */
  var KEY = 'rustbook-theme';
  try {
    if (localStorage.getItem(KEY) === 'dark') body.classList.add('dark');
  } catch (e) { /* file:// may block storage */ }

  var themeBtn = document.getElementById('theme');
  themeBtn.addEventListener('click', function () {
    body.classList.toggle('dark');
    try {
      localStorage.setItem(KEY, body.classList.contains('dark') ? 'dark' : 'light');
    } catch (e) { /* ignore */ }
  });

  /* ---------- mobile nav ---------- */
  document.getElementById('nav-toggle').addEventListener('click', function () {
    body.classList.toggle('nav-open');
  });

  sidebar.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && window.innerWidth <= 900) {
      body.classList.remove('nav-open');
    }
  });

  /* ---------- sidebar filter ---------- */
  var box = document.getElementById('search');
  var empty = sidebar.querySelector('.empty');

  function filter() {
    var q = box.value.trim().toLowerCase();
    var shown = 0;
    links.forEach(function (a) {
      var hit = !q || a.textContent.toLowerCase().indexOf(q) !== -1;
      a.style.display = hit ? '' : 'none';
      if (hit) shown++;
    });
    empty.classList.toggle('show', shown === 0 && !!q);
  }

  box.addEventListener('input', filter);
  box.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      box.value = '';
      filter();
      box.blur();
    }
  });

  /* ---------- scroll spy ---------- */
  var byId = {};
  links.forEach(function (a) {
    byId[decodeURIComponent(a.hash.slice(1))] = a;
  });

  var active = null;

  function setActive(h) {
    var a = byId[h.id];
    if (!a || a === active) return;
    if (active) active.classList.remove('active');
    active = a;
    a.classList.add('active');

    var ar = a.getBoundingClientRect();
    var sr = sidebar.getBoundingClientRect();
    if (ar.top < sr.top + 10 || ar.bottom > sr.bottom - 10) {
      sidebar.scrollTop += ar.top - sr.top - sidebar.clientHeight / 2;
    }
  }

  var totop = document.getElementById('totop');

  function onScroll() {
    var probe = window.scrollY + 120;
    var cur = heads[0];
    for (var i = 0; i < heads.length; i++) {
      var h = heads[i];
      var top = h.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) cur = h;
      else break;
    }
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 6) {
      cur = heads[heads.length - 1];
    }
    if (cur) setActive(cur);
    totop.classList.toggle('show', window.scrollY > 600);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', onScroll);

  totop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- keyboard: / focuses search ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== box) {
      e.preventDefault();
      box.focus();
    }
  });

  onScroll();
})();