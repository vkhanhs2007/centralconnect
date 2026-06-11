// Vercel Serverless Function — /api/ai
// Dùng https module (built-in) để tương thích mọi Node.js version, không cần fetch global

const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Hỗ trợ cả GROQ_KEY lẫn GROQ_API_KEY
  const GROQ_KEY = process.env.GROQ_KEY || process.env.GROQ_API_KEY || '';
  if (!GROQ_KEY) {
    return res.status(503).json({
      error: 'GROQ_KEY chưa được cấu hình. Vào Vercel Dashboard > Settings > Environment Variables, thêm GROQ_KEY rồi Redeploy.'
    });
  }

  const { messages, max_tokens = 800 } = req.body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages là bắt buộc và phải là mảng không rỗng' });
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const payload = JSON.stringify({
    model,
    messages,
    temperature: 0.7,
    max_tokens: Math.min(max_tokens, 4096)
  });

  return new Promise((resolve) => {
    const opts = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const groqReq = https.request(opts, (groqRes) => {
      let body = '';
      groqRes.on('data', chunk => { body += chunk; });
      groqRes.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (groqRes.statusCode !== 200) {
            const msg = data?.error?.message || ('Groq API lỗi ' + groqRes.statusCode);
            res.status(groqRes.statusCode).json({ error: msg });
          } else {
            const content = data.choices?.[0]?.message?.content || '';
            res.json({ content });
          }
        } catch {
          res.status(500).json({ error: 'Groq trả về dữ liệu không hợp lệ' });
        }
        resolve();
      });
    });

    groqReq.on('error', (err) => {
      res.status(500).json({ error: 'Không kết nối được Groq: ' + (err.message || 'Network error') });
      resolve();
    });

    groqReq.setTimeout(25000, () => {
      groqReq.destroy();
      res.status(504).json({ error: 'Groq API timeout (>25s)' });
      resolve();
    });

    groqReq.write(payload);
    groqReq.end();
  });
};
