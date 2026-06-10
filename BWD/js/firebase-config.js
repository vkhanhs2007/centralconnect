/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║          CENTRAL CONNECT — Cấu hình Backend                         ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  Có 3 chế độ database (chọn 1):                                     ║
 * ║                                                                      ║
 * ║  Chế độ A — SQL Server (backend Node.js):                           ║
 * ║    1. cd server → npm install → sao chép .env.example thành .env    ║
 * ║    2. Chạy schema.sql trong SQL Server Management Studio            ║
 * ║    3. npm start (server chạy ở http://localhost:3000)               ║
 * ║    4. Đặt CC_USE_API = true bên dưới                                ║
 * ║                                                                      ║
 * ║  Chế độ B — Firebase Firestore (cloud, không cần backend):          ║
 * ║    1. Vào https://console.firebase.google.com/                      ║
 * ║    2. Tạo project → lấy firebaseConfig → paste vào bên dưới        ║
 * ║    3. Đặt CC_USE_FIREBASE = true                                    ║
 * ║                                                                      ║
 * ║  Chế độ C — localStorage (offline, không cần cài gì):              ║
 * ║    Giữ nguyên CC_USE_API = false và CC_USE_FIREBASE = false         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

// ══ Chế độ A: SQL Server API ══════════════════════════════════════════
// Đặt true khi server Node.js (server/server.js) đang chạy
const CC_USE_API = true;

// URL của backend API (mặc định localhost:3000)
const CC_API_URL = "http://localhost:3000";

// ══ Chế độ B: Firebase ═══════════════════════════════════════════════
const CC_FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abcdefabcdef000000",
};

// Đặt true sau khi đã điền CC_FIREBASE_CONFIG
const CC_USE_FIREBASE = false;

// ══ Tự động khởi tạo ═════════════════════════════════════════════════
(function () {
  if (CC_USE_API) {
    console.info("[CC] 🗄️  Chế độ SQL Server API →", CC_API_URL);
    // Kiểm tra server có đang chạy không
    fetch(CC_API_URL + "/api/health")
      .then((r) => r.json())
      .then(() => console.info("[CC] ✅ API server kết nối thành công"))
      .catch(() =>
        console.error(
          "[CC] ❌ Không thể kết nối API server tại",
          CC_API_URL,
          "\n    Kiểm tra: cd server → npm start",
        ),
      );
    return;
  }

  if (!CC_USE_FIREBASE) {
    console.info("[CC] 🔵 Chế độ localStorage (offline).");
    return;
  }

  if (typeof firebase === "undefined") {
    console.error("[CC] ❌ Firebase SDK chưa được load.");
    return;
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(CC_FIREBASE_CONFIG);
    const _db = firebase.firestore();
    const _auth = firebase.auth();
    _db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
    window._ccFirestore = _db;
    window._ccAuth = _auth;
    document.dispatchEvent(
      new CustomEvent("cc:firebase-ready", {
        detail: { db: _db, auth: _auth },
      }),
    );
    console.info("[CC] 🔥 Firebase khởi tạo thành công ✓");
  } catch (e) {
    console.error("[CC] ❌ Firebase init lỗi:", e.message);
  }
})();
