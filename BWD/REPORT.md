# Báo Cáo Hoàn Thiện – Central Connect
**Dự án BWD 2026 · VKU · Bán kết 13/06/2026**

---

## Tổng quan dự án

| Hạng mục | Chi tiết |
|---|---|
| Tên dự án | **Central Connect** – Di sản số Đà Nẵng |
| Chủ đề | Bảo tồn & phát huy di sản văn hóa vùng Đà Nẵng – Quảng Nam |
| Cuộc thi | BWD (Best Web Design) 2026 |
| Đơn vị | Trường Đại học Việt-Hàn (VKU) – Đại học Đà Nẵng |
| Email | khanhnv.25itb@vku.udn.vn |
| Bán kết | 13/06/2026 |
| Stack | HTML5 + CSS3 + Vanilla JS (Frontend) · Node.js/Express + MySQL (Backend) · Firebase Auth |

---

## Cấu trúc website

### Tổng số trang: **19 trang HTML**

#### Trang chính (Core)
| Trang | URL | Mô tả |
|---|---|---|
| Trang chủ | `index.html` | Landing page, hero section, featured places |
| Khám phá | `pages/kham-pha.html` | Bản đồ tương tác Leaflet + 14 địa điểm di sản |
| Di tích | `pages/di-tich.html` | Danh sách di tích lịch sử + modal chi tiết |
| Làng nghề | `pages/lang-nghe.html` | Làng nghề truyền thống |
| Ẩm thực | `pages/am-thuc.html` | Ẩm thực địa phương + Google Maps |
| Sự kiện | `pages/su-kien.html` | Lịch sự kiện văn hoá |
| Blog | `pages/blog.html` | Bài viết cộng đồng |
| Lịch trình AI | `pages/lich-trinh.html` | Tạo lịch trình AI |
| Gây quỹ | `pages/gay-quy.html` | Gây quỹ bảo tồn di sản |
| Đối tác | `pages/doi-tac.html` | Danh sách đối tác |
| VKU Corner | `pages/vku-corner.html` | Góc VKU + bản đồ campus |
| Hồ sơ | `pages/profile.html` | Trang hồ sơ người dùng |

#### Trang người dùng (mới tạo session này)
| Trang | URL | Mô tả |
|---|---|---|
| Lịch trình của tôi | `pages/my-schedule.html` | Quản lý lịch trình đã tạo |
| Voucher của tôi | `pages/my-vouchers.html` | Voucher đổi từ điểm Hạt Bàu |
| Bảng xếp hạng | `pages/leaderboard.html` | Top người dùng tích điểm |
| Cài đặt | `pages/settings.html` | Cài đặt tài khoản + bảo mật |

#### Trang thông tin (mới tạo session này)
| Trang | URL | Mô tả |
|---|---|---|
| Giới thiệu | `pages/about.html` | Giới thiệu dự án & đội ngũ |
| Liên hệ | `pages/contact.html` | Form liên hệ |
| Chính sách | `pages/privacy.html` | Chính sách bảo mật |
| Điều khoản | `pages/terms.html` | Điều khoản sử dụng |

---

## Các tính năng đã triển khai

### 1. Navigation & Footer
- **Nav active state**: JS tự động phát hiện trang hiện tại và đánh dấu link active bằng màu xanh ocean, không nhầm lẫn với "Gây Quỹ" chip
- **Gây Quỹ badge**: Đổi sang dạng chip/pill màu cam với border, rõ ràng phân biệt với trang active
- **Footer chuẩn hoá**: `nav.js` inject footer chung cho tất cả 19 trang – links đầy đủ tới các trang thông tin, mạng xã hội, copyright
- **Mobile menu**: Hamburger menu responsive cho tất cả màn hình

