// ══════════════════════════════════════════════════════
// NAV.JS — Hamburger mobile menu + active nav + shared footer
// Central Connect · Di sản số Đà Nẵng
// ══════════════════════════════════════════════════════
(function () {
  const ROOT = window.location.href.includes('/pages/') ? '../' : '';

  // ── Active nav detection ──────────────────────────────
  function setNavActive() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    document.querySelectorAll('#navbar .nav-menu > li > a').forEach(a => {
      a.classList.remove('active');
      const href = (a.getAttribute('href') || '').split('/').pop().split('#')[0];
      if (href && href === page) a.classList.add('active');
    });
  }

  // ── Shared footer ──────────────────────────────────────
  function injectFooter() {
    const existing = document.querySelector('footer');
    const html = `
  <div style="max-width:1100px;margin:0 auto;">
    <div class="footer-grid" style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px;">
      <div>
        <div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--gold,#C9A84C);letter-spacing:0.05em;margin-bottom:8px;">CENTRAL CONNECT</div>
        <p style="font-size:13px;color:var(--muted,#8A7D6E);line-height:1.7;max-width:240px;margin-bottom:16px;">Bản đồ di sản tương tác – khám phá văn hoá Đà Nẵng &amp; miền Trung.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <a href="${ROOT}pages/about.html" style="font-size:11px;color:var(--muted,#8A7D6E);text-decoration:none;border:1px solid rgba(138,125,110,0.25);padding:4px 10px;border-radius:20px;transition:color 0.2s;">Giới thiệu</a>
          <a href="${ROOT}pages/contact.html" style="font-size:11px;color:var(--muted,#8A7D6E);text-decoration:none;border:1px solid rgba(138,125,110,0.25);padding:4px 10px;border-radius:20px;transition:color 0.2s;">Liên hệ</a>
        </div>
      </div>
      <div>
        <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted,#8A7D6E);margin-bottom:14px;">Khám phá</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="${ROOT}pages/kham-pha.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🗺 Bản đồ di sản</a>
          <a href="${ROOT}pages/di-tich.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🏛 Di tích lịch sử</a>
          <a href="${ROOT}pages/lang-nghe.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🏺 Làng nghề</a>
          <a href="${ROOT}pages/am-thuc.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🍜 Ẩm thực</a>
        </div>
      </div>
      <div>
        <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted,#8A7D6E);margin-bottom:14px;">Lịch Trình</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="${ROOT}pages/lich-trinh.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">📅 Lên lịch AI</a>
          <a href="${ROOT}pages/su-kien.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🎭 Sự kiện</a>
          <a href="${ROOT}pages/vku-corner.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🎒 Từ VKU</a>
          <a href="${ROOT}pages/my-schedule.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🗂 Lịch trình của tôi</a>
        </div>
      </div>
      <div>
        <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted,#8A7D6E);margin-bottom:14px;">Cộng đồng</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="${ROOT}pages/blog.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">📝 Blog</a>
          <a href="${ROOT}pages/gay-quy.html" style="font-size:13px;color:#D47A10;text-decoration:none;font-weight:600;transition:color 0.2s;" onmouseover="this.style.color='#F0B840'" onmouseout="this.style.color='#D47A10'">🌱 Gây Quỹ</a>
          <a href="${ROOT}pages/leaderboard.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🏅 Bảng xếp hạng</a>
          <a href="${ROOT}pages/doi-tac.html" style="font-size:13px;color:rgba(245,240,232,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--ocean-light,#4A90D9)'" onmouseout="this.style.color='rgba(245,240,232,0.6)'">🤝 Đối tác</a>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid rgba(74,144,217,0.1);padding-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <span style="font-size:12px;color:var(--muted,#8A7D6E);">© 2026 Central Connect · <a href="${ROOT}pages/privacy.html" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(138,125,110,0.3);">Chính sách bảo mật</a> · <a href="${ROOT}pages/terms.html" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(138,125,110,0.3);">Điều khoản</a></span>
      <span style="font-size:12px;color:var(--muted,#8A7D6E);">Bản đồ: <a href="https://leafletjs.com" target="_blank" rel="noopener" style="color:var(--ocean-light,#4A90D9);text-decoration:none;">Leaflet</a> &amp; <a href="https://www.openstreetmap.org" target="_blank" rel="noopener" style="color:var(--ocean-light,#4A90D9);text-decoration:none;">OpenStreetMap</a></span>
    </div>
  </div>`;

    if (existing) {
      existing.innerHTML = html;
      existing.style.cssText = 'background:#060810;border-top:1px solid rgba(74,144,217,0.12);padding:48px 40px 28px;';
    } else {
      const footer = document.createElement('footer');
      footer.style.cssText = 'background:#060810;border-top:1px solid rgba(74,144,217,0.12);padding:48px 40px 28px;';
      footer.innerHTML = html;
      document.body.appendChild(footer);
    }

    // Responsive footer grid
    const style = document.getElementById('footer-responsive-style');
    if (!style) {
      const s = document.createElement('style');
      s.id = 'footer-responsive-style';
      s.textContent = `
        @media (max-width:800px) { footer .footer-grid { grid-template-columns:1fr 1fr !important; gap:24px !important; } }
        @media (max-width:540px) { footer .footer-grid { grid-template-columns:1fr !important; gap:20px !important; } footer { padding:36px 20px 24px !important; } }
      `;
      document.head.appendChild(s);
    }
  }

  // ── Mobile menu injection ──────────────────────────────
  function injectMobileMenu() {
    if (document.getElementById('mobileMenu')) return;

    if (!document.querySelector('link[href*="nav.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = ROOT + 'css/nav.css';
      document.head.appendChild(link);
    }

    const nav = document.getElementById('navbar');
    if (!nav) return;

    const hamburger = document.createElement('button');
    hamburger.className = 'nav-hamburger';
    hamburger.id = 'navHamburger';
    hamburger.setAttribute('aria-label', 'Mở menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(hamburger);

    const menuItems = buildMenuItems(nav);

    document.body.insertAdjacentHTML('beforeend', `
    <div class="mobile-menu-overlay" id="mobileOverlay"></div>
    <nav class="mobile-menu" id="mobileMenu" aria-label="Menu di động">
      <div class="mobile-menu-logo">
        <div class="mobile-menu-logo-text">
          <div class="mobile-menu-logo-name">CENTRAL CONNECT</div>
          <div class="mobile-menu-logo-sub">Di sản số Đà Nẵng</div>
        </div>
        <button class="mobile-close-btn" onclick="closeMobileMenu()" aria-label="Đóng menu">✕</button>
      </div>
      <div id="mobileNavItems">${menuItems}</div>
      <div class="mobile-menu-actions" id="mobileMenuActions">
        <button class="mobile-btn-login" onclick="document.getElementById('openLogin')?.click(); closeMobileMenu()">Đăng nhập</button>
        <button class="mobile-btn-register" onclick="document.getElementById('openRegister')?.click(); closeMobileMenu()">Đăng ký miễn phí</button>
      </div>
    </nav>
    `);

    hamburger.addEventListener('click', toggleMobileMenu);
    document.getElementById('mobileOverlay').addEventListener('click', closeMobileMenu);

    document.querySelectorAll('.mobile-nav-item[data-has-sub]').forEach(item => {
      item.addEventListener('click', () => {
        const sub = item.nextElementSibling;
        if (sub && sub.classList.contains('mobile-nav-sub')) {
          sub.classList.toggle('open');
          const arrow = item.querySelector('.item-arrow');
          if (arrow) arrow.textContent = sub.classList.contains('open') ? '▲' : '▾';
        }
      });
    });

    document.querySelectorAll('.mobile-nav-sub a, .mobile-nav-item[href]').forEach(a => {
      a.addEventListener('click', () => setTimeout(closeMobileMenu, 120));
    });
  }

  function buildMenuItems(nav) {
    const items = [];
    const navLinks = nav.querySelectorAll('.nav-menu > li');

    navLinks.forEach(li => {
      const link = li.querySelector(':scope > a');
      if (!link) return;
      const href    = link.getAttribute('href') || '#';
      const text    = link.textContent.replace('▾', '').trim();
      const isFund  = link.classList.contains('fund-link');
      const isAuth  = li.classList.contains('auth-only');
      const subMenu = li.querySelector('.dropdown-menu');

      const fundClass = isFund ? ' fund' : '';
      const authStyle = isAuth ? ' style="display:none" class="mobile-nav-item auth-only' + fundClass + '"' : ` class="mobile-nav-item${fundClass}"`;

      if (subMenu) {
        const subLinks = [...subMenu.querySelectorAll('a')].map(a => {
          const subHref = a.getAttribute('href') || '#';
          return `<a href="${subHref}">${a.textContent.trim()}</a>`;
        }).join('');
        items.push(
          `<div${authStyle} data-has-sub="1">${text} <span class="item-arrow">▾</span></div>
           <div class="mobile-nav-sub">${subLinks}</div>`
        );
      } else {
        items.push(`<a href="${href}"${isAuth ? ' class="mobile-nav-item auth-only' + fundClass + '"' : ` class="mobile-nav-item${fundClass}"`}>${text}</a>`);
      }
    });

    return items.join('');
  }

  function toggleMobileMenu() {
    const isOpen = document.getElementById('mobileMenu').classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  }

  function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('open');
    document.getElementById('mobileOverlay').classList.add('open');
    document.getElementById('navHamburger').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    document.getElementById('mobileMenu')?.classList.remove('open');
    document.getElementById('mobileOverlay')?.classList.remove('open');
    document.getElementById('navHamburger')?.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeMobileMenu = closeMobileMenu;

  function syncAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName   = localStorage.getItem('userName') || 'Tài khoản';
    const authItems  = document.querySelectorAll('#mobileNavItems .auth-only');
    const actions    = document.getElementById('mobileMenuActions');

    authItems.forEach(el => {
      el.style.display = isLoggedIn ? (el.tagName === 'A' ? 'block' : 'flex') : 'none';
    });

    if (actions) {
      actions.innerHTML = isLoggedIn
        ? `<div style="display:flex;align-items:center;gap:10px;padding:12px 0;border-top:1px solid rgba(201,168,76,0.12)">
             <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#9A7A30,#C9A84C);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#1A1410">${userName.charAt(0).toUpperCase()}</div>
             <div><div style="font-size:14px;font-weight:600;color:#F5F0E8">${userName}</div><div style="font-size:11px;color:#8A7D6E">Đã đăng nhập</div></div>
           </div>
           <button class="mobile-btn-login" style="color:#E05C5C;border-color:rgba(224,92,92,0.4)" onclick="logout()">↩ Đăng xuất</button>`
        : `<button class="mobile-btn-login" onclick="document.getElementById('openLogin')?.click();closeMobileMenu()">Đăng nhập</button>
           <button class="mobile-btn-register" onclick="document.getElementById('openRegister')?.click();closeMobileMenu()">Đăng ký miễn phí</button>`;
    }
  }

  function addScrollEffect() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 30); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ════════════════════════════════════════════════════
  // DARK / LIGHT MODE
  // ════════════════════════════════════════════════════
  function injectThemeCSS() {
    if (document.getElementById('cc-theme-style')) return;
    const s = document.createElement('style');
    s.id = 'cc-theme-style';
    s.textContent = `
      html.cc-light body { background: #F5F0E8 !important; color: #1A1410 !important; }
      html.cc-light nav#navbar { background: rgba(245,240,232,0.95) !important; }
      html.cc-light nav#navbar.scrolled {
        background: rgba(245,240,232,0.97) !important;
        border-bottom-color: rgba(26,79,140,0.2) !important;
        box-shadow: 0 2px 20px rgba(0,0,0,0.08) !important;
      }
      html.cc-light .nav-menu a { color: rgba(26,20,16,0.75) !important; }
      html.cc-light .nav-menu a:hover { background: rgba(26,79,140,0.07) !important; color: #4A90D9 !important; }
      html.cc-light .nav-menu .fund-link { color: #D47A10 !important; }
      html.cc-light .dropdown-menu {
        background: rgba(245,240,232,0.98) !important;
        border-color: rgba(26,79,140,0.15) !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
      }
      html.cc-light .dropdown-menu a { color: #1A1410 !important; }
      html.cc-light .dropdown-menu a:hover { background: rgba(26,79,140,0.07) !important; color: #4A90D9 !important; }
      html.cc-light .user-pill { background: rgba(26,20,16,0.05) !important; border-color: rgba(26,79,140,0.3) !important; }
      html.cc-light .user-name { color: #1A1410 !important; }
      html.cc-light .user-dropdown { background: rgba(245,240,232,0.98) !important; border-color: rgba(26,79,140,0.15) !important; }
      html.cc-light .user-dropdown a { color: #1A1410 !important; }
      html.cc-light .btn-login { border-color: rgba(26,20,16,0.3) !important; color: #1A1410 !important; }
      html.cc-light .mobile-menu { background: #EDE8E0 !important; border-right-color: rgba(26,79,140,0.12) !important; }
      html.cc-light .mobile-menu-logo { background: rgba(26,79,140,0.04) !important; border-bottom-color: rgba(26,20,16,0.08) !important; }
      html.cc-light .mobile-menu-logo-name { color: #C9A84C !important; }
      html.cc-light .mobile-menu-logo-sub { color: #5A4D3E !important; }
      html.cc-light .mobile-close-btn { border-color: rgba(26,20,16,0.15) !important; color: #5A4D3E !important; }
      html.cc-light .mobile-nav-item { color: rgba(26,20,16,0.82) !important; border-bottom-color: rgba(26,20,16,0.08) !important; }
      html.cc-light .mobile-nav-item:hover { background: rgba(201,168,76,0.06) !important; }
      html.cc-light .mobile-nav-sub { background: rgba(26,20,16,0.03) !important; }
      html.cc-light .mobile-nav-sub a { color: rgba(26,20,16,0.65) !important; }
      html.cc-light .mobile-btn-login { border-color: rgba(26,20,16,0.2) !important; color: #1A1410 !important; }
      html.cc-light #cc-utility-mobile { border-top-color: rgba(26,20,16,0.1) !important; }
      html.cc-light .cc-mobile-util-btn { border-color: rgba(26,20,16,0.2) !important; color: #1A1410 !important; }
      html.cc-light .cc-mobile-lang-select { border-color: rgba(26,20,16,0.2) !important; color: #1A1410 !important; background: rgba(26,20,16,0.04) !important; }
      /* ── Theme toggle button ── */
      .cc-theme-toggle {
        width: 34px; height: 34px; flex-shrink: 0;
        border: 1px solid rgba(245,240,232,0.15); background: transparent;
        border-radius: 8px; cursor: pointer; font-size: 16px;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s; line-height: 1;
      }
      .cc-theme-toggle:hover { border-color: var(--gold); background: rgba(201,168,76,0.1); }
      html.cc-light .cc-theme-toggle { border-color: rgba(26,20,16,0.2); }
      /* ── Language selector ── */
      .cc-lang-selector { position: relative; flex-shrink: 0; }
      .cc-lang-btn {
        display: flex; align-items: center; gap: 4px;
        height: 34px; padding: 0 10px;
        border: 1px solid rgba(245,240,232,0.15); background: transparent;
        border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 500;
        color: rgba(245,240,232,0.8); font-family: inherit;
        transition: all 0.2s; white-space: nowrap;
      }
      .cc-lang-btn:hover { border-color: var(--gold); background: rgba(201,168,76,0.1); color: var(--gold); }
      html.cc-light .cc-lang-btn { color: rgba(26,20,16,0.72); border-color: rgba(26,20,16,0.2); }
      html.cc-light .cc-lang-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.08); }
      .cc-lang-dropdown {
        position: absolute; top: calc(100% + 6px); right: 0;
        background: rgba(10,13,20,0.97); border: 1px solid rgba(74,144,217,0.15);
        border-radius: 10px; padding: 6px; min-width: 155px;
        opacity: 0; visibility: hidden; transform: translateY(-6px);
        transition: all 0.22s ease; backdrop-filter: blur(20px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.3); z-index: 500;
      }
      .cc-lang-selector.open .cc-lang-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
      .cc-lang-dropdown button {
        display: block; width: 100%; padding: 8px 12px;
        background: transparent; border: none; text-align: left;
        font-size: 13px; color: rgba(245,240,232,0.85); border-radius: 6px;
        cursor: pointer; font-family: inherit; transition: all 0.15s;
      }
      .cc-lang-dropdown button:hover { background: rgba(74,144,217,0.1); color: #4A90D9; }
      .cc-lang-dropdown button.cc-lang-active { color: #C9A84C; font-weight: 600; }
      html.cc-light .cc-lang-dropdown { background: rgba(245,240,232,0.98) !important; border-color: rgba(26,79,140,0.15) !important; }
      html.cc-light .cc-lang-dropdown button { color: rgba(26,20,16,0.85) !important; }
      html.cc-light .cc-lang-dropdown button:hover { background: rgba(26,79,140,0.07) !important; color: #4A90D9 !important; }
      @media (max-width: 860px) { .cc-theme-toggle, .cc-lang-selector { display: none !important; } }

      /* ══ PAGE CONTENT LIGHT MODE ══ */
      /* Stats */
      html.cc-light #stats { background: #EDE8E0 !important; }
      html.cc-light .stat-label { color: #5A4D3E !important; }
      html.cc-light .stat-number { color: #1A4F8C !important; }
      html.cc-light .stat-divider { background: rgba(26,20,16,0.1) !important; }
      /* Section labels & text */
      html.cc-light .section-label { color: #4A90D9 !important; }
      html.cc-light .section-title { color: #1A1410 !important; }
      html.cc-light .section-desc { color: #5A4D3E !important; }
      html.cc-light .see-all { color: #1A4F8C !important; border-color: rgba(26,79,140,0.3) !important; }
      html.cc-light .see-all:hover { background: rgba(26,79,140,0.07) !important; }
      /* Explore cats */
      html.cc-light #explore-cats { background: rgba(245,240,232,0.6) !important; border-top-color: rgba(26,79,140,0.12) !important; }
      /* Place cards */
      html.cc-light .place-card { background: #fff !important; border-color: rgba(26,79,140,0.12) !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
      html.cc-light .place-card:hover { border-color: rgba(26,79,140,0.3) !important; box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important; }
      html.cc-light .card-name { color: #1A1410 !important; }
      html.cc-light .card-loc { color: #5A4D3E !important; }
      html.cc-light .card-body { background: #fff !important; }
      /* Heritage */
      html.cc-light #heritage { background: linear-gradient(180deg, #EDE8E0 0%, #F5F0E8 100%) !important; border-color: rgba(26,79,140,0.1) !important; }
      /* Fund cards */
      html.cc-light #fundraising { background: linear-gradient(180deg, #EDE8E0 0%, #F5F0E8 100%) !important; }
      html.cc-light .fund-card { background: #fff !important; border-color: rgba(26,79,140,0.12) !important; }
      html.cc-light .fund-name { color: #1A1410 !important; }
      html.cc-light .fund-desc { color: #5A4D3E !important; }
      html.cc-light .progress-bar { background: rgba(26,79,140,0.1) !important; }
      html.cc-light .progress-raised { color: #1A4F8C !important; }
      html.cc-light .progress-goal { color: #5A4D3E !important; }
      /* Food */
      html.cc-light #food { background: #F5F0E8 !important; }
      html.cc-light .food-item { border-color: rgba(26,79,140,0.1) !important; }
      html.cc-light .food-info { background: rgba(245,240,232,0.97) !important; }
      html.cc-light .food-name { color: #1A1410 !important; }
      html.cc-light .food-place { color: #5A4D3E !important; }
      /* VKU */
      html.cc-light #vku { background: linear-gradient(180deg, #EDE8E0 0%, #F5F0E8 100%) !important; }
      html.cc-light .vku-full { color: #5A4D3E !important; }
      html.cc-light .blog-item { background: rgba(26,20,16,0.03) !important; border-color: rgba(26,79,140,0.12) !important; }
      html.cc-light .blog-item:hover { background: rgba(26,79,140,0.05) !important; }
      html.cc-light .blog-title { color: #1A1410 !important; }
      html.cc-light .blog-author { color: #5A4D3E !important; }
      html.cc-light .vku-banner { background: rgba(26,79,140,0.06) !important; border-color: rgba(26,79,140,0.2) !important; }
      /* AI guide */
      html.cc-light #local-guide { background: linear-gradient(180deg, #EDE8E0 0%, #E8E0D4 100%) !important; }
      html.cc-light .guide-chat-window { background: rgba(245,240,232,0.9) !important; border-color: rgba(26,79,140,0.15) !important; }
      html.cc-light .guide-chat-header { background: rgba(26,79,140,0.05) !important; border-bottom-color: rgba(26,79,140,0.1) !important; }
      html.cc-light .guide-header-name { color: #1A1410 !important; }
      html.cc-light .guide-chip { color: #5A4D3E !important; border-color: rgba(26,79,140,0.2) !important; }
      html.cc-light .guide-chip:hover { color: #4A90D9 !important; border-color: #4A90D9 !important; }
      html.cc-light .guide-messages { background: rgba(245,240,232,0.5) !important; }
      html.cc-light .guide-msg:not(.user) .guide-bubble { background: rgba(26,79,140,0.05) !important; border-color: rgba(26,79,140,0.1) !important; color: #1A1410 !important; }
      html.cc-light .guide-msg.user .guide-bubble { background: rgba(184,83,46,0.07) !important; border-color: rgba(184,83,46,0.15) !important; color: #1A1410 !important; }
      html.cc-light .guide-input-row { border-top-color: rgba(26,79,140,0.1) !important; background: rgba(245,240,232,0.9) !important; }
      html.cc-light .guide-input { background: #fff !important; color: #1A1410 !important; border-color: rgba(26,79,140,0.2) !important; }
      /* Newsletter */
      html.cc-light #newsletter { background: linear-gradient(135deg, rgba(26,79,140,0.04) 0%, rgba(184,83,46,0.03) 100%) !important; border-color: rgba(26,79,140,0.15) !important; }
      html.cc-light .newsletter-title { color: #1A1410 !important; }
      html.cc-light .newsletter-sub { color: #5A4D3E !important; }
      html.cc-light .newsletter-form input { background: #fff !important; color: #1A1410 !important; border-color: rgba(26,79,140,0.25) !important; }
      /* Footer */
      html.cc-light footer { background: #E8E0D4 !important; border-top-color: rgba(26,79,140,0.1) !important; }
      html.cc-light .footer-col h4 { color: #1A4F8C !important; }
      html.cc-light .footer-col a { color: #5A4D3E !important; }
      html.cc-light .footer-col a:hover { color: #1A1410 !important; }
      html.cc-light .footer-brand p { color: #5A4D3E !important; }
      html.cc-light .footer-copy { color: #5A4D3E !important; }
      html.cc-light .footer-bottom { border-top-color: rgba(26,79,140,0.12) !important; }
      html.cc-light .social-btn { border-color: rgba(26,79,140,0.2) !important; color: #5A4D3E !important; }
      /* Modals */
      html.cc-light .modal-overlay { background: rgba(245,240,232,0.7) !important; }
      html.cc-light .modal { background: #fff !important; border-color: rgba(26,79,140,0.2) !important; box-shadow: 0 16px 48px rgba(0,0,0,0.15) !important; }
      html.cc-light .modal-title { color: #1A1410 !important; }
      html.cc-light .modal-sub { color: #5A4D3E !important; }
      html.cc-light .modal-logo-name { color: #1A4F8C !important; }
      html.cc-light .form-group label { color: #5A4D3E !important; }
      html.cc-light .form-group input { background: #F5F0E8 !important; border-color: rgba(26,79,140,0.2) !important; color: #1A1410 !important; }
      html.cc-light .form-group input:focus { background: #fff !important; border-color: #4A90D9 !important; }
      html.cc-light .form-group input::placeholder { color: rgba(26,20,16,0.4) !important; }
      html.cc-light .remember { color: #5A4D3E !important; }
      html.cc-light .forgot { color: #1A4F8C !important; }
      html.cc-light .modal-switch { color: #5A4D3E !important; }
      html.cc-light .modal-switch button { color: #1A4F8C !important; }
      html.cc-light .modal-close { background: rgba(26,79,140,0.06) !important; border-color: rgba(26,79,140,0.15) !important; color: #1A1410 !important; }
      html.cc-light .divider-text::before, html.cc-light .divider-text::after { background: rgba(26,79,140,0.15) !important; }
      html.cc-light .divider-text span { color: #5A4D3E !important; }
      html.cc-light .social-login-btn { background: #F5F0E8 !important; border-color: rgba(26,79,140,0.15) !important; color: #1A1410 !important; }
      html.cc-light .social-login-btn:hover { background: #fff !important; }
      html.cc-light .pref-item { background: rgba(26,79,140,0.04) !important; border-color: rgba(26,79,140,0.12) !important; color: #5A4D3E !important; }
      html.cc-light .pref-item.selected { background: rgba(26,79,140,0.1) !important; border-color: #4A90D9 !important; color: #1A1410 !important; }
      html.cc-light .bonus-box { background: rgba(26,79,140,0.05) !important; border-color: rgba(26,79,140,0.2) !important; }
      html.cc-light .bonus-text strong { color: #1A4F8C !important; }
      html.cc-light .bonus-text span { color: #5A4D3E !important; }
      html.cc-light .btn-back { border-color: rgba(26,79,140,0.2) !important; color: #5A4D3E !important; }
      html.cc-light .btn-back:hover { border-color: #4A90D9 !important; color: #4A90D9 !important; }
      /* Settings modal */
      html.cc-light .settings-nav-item { color: #5A4D3E !important; }
      html.cc-light .settings-nav-item:hover { background: rgba(26,79,140,0.05) !important; color: #1A1410 !important; }
      html.cc-light .settings-nav-item.active { background: rgba(26,79,140,0.08) !important; color: #1A4F8C !important; }
      html.cc-light .settings-nav { border-right-color: rgba(26,79,140,0.12) !important; }
      html.cc-light .settings-panel h3 { color: #1A1410 !important; }
      html.cc-light .toggle-label { color: #1A1410 !important; }
      html.cc-light .toggle-sub { color: #5A4D3E !important; }
      html.cc-light .toggle-row { border-bottom-color: rgba(26,79,140,0.08) !important; }
      html.cc-light .lang-btn { background: #F5F0E8 !important; border-color: rgba(26,79,140,0.15) !important; color: #5A4D3E !important; }
      html.cc-light .lang-btn.active { background: rgba(26,79,140,0.08) !important; border-color: #4A90D9 !important; color: #1A4F8C !important; }
      /* Chatbot */
      html.cc-light #ai-chat-window { background: #fff !important; border-color: rgba(26,79,140,0.15) !important; }
      html.cc-light .chat-header { background: rgba(26,79,140,0.05) !important; border-bottom-color: rgba(26,79,140,0.1) !important; }
      html.cc-light .chat-header-name { color: #1A1410 !important; }
      html.cc-light .msg:not(.user) .msg-bubble { background: rgba(26,79,140,0.05) !important; border-color: rgba(26,79,140,0.1) !important; color: #1A1410 !important; }
      html.cc-light .msg.user .msg-bubble { background: rgba(184,83,46,0.07) !important; color: #1A1410 !important; }
      html.cc-light .chat-input { background: #F5F0E8 !important; color: #1A1410 !important; border-color: rgba(26,79,140,0.2) !important; }
      html.cc-light .chat-input::placeholder { color: rgba(26,20,16,0.4) !important; }
      html.cc-light .chat-input-bar { background: #fff !important; border-top-color: rgba(26,79,140,0.1) !important; }
      html.cc-light .chat-chips { background: rgba(245,240,232,0.8) !important; border-top-color: rgba(26,79,140,0.08) !important; }
      html.cc-light .chat-chip { border-color: rgba(26,79,140,0.2) !important; color: #5A4D3E !important; background: #fff !important; }
      html.cc-light .chat-chip:hover { border-color: #4A90D9 !important; color: #4A90D9 !important; }
      /* Scroll progress & back-to-top */
      html.cc-light #back-to-top { background: rgba(245,240,232,0.95) !important; border-color: rgba(26,79,140,0.2) !important; color: #1A4F8C !important; }
      /* Toast */
      html.cc-light .toast { background: rgba(245,240,232,0.98) !important; border-color: rgba(144,212,138,0.4) !important; }
    `;
    document.head.appendChild(s);
  }

  function initDarkMode() {
    injectThemeCSS();
    if (localStorage.getItem('cc_theme') === 'light') {
      document.documentElement.classList.add('cc-light');
    }
  }

  window.ccToggleDarkMode = function () {
    const isLight = document.documentElement.classList.toggle('cc-light');
    localStorage.setItem('cc_theme', isLight ? 'light' : 'dark');
    const icon = isLight ? '🌙' : '☀️';
    const desktopBtn = document.getElementById('ccThemeToggle');
    if (desktopBtn) { desktopBtn.textContent = icon; desktopBtn.title = isLight ? 'Dark Mode' : 'Light Mode'; }
    const mobileLbl = document.getElementById('ccMobileThemeLbl');
    if (mobileLbl) mobileLbl.textContent = isLight ? '🌙 Dark' : '☀️ Light';
  };

  // ════════════════════════════════════════════════════
  // INTERNATIONALIZATION (i18n)
  // ════════════════════════════════════════════════════
  const CC_TRANSLATIONS = {
    vi: {
      nav_explore: 'Khám Phá', nav_food: 'Ẩm Thực', nav_events: 'Sự Kiện',
      nav_blog: 'Blog', nav_fund: 'Gây Quỹ', nav_schedule: 'Lịch Trình', nav_partners: 'Đối Tác',
      nav_login: 'Đăng nhập', nav_register: 'Đăng ký',
      hero_badge: 'Đà Nẵng · Di sản ngàn năm',
      hero_line1: 'Chạm vào quá khứ', hero_line2: 'Kết nối tương lai',
      hero_cta_primary: '🗺 Khám phá ngay', hero_cta_ghost: '📅 Lên lịch trình AI',
    },
    en: {
      nav_explore: 'Explore', nav_food: 'Cuisine', nav_events: 'Events',
      nav_blog: 'Blog', nav_fund: 'Fundraise', nav_schedule: 'Itinerary', nav_partners: 'Partners',
      nav_login: 'Log in', nav_register: 'Sign up',
      hero_badge: 'Da Nang · Thousand-year Heritage',
      hero_line1: 'Touch the Past', hero_line2: 'Connect the Future',
      hero_cta_primary: '🗺 Explore Now', hero_cta_ghost: '📅 Plan with AI',
    },
    ko: {
      nav_explore: '탐험', nav_food: '음식', nav_events: '이벤트',
      nav_blog: '블로그', nav_fund: '기금 모금', nav_schedule: '일정', nav_partners: '파트너',
      nav_login: '로그인', nav_register: '회원가입',
      hero_badge: '다낭 · 천년의 문화유산',
      hero_line1: '과거를 만지다', hero_line2: '미래를 연결하다',
      hero_cta_primary: '🗺 지금 탐험하기', hero_cta_ghost: '📅 AI 일정 계획',
    },
    zh: {
      nav_explore: '探索', nav_food: '美食', nav_events: '活动',
      nav_blog: '博客', nav_fund: '募款', nav_schedule: '行程', nav_partners: '合作伙伴',
      nav_login: '登录', nav_register: '注册',
      hero_badge: '岘港 · 千年文化遗产',
      hero_line1: '触摸过去', hero_line2: '连接未来',
      hero_cta_primary: '🗺 立即探索', hero_cta_ghost: '📅 AI行程规划',
    },
    ja: {
      nav_explore: '探索', nav_food: '料理', nav_events: 'イベント',
      nav_blog: 'ブログ', nav_fund: '募金', nav_schedule: 'スケジュール', nav_partners: 'パートナー',
      nav_login: 'ログイン', nav_register: '登録',
      hero_badge: 'ダナン・千年の文化遺産',
      hero_line1: '過去に触れる', hero_line2: '未来を繋ぐ',
      hero_cta_primary: '🗺 今すぐ探索', hero_cta_ghost: '📅 AIで旅程計画',
    }
  };

  const CC_LANG_FLAGS  = { vi: '🇻🇳', en: '🇺🇸', ko: '🇰🇷', zh: '🇨🇳', ja: '🇯🇵' };
  const CC_LANG_LABELS = { vi: 'VI',   en: 'EN',   ko: 'KO',   zh: 'ZH',   ja: 'JA'  };

  const NAV_I18N_MAP = [
    { match: 'kham-pha',   key: 'nav_explore',  arrow: true  },
    { match: 'am-thuc',    key: 'nav_food',     arrow: false },
    { match: 'su-kien',    key: 'nav_events',   arrow: false },
    { match: 'blog',       key: 'nav_blog',     arrow: false },
    { match: 'gay-quy',    key: 'nav_fund',     arrow: false },
    { match: 'lich-trinh', key: 'nav_schedule', arrow: true  },
    { match: 'doi-tac',    key: 'nav_partners', arrow: true  },
  ];

  function applyTranslations(lang) {
    const t = CC_TRANSLATIONS[lang] || CC_TRANSLATIONS.vi;

    // Dịch nav links desktop
    NAV_I18N_MAP.forEach(function(item) {
      const link = document.querySelector('#navbar .nav-menu a[href*="' + item.match + '"]');
      if (link && t[item.key]) link.textContent = t[item.key] + (item.arrow ? ' ▾' : '');
    });

    // Nút login / register
    const loginBtn = document.getElementById('openLogin');
    const regBtn   = document.getElementById('openRegister');
    if (loginBtn && t.nav_login)    loginBtn.textContent  = t.nav_login;
    if (regBtn   && t.nav_register) regBtn.textContent    = t.nav_register;

    // Cập nhật nhãn nút ngôn ngữ trên desktop
    var langBtn = document.getElementById('ccLangToggle');
    if (langBtn) langBtn.textContent = (CC_LANG_FLAGS[lang] || '🌐') + ' ' + (CC_LANG_LABELS[lang] || lang.toUpperCase());

    // Đánh dấu ngôn ngữ đang active
    document.querySelectorAll('#ccLangSelector .cc-lang-dropdown button').forEach(function(btn) {
      btn.classList.toggle('cc-lang-active', btn.dataset.lang === lang);
    });

    // Đồng bộ select trên mobile
    var mSel = document.getElementById('ccMobileLangSelect');
    if (mSel) mSel.value = lang;

    // Gọi i18n.js nếu đã load
    if (typeof window.ccApplyPageTranslations === 'function') {
      window.ccApplyPageTranslations(lang);
    }
  }

  window.ccSetLang = function (lang) {
    if (!CC_TRANSLATIONS[lang]) return;
    localStorage.setItem('cc_lang', lang);
    applyTranslations(lang);
    var sel = document.getElementById('ccLangSelector');
    if (sel) sel.classList.remove('open');
  };

  window.ccToggleLangMenu = function () {
    var sel = document.getElementById('ccLangSelector');
    if (sel) sel.classList.toggle('open');
  };

  // Đóng dropdown ngôn ngữ khi click ra ngoài
  document.addEventListener('click', function (e) {
    var sel = document.getElementById('ccLangSelector');
    if (sel && sel.classList.contains('open') && !sel.contains(e.target)) {
      sel.classList.remove('open');
    }
  });

  function initI18n() {
    var lang = localStorage.getItem('cc_lang') || 'vi';
    applyTranslations(lang);
  }

  // ════════════════════════════════════════════════════
  // INJECT UTILITY BUTTONS (Theme + Language)
  // ════════════════════════════════════════════════════
  function injectUtilityButtons() {
    var navActions = document.querySelector('#navbar .nav-actions');
    if (!navActions || document.getElementById('ccThemeToggle')) return;

    var lang    = localStorage.getItem('cc_lang') || 'vi';
    var isLight = document.documentElement.classList.contains('cc-light');

    // Nút dark/light mode
    var themeBtn = document.createElement('button');
    themeBtn.id          = 'ccThemeToggle';
    themeBtn.className   = 'cc-theme-toggle';
    themeBtn.title       = isLight ? 'Dark Mode' : 'Light Mode';
    themeBtn.textContent = isLight ? '🌙' : '☀️';
    themeBtn.onclick     = window.ccToggleDarkMode;

    // Dropdown chọn ngôn ngữ
    var langSel = document.createElement('div');
    langSel.className = 'cc-lang-selector';
    langSel.id        = 'ccLangSelector';
    langSel.innerHTML  = '<button class="cc-lang-btn" id="ccLangToggle" onclick="ccToggleLangMenu()">' +
      (CC_LANG_FLAGS[lang] || '🌐') + ' ' + (CC_LANG_LABELS[lang] || 'VI') +
      '</button>' +
      '<div class="cc-lang-dropdown">' +
        '<button data-lang="vi" onclick="ccSetLang(\'vi\')">🇻🇳 Tiếng Việt</button>' +
        '<button data-lang="en" onclick="ccSetLang(\'en\')">🇺🇸 English</button>' +
        '<button data-lang="ko" onclick="ccSetLang(\'ko\')">🇰🇷 한국어</button>' +
        '<button data-lang="zh" onclick="ccSetLang(\'zh\')">🇨🇳 中文</button>' +
        '<button data-lang="ja" onclick="ccSetLang(\'ja\')">🇯🇵 日本語</button>' +
      '</div>';

    // Chèn vào trước nút đăng nhập (hoặc trước user pill nếu đã login)
    var ref = document.getElementById('guestActions') || document.getElementById('userPill') || null;
    if (ref) {
      navActions.insertBefore(themeBtn, ref);
      navActions.insertBefore(langSel, ref);
    } else {
      navActions.prepend(langSel);
      navActions.prepend(themeBtn);
    }
  }

  function injectMobileUtilityButtons() {
    var mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu || document.getElementById('cc-utility-mobile')) return;

    var lang    = localStorage.getItem('cc_lang') || 'vi';
    var isLight = document.documentElement.classList.contains('cc-light');

    var div = document.createElement('div');
    div.id = 'cc-utility-mobile';
    div.style.cssText = 'padding:10px 20px 16px;border-top:1px solid rgba(74,144,217,0.1);display:flex;gap:8px;flex-wrap:wrap;';
    div.innerHTML =
      '<button class="cc-mobile-util-btn" style="flex:1;min-width:90px;padding:9px 6px;background:transparent;border:1px solid rgba(245,240,232,0.18);color:var(--cream);border-radius:8px;font-size:12px;cursor:pointer;font-family:inherit;white-space:nowrap;" onclick="ccToggleDarkMode()">' +
        '<span id="ccMobileThemeLbl">' + (isLight ? '🌙 Dark' : '☀️ Light') + '</span>' +
      '</button>' +
      '<select id="ccMobileLangSelect" class="cc-mobile-lang-select" onchange="ccSetLang(this.value)" style="flex:2;min-width:110px;padding:9px 8px;background:rgba(245,240,232,0.08);border:1px solid rgba(245,240,232,0.18);color:var(--cream);border-radius:8px;font-size:12px;cursor:pointer;font-family:inherit;outline:none;">' +
        '<option value="vi"' + (lang==='vi'?' selected':'') + '>🇻🇳 Tiếng Việt</option>' +
        '<option value="en"' + (lang==='en'?' selected':'') + '>🇺🇸 English</option>' +
        '<option value="ko"' + (lang==='ko'?' selected':'') + '>🇰🇷 한국어</option>' +
        '<option value="zh"' + (lang==='zh'?' selected':'') + '>🇨🇳 中文</option>' +
        '<option value="ja"' + (lang==='ja'?' selected':'') + '>🇯🇵 日本語</option>' +
      '</select>';
    mobileMenu.appendChild(div);
  }

  // ════════════════════════════════════════════════════
  // NAV AUTH GUARDS — Blog, Gây Quỹ, Đối Tác yêu cầu đăng nhập
  // ════════════════════════════════════════════════════
  var GUARDED_PAGES = ['blog.html', 'gay-quy.html', 'doi-tac.html'];

  function addNavAuthGuards() {
    // Capture phase → chạy trước bubble listener của effects.js
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!GUARDED_PAGES.some(function(p) { return href.indexOf(p) !== -1; })) return;

      var user = null;
      try { user = JSON.parse(localStorage.getItem('cc_user')); } catch (_) {}
      var isLoggedIn = !!user || localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        e.preventDefault();
        e.stopImmediatePropagation(); // Ngăn effects.js chuyển trang
        var modal = document.getElementById('loginModal');
        if (modal) modal.classList.add('open');
        else { var btn = document.getElementById('openLogin'); if (btn) btn.click(); }
      }
    }, true);
  }

  // ════════════════════════════════════════════════════
  // KHỞI CHẠY
  // ════════════════════════════════════════════════════
  function initAll() {
    initDarkMode();        // 1. Khôi phục theme đã lưu
    initI18n();            // 2. Dịch nav links (trước khi build mobile menu)
    injectMobileMenu();    // 3. Build mobile menu từ nav links (đã dịch)
    injectUtilityButtons(); // 4. Thêm nút theme + ngôn ngữ vào desktop nav
    injectMobileUtilityButtons(); // 5. Thêm nút theme + ngôn ngữ vào mobile menu
    injectFooter();        // 6. Inject footer
    setNavActive();        // 7. Đánh dấu trang hiện tại
    setTimeout(syncAuthState, 50); // 8. Đồng bộ trạng thái đăng nhập
    addScrollEffect();     // 9. Hiệu ứng scroll navbar
    addNavAuthGuards();    // 10. Bảo vệ Blog / Gây Quỹ / Đối Tác
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
