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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectMobileMenu();
      injectFooter();
      setNavActive();
      setTimeout(syncAuthState, 50);
      addScrollEffect();
    });
  } else {
    injectMobileMenu();
    injectFooter();
    setNavActive();
    setTimeout(syncAuthState, 50);
    addScrollEffect();
  }
})();