### 2. Xác thực & Bảo mật (auth-modal.js)
- **Đăng ký multi-step**: Bước 1 (thông tin + mật khẩu) → Bước OTP → Bước 2 (chọn sở thích) → Hoàn tất
- **Kiểm tra mật khẩu mạnh**: Tối thiểu 8 ký tự + chữ hoa + chữ thường + chữ số + ký tự đặc biệt
- **Thanh sức mạnh mật khẩu**: Visual bar đổi màu theo độ mạnh (đỏ → vàng → xanh)
- **Inline field errors**: Thông báo lỗi ngay dưới từng trường, không dùng alert()
- **OTP email 6 chữ số**: Auto-advance khi nhập, đếm ngược 120s, nút resend
- **Quên mật khẩu**: Flow 3 bước – email → OTP → mật khẩu mới
- **Dev mode OTP**: Nếu SMTP chưa cấu hình, OTP trả về trong response để test

### 3. Backend API (server/server.js)
Các endpoint mới:
```
POST /api/auth/send-register-otp   → Gửi OTP đăng ký qua email
POST /api/auth/send-reset-otp      → Gửi OTP đặt lại mật khẩu
POST /api/auth/verify-otp          → Xác thực OTP (type: register | reset)
POST /api/auth/register            → Đăng ký tài khoản MySQL
POST /api/auth/reset-password      → Đặt lại mật khẩu
```
- OTP lưu in-memory Map, tự hết hạn sau 10 phút
- Nodemailer với SMTP env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- Fallback console.log nếu SMTP chưa cấu hình

### 4. Bản đồ Kham Phá (kham-pha.html)
- **Tile layer**: Đổi sang CartoDB Voyager (màu sắc, rõ ràng) thay vì dark_all
- **14 địa điểm**: Gồm 2 địa điểm mới thêm (id:13 Làng Cổ Lộc Yên, id:14 Cù Lao Chàm)
- **Chủ quyền**: Markers Hoàng Sa & Trường Sa với nền navy đậm, chữ vàng – rõ trên bản đồ sáng
- **Google Maps Chỉ đường**: Nút trong popup mỗi địa điểm
- **Image fallback**: `safeBg()` xử lý ảnh lỗi

### 5. Bản đồ VKU Corner (vku-corner.html)
- Leaflet với Esri Satellite + OSM Street toggle
- Loading spinner khi tải tiles
- Chỉ đường tích hợp cho tuyến đường và timeline

### 6. Di tích & Ẩm thực
- Nút "Chỉ đường" Google Maps trong modal và danh sách cards
- Contrast cải thiện toàn bộ text (cream/gold thay vì trắng nhạt trên nền tối)

### 7. Utils (js/utils.js)
Helper functions dùng chung trên `window`:
- `ccFormatDate`, `ccFormatDateTime`, `ccFormatPoints`
- `ccMapsDirectionUrl`, `ccMapsSearchUrl`
- `ccValidateEmail`, `ccValidatePassword`
- `ccGetUser` – đọc user từ localStorage/Firebase
- `ccOnImgError` – fallback ảnh lỗi
- `ccShowListLoading`, `ccShowListEmpty`, `ccShowListError`

### 8. Trang người dùng

**My Schedule** (`my-schedule.html`)
- Grid lịch trình với thumbnail emoji, badge thời lượng
- Merge localStorage + MOCK data
- Actions: Xem, Sao chép, Xoá (localStorage)
- Link tạo mới → lich-trinh.html

**My Vouchers** (`my-vouchers.html`)
- 4 MOCK vouchers: 2 active (Grab, Bà Nà), 1 used, 1 expired
- Điểm Hạt Bàu display
- Filter tabs: Tất cả / Còn dùng / Đã dùng / Hết hạn
- Copy to clipboard với toast notification

**Leaderboard** (`leaderboard.html`)
- Fetch từ `GET /api/leaderboard?limit=10`, fallback MOCK 10 entries
- Tab Tổng hợp / Tuần này / Tháng này
- Medals 🥇🥈🥉 với card color border khác nhau
- "Xếp hạng của bạn" box cho user đăng nhập

**Settings** (`settings.html`)
- Thông tin cá nhân: Họ tên, Email, SĐT, Đến từ
- Đổi mật khẩu + thanh sức mạnh
- 4 toggle thông báo với CSS slider
- Danger zone: Xoá dữ liệu / Xoá tài khoản

### 9. Trang thông tin

**About** (`about.html`) – Giới thiệu sứ mệnh, 4 tính năng nổi bật, đội ngũ VKU

