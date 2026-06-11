// Vercel Serverless Function — POST /api/chat
// Biến môi trường cần thêm trên Vercel:
//   GROQ_API_KEY  (bắt buộc) — lấy tại console.groq.com
//   GROQ_MODEL    (tuỳ chọn) — mặc định: llama-3.1-8b-instant

const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROQ_KEY || '';
  if (!GROQ_API_KEY) {
    return res.status(503).json({
      error: 'Chưa cấu hình GROQ_API_KEY trên Vercel Environment Variables.'
    });
  }

  const { messages, max_tokens } = req.body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Thiếu trường messages' });
  }

  const model   = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const tokens  = Math.min(parseInt(max_tokens) || 800, 4096);
  const payload = JSON.stringify({ model, messages, temperature: 0.7, max_tokens: tokens });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  'Bearer ' + GROQ_API_KEY,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const groqReq = https.request(options, (groqRes) => {
      let body = '';
      groqRes.on('data', chunk => { body += chunk; });
      groqRes.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (groqRes.statusCode !== 200) {
            res.status(groqRes.statusCode).json({
              error: data?.error?.message || ('Groq lỗi HTTP ' + groqRes.statusCode)
            });
          } else {
            res.status(200).json({
              content: data.choices?.[0]?.message?.content || ''
            });
          }
        } catch {
          res.status(500).json({ error: 'Groq trả về dữ liệu không hợp lệ' });
        }
        resolve();
      });
    });

    groqReq.on('error', (err) => {
      res.status(500).json({ error: 'Lỗi kết nối Groq: ' + (err.message || 'unknown') });
      resolve();
    });

    groqReq.setTimeout(25000, () => {
      groqReq.destroy();
      res.status(504).json({ error: 'Groq timeout (>25s), thử lại sau.' });
      resolve();
    });

    groqReq.write(payload);
    groqReq.end();
  });
};
