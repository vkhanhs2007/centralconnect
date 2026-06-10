// ══════════════════════════════════════════════════════
// UTILS.JS — Hàm dùng chung toàn website
// Central Connect · Di sản số Đà Nẵng
// ══════════════════════════════════════════════════════

// ── Định dạng ngày ──────────────────────────────────────────────
window.ccFormatDate = function (d) {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date)) return String(d);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

window.ccFormatDateTime = function (d) {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date)) return String(d);
  return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ── Định dạng điểm ─────────────────────────────────────────────
window.ccFormatPoints = function (n) {
  if (n == null) return '0';
  return Number(n).toLocaleString('vi-VN');
};

// ── Google Maps URLs ──────────────────────────────────────────
window.ccMapsDirectionUrl = function (lat, lng) {
  return 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng;
};

window.ccMapsSearchUrl = function (name, location) {
  const q = location ? name + ', ' + location : name;
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
};

// ── Toast thông báo chung ──────────────────────────────────────
window.showToast = window.showToast || function (msg, duration) {
  const t = document.getElementById('toast') || document.getElementById('ccAuthToast');
  if (!t) { console.log('[Toast]', msg); return; }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration || 3000);
};

// ── Validate email ──────────────────────────────────────────────
window.ccValidateEmail = function (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
};

// ── Validate mật khẩu mạnh ─────────────────────────────────────
window.ccValidatePassword = function (pw) {
  return {
    ok:      pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw),
    len:     pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    digit:   /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw)
  };
};

// ── Xử lý ảnh lỗi ──────────────────────────────────────────────
window.ccOnImgError = function (el, fallback) {
  el.onerror = null;
  el.src = fallback || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%230D1018%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%238A7D6E%22 font-size=%2240%22%3E🏛%3C/text%3E%3C/svg%3E';
};

// ── Lấy user từ localStorage ────────────────────────────────────
window.ccGetUser = function () {
  try { return JSON.parse(localStorage.getItem('cc_user')) || null; } catch { return null; }
};

// ── Loading state cho danh sách ────────────────────────────────
window.ccShowListLoading = function (containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted,#8A7D6E);font-size:14px;"><div style="width:32px;height:32px;border:3px solid rgba(74,144,217,0.2);border-top-color:#4A90D9;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 12px;"></div>Đang tải...</div>';
};

window.ccShowListEmpty = function (containerId, msg) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:48px 20px;color:var(--muted,#8A7D6E);"><div style="font-size:40px;margin-bottom:12px;">📭</div><div style="font-size:14px;">' + (msg || 'Chưa có dữ liệu') + '</div></div>';
};

window.ccShowListError = function (containerId, msg) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#E05C5C;"><div style="font-size:32px;margin-bottom:8px;">⚠</div><div style="font-size:13px;">' + (msg || 'Không tải được dữ liệu') + '</div></div>';
};