**Contact** (`contact.html`) – Thông tin liên hệ + form gửi tin nhắn (success state)

**Privacy** (`privacy.html`) – 7 điều khoản bảo mật chi tiết, rõ ràng, đúng pháp lý

**Terms** (`terms.html`) – 9 điều khoản sử dụng, quy tắc cộng đồng, chính sách điểm

---

## Kiến trúc kỹ thuật

```
BWD/
├── index.html                  ← Trang chủ
├── pages/                      ← 18 trang con
│   ├── kham-pha.html           ← Bản đồ Leaflet chính
│   ├── [core pages...]
│   ├── my-schedule.html        ← Trang người dùng (mới)
│   ├── my-vouchers.html        ← Trang người dùng (mới)
│   ├── leaderboard.html        ← Trang người dùng (mới)
│   ├── settings.html           ← Trang người dùng (mới)
│   ├── about.html              ← Trang info (mới)
│   ├── contact.html            ← Trang info (mới)
│   ├── privacy.html            ← Trang info (mới)
│   └── terms.html              ← Trang info (mới)
├── css/
│   ├── nav.css                 ← Nav + Footer + active states
│   └── [page-specific...]
├── js/
│   ├── nav.js                  ← Inject nav, footer, active state, mobile menu
│   ├── auth-modal.js           ← Login/Register/OTP/ForgotPw modals
│   ├── utils.js                ← Common helpers
│   ├── firebase-config.js      ← Firebase init
│   ├── db.js                   ← Firestore helpers
│   └── [other...]
├── server/
│   ├── server.js               ← Express API + OTP endpoints
│   └── [routes...]
└── assets/
    └── images/                 ← Ảnh địa điểm, logo
```

---

## Palette màu & Design System

| Token | Hex | Dùng cho |
|---|---|---|
| `--gold` | `#C9A84C` | Accent chính, tiêu đề quan trọng |
| `--cream` | `#F5F0E8` | Text chính trên nền tối |
| `--ocean` | `#1A4F8C` | Background button, gradient |
| `--ocean-light` | `#4A90D9` | Link active, hover state |
| `--muted` | `#8A7D6E` | Text phụ, label |
| Background | `#080A0F` | Nền trang |

**Font**: Playfair Display (serif, headings) + Be Vietnam Pro (sans-serif, body)

---

## Checklist trước buổi thuyết trình

- [x] Tất cả nav links đều hoạt động
- [x] Footer hiển thị trên tất cả trang
- [x] Nav active state đúng trang
- [x] Đăng nhập/Đăng ký không có lỗi JS console
- [x] OTP flow hoạt động (dev mode: OTP trong response)
- [x] Dropdown user: Lịch trình, Voucher, Bảng xếp hạng, Cài đặt đều có trang đích
- [x] Bản đồ kham-pha.html hiển thị màu sắc (Voyager tiles)
- [x] Markers Hoàng Sa & Trường Sa hiển thị rõ trên bản đồ sáng
- [x] Trang about/contact/privacy/terms đều có nội dung đầy đủ
- [x] Responsive mobile (media queries ở tất cả trang)
- [ ] Kiểm tra server Node.js chạy ổn định (`node server/server.js`)
- [ ] Firebase auth hoạt động với project thật
- [ ] SMTP email nếu demo OTP thật (hoặc dùng dev mode)

---

## Ghi chú cho buổi demo

1. **Demo đăng ký OTP**: Chạy `node server/server.js` → Server in OTP ra console nếu chưa có SMTP. Nhập OTP từ console vào ô xác thực.

2. **Demo bản đồ**: Mở `kham-pha.html` → Bản đồ Voyager có màu sắc → Click marker để xem chi tiết → Nút "Chỉ đường" mở Google Maps.

3. **Demo dropdown user**: Đăng nhập → Click avatar → Các trang Lịch trình, Voucher, Bảng xếp hạng, Cài đặt đều navigate đúng.

4. **Demo bảng xếp hạng**: Mở `leaderboard.html` → Tải data từ API hoặc hiển thị MOCK 10 người dùng với medals.

---

*Báo cáo tổng hợp – Central Connect v2.0 · Hoàn thiện 10/06/2026*
