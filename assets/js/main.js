/* ============================================================
 *  main.js —— 木石客栈 · 全站交互
 *  内容配置请改 config.js，本文件一般不用动。
 * ============================================================ */
(function () {
  'use strict';
  var M = window.MUSHI || {};
  var SITE = M.site || {};
  var GATE = M.gate || {};
  var THEME = M.theme || {};
  var CATS = M.categories || [];
  var FILES = M.files || [];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page');

  /* ---------- 轻提示 ---------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1900);
  }

  /* ---------- 主题 ---------- */
  function applyTheme(t) {
    if (t === 'auto') t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('mushi-theme', t); } catch (e) {}
    var btn = $('#themeBtn'); if (btn) btn.textContent = t === 'dark' ? '🌙' : '☀️';
  }
  function initTheme() {
    var saved = 'auto';
    try { saved = localStorage.getItem('mushi-theme') || THEME.default || 'auto'; } catch (e) {}
    applyTheme(saved);
    var btn = $('#themeBtn');
    if (btn) btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- 樱花粒子 ---------- */
  function initPetals() {
    if (reduceMotion) return;
    var n = 14;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      var size = 8 + Math.random() * 10;
      p.style.width = size + 'px'; p.style.height = size + 'px';
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.animationDuration = (9 + Math.random() * 8) + 's';
      p.style.animationDelay = (-Math.random() * 16) + 's';
      p.style.opacity = (0.35 + Math.random() * 0.45).toFixed(2);
      document.body.appendChild(p);
    }
  }

  /* ---------- 口令门 ---------- */
  function initGate() {
    var gate = $('#gate');
    if (!gate || !GATE.enabled) return;
    // 记住登录：localStorage 里存的是“输入是否正确”的标记
    try {
      if (localStorage.getItem('mushi-gate-ok') === '1') { gate.classList.add('gone'); }
    } catch (e) {}
    var input = $('#gateInput');
    var err = $('#gateError');
    function tryOpen() {
      var v = (input.value || '').trim();
      if (v === GATE.password) {
        try { localStorage.setItem('mushi-gate-ok', '1'); } catch (e) {}
        gate.classList.add('gone');
        if (page === 'resume') initResume(); // 简历页放行后载入
      } else {
        err.textContent = '口令不对，再试试～';
        input.value = ''; input.focus();
      }
    }
    $('#gateOpen').addEventListener('click', tryOpen);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryOpen(); });
  }

  /* ---------- 看板娘 ---------- */
  var MASCOT_LINES = [
    '欢迎来到木石客栈～',
    '我是小树，有事点我！',
    '今天也要开心哦 🌸',
    '找不到文件？点右上角放大镜',
    '深夜了，记得早点休息呀',
    '有缘自会相遇 ✨',
  ];
  function initMascot() {
    var img = $('#mascotImg');
    if (img) {
      img.textContent = SITE.mascotImg ? '' : '🌸';
      if (SITE.mascotImg) img.innerHTML = '<img src="' + esc(SITE.mascotImg) + '" alt="' + esc(SITE.mascot) + '">';
    }
    var bubble = $('#mascotBubble');
    function say(msg) {
      if (!bubble) return;
      bubble.textContent = msg;
      bubble.classList.add('show');
      clearTimeout(say._t);
      say._t = setTimeout(function () { bubble.classList.remove('show'); }, 2600);
    }
    // 随机欢迎台词
    setTimeout(function () { say(MASCOT_LINES[Math.floor(Math.random() * MASCOT_LINES.length)]); }, 900);
    var mascot = $('#mascot');
    if (mascot) mascot.addEventListener('click', function () {
      say(MASCOT_LINES[Math.floor(Math.random() * MASCOT_LINES.length)]);
    });
    // 暴露给下载成功等场景调用
    window.mushiSay = say;
  }

  /* ---------- 渲染文件卡片 ---------- */
  function fileCardHTML(f, i) {
    var cat = CATS.find(function (c) { return c.id === f.category; });
    var tags = (f.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
    var lock = f.password ? ' 🔒' : '';
    return '<a class="card file-card" href="detail.html?id=' + encodeURIComponent(f.id) + '" data-reveal style="transition-delay:' + (i * 50) + 'ms">' +
      '<div class="file-top"><span class="file-ico">' + esc(cat ? cat.icon : '📄') + '</span>' +
      '<div style="min-width:0"><div class="file-title">' + esc(f.title) + lock + '</div>' +
      '<div class="file-desc">' + esc(f.desc || '') + '</div></div></div>' +
      (tags ? '<div class="file-meta">' + tags + '</div>' : '') +
      '<div class="file-meta">' + [f.size, f.date, (f.downloads || 0) + ' 次下载'].filter(Boolean).join(' · ') + '</div>' +
      '<div class="file-foot"><span class="link-btn">查看详情 →</span></div>' +
    '</a>';
  }

  function renderFiles(el, list) {
    if (!el) return;
    if (!list.length) { el.innerHTML = '<div class="card" style="padding:30px;text-align:center;color:var(--text-faint)">这里还没有文件～</div>'; return; }
    el.innerHTML = list.map(function (f, i) { return fileCardHTML(f, i); }).join('');
    revealScan();
  }

  /* ---------- 首页 ---------- */
  function initHome() {
    // 分类导航
    var catEl = $('#catGrid');
    if (catEl) {
      var visible = CATS.filter(function (c) { return !c.hidden; });
      catEl.innerHTML = visible.map(function (c, i) {
        return '<a class="card cat-card" href="list.html?cat=' + encodeURIComponent(c.id) + '" data-reveal style="transition-delay:' + (i * 50) + 'ms">' +
          '<span class="cat-icon">' + esc(c.icon) + '</span>' +
          '<span class="cat-name">' + esc(c.name) + '</span>' +
          '<span class="cat-desc">' + esc(c.desc) + '</span>' +
        '</a>';
      }).join('');
    }
    // 最近更新 / 推荐
    var recent = $('#recentGrid');
    if (recent) {
      var list = FILES.slice().sort(function (a, b) {
        var fa = a.featured ? 1 : 0, fb = b.featured ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return String(b.date || '').localeCompare(String(a.date || ''));
      }).slice(0, 6);
      renderFiles(recent, list);
    }
    // 下载榜
    var rank = $('#rankGrid');
    if (rank) {
      var top = FILES.slice().sort(function (a, b) { return (b.downloads || 0) - (a.downloads || 0); }).slice(0, 5);
      rank.innerHTML = top.map(function (f, i) {
        return '<a class="card" href="detail.html?id=' + encodeURIComponent(f.id) + '" style="display:flex;align-items:center;gap:12px;padding:12px 16px" data-reveal style="transition-delay:' + (i * 40) + 'ms">' +
          '<span style="font-size:20px;font-weight:800;color:var(--pink)">' + (i + 1) + '</span>' +
          '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(f.title) + '</span>' +
          '<span style="font-size:12px;color:var(--text-faint)">' + (f.downloads || 0) + ' 次</span>' +
        '</a>';
      }).join('');
    }
    // 站名
    var brand = $('#siteName'); if (brand) brand.textContent = SITE.name || '';
    var sub = $('#siteSub'); if (sub) sub.textContent = SITE.subtitle || '';
  }

  /* ---------- 列表页 ---------- */
  function initList() {
    var params = new URLSearchParams(location.search);
    var catId = params.get('cat');
    var cat = CATS.find(function (c) { return c.id === catId; });
    var list = FILES.filter(function (f) { return !cat || f.category === cat.id; });

    var title = $('#listTitle');
    if (title) title.textContent = cat ? cat.icon + ' ' + cat.name : '全部文件';
    var sub = $('#listSub');
    if (sub) sub.textContent = cat ? cat.desc : '所有分类的文件';
    renderFiles($('#listGrid'), list);

    // 筛选按钮（只在“全部”时显示分类过滤）
    var bar = $('#filterBar');
    if (bar && !cat) {
      bar.innerHTML = ['全部'].concat(CATS.filter(function (c) { return !c.hidden; })).map(function (c, i) {
        return '<button class="link-btn filter-chip' + (i === 0 ? ' active' : '') + '" data-cat="' + esc(c.id || '') + '">' + esc(c === '全部' ? '全部' : c.name) + '</button>';
      }).join('');
      bar.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('.filter-chip') : null;
        if (!b) return;
        $$('.filter-chip', bar).forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var id = b.getAttribute('data-cat');
        renderFiles($('#listGrid'), id ? FILES.filter(function (f) { return f.category === id; }) : FILES);
      });
    }
  }

  /* ---------- 详情页 ---------- */
  function initDetail() {
    var id = new URLSearchParams(location.search).get('id');
    var f = FILES.find(function (x) { return x.id === id; });
    var wrap = $('#detailWrap');
    if (!wrap) return;
    if (!f) { wrap.innerHTML = '<div class="card detail-card">找不到这个文件。</div>'; return; }
    var cat = CATS.find(function (c) { return c.id === f.category; });

    var tagHtml = (f.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
    var kv = [];
    if (f.version) kv.push(['版本', f.version]);
    if (f.size) kv.push(['大小', f.size]);
    if (f.date) kv.push(['更新', f.date]);
    if (f.downloads != null) kv.push(['下载', f.downloads + ' 次']);
    if (f.md5) kv.push(['MD5', '<span class="v" style="font-family:var(--mono);font-size:12px">' + esc(f.md5) + '</span>']);
    var kvHtml = kv.map(function (r) { return '<span class="k">' + esc(r[0]) + '</span><span class="v">' + r[1] + '</span>'; }).join('');

    wrap.innerHTML =
      '<div class="card detail-card" data-reveal>' +
        '<a class="link-btn" href="javascript:history.back()">← 返回</a>' +
        '<h1 class="detail-title" style="margin-top:14px">' + esc(cat ? cat.icon : '') + ' ' + esc(f.title) + (f.password ? ' 🔒' : '') + '</h1>' +
        '<p class="detail-desc">' + esc(f.desc || '') + '</p>' +
        (tagHtml ? '<div class="detail-meta">' + tagHtml + '</div>' : '') +
        '<div class="kv">' + kvHtml + '</div>' +
        (f.note ? '<p class="detail-desc" style="margin-top:14px;color:var(--pink)">💡 ' + esc(f.note) + '</p>' : '') +
        '<div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
          '<button class="btn btn-primary" id="dlBtn">⬇️ 下载文件</button>' +
          '<button class="btn" id="copyBtn">🔗 复制本页链接</button>' +
        '</div>' +
      '</div>';

    // 下载按钮（单文件口令）
    $('#dlBtn').addEventListener('click', function () {
      if (f.password) {
        var p = prompt('这个文件有口令，请输入：');
        if (p === null) return;
        if (p !== f.password) { toast('口令不对～'); return; }
      }
      window.open(f.download, '_blank');
      if (window.mushiSay) window.mushiSay('下载开始啦，玩得开心～');
    });
    // 复制本页链接（供转发；二维码待用验证过的实现补齐）
    $('#copyBtn').addEventListener('click', function () {
      var url = location.href;
      function done(ok) { toast(ok ? '链接已复制，可以发给别人啦～' : '复制失败，请手动复制地址栏'); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(legacyCopy(url)); });
      } else { done(legacyCopy(url)); }
    });
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.top = '-1000px';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* ---------- 简历页（浏览器端加密） ---------- */
  function initResume() {
    var wrap = $('#resumeWrap');
    if (!wrap) return;
    // 简历数据在 resume-data.js 里加密存储，这里按提示口令解密
    if (!window.RESUME_CIPHER) {
      wrap.innerHTML = '<div class="card resume-content">简历数据未配置。</div>'; return;
    }
    async function decrypt(pw) {
      try {
        var key = await sha256hex(pw);
        var bytes = await aesDecrypt(window.RESUME_CIPHER, key);
        if (!bytes) return null;
        return new TextDecoder('utf-8').decode(bytes);
      } catch (e) { return null; }
    }
    async function show() {
      var p = $('#resumePw').value || '';
      var html = await decrypt(p);
      if (html == null) { toast('密码不对，或数据损坏'); return; }
      wrap.innerHTML = '<div class="card resume-content">' + html + '</div>';
      $('#resumeLock').classList.add('hidden');
    }
    $('#resumeGo').addEventListener('click', show);
    $('#resumePw').addEventListener('keydown', function (e) { if (e.key === 'Enter') show(); });
  }

  /* ---------- 搜索 ---------- */
  function initSearch() {
    var ov = $('#searchOverlay');
    if (!ov) return;
    var input = $('#searchInput');
    var results = $('#searchResults');
    var items = FILES.map(function (f) {
      var cat = CATS.find(function (c) { return c.id === f.category; });
      return { id: f.id, title: f.title, sum: (cat ? cat.name + ' · ' : '') + (f.desc || ''), hay: [f.title, f.desc, (f.tags || []).join(' '), f.version, cat ? cat.name : ''].join(' ').toLowerCase() };
    });
    var hl = 0, cur = [];

    function render(q) {
      if (!q) cur = items.slice(0, 8);
      else { var n = q.toLowerCase(); cur = items.filter(function (it) { return it.hay.indexOf(n) !== -1; }); }
      if (!cur.length) { results.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-faint)">没找到相关文件～</div>'; return; }
      results.innerHTML = cur.map(function (it, i) {
        return '<a class="search-item' + (i === hl ? ' hl' : '') + '" href="detail.html?id=' + encodeURIComponent(it.id) + '" data-i="' + i + '">' +
          '<div class="search-item-title">' + hi(it.title, q) + '</div>' +
          '<div class="search-item-sum">' + hi(it.sum, q) + '</div></a>';
      }).join('');
    }
    function hi(t, q) { var s = esc(t); if (!q) return s; try { return s.replace(new RegExp('(' + escRe(esc(q)) + ')', 'ig'), '<mark>$1</mark>'); } catch (e) { return s; } }

    function open() { ov.classList.add('open'); hl = 0; input.value = ''; render(''); setTimeout(function () { input.focus(); }, 30); document.body.style.overflow = 'hidden'; }
    function close() { ov.classList.remove('open'); document.body.style.overflow = ''; }

    $$('[data-search-open]').forEach(function (b) { b.addEventListener('click', open); });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    $('#searchClose').addEventListener('click', close);
    input.addEventListener('input', function () { hl = 0; render(input.value.trim()); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); hl = (hl + 1) % Math.max(cur.length, 1); render(input.value.trim()); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); hl = (hl - 1 + Math.max(cur.length, 1)) % Math.max(cur.length, 1); render(input.value.trim()); }
      else if (e.key === 'Enter' && cur[hl]) { location.href = 'detail.html?id=' + encodeURIComponent(cur[hl].id); }
      else if (e.key === 'Escape') { close(); }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    });
  }

  /* ---------- 滚动渐入 ---------- */
  function revealScan() {
    var nodes = $$('[data-reveal]:not(.is-visible)');
    if (!nodes.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) { nodes.forEach(function (n) { n.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 页脚 ---------- */
  function initFooter() {
    var y = $('#year'); if (y) y.textContent = SITE.year || new Date().getFullYear();
    var n = $('#footName'); if (n) n.textContent = SITE.name || '';
    var note = $('#footNote'); if (note) note.textContent = SITE.footer || '';
    var t = document.body.getAttribute('data-title');
    if (t) document.title = t + ' · ' + (SITE.name || '');
  }

  /* ---------- 启动 ---------- */
  function boot() {
    initTheme();
    initPetals();
    initGate();
    initMascot();
    initFooter();
    initSearch();
    if (page === 'home') initHome();
    else if (page === 'list') initList();
    else if (page === 'detail') initDetail();
    else if (page === 'resume') { if (!GATE.enabled) initResume(); }
    revealScan();
    // 简历页独立口令：若进站门关着，简历页自己会显示锁
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
