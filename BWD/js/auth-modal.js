/**
 * auth-modal.js
 * Inject modal đăng nhập / đăng ký vào mọi trang (trừ index.html đã có riêng).
 * Đồng bộ trạng thái đăng nhập, điểm Hải Âu, avatar qua localStorage.
 */
(function () {
  const ROOT = window.location.href.includes('/pages/') ? '../' : '';
  const hasExistingLoginModal = !!document.getElementById('loginModal');
  const shouldInjectModal = !hasExistingLoginModal;

  // ─── Inject CSS ───
  if (shouldInjectModal) {
    const style = document.createElement('style');
    style.textContent = `
  .cc-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9000;
    display:flex;align-items:center;justify-content:center;
    opacity:0;visibility:hidden;transition:all 0.3s;backdrop-filter:blur(6px);}
  .cc-modal-overlay.open{opacity:1;visibility:visible;}
  .cc-modal{background:#0D1018;border:1px solid rgba(74,144,217,0.15);border-radius:20px;
    padding:36px 32px;max-width:440px;width:90%;max-height:90vh;overflow-y:auto;
    transform:translateY(20px);transition:transform 0.3s;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.5);}
  .cc-modal-overlay.open .cc-modal{transform:translateY(0);}
  .cc-modal::-webkit-scrollbar{width:4px;}.cc-modal::-webkit-scrollbar-thumb{background:#1A4F8C;}
  .cc-modal-close{position:absolute;top:14px;right:14px;background:rgba(74,144,217,0.08);  border:1px solid rgba(74,144,217,0.2);border-radius:50%;width:30px;height:30px;  cursor:pointer;color:#F5F0E8;font-size:14px;display:flex;align-items:center;justify-content:center;}
  .cc-modal-close:hover{background:rgba(74,144,217,0.15);color:var(--cream);}
  .cc-modal-logo{display:flex;align-items:center;gap:10px;margin-bottom:20px;justify-content:center;}
  .cc-modal-logo img{width:36px;height:36px;border-radius:8px;object-fit:cover;}
  .cc-modal-logo-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:900;
    color:#C9A84C;letter-spacing:0.08em;}
  .cc-modal-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;
    color:#F5F0E8;margin-bottom:6px;text-align:center;}
  .cc-modal-sub{font-size:13px;color:#8A7D6E;margin-bottom:24px;text-align:center;line-height:1.5;}
  .cc-form-group{margin-bottom:14px;}
  .cc-form-group label{display:block;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;
    color:#8A7D6E;margin-bottom:6px;}
  .cc-form-group input{width:100%;background:rgba(74,144,217,0.05);border:1px solid rgba(74,144,217,0.15);  color:#F5F0E8;padding:10px 14px;border-radius:8px;font-size:14px;font-family:inherit;
    outline:none;transition:border-color 0.2s;box-sizing:border-box;}
  .cc-form-group input:focus{border-color:#4A90D9;background:rgba(74,144,217,0.08);}
  .cc-form-group input::placeholder{color:rgba(245,240,232,0.35);}
  .cc-input-wrap{position:relative;}
  .cc-input-wrap input{padding-right:44px;}
  .cc-toggle-pw{position:absolute;right:12px;top:50%;transform:translateY(-50%);
    background:none;border:none;cursor:pointer;font-size:16px;opacity:0.5;transition:opacity 0.2s;}
  .cc-toggle-pw:hover{opacity:1;}
  .cc-btn-primary{width:100%;background:linear-gradient(135deg,#1A4F8C,#4A90D9);
    color:#fff;border:none;padding:13px;border-radius:10px;font-size:15px;
    font-weight:700;cursor:pointer;font-family:inherit;margin-top:6px;transition:all 0.3s;}
  .cc-btn-primary:hover{background:linear-gradient(135deg,#4A90D9,#6AAAE8);transform:translateY(-1px);}
  .cc-divider{display:flex;align-items:center;gap:12px;margin:18px 0;color:#8A7D6E;font-size:12px;}
  .cc-divider::before,.cc-divider::after{content:'';flex:1;height:1px;background:rgba(74,144,217,0.15);}
  .cc-social-row{display:flex;gap:10px;margin-bottom:18px;}
  .cc-social-btn{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(74,144,217,0.15);  color:#F5F0E8;padding:10px;border-radius:8px;font-size:13px;font-weight:600;
    cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;
    justify-content:center;gap:7px;}
  .cc-social-btn:hover{background:rgba(74,144,217,0.1);border-color:rgba(74,144,217,0.4);color:#F5F0E8;}
  .cc-google-icon{width:18px;height:18px;flex-shrink:0;}
  .cc-switch{text-align:center;font-size:13px;color:#8A7D6E;margin-top:16px;}
  .cc-switch button{background:none;border:none;color:#4A90D9;cursor:pointer;
    font-size:13px;font-weight:600;padding:0;transition:color 0.2s;}
  .cc-switch button:hover{color:#6AAAE8;}
  .cc-field-error{font-size:11px;color:#E05C5C;margin-top:4px;display:none;}
  .cc-field-error.show{display:block;}
  .cc-input-err input,.cc-input-err{border-color:#E05C5C!important;}
  .cc-pw-strength{height:3px;border-radius:2px;margin-top:5px;background:rgba(74,144,217,0.08);overflow:hidden;}
  .cc-pw-bar{height:100%;width:0;border-radius:2px;transition:width 0.3s,background 0.3s;}
  .cc-pw-hint{font-size:10px;color:#8A7D6E;margin-top:3px;}
  .cc-otp-wrap{display:flex;gap:8px;justify-content:center;margin:18px 0;}
  .cc-otp-digit{width:46px;height:54px;background:rgba(74,144,217,0.07);border:1.5px solid rgba(74,144,217,0.2);border-radius:10px;text-align:center;font-size:22px;font-weight:700;color:#F5F0E8;outline:none;font-family:inherit;}
  .cc-otp-digit:focus{border-color:#4A90D9;background:rgba(74,144,217,0.12);}
  .cc-countdown{font-size:12px;color:#8A7D6E;text-align:center;margin-top:6px;}
  .cc-countdown span{color:#4A90D9;font-weight:600;}
  .cc-resend-btn{background:none;border:none;color:#4A90D9;font-size:12px;cursor:pointer;font-family:inherit;padding:0;}
  .cc-resend-btn:disabled{color:#8A7D6E;cursor:default;}
  .cc-form-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
  .cc-remember{display:flex;align-items:center;gap:6px;font-size:13px;color:#8A7D6E;cursor:pointer;}
  .cc-remember input{width:auto;margin:0;}
  .cc-forgot{background:none;border:none;color:#4A90D9;font-size:12px;cursor:pointer;padding:0;}
  .cc-step-dots{display:flex;align-items:center;gap:6px;justify-content:center;margin-bottom:20px;}
  .cc-dot{width:24px;height:24px;border-radius:50%;background:rgba(74,144,217,0.1);
    border:2px solid rgba(74,144,217,0.2);color:#8A7D6E;font-size:11px;font-weight:700;
    display:flex;align-items:center;justify-content:center;transition:all 0.3s;}
  .cc-dot.active{background:#1A4F8C;border-color:#4A90D9;color:#fff;}
  .cc-dot.done{background:rgba(74,144,217,0.3);border-color:#4A90D9;color:#4A90D9;}
  .cc-dot-line{flex:1;height:1px;background:rgba(74,144,217,0.15);max-width:32px;}
  .cc-pref-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;}
  .cc-pref-item{padding:10px 12px;background:rgba(74,144,217,0.05);border:1px solid rgba(74,144,217,0.12);  border-radius:8px;font-size:12px;color:#8A7D6E;cursor:pointer;transition:all 0.2s;
    display:flex;align-items:center;gap:8px;}
  .cc-pref-item.selected{background:rgba(26,79,140,0.1);border-color:#4A90D9;color:#1A4F8C;font-weight:600;}
  .cc-btn-row{display:flex;gap:10px;margin-top:6px;}
  .cc-btn-back{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(74,144,217,0.15);  color:#F5F0E8;padding:12px;border-radius:10px;font-size:14px;cursor:pointer;font-family:inherit;transition:all 0.2s;}
  .cc-btn-back:hover{background:rgba(255,255,255,0.08);border-color:rgba(74,144,217,0.3);}
  .cc-toast-auth{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(60px);
    background:rgba(10,13,20,0.95);border:1px solid rgba(74,144,217,0.35);
    color:#F5F0E8;padding:12px 24px;border-radius:10px;font-size:14px;
    backdrop-filter:blur(12px);transition:all 0.35s;z-index:10000;
    pointer-events:none;white-space:nowrap;font-family:'Be Vietnam Pro',sans-serif;}
  .cc-toast-auth.show{transform:translateX(-50%) translateY(0);}
  `;
    document.head.appendChild(style);
  }

  // ─── Inject HTML ───
  const HTML = `
  <!-- AUTH MODAL: ĐĂNG NHẬP -->
  <div class="cc-modal-overlay" id="loginModal">
    <div class="cc-modal">
      <button class="cc-modal-close" onclick="ccCloseModals()">✕</button>
      <div class="cc-modal-logo">
        <img src="${ROOT}assets/images/logo.jpg" alt="logo">
        <div class="cc-modal-logo-name">CENTRAL CONNECT</div>
      </div>
      <div class="cc-modal-title">Chào mừng trở lại!</div>
      <div class="cc-modal-sub">Đăng nhập để tích điểm Hạt Bàu và nhận ưu đãi</div>
      <div class="cc-form-group">
        <label>Email hoặc tên đăng nhập</label>
        <input type="text" id="ccLoginEmail" placeholder="example@email.com">
      </div>
      <div class="cc-form-group">
        <label>Mật khẩu</label>
        <div class="cc-input-wrap">
          <input type="password" id="ccLoginPw" placeholder="••••••••" onkeydown="if(event.key==='Enter')ccDoLogin()">
          <button class="cc-toggle-pw" onclick="ccTogglePw('ccLoginPw',this)">👁</button>
        </div>
      </div>
      <div class="cc-form-row">
        <label class="cc-remember"><input type="checkbox" id="ccRemember"> Ghi nhớ tôi</label>
        <button class="cc-forgot" onclick="ccOpenForgot()">Quên mật khẩu?</button>
      </div>
      <button class="cc-btn-primary" onclick="ccDoLogin()">ĐĂNG NHẬP</button>
      <div class="cc-divider">hoặc đăng nhập bằng</div>
      <div class="cc-social-row">
        <button class="cc-social-btn" onclick="ccDoGoogleLogin()">
          <svg class="cc-google-icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button class="cc-social-btn" onclick="ccDoLogin()">📘 Facebook</button>
      </div>
      <div class="cc-switch">Chưa có tài khoản? <button onclick="ccSwitchToRegister()">Đăng ký ngay</button></div>
    </div>
  </div>

  <!-- AUTH MODAL: ĐĂNG KÝ -->
  <div class="cc-modal-overlay" id="registerModal">
    <div class="cc-modal">
      <button class="cc-modal-close" onclick="ccCloseModals()">✕</button>
      <div class="cc-modal-logo">
        <img src="${ROOT}assets/images/logo.jpg" alt="logo">
        <div class="cc-modal-logo-name">CENTRAL CONNECT</div>
      </div>
      <div class="cc-step-dots">
        <div class="cc-dot active" id="ccDot1">1</div><div class="cc-dot-line"></div>
        <div class="cc-dot" id="ccDot2">2</div><div class="cc-dot-line"></div>
        <div class="cc-dot" id="ccDot3">3</div>
      </div>
      <!-- Step 1 -->
      <div id="ccRegStep1">
        <div class="cc-modal-title">Tạo tài khoản</div>
        <div class="cc-modal-sub">Bước 1/3 · Thông tin cơ bản</div>
        <div class="cc-form-group">
          <label>Họ và tên</label>
          <input type="text" id="ccRegName" placeholder="Nguyễn Văn A" autocomplete="name">
          <div class="cc-field-error" id="errRegName">Vui lòng nhập họ tên</div>
        </div>
        <div class="cc-form-group">
          <label>Email</label>
          <input type="email" id="ccRegEmail" placeholder="email@example.com" autocomplete="email">
          <div class="cc-field-error" id="errRegEmail">Email không hợp lệ</div>
        </div>
        <div class="cc-form-group">
          <label>Mật khẩu</label>
          <div class="cc-input-wrap">
            <input type="password" id="ccRegPw" placeholder="Tối thiểu 8 ký tự" oninput="ccCheckPwStrength(this.value)" autocomplete="new-password">
            <button class="cc-toggle-pw" onclick="ccTogglePw('ccRegPw',this)" type="button">👁</button>
          </div>
          <div class="cc-pw-strength"><div class="cc-pw-bar" id="ccPwBar"></div></div>
          <div class="cc-pw-hint" id="ccPwHint">Cần: 8+ ký tự · Hoa · Thường · Số · Ký tự đặc biệt</div>
          <div class="cc-field-error" id="errRegPw">Mật khẩu chưa đủ mạnh</div>
        </div>
        <div class="cc-form-group">
          <label>Xác nhận mật khẩu</label>
          <div class="cc-input-wrap">
            <input type="password" id="ccRegPwConfirm" placeholder="Nhập lại mật khẩu" autocomplete="new-password">
            <button class="cc-toggle-pw" onclick="ccTogglePw('ccRegPwConfirm',this)" type="button">👁</button>
          </div>
          <div class="cc-field-error" id="errRegPwConfirm">Mật khẩu xác nhận không khớp</div>
        </div>
        <button class="cc-btn-primary" onclick="ccGoStep('otp')">Gửi mã xác thực →</button>
        <div class="cc-switch">Đã có tài khoản? <button onclick="ccSwitchToLogin()">Đăng nhập</button></div>
      </div>

      <!-- Step OTP -->
      <div id="ccRegStepOTP" style="display:none">
        <div class="cc-modal-title">Xác thực email</div>
        <div class="cc-modal-sub">Nhập mã 6 số đã gửi tới <span id="ccOtpEmailDisplay" style="color:#4A90D9;font-weight:600"></span></div>
        <div class="cc-otp-wrap" id="ccOtpWrap">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]" oninput="ccOtpInput(this,0)">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]" oninput="ccOtpInput(this,1)">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]" oninput="ccOtpInput(this,2)">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]" oninput="ccOtpInput(this,3)">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]" oninput="ccOtpInput(this,4)">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]" oninput="ccOtpInput(this,5)">
        </div>
        <div class="cc-countdown" id="ccOtpCountdown">Mã hết hạn sau <span id="ccOtpTimer">05:00</span></div>
        <div style="text-align:center;margin-top:8px"><button class="cc-resend-btn" id="ccResendBtn" onclick="ccResendOtp()" disabled>Gửi lại mã</button></div>
        <div class="cc-field-error" id="errOtp" style="text-align:center;"></div>
        <div class="cc-btn-row" style="margin-top:16px">
          <button class="cc-btn-back" onclick="ccGoStep(1)">← Quay lại</button>
          <button class="cc-btn-primary" style="margin-top:0" onclick="ccVerifyOtp()">Xác nhận</button>
        </div>
      </div>
      <!-- Step 2 -->
      <div id="ccRegStep2" style="display:none">
        <div class="cc-modal-title">Sở thích của bạn</div>
        <div class="cc-modal-sub">Bước 2/3 · Cá nhân hoá hành trình</div>
        <div class="cc-pref-grid">
          <div class="cc-pref-item" onclick="this.classList.toggle('selected')">🏖 Biển & Nghỉ dưỡng</div>
          <div class="cc-pref-item" onclick="this.classList.toggle('selected')">🏛 Di tích lịch sử</div>
          <div class="cc-pref-item" onclick="this.classList.toggle('selected')">🍜 Ẩm thực</div>
          <div class="cc-pref-item" onclick="this.classList.toggle('selected')">🌿 Thiên nhiên</div>
          <div class="cc-pref-item" onclick="this.classList.toggle('selected')">🏺 Làng nghề</div>
          <div class="cc-pref-item" onclick="this.classList.toggle('selected')">🎭 Lễ hội văn hoá</div>
        </div>
        <div class="cc-btn-row">
          <button class="cc-btn-back" onclick="ccGoStep(1)">← Quay lại</button>
          <button class="cc-btn-primary" style="margin-top:0" onclick="ccGoStep(3)">Tiếp theo →</button>
        </div>
      </div>
      <!-- Step 3 -->
      <div id="ccRegStep3" style="display:none">
        <div class="cc-modal-title">Hoàn tất hồ sơ</div>
        <div class="cc-modal-sub">Bước 3/3 · Thông tin bổ sung</div>
        <div class="cc-form-group"><label>Số điện thoại (tùy chọn)</label><input type="tel" id="ccRegPhone" placeholder="0901 234 567"></div>
        <div class="cc-form-group"><label>Bạn đến từ đâu?</label><input type="text" id="ccRegFrom" placeholder="Hà Nội, TP.HCM..."></div>
        <div style="font-size:12px;color:#8A7D6E;margin-bottom:16px;line-height:1.7">
          Bằng cách đăng ký bạn đồng ý với <span style="color:#4A90D9">Điều khoản sử dụng</span> và <span style="color:#4A90D9">Chính sách bảo mật</span>.
        </div>
        <div class="cc-btn-row">
          <button class="cc-btn-back" onclick="ccGoStep(2)">← Quay lại</button>
          <button class="cc-btn-primary" style="margin-top:0" onclick="ccDoRegister()">Hoàn tất 🎉</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div class="cc-modal-overlay" id="forgotModal">
    <div class="cc-modal">
      <button class="cc-modal-close" onclick="ccCloseModals()">✕</button>
      <div class="cc-modal-logo">
        <div class="cc-modal-logo-name">CENTRAL CONNECT</div>
      </div>
      <!-- FP Step 1: nhập email -->
      <div id="ccFpStep1">
        <div class="cc-modal-title">Quên mật khẩu</div>
        <div class="cc-modal-sub">Nhập email để nhận mã xác thực đặt lại mật khẩu</div>
        <div class="cc-form-group">
          <label>Email</label>
          <input type="email" id="ccFpEmail" placeholder="email@example.com" autocomplete="email">
          <div class="cc-field-error" id="errFpEmail">Email không hợp lệ</div>
        </div>
        <button class="cc-btn-primary" onclick="ccSendFpOtp()">Gửi mã xác thực</button>
        <div class="cc-switch"><button onclick="ccSwitchToLogin()">← Quay lại đăng nhập</button></div>
      </div>
      <!-- FP Step 2: nhập OTP -->
      <div id="ccFpStep2" style="display:none">
        <div class="cc-modal-title">Nhập mã OTP</div>
        <div class="cc-modal-sub">Mã 6 số đã gửi tới <span id="ccFpEmailDisplay" style="color:#4A90D9;font-weight:600"></span></div>
        <div class="cc-otp-wrap">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" oninput="ccOtpInput(this,0,'fp')">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" oninput="ccOtpInput(this,1,'fp')">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" oninput="ccOtpInput(this,2,'fp')">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" oninput="ccOtpInput(this,3,'fp')">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" oninput="ccOtpInput(this,4,'fp')">
          <input class="cc-otp-digit" maxlength="1" type="text" inputmode="numeric" oninput="ccOtpInput(this,5,'fp')">
        </div>
        <div class="cc-field-error" id="errFpOtp" style="text-align:center;"></div>
        <div class="cc-btn-row" style="margin-top:16px">
          <button class="cc-btn-back" onclick="ccShowFpStep(1)">← Quay lại</button>
          <button class="cc-btn-primary" style="margin-top:0" onclick="ccVerifyFpOtp()">Tiếp theo →</button>
        </div>
      </div>
      <!-- FP Step 3: đặt mật khẩu mới -->
      <div id="ccFpStep3" style="display:none">
        <div class="cc-modal-title">Mật khẩu mới</div>
        <div class="cc-modal-sub">Đặt mật khẩu mới cho tài khoản của bạn</div>
        <div class="cc-form-group">
          <label>Mật khẩu mới</label>
          <div class="cc-input-wrap">
            <input type="password" id="ccFpNewPw" placeholder="Tối thiểu 8 ký tự" oninput="ccCheckPwStrength(this.value,'fp')" autocomplete="new-password">
            <button class="cc-toggle-pw" onclick="ccTogglePw('ccFpNewPw',this)" type="button">👁</button>
          </div>
          <div class="cc-pw-strength"><div class="cc-pw-bar" id="ccFpPwBar"></div></div>
          <div class="cc-field-error" id="errFpNewPw">Mật khẩu chưa đủ mạnh</div>
        </div>
        <div class="cc-form-group">
          <label>Xác nhận mật khẩu</label>
          <div class="cc-input-wrap">
            <input type="password" id="ccFpConfirmPw" placeholder="Nhập lại mật khẩu" autocomplete="new-password">
            <button class="cc-toggle-pw" onclick="ccTogglePw('ccFpConfirmPw',this)" type="button">👁</button>
          </div>
          <div class="cc-field-error" id="errFpConfirmPw">Mật khẩu xác nhận không khớp</div>
        </div>
        <button class="cc-btn-primary" onclick="ccDoResetPassword()">Đặt lại mật khẩu</button>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div class="cc-toast-auth" id="ccAuthToast"></div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = HTML;
  if (shouldInjectModal) {
    document.body.appendChild(wrapper);

    // ─── Close on backdrop click ───
    document.querySelectorAll('.cc-modal-overlay, .modal-overlay').forEach(m => {
      m.addEventListener('click', e => { if (e.target === m) ccCloseModals(); });
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') ccCloseModals(); });

  // ─── Wire openLogin / openRegister buttons ───
  function wireOpenButtons() {
    const ol = document.getElementById('openLogin');
    const or = document.getElementById('openRegister');
    if (ol) ol.addEventListener('click', () => document.getElementById('loginModal').classList.add('open'));
    if (or) or.addEventListener('click', () => document.getElementById('registerModal').classList.add('open'));
  }
  document.addEventListener('DOMContentLoaded', wireOpenButtons);
  // nav.js injects after DOMContentLoaded, so also wire after a short delay
  setTimeout(wireOpenButtons, 600);

  // ─── Helpers ───
  window.ccCloseModals = function () {
    document.querySelectorAll('.cc-modal-overlay, .modal-overlay').forEach(m => m.classList.remove('open'));
  };
  window.ccSwitchToLogin = function () { ccCloseModals(); const el = document.getElementById('loginModal'); if (el) el.classList.add('open'); };
  window.ccSwitchToRegister = function () { ccCloseModals(); const el = document.getElementById('registerModal'); if (el) el.classList.add('open'); };
  window.ccTogglePw = function (id, btn) {
    const el = document.getElementById(id);
    el.type = el.type === 'password' ? 'text' : 'password';
  };

  let ccCurStep = 1;
  let _ccOtpVerified = false;

  function ccValidatePwStrength(pw) {
    const checks = {
      len:     pw.length >= 8,
      upper:   /[A-Z]/.test(pw),
      lower:   /[a-z]/.test(pw),
      digit:   /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw)
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score, ok: score === 5 };
  }

  window.ccCheckPwStrength = function (val, ctx) {
    const barId = ctx === 'fp' ? 'ccFpPwBar' : 'ccPwBar';
    const bar = document.getElementById(barId);
    if (!bar) return;
    const { score } = ccValidatePwStrength(val);
    const pct = (score / 5) * 100;
    const colors = ['', '#E05C5C', '#E8A020', '#E8C020', '#60D090', '#4A9ED4'];
    bar.style.width = pct + '%';
    bar.style.background = colors[score] || '#E05C5C';
  };

  function ccShowFieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    if (msg) { el.textContent = msg; el.classList.add('show'); }
    else el.classList.remove('show');
  }

  window.ccGoStep = function (n) {
    if (n === 'otp' || n === 2) {
      const name  = (document.getElementById('ccRegName')?.value || '').trim();
      const email = (document.getElementById('ccRegEmail')?.value || '').trim();
      const pw    = (document.getElementById('ccRegPw')?.value || '');
      const pwc   = (document.getElementById('ccRegPwConfirm')?.value || '');
      let valid = true;

      ccShowFieldError('errRegName', '');
      ccShowFieldError('errRegEmail', '');
      ccShowFieldError('errRegPw', '');
      ccShowFieldError('errRegPwConfirm', '');

      if (!name) { ccShowFieldError('errRegName', 'Vui lòng nhập họ tên'); valid = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { ccShowFieldError('errRegEmail', 'Email không hợp lệ (vd: abc@gmail.com)'); valid = false; }
      const pwResult = ccValidatePwStrength(pw);
      if (!pwResult.ok) {
        const missing = [];
        if (!pwResult.checks.len)     missing.push('8+ ký tự');
        if (!pwResult.checks.upper)   missing.push('chữ hoa');
        if (!pwResult.checks.lower)   missing.push('chữ thường');
        if (!pwResult.checks.digit)   missing.push('số');
        if (!pwResult.checks.special) missing.push('ký tự đặc biệt');
        ccShowFieldError('errRegPw', 'Cần thêm: ' + missing.join(', '));
        valid = false;
      }
      if (pw !== pwc) { ccShowFieldError('errRegPwConfirm', 'Mật khẩu xác nhận không khớp'); valid = false; }
      if (!valid) return;

      if (n === 'otp') { ccSendRegOtp(email); return; }
    }

    const stepIds = ['ccRegStep1', 'ccRegStepOTP', 'ccRegStep2', 'ccRegStep3'];
    stepIds.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });

    const stepMap = { 1: 'ccRegStep1', 'otp': 'ccRegStepOTP', 2: 'ccRegStep2', 3: 'ccRegStep3' };
    const target = document.getElementById(stepMap[n]);
    if (target) target.style.display = 'block';

    [1, 2, 3].forEach(i => {
      const d = getEl('ccDot' + i, 'dot' + i);
      if (!d) return;
      const numN = n === 'otp' ? 1 : (typeof n === 'number' ? n : 1);
      d.className = (d.className.includes('cc-dot') ? 'cc-dot' : 'step-dot') + (i < numN ? ' done' : i === numN ? ' active' : '');
    });
    ccCurStep = n;
  };

  function ccShowToastMsg(msg) {
    const t = document.getElementById('ccAuthToast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
  }
  window.ccShowToast = ccShowToastMsg;
  window.doLogin = window.ccDoLogin;
  window.doRegister = window.ccDoRegister;
  window.togglePw = window.ccTogglePw;
  window.closeModals = window.ccCloseModals;
  window.openLogin = window.ccSwitchToLogin;
  window.openRegister = window.ccSwitchToRegister;

  // ─── Avatar initials from name ───
  function makeInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  function getEl(...ids) {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  // ─── Apply auth state to nav elements ───
  function applyAuthState() {
    const user = getStoredUser();
    const guestActions = document.getElementById('guestActions');
    const userPill = document.getElementById('userPill');
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');
    const userPointsEl = document.getElementById('userPoints');
    const authLinks = document.querySelectorAll('.auth-only');

    if (user) {
      if (guestActions) guestActions.style.display = 'none';
      if (userPill) userPill.style.display = 'flex';
      if (userNameEl) userNameEl.textContent = user.displayName;
      if (userAvatarEl) userAvatarEl.textContent = user.initials;
      if (userPointsEl) userPointsEl.textContent = '🌾 ' + (user.points || 50);
      authLinks.forEach(el => el.style.display = 'block');
    } else {
      if (guestActions) guestActions.style.display = 'flex';
      if (userPill) userPill.style.display = 'none';
      authLinks.forEach(el => el.style.display = 'none');
    }
  }

  // ─── localStorage helpers ───
  function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('cc_user')) || null; } catch { return null; }
  }
  function storeUser(obj) {
    localStorage.setItem('cc_user', JSON.stringify(obj));
    // Legacy compat
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', obj.displayName);
  }

  // ─── Login (Firebase hoặc localStorage) ───
  window.ccDoLogin = async function () {
    const emailEl = getEl('ccLoginEmail', 'loginEmail');
    const pwEl = getEl('ccLoginPw', 'loginPw');
    const emailVal = (emailEl?.value || '').trim();
    const pwVal    = (pwEl?.value    || '').trim();

    if (!emailVal) { ccShowToastMsg('⚠ Vui lòng nhập email'); return; }

    // ── Firebase path ──
    if (typeof CC_USE_FIREBASE !== 'undefined' && CC_USE_FIREBASE && typeof firebase !== 'undefined') {
      try {
        const cred = await firebase.auth().signInWithEmailAndPassword(emailVal, pwVal || 'dummy123');
        const fbUser = cred.user;
        let profile = null;
        if (window.ccDB) {
          try { profile = await ccDB.getUser(fbUser.uid); } catch {}
        }
        const displayName = profile?.displayName || fbUser.displayName || fbUser.email.split('@')[0];
        const user = {
          uid: fbUser.uid, email: fbUser.email, displayName,
          initials: makeInitials(displayName),
          points:   profile?.points ?? 100,
          prefs:    profile?.prefs  || [],
          from:     profile?.from   || '',
          provider: 'email',
          createdAt: profile?.createdAt || Date.now()
        };
        storeUser(user);
        if (window.ccDB) await ccDB.saveUser(user);
        ccCloseModals(); applyAuthState();
        ccShowToastMsg('✅ Đăng nhập thành công! Bạn có ' + user.points + ' Hạt Bàu 🌾');
        return;
      } catch (err) {
        const msgs = {
          'auth/user-not-found':  '❌ Email chưa đăng ký',
          'auth/wrong-password':  '❌ Mật khẩu không đúng',
          'auth/invalid-email':   '❌ Email không hợp lệ',
          'auth/too-many-requests': '⚠ Quá nhiều lần thử. Thử lại sau.',
          'auth/invalid-credential': '❌ Email hoặc mật khẩu không đúng'
        };
        ccShowToastMsg(msgs[err.code] || '❌ Lỗi đăng nhập: ' + err.message);
        return;
      }
    }

    // ── localStorage fallback ──
    const email = emailVal || 'khach@example.com';
    const name = email.includes('@') ? email.split('@')[0].replace(/[._]/g, ' ') : email;
    const cap = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const displayName = cap.length > 14 ? cap.substring(0, 14) + '...' : cap;
    const existing = getStoredUser();

    // Thử lấy profile từ server (để khôi phục điểm demo account)
    let serverProfile = null;
    if (window.ccDB) {
      try {
        const apiBase = (typeof CC_API_URL !== 'undefined' ? CC_API_URL : 'http://localhost:3000');
        const resp = await fetch(apiBase + '/api/users/by-email/' + encodeURIComponent(email));
        if (resp.ok) serverProfile = await resp.json();
      } catch { }
    }

    const user = {
      uid:        serverProfile?.uid       || existing?.uid        || ('local-' + Date.now()),
      email,
      displayName: serverProfile?.displayName || displayName,
      initials:    serverProfile?.initials   || makeInitials(displayName),
      points:      serverProfile?.points     ?? (existing ? existing.points : 50),
      prefs:       serverProfile?.prefs      || (existing ? existing.prefs : []),
      createdAt:   existing ? existing.createdAt : Date.now(),
      provider: 'local'
    };
    storeUser(user);
    // Nếu đang bật API hoặc ccDB sẵn sàng, persist lên server
    if (window.ccDB && !serverProfile) {
      try { await ccDB.saveUser(user); } catch { }
    }
    ccCloseModals(); applyAuthState();
    ccShowToastMsg('✅ Đăng nhập thành công! Bạn có ' + user.points + ' Hạt Bàu 🌾');
  };

  // ─── Google OAuth (Firebase hoặc mock) ───
  window.ccDoGoogleLogin = async function () {
    // ── Firebase path ──
    if (typeof CC_USE_FIREBASE !== 'undefined' && CC_USE_FIREBASE && typeof firebase !== 'undefined') {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const cred    = await firebase.auth().signInWithPopup(provider);
        const fbUser  = cred.user;
        let profile   = null;
        if (window.ccDB) {
          try { profile = await ccDB.getUser(fbUser.uid); } catch {}
        }
        const displayName = profile?.displayName || fbUser.displayName || fbUser.email.split('@')[0];
        const user = {
          uid: fbUser.uid, email: fbUser.email, displayName,
          initials:  profile?.initials || makeInitials(displayName),
          points:    profile?.points   ?? 100,
          prefs:     profile?.prefs    || [],
          from:      profile?.from     || '',
          provider:  'google',
          photoURL:  fbUser.photoURL   || null,
          createdAt: profile?.createdAt || Date.now()
        };
        storeUser(user);
        if (window.ccDB) await ccDB.saveUser(user);
        ccCloseModals(); applyAuthState();
        ccShowToastMsg('✅ Đăng nhập Google thành công! Chào ' + displayName + ' 🌾');
        return;
      } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          ccShowToastMsg('❌ Lỗi đăng nhập Google: ' + err.message);
        }
        return;
      }
    }

    // ── Mock fallback ──
    const mockName = 'Người Dùng Google';
    const user = {
      uid: 'local-google-' + Date.now(),
      email: 'user@gmail.com', displayName: mockName, initials: 'ND',
      points: 75, prefs: ['🏛 Di tích lịch sử', '🍜 Ẩm thực'],
      provider: 'google', createdAt: Date.now()
    };
    storeUser(user);
    if (window.ccDB) {
      try { await ccDB.saveUser(user); } catch { }
    }
    ccCloseModals(); applyAuthState();
    ccShowToastMsg('✅ Đăng nhập Google thành công! Bạn có 75 Hạt Bàu 🌾');
  };

  // ─── Register (Firebase hoặc localStorage) ───
  window.ccDoRegister = async function () {
    const name  = (getEl('ccRegName', 'regName')?.value  || '').trim();
    const email = (getEl('ccRegEmail', 'regEmail')?.value || '').trim();
    const pw    = (getEl('ccRegPw', 'regPw')?.value    || '').trim();
    const from  = (getEl('ccRegFrom', 'regFrom')?.value  || '').trim();
    const prefs = [...document.querySelectorAll('#registerModal .cc-pref-item.selected, #registerModal .pref-item.selected')].map(el => el.textContent.trim());

    if (!name)  { ccShowToastMsg('⚠ Vui lòng nhập họ tên'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { ccShowToastMsg('⚠ Email không hợp lệ'); return; }
    if (!ccValidatePwStrength(pw).ok) { ccShowToastMsg('⚠ Mật khẩu chưa đủ mạnh (cần 8+ ký tự, hoa, thường, số, ký tự đặc biệt)'); return; }

    // ── Firebase path ──
    if (typeof CC_USE_FIREBASE !== 'undefined' && CC_USE_FIREBASE && typeof firebase !== 'undefined') {
      if (!pw || pw.length < 8) { ccShowToastMsg('⚠ Mật khẩu tối thiểu 8 ký tự'); return; }
      try {
        const cred   = await firebase.auth().createUserWithEmailAndPassword(email, pw);
        const fbUser = cred.user;
        await fbUser.updateProfile({ displayName: name });
        const user = {
          uid: fbUser.uid, email, displayName: name,
          initials: makeInitials(name),
          points: 100, prefs, from,
          provider: 'email',
          createdAt: Date.now()
        };
        storeUser(user);
        if (window.ccDB) await ccDB.saveUser(user);
        ccCloseModals(); ccGoStep(1); applyAuthState();
        ccShowToastMsg('🎉 Chào mừng ' + name + '! Bạn nhận được 100 Hạt Bàu khởi đầu 🌾');
        return;
      } catch (err) {
        const msgs = {
          'auth/email-already-in-use': '❌ Email đã được sử dụng. Hãy đăng nhập.',
          'auth/invalid-email':        '❌ Email không hợp lệ',
          'auth/weak-password':        '❌ Mật khẩu quá yếu (tối thiểu 6 ký tự)'
        };
        ccShowToastMsg(msgs[err.code] || '❌ Lỗi đăng ký: ' + err.message);
        return;
      }
    }

    // ── localStorage fallback ──
    const user = {
      uid: 'local-' + Date.now(),
      email: email || 'member@example.com',
      displayName: name || 'Thành viên mới',
      initials: makeInitials(name || 'Thành viên'),
      points: 100, prefs, from,
      provider: 'local',
      createdAt: Date.now()
    };
    storeUser(user);
    if (window.ccDB) {
      try { await ccDB.saveUser(user); } catch { }
    }
    ccCloseModals(); ccGoStep(1); applyAuthState();
    ccShowToastMsg('🎉 Chào mừng ' + user.displayName + '! Bạn nhận được 100 Hạt Bàu khởi đầu 🌾');
  };

  // ─── Logout (Firebase + localStorage) ───
  window.logout = async function () {
    if (typeof CC_USE_FIREBASE !== 'undefined' && CC_USE_FIREBASE && typeof firebase !== 'undefined') {
      try { await firebase.auth().signOut(); } catch {}
    }
    if (window.ccDB) { ccDB.clearUser(); } else {
      localStorage.removeItem('cc_user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
    }
    applyAuthState();
    ccShowToastMsg('👋 Đã đăng xuất. Hẹn gặp lại!');
    setTimeout(() => { if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') window.location.href = ROOT + 'index.html'; }, 1200);
  };

  // ─── Points helper (delegate to ccDB if available) ───
  window.ccAddPoints = async function (pts, reason) {
    if (window.ccDB) {
      await ccDB.addPoints(pts, reason);
      return;
    }
    // fallback
    const user = getStoredUser();
    if (!user) return;
    user.points = (user.points || 0) + pts;
    storeUser(user);
    const el = document.getElementById('userPoints');
    if (el) el.textContent = '🌾 ' + user.points;
    if (reason) ccShowToastMsg('+' + pts + ' Hạt Bàu 🌾 · ' + reason);
  };
  // Alias for db.js toast calls
  window.ccShowToastMsg = ccShowToastMsg;
  // Expose legacy modal handlers for built-in page markup
  window.doLogin = ccDoLogin;
  window.doRegister = ccDoRegister;

  // ─── OTP helpers ─────────────────────────────────────────────
  const CC_API = 'http://localhost:3000';
  let _otpTimerInterval = null;

  function ccStartOtpTimer(seconds, displayId, resendBtnId) {
    clearInterval(_otpTimerInterval);
    let left = seconds;
    const timerEl = document.getElementById(displayId);
    const resendEl = document.getElementById(resendBtnId);
    if (resendEl) resendEl.disabled = true;

    _otpTimerInterval = setInterval(() => {
      left--;
      const m = String(Math.floor(left / 60)).padStart(2, '0');
      const s = String(left % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = m + ':' + s;
      if (left <= 0) {
        clearInterval(_otpTimerInterval);
        if (timerEl) timerEl.textContent = '00:00';
        if (resendEl) resendEl.disabled = false;
      }
    }, 1000);
  }

  window.ccOtpInput = function (el, idx, ctx) {
    el.value = el.value.replace(/[^0-9]/g, '').slice(-1);
    const wrap = ctx === 'fp'
      ? document.querySelectorAll('#ccFpStep2 .cc-otp-digit')
      : document.querySelectorAll('#ccOtpWrap .cc-otp-digit');
    if (el.value && wrap[idx + 1]) wrap[idx + 1].focus();
  };

  function ccGetOtpValue(ctx) {
    const wrap = ctx === 'fp'
      ? document.querySelectorAll('#ccFpStep2 .cc-otp-digit')
      : document.querySelectorAll('#ccOtpWrap .cc-otp-digit');
    return [...wrap].map(i => i.value).join('');
  }

  async function ccSendRegOtp(email) {
    const emailEl = document.getElementById('ccOtpEmailDisplay');
    if (emailEl) emailEl.textContent = email;

    try {
      const res = await fetch(CC_API + '/api/auth/send-register-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) { ccShowToastMsg('❌ ' + (data.error || 'Không gửi được mã OTP')); return; }
      if (data.devOtp) ccShowToastMsg('🔧 [Dev] Mã OTP: ' + data.devOtp);
    } catch {
      ccShowToastMsg('⚠ Server chưa khởi động — dùng mã demo: 123456');
      localStorage.setItem('_cc_demo_otp', '123456');
      localStorage.setItem('_cc_demo_otp_email', email);
      localStorage.setItem('_cc_demo_otp_exp', Date.now() + 5 * 60 * 1000);
    }

    const stepIds = ['ccRegStep1', 'ccRegStepOTP', 'ccRegStep2', 'ccRegStep3'];
    stepIds.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    const otpEl = document.getElementById('ccRegStepOTP');
    if (otpEl) otpEl.style.display = 'block';
    ccStartOtpTimer(300, 'ccOtpTimer', 'ccResendBtn');
  }

  window.ccVerifyOtp = async function () {
    const otp = ccGetOtpValue('reg');
    const email = (document.getElementById('ccRegEmail')?.value || '').trim();
    ccShowFieldError('errOtp', '');

    try {
      const res = await fetch(CC_API + '/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type: 'register' })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { ccShowFieldError('errOtp', '❌ Mã OTP không đúng hoặc đã hết hạn'); return; }
    } catch {
      const demoOtp = localStorage.getItem('_cc_demo_otp');
      const exp = parseInt(localStorage.getItem('_cc_demo_otp_exp') || '0');
      if (!demoOtp || otp !== demoOtp || Date.now() > exp) {
        ccShowFieldError('errOtp', '❌ Mã OTP không đúng hoặc đã hết hạn'); return;
      }
    }

    _ccOtpVerified = true;
    clearInterval(_otpTimerInterval);
    ccGoStep(2);
  };

  window.ccResendOtp = function () {
    const email = (document.getElementById('ccRegEmail')?.value || '').trim();
    if (email) ccSendRegOtp(email);
  };

  // ─── Forgot Password ──────────────────────────────────────────
  let _ccFpOtpVerified = false;

  window.ccOpenForgot = function () {
    ccCloseModals();
    const el = document.getElementById('forgotModal');
    if (el) el.classList.add('open');
    ccShowFpStep(1);
  };

  window.ccShowFpStep = function (n) {
    [1, 2, 3].forEach(i => {
      const el = document.getElementById('ccFpStep' + i);
      if (el) el.style.display = i === n ? 'block' : 'none';
    });
  };

  window.ccSendFpOtp = async function () {
    const email = (document.getElementById('ccFpEmail')?.value || '').trim();
    ccShowFieldError('errFpEmail', '');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ccShowFieldError('errFpEmail', 'Email không hợp lệ'); return;
    }

    const displayEl = document.getElementById('ccFpEmailDisplay');
    if (displayEl) displayEl.textContent = email;

    try {
      const res = await fetch(CC_API + '/api/auth/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) { ccShowToastMsg('❌ ' + (data.error || 'Email chưa đăng ký')); return; }
      if (data.devOtp) ccShowToastMsg('🔧 [Dev] Mã OTP: ' + data.devOtp);
    } catch {
      ccShowToastMsg('⚠ Server chưa khởi động — dùng mã demo: 123456');
      localStorage.setItem('_cc_fp_otp', '123456');
      localStorage.setItem('_cc_fp_email', email);
      localStorage.setItem('_cc_fp_exp', Date.now() + 5 * 60 * 1000);
    }

    ccShowFpStep(2);
  };

  window.ccVerifyFpOtp = async function () {
    const otp   = ccGetOtpValue('fp');
    const email = (document.getElementById('ccFpEmail')?.value || '').trim();
    ccShowFieldError('errFpOtp', '');

    try {
      const res = await fetch(CC_API + '/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type: 'reset' })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { ccShowFieldError('errFpOtp', '❌ Mã OTP không đúng hoặc đã hết hạn'); return; }
    } catch {
      const demoOtp = localStorage.getItem('_cc_fp_otp');
      const exp = parseInt(localStorage.getItem('_cc_fp_exp') || '0');
      if (!demoOtp || otp !== demoOtp || Date.now() > exp) {
        ccShowFieldError('errFpOtp', '❌ Mã OTP không đúng hoặc đã hết hạn'); return;
      }
    }

    _ccFpOtpVerified = true;
    ccShowFpStep(3);
  };

  window.ccDoResetPassword = async function () {
    const email  = (document.getElementById('ccFpEmail')?.value || '').trim();
    const pw     = (document.getElementById('ccFpNewPw')?.value || '');
    const confirm= (document.getElementById('ccFpConfirmPw')?.value || '');
    ccShowFieldError('errFpNewPw', '');
    ccShowFieldError('errFpConfirmPw', '');

    if (!ccValidatePwStrength(pw).ok) { ccShowFieldError('errFpNewPw', 'Mật khẩu chưa đủ mạnh (8+ ký tự, hoa, thường, số, ký tự đặc biệt)'); return; }
    if (pw !== confirm) { ccShowFieldError('errFpConfirmPw', 'Mật khẩu xác nhận không khớp'); return; }

    try {
      await fetch(CC_API + '/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: pw })
      });
    } catch { }

    ccCloseModals();
    ccShowToastMsg('✅ Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập lại.');
    setTimeout(ccSwitchToLogin, 1500);
  };

  // ─── User dropdown nav redirects ─────────────────────────────
  const ROOT_PATH = window.location.href.includes('/pages/') ? '' : 'pages/';
  window.openItinerary   = () => window.location.href = ROOT_PATH + 'my-schedule.html';
  window.openVouchers    = () => window.location.href = ROOT_PATH + 'my-vouchers.html';
  window.openLeaderboard = () => window.location.href = ROOT_PATH + 'leaderboard.html';
  window.openSettings    = () => window.location.href = ROOT_PATH + 'settings.html';

  // ─── Auto-apply on load ───
  document.addEventListener('DOMContentLoaded', () => {
    applyAuthState();
    syncPointsFromServer();
  });
  // Also re-apply after nav.js injects the nav pill elements
  setTimeout(applyAuthState, 700);

  // Sync điểm từ server (sau reset demo, tránh stale localStorage)
  async function syncPointsFromServer() {
    const user = getStoredUser();
    if (!user || !user.uid) return;
    try {
      const apiBase = (typeof CC_API_URL !== 'undefined' ? CC_API_URL : 'http://localhost:3000');
      const res = await fetch(apiBase + '/api/users/' + encodeURIComponent(user.uid));
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.points === 'number' && data.points !== user.points) {
        user.points = data.points;
        localStorage.setItem('cc_user', JSON.stringify(user));
        const el = document.getElementById('userPoints');
        if (el) el.textContent = '🌾 ' + data.points;
      }
    } catch { }
  }

})();
