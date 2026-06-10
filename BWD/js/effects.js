/* ══════════════════════════════════════════════════════
   EFFECTS.JS — Hiệu ứng dùng chung cho tất cả trang
   Central Connect · Di sản số Đà Nẵng
   ══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Inject CSS ── */
  const css = `
    /* ── SCROLL PROGRESS BAR ── */
    #scroll-progress {
      position: fixed; top: 0; left: 0; z-index: 9999;
      height: 3px; width: 0%;
      background: linear-gradient(90deg, #9A7A30, #C9A84C, #E8C97A);
      transition: width 0.1s linear;
      pointer-events: none;
    }

    /* ── BACK TO TOP ── */
    #back-to-top {
      position: fixed; bottom: 90px; right: 24px; z-index: 8000;
      width: 42px; height: 42px;
      background: rgba(20,15,10,0.85);
      border: 1px solid rgba(201,168,76,0.4);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 16px; color: #C9A84C;
      opacity: 0; pointer-events: none;
      transform: translateY(10px);
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      backdrop-filter: blur(10px);
    }
    #back-to-top.visible { opacity: 1; pointer-events: auto; transform: translateY(0); }
    #back-to-top:hover {
      background: rgba(201,168,76,0.15);
      border-color: #C9A84C;
      transform: translateY(-3px) !important;
      box-shadow: 0 8px 24px rgba(201,168,76,0.2);
    }

    /* ── PAGE TRANSITION OVERLAY ── */
    #page-transition {
      position: fixed; inset: 0; z-index: 99999;
      background: #1A1410;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.35s ease;
    }
    #page-transition.fade-out { opacity: 1; }

    /* ── REVEAL ON SCROLL (Animate on scroll) ── */
    .cc-reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .cc-reveal.cc-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .cc-reveal-left {
      opacity: 0;
      transform: translateX(-30px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .cc-reveal-left.cc-visible { opacity: 1; transform: translateX(0); }
    .cc-reveal-right {
      opacity: 0;
      transform: translateX(30px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .cc-reveal-right.cc-visible { opacity: 1; transform: translateX(0); }

    /* ── CURSOR GLOW (desktop only) ── */
    #cursor-glow {
      position: fixed;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: transform 0.08s linear;
      display: none;
    }
    @media (hover: hover) { #cursor-glow { display: block; } }

    /* ── TOOLTIP ── */
    [data-tooltip] { position: relative; }
    [data-tooltip]::after {
      content: attr(data-tooltip);
      position: absolute; bottom: calc(100% + 8px); left: 50%;
      transform: translateX(-50%) translateY(4px);
      background: rgba(20,15,10,0.95);
      border: 1px solid rgba(201,168,76,0.3);
      color: #F5F0E8;
      font-size: 11px; font-family: 'Be Vietnam Pro', sans-serif;
      padding: 5px 10px; border-radius: 6px;
      white-space: nowrap;
      opacity: 0; pointer-events: none;
      transition: all 0.2s ease;
    }
    [data-tooltip]:hover::after {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* ── LOADING SPLASH (chỉ index.html) ── */
    #cc-splash {
      position: fixed; inset: 0; z-index: 999999;
      background: #1A1410;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      transition: opacity 0.6s ease, visibility 0.6s ease;
    }
    #cc-splash.hidden { opacity: 0; visibility: hidden; }
    .splash-logo {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px; font-weight: 900;
      color: #C9A84C;
      letter-spacing: 0.15em;
      margin-bottom: 8px;
      animation: splashPulse 1.5s ease-in-out infinite;
    }
    .splash-sub {
      font-size: 11px; letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #8A7D6E;
      margin-bottom: 40px;
    }
    .splash-bar-wrap {
      width: 160px; height: 2px;
      background: rgba(201,168,76,0.15);
      border-radius: 2px; overflow: hidden;
    }
    .splash-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #9A7A30, #E8C97A);
      border-radius: 2px;
      animation: splashLoad 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    @keyframes splashLoad {
      0%   { width: 0%; }
      60%  { width: 75%; }
      100% { width: 100%; }
    }
    @keyframes splashPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `;

  /* ── Inject styles ── */
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function init() {
    injectScrollProgress();
    injectBackToTop();
    injectPageTransition();
    injectCursorGlow();
    initRevealOnScroll();
    initSplash();
  }

  /* ── SCROLL PROGRESS BAR ── */
  function injectScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ── BACK TO TOP ── */
  function injectBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Lên đầu trang');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── PAGE TRANSITION ── */
  function injectPageTransition() {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition';
    document.body.appendChild(overlay);

    // Fade in khi trang load xong
    requestAnimationFrame(() => {
      overlay.style.opacity = '0';
    });

    // Fade out khi click link nội bộ
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || a.target === '_blank') return;
      if (a.hasAttribute('onclick') && !href.endsWith('.html')) return;

      e.preventDefault();
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.opacity = '1';
      setTimeout(() => { window.location.href = href; }, 300);
    });
  }

  /* ── CURSOR GLOW ── */
  function injectCursorGlow() {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
    }, { passive: true });

    function animateGlow() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ── REVEAL ON SCROLL ── */
  function initRevealOnScroll() {
    // Tự động thêm cc-reveal cho các phần tử chưa có class reveal
    const autoTargets = document.querySelectorAll(
      '.place-card, .fund-card, .campaign-card, .partner-card, .food-card, .stat-item, .journey-step, .voucher-card'
    );
    autoTargets.forEach((el, i) => {
      if (!el.classList.contains('cc-reveal') && !el.classList.contains('reveal')) {
        el.classList.add('cc-reveal');
        el.style.transitionDelay = (i % 4) * 0.1 + 's';
      }
    });

    const revealEls = document.querySelectorAll('.cc-reveal, .cc-reveal-left, .cc-reveal-right');
    if (!revealEls.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('cc-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => obs.observe(el));
  }

  /* ── SPLASH SCREEN (chỉ trang index.html) ── */
  function initSplash() {
    const isIndex = location.pathname.endsWith('index.html') || location.pathname.endsWith('/') || location.pathname === '';
    if (!isIndex) return;
    // Không hiện splash nếu vừa navigate từ trang khác (trong 3 giây)
    const lastVisit = sessionStorage.getItem('cc_visited');
    if (lastVisit) return;
    sessionStorage.setItem('cc_visited', '1');

    const splash = document.createElement('div');
    splash.id = 'cc-splash';
    splash.innerHTML = `
      <div class="splash-logo">CENTRAL CONNECT</div>
      <div class="splash-sub">Di sản số Đà Nẵng</div>
      <div class="splash-bar-wrap"><div class="splash-bar-fill"></div></div>
    `;
    document.body.appendChild(splash);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      splash.classList.add('hidden');
      document.body.style.overflow = '';
      setTimeout(() => splash.remove(), 700);
    }, 1800);
  }

  /* ── RUN ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── LAZY LOAD IMAGES ── */
  function initLazyImages() {
    const imgs = document.querySelectorAll('img:not([loading])');
    imgs.forEach(img => { img.setAttribute('loading', 'lazy'); });
  }

  /* ── ACTIVE NAV LINK ── */
  function highlightActiveNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a[href], .mobile-nav-item[href]').forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (href === page) {
        a.style.color = '#C9A84C';
        a.style.background = 'rgba(201,168,76,0.08)';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initLazyImages(); highlightActiveNav(); });
  } else {
    initLazyImages();
    highlightActiveNav();
  }
})();
