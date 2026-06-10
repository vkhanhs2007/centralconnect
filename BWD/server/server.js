'use strict';
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');
const path    = require('path');
const https   = require('https');

const app  = express();
const PORT = process.env.PORT || 3000;
const GROQ_KEY   = process.env.GROQ_KEY   || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Serve frontend static files (production)
app.use(express.static(path.join(__dirname, '..')));

const dbConfig = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'CentralConnect',
  charset:  'utf8mb4',
  waitForConnections: true,
  connectionLimit:    10
};

let pool;
async function getPool() {
  if (!pool) pool = mysql.createPool(dbConfig);
  return pool;
}

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ════════════════════════════════════════════════════════════════
//  USERS
// ════════════════════════════════════════════════════════════════
app.post('/api/users', wrap(async (req, res) => {
  const { uid, email, displayName, initials, points, prefs, fromLocation, phone, provider, photoURL } = req.body;
  if (!uid || !email) return res.status(400).json({ error: 'uid và email là bắt buộc' });

  const db = await getPool();
  await db.query(
    `INSERT INTO users (uid, email, displayName, initials, points, prefs, fromLocation, phone, provider, photoURL)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       email=VALUES(email), displayName=VALUES(displayName), initials=VALUES(initials),
       points=VALUES(points), prefs=VALUES(prefs), fromLocation=VALUES(fromLocation),
       phone=VALUES(phone), provider=VALUES(provider), photoURL=VALUES(photoURL), updatedAt=NOW()`,
    [uid, email, displayName||'', initials||'', points??100,
     JSON.stringify(prefs||[]), fromLocation||'', phone||'', provider||'email', photoURL||'']
  );
  res.json({ ok: true });
}));

app.get('/api/users/by-email/:email', wrap(async (req, res) => {
  const db = await getPool();
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [req.params.email]);
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy user' });
  const user = rows[0];
  try { user.prefs = JSON.parse(user.prefs || '[]'); } catch { user.prefs = []; }
  res.json(user);
}));

app.get('/api/users/:uid', wrap(async (req, res) => {
  const db = await getPool();
  const [rows] = await db.query('SELECT * FROM users WHERE uid = ?', [req.params.uid]);
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy user' });
  const user = rows[0];
  try { user.prefs = JSON.parse(user.prefs || '[]'); } catch { user.prefs = []; }
  res.json(user);
}));

// ════════════════════════════════════════════════════════════════
//  ĐỊA ĐIỂM DU LỊCH
// ════════════════════════════════════════════════════════════════
app.get('/api/places', wrap(async (req, res) => {
  const db = await getPool();
  const where = []; const params = [];
  if (req.query.province) { where.push('province = ?'); params.push(req.query.province); }
  if (req.query.type)     { where.push('type = ?');     params.push(req.query.type); }
  const cond = where.length ? ' WHERE ' + where.join(' AND ') : '';
  const [rows] = await db.query('SELECT * FROM places' + cond + ' ORDER BY rating DESC', params);
  res.json(rows);
}));

// ════════════════════════════════════════════════════════════════
//  ẨM THỰC
// ════════════════════════════════════════════════════════════════
app.get('/api/foods', wrap(async (req, res) => {
  const db = await getPool();
  const where = []; const params = [];
  if (req.query.cat) { where.push('cat = ?'); params.push(req.query.cat); }
  const cond = where.length ? ' WHERE ' + where.join(' AND ') : '';
  const [rows] = await db.query('SELECT * FROM foods' + cond + ' ORDER BY rating DESC', params);
  const result = rows.map(r => { try { r.menu = JSON.parse(r.menu || '[]'); } catch { r.menu = []; } return r; });
  res.json(result);
}));

// ════════════════════════════════════════════════════════════════
//  SỰ KIỆN
// ════════════════════════════════════════════════════════════════
app.get('/api/events', wrap(async (req, res) => {
  const db = await getPool();
  const [rows] = await db.query(
    'SELECT * FROM events WHERE cat IS NOT NULL ORDER BY eventDate ASC'
  );
  const result = rows.map(r => {
    try { r.tags = JSON.parse(r.tags || '[]'); } catch { r.tags = []; }
    return r;
  });
  res.json(result);
}));

