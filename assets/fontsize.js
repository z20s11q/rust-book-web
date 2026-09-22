
(function () {
  var KEY = 'rustbook-font-scale', MIN = 0.7, MAX = 1.8, STEP = 0.1;
  var scale = parseFloat(localStorage.getItem(KEY)) || 1;
  function apply() {
    scale = Math.round(Math.min(MAX, Math.max(MIN, scale)) * 100) / 100;
    document.documentElement.style.setProperty('--book-scale', scale);
    var p = document.querySelector('#fontsize-ctl .pct');
    if (p) p.textContent = Math.round(scale * 100) + '%';
    try { localStorage.setItem(KEY, scale); } catch (e) {}
  }
  function mount() {
    if (document.getElementById('fontsize-ctl')) return;
    var host = document.querySelector('.md-header__inner .md-header__option') ||
               document.querySelector('.md-header__inner');
    if (!host) return;
    var box = document.createElement('div');
    box.id = 'fontsize-ctl';
    box.innerHTML = '<button type="button" data-d="-1" title="缩小字号">A-</button>' +
                    '<span class="pct"></span>' +
                    '<button type="button" data-d="1" title="放大字号">A+</button>' +
                    '<button type="button" data-d="0" title="恢复默认">A</button>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var d = +b.getAttribute('data-d');
      scale = d === 0 ? 1 : scale + d * STEP;
      apply();
    });
    host.parentNode.insertBefore(box, host.nextSibling);
    apply();
  }
  apply();
  document.addEventListener('DOMContentLoaded', mount);
  if (typeof document$ !== 'undefined') document$.subscribe(mount); else mount();
  document.addEventListener('keydown', function (e) {
    if (!(e.ctrlKey || e.metaKey) || !e.altKey) return;
    if (e.key === '=' || e.key === '+') { scale += STEP; apply(); e.preventDefault(); }
    if (e.key === '-') { scale -= STEP; apply(); e.preventDefault(); }
    if (e.key === '0') { scale = 1; apply(); e.preventDefault(); }
  });
})();
