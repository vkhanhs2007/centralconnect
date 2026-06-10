// auth.js — Central Connect Auth Layer v2.0
// Hỗ trợ Firebase Auth (khi CC_USE_FIREBASE=true) + localStorage fallback

// ── Áp dụng trạng thái nav dựa vào cc_user trong localStorage ────────
function applyNavigationState() {
  const user = (function() {
    try { return JSON.parse(localStorage.getItem('cc_user')); } catch { return null; }
  })();

  const isLoggedIn    = !!user || localStorage.getItem('isLoggedIn') === 'true';
  const displayName   = user?.displayName || localStorage.getItem('userName') || 'Tài khoản';
  const initials      = user?.initials || displayName.substring(0, 2).toUpperCase();
  const points        = user?.points ?? 50;

  const authLinks     = document.querySelectorAll('.auth-only');
  const guestActions  = document.getElementById('guestActions');
  const userPill      = document.getElementById('userPill');
  const userNameEl    = document.getElementById('userName');
  const userAvatarEl  = document.getElementById('userAvatar');
  const userPointsEl  = document.getElementById('userPoints');

  if (isLoggedIn) {
    authLinks.forEach(el => el.style.display = 'block');
    if (guestActions) guestActions.style.display = 'none';
    if (userPill)     userPill.style.display     = 'flex';
    if (userNameEl)   userNameEl.textContent      = displayName;
    if (userAvatarEl) userAvatarEl.textContent    = initials;
    if (userPointsEl) userPointsEl.textContent    = '🌾 ' + points;
  } else {
    authLinks.forEach(el => el.style.display = 'none');
    if (guestActions) guestActions.style.display = 'flex';
    if (userPill)     userPill.style.display     = 'none';
  }
}

// ── Đăng xuất dùng chung ─────────────────────────────────────────────
function logout() {
  // Firebase sign-out nếu đang dùng Firebase
  if (typeof CC_USE_FIREBASE !== 'undefined' && CC_USE_FIREBASE && typeof firebase !== 'undefined') {
    firebase.auth().signOut().catch(() => {});
  }
  if (window.ccDB) {
    ccDB.clearUser();
  } else {
    localStorage.removeItem('cc_user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
  }
  applyNavigationState();
  // Toast
  const toastFn = window.ccShowToastMsg || window.ccShowToast;
  if (toastFn) toastFn('👋 Đã đăng xuất. Hẹn gặp lại!');
  setTimeout(() => {
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
      window.location.href = 'index.html';
    }
  }, 1000);
}

// ── requireLogin — Yêu cầu đăng nhập trước khi làm gì đó ─────────────
function requireLogin(action) {
  const user = (function() {
    try { return JSON.parse(localStorage.getItem('cc_user')); } catch { return null; }
  })();
  if (user) {
    if (typeof action === 'function') action();
    return true;
  }
  // Mở modal đăng nhập
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.add('open');
  return false;
}

// ── requirePageAccess — Kiểm tra login trước khi load trang protected ────
function requirePageAccess() {
  const user = (function() {
    try { return JSON.parse(localStorage.getItem('cc_user')); } catch { return null; }
  })();
  const isLoggedIn = !!user || localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    // Redirect về trang chủ nếu chưa đăng nhập
    const toast = window.ccShowToastMsg || window.ccShowToast;
    if (toast) toast('🔒 Vui lòng đăng nhập để truy cập trang này');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    return false;
  }
  return true;
}

// ── Firebase Auth State Observer ──────────────────────────────────────
function _setupFirebaseAuthObserver() {
  if (typeof CC_USE_FIREBASE === 'undefined' || !CC_USE_FIREBASE) return;
  if (typeof firebase === 'undefined' || !window._ccAuth) return;

  window._ccAuth.onAuthStateChanged(async function (fbUser) {
    if (fbUser) {
      // Lấy profile từ Firestore (nếu có)
      let profile = null;
      if (window.ccDB) {
        try { profile = await ccDB.getUser(fbUser.uid); } catch { }
      }

      const makeInit = window.ccMakeInitials || function(n) { return (n||'TK').substring(0,2).toUpperCase(); };
      const displayName = profile?.displayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Thành viên';

      const user = {
        uid:         fbUser.uid,
        email:       fbUser.email,
        displayName,
        initials:    profile?.initials || makeInit(displayName),
        points:      profile?.points   ?? 100,
        prefs:       profile?.prefs    || [],
        from:        profile?.from     || '',
        provider:    fbUser.providerData[0]?.providerId || 'email',
        photoURL:    fbUser.photoURL   || null,
        createdAt:   profile?.createdAt || Date.now()
      };

      localStorage.setItem('cc_user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', user.displayName);

      applyNavigationState();
    } else {
      // Đăng xuất khỏi Firebase → xóa localStorage
      localStorage.removeItem('cc_user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      applyNavigationState();
    }
  });
}

// ── Khởi chạy ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  applyNavigationState();

  // Nếu Firebase sẵn sàng ngay lúc DOMContentLoaded
  if (window._ccAuth) _setupFirebaseAuthObserver();
});

// Lắng nghe sự kiện Firebase ready (firebase-config.js bắn ra)
document.addEventListener('cc:firebase-ready', function () {
  _setupFirebaseAuthObserver();
});