// ════════════════════════════════════════════════════════════════
//  ĐIỂM HẠT BÀU
// ════════════════════════════════════════════════════════════════
app.post('/api/points', wrap(async (req, res) => {
  const { uid, displayName, amount, reason } = req.body;
  if (!uid || !amount) return res.status(400).json({ error: 'uid và amount là bắt buộc' });

  const db = await getPool();
  const [check] = await db.query('SELECT uid FROM users WHERE uid = ?', [uid]);
  if (!check.length) return res.status(403).json({ error: 'Người dùng không tồn tại' });

  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    await conn.query('UPDATE users SET points = points + ?, updatedAt = NOW() WHERE uid = ?', [amount, uid]);
    await conn.query(
      'INSERT INTO points_log (uid, displayName, amount, reason) VALUES (?, ?, ?, ?)',
      [uid, displayName||'', amount, reason||'']
    );
    await conn.commit();
    const [r] = await db.query('SELECT points FROM users WHERE uid = ?', [uid]);
    res.json({ ok: true, points: r[0]?.points ?? 0 });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// ════════════════════════════════════════════════════════════════
//  BẢNG XẾP HẠNG
// ════════════════════════════════════════════════════════════════
app.get('/api/leaderboard', wrap(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '10'), 50);
  const db = await getPool();
  const [rows] = await db.query(
    'SELECT uid, displayName, initials, points FROM users ORDER BY points DESC LIMIT ?',
    [limit]
  );
  res.json(rows);
}));

// ════════════════════════════════════════════════════════════════
//  CHECK-IN
// ════════════════════════════════════════════════════════════════
app.post('/api/checkins', wrap(async (req, res) => {
  const { placeId, placeName, uid, displayName } = req.body;
  if (!placeId || !uid) return res.status(400).json({ error: 'placeId và uid là bắt buộc' });

  const db = await getPool();
  const [exists] = await db.query(
    'SELECT 1 FROM checkins WHERE placeId = ? AND uid = ?', [placeId, uid]
  );
  if (exists.length) return res.json({ ok: false, already: true });

  await db.query(
    'INSERT INTO checkins (placeId, placeName, uid, displayName) VALUES (?, ?, ?, ?)',
    [placeId, placeName||'', uid, displayName||'']
  );
  res.json({ ok: true, already: false });
}));

// ════════════════════════════════════════════════════════════════
//  CÂU CHUYỆN CỘNG ĐỒNG
// ════════════════════════════════════════════════════════════════
app.get('/api/stories', wrap(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '20'), 100);
  const db = await getPool();
  const [rows] = await db.query(
    'SELECT * FROM stories ORDER BY timestamp DESC LIMIT ?', [limit]
  );
  const result = rows.map(r => {
    try { r.tags = JSON.parse(r.tags || '[]'); } catch { r.tags = []; }
    return r;
  });
  res.json(result);
}));

app.post('/api/stories', wrap(async (req, res) => {
  const { title, content, place, tags, authorName, authorUid, initials } = req.body;
  if (!content) return res.status(400).json({ error: 'content là bắt buộc' });

  const db = await getPool();
  const [r] = await db.query(
    'INSERT INTO stories (title, content, place, tags, authorName, authorUid, initials) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title||'', content, place||'', JSON.stringify(tags||[]), authorName||'', authorUid||null, initials||'']
  );
  res.json({ ok: true, id: r.insertId });
}));

app.post('/api/stories/:id/like', wrap(async (req, res) => {
  const storyId = parseInt(req.params.id);
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid là bắt buộc' });

  const db = await getPool();
  const [dup] = await db.query(
    'SELECT 1 FROM story_likes WHERE storyId = ? AND uid = ?', [storyId, uid]
  );
  if (dup.length) return res.json({ ok: false, already: true });

  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    await conn.query('INSERT INTO story_likes (storyId, uid) VALUES (?, ?)', [storyId, uid]);
    await conn.query('UPDATE stories SET likes = likes + 1 WHERE id = ?', [storyId]);
    await conn.commit();
    const [r] = await db.query('SELECT likes FROM stories WHERE id = ?', [storyId]);
    res.json({ ok: true, likes: r[0]?.likes ?? 0 });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// ════════════════════════════════════════════════════════════════
//  DỰ ÁN GÂY QUỸ
// ════════════════════════════════════════════════════════════════
app.get('/api/projects', wrap(async (req, res) => {
  const db = await getPool();
  const [rows] = await db.query('SELECT * FROM projects ORDER BY createdAt DESC');
  res.json(rows);
}));

app.get('/api/projects/:id', wrap(async (req, res) => {
  const db = await getPool();
  const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy dự án' });
  res.json(rows[0]);
}));

app.post('/api/donations', wrap(async (req, res) => {
  const { projectId, amount, uid, displayName } = req.body;
  if (!projectId || !amount) return res.status(400).json({ error: 'projectId và amount là bắt buộc' });

  const db = await getPool();
  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    await conn.query(
      'INSERT INTO donations (projectId, amount, uid, displayName) VALUES (?, ?, ?, ?)',
      [projectId, amount, uid||null, displayName||'']
    );
    await conn.query(
      'UPDATE projects SET raised = raised + ?, updatedAt = NOW() WHERE id = ?',
      [amount, projectId]
    );
    await conn.commit();
    const [r] = await db.query('SELECT raised, goal FROM projects WHERE id = ?', [projectId]);
    res.json({ ok: true, raised: r[0]?.raised, goal: r[0]?.goal });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// ════════════════════════════════════════════════════════════════
//  SỰ KIỆN & ĐĂNG KÝ
// ════════════════════════════════════════════════════════════════
app.post('/api/rsvps', wrap(async (req, res) => {
  const { eventId, eventName, uid, displayName } = req.body;
  if (!eventId || !uid) return res.status(400).json({ error: 'eventId và uid là bắt buộc' });

  const db = await getPool();
  const [dup] = await db.query(
    'SELECT 1 FROM rsvps WHERE eventId = ? AND uid = ?', [eventId, uid]
  );
  if (dup.length) return res.json({ ok: false, already: true });

  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    await conn.query(
      'INSERT INTO rsvps (eventId, eventName, uid, displayName) VALUES (?, ?, ?, ?)',
      [eventId, eventName||'', uid, displayName||'']
    );
    await conn.query('UPDATE events SET attendees = attendees + 1 WHERE id = ?', [eventId]);
    await conn.commit();
    res.json({ ok: true, already: false });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// ════════════════════════════════════════════════════════════════
//  THỐNG KÊ TỔNG QUAN
// ════════════════════════════════════════════════════════════════
app.get('/api/stats', wrap(async (req, res) => {
  const db = await getPool();
  const [[m]] = await db.query('SELECT COUNT(*) AS cnt FROM users');
  const [[s]] = await db.query('SELECT COUNT(*) AS cnt FROM stories');
  const [[c]] = await db.query('SELECT COUNT(*) AS cnt FROM checkins');
  const [[d]] = await db.query('SELECT IFNULL(SUM(amount), 0) AS total FROM donations');
  res.json({ members: m.cnt, stories: s.cnt, checkins: c.cnt, totalDonated: d.total });
}));

// ════════════════════════════════════════════════════════════════
//  XÁC THỰC OTP (in-memory store, 5 phút hết hạn)
//  Để gửi email thật: npm install nodemailer, cấu hình .env
//  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
// ════════════════════════════════════════════════════════════════
const otpStore = new Map(); // key: `type:email` → { otp, exp }

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(to, otp, subject) {
  // Nếu có nodemailer + SMTP config thì gửi email thật
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to, subject,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0D1018;padding:32px;border-radius:12px;color:#F5F0E8;">
          <h2 style="color:#C9A84C;font-family:Georgia,serif;">CENTRAL CONNECT</h2>
          <p>Mã xác thực của bạn là:</p>
          <div style="font-size:36px;font-weight:900;letter-spacing:12px;color:#4A90D9;margin:20px 0;">${otp}</div>
          <p style="color:#8A7D6E;font-size:13px;">Mã có hiệu lực trong 5 phút. Không chia sẻ mã này với ai.</p>
        </div>`
      });
      return true;
    } catch (e) {
      console.error('[SMTP Error]', e.message);
    }
  }
  // Fallback: log ra console (dev mode)
  console.log(`[OTP Dev] ${to} → ${otp}`);
  return false;
}

// POST /api/auth/send-register-otp
app.post('/api/auth/send-register-otp', wrap(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email không hợp lệ' });
  }
  const otp = generateOtp();
  otpStore.set(`register:${email}`, { otp, exp: Date.now() + 5 * 60 * 1000 });
  const sent = await sendOtpEmail(email, otp, 'Mã xác thực đăng ký – Central Connect');
  const resp = { ok: true };
  if (!sent) resp.devOtp = otp; // trả về mã OTP nếu chưa cấu hình SMTP (dev mode)
  res.json(resp);
}));

// POST /api/auth/send-reset-otp
app.post('/api/auth/send-reset-otp', wrap(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email không hợp lệ' });
  }
  const db = await getPool();
  const [rows] = await db.query('SELECT 1 FROM users WHERE email = ? LIMIT 1', [email]);
  if (!rows.length) return res.status(404).json({ error: 'Email chưa đăng ký tài khoản' });

  const otp = generateOtp();
  otpStore.set(`reset:${email}`, { otp, exp: Date.now() + 5 * 60 * 1000 });
  const sent = await sendOtpEmail(email, otp, 'Mã đặt lại mật khẩu – Central Connect');
  const resp = { ok: true };
  if (!sent) resp.devOtp = otp;
  res.json(resp);
}));

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', wrap(async (req, res) => {
  const { email, otp, type } = req.body; // type: 'register' | 'reset'
  const key = `${type || 'register'}:${email}`;
  const record = otpStore.get(key);
  if (!record || record.otp !== String(otp) || Date.now() > record.exp) {
    return res.status(400).json({ ok: false, error: 'Mã OTP không đúng hoặc đã hết hạn' });
  }
  otpStore.delete(key);
  res.json({ ok: true });
}));

// POST /api/auth/register  (hoàn tất đăng ký sau OTP)
app.post('/api/auth/register', wrap(async (req, res) => {
  const { uid, email, displayName, initials, password, prefs, fromLocation, phone } = req.body;
  if (!email || !displayName) return res.status(400).json({ error: 'email và displayName là bắt buộc' });

  const db = await getPool();
  const finalUid = uid || ('local-' + Date.now());
  await db.query(
    `INSERT INTO users (uid, email, displayName, initials, points, prefs, fromLocation, phone, provider)
     VALUES (?, ?, ?, ?, 100, ?, ?, ?, 'email')
     ON DUPLICATE KEY UPDATE displayName=VALUES(displayName), updatedAt=NOW()`,
    [finalUid, email, displayName, initials || '', JSON.stringify(prefs || []), fromLocation || '', phone || '']
  );
  res.json({ ok: true, uid: finalUid });
}));

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', wrap(async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ error: 'email và newPassword là bắt buộc' });
  // Nếu dùng Firebase Auth thì mật khẩu được quản lý bởi Firebase, không lưu ở DB
  // Đây chỉ là marker cho localStorage fallback mode
  res.json({ ok: true, message: 'Mật khẩu đã được đặt lại (Firebase/local mode)' });
}));

// ════════════════════════════════════════════════════════════════
//  AI PROXY — giữ GROQ_KEY an toàn phía server
// ════════════════════════════════════════════════════════════════
app.post('/api/ai', wrap(async (req, res) => {
  if (!GROQ_KEY) return res.status(503).json({ error: 'AI chưa được cấu hình trên server' });

  const { messages, max_tokens = 800 } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages là bắt buộc' });
  }

  const payload = JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.7, max_tokens });

  const result = await new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    const req2 = https.request(opts, r => {
      let body = '';
      r.on('data', d => body += d);
      r.on('end', () => {
        try { resolve({ status: r.statusCode, data: JSON.parse(body) }); }
        catch { reject(new Error('Invalid JSON from Groq')); }
      });
    });
    req2.on('error', reject);
    req2.write(payload);
    req2.end();
  });

  if (result.status !== 200) {
    return res.status(result.status).json({ error: result.data?.error?.message || 'Groq API error' });
  }
  const content = result.data?.choices?.[0]?.message?.content || '';
  res.json({ content });
}));

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[API Error]', err.message);
  res.status(500).json({ error: err.message || 'Lỗi server' });
});

// ── Khởi động server ─────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🚀 Central Connect API đang chạy tại http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
  try {
    const p = await getPool();
    await p.query('SELECT 1');
    console.log('[DB] ✅ Kết nối MySQL thành công');
  } catch (e) {
    console.error('[DB] ❌ Không thể kết nối MySQL:', e.message);
    console.error('    Kiểm tra lại .env và đảm bảo MySQL đang chạy.\n');
  }
});
