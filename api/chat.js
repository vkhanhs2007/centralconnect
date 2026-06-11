// Vercel Serverless Function — POST /api/chat
// Biến môi trường cần thêm trên Vercel Dashboard:
//   GROQ_API_KEY = gsk_xxxxxxxxxxxxxxxxxxxx
// (Settings > Environment Variables > Add > Save > Redeploy)

const https = require('https');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Đọc API key — hỗ trợ cả hai tên biến
  const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROQ_KEY || '';
  if (!GROQ_API_KEY) {
    return res.status(503).json({
      error: 'GROQ_API_KEY chưa được cấu hình trên Vercel.'
    });
  }

  // Parse body
  const { messages, max_tokens = 800 } = req.body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Thiếu trường messages' });
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const payload = JSON.stringify({
    model,
    messages,
    temperature: 0.7,
    max_tokens: Math.min(Number(max_tokens) || 800, 4096)
  });

  // Gọi Groq API bằng https (không cần fetch global)
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY,
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
            const msg = data?.error?.message || ('Groq lỗi ' + groqRes.statusCode);
            res.status(groqRes.statusCode).json({ error: msg });
          } else {
            // Trả về { content: "..." } — frontend đọc data.content
            const content = data.choices?.[0]?.message?.content || '';
            res.status(200).json({ content });
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
      res.status(504).json({ error: 'Groq timeout' });
      resolve();
    });

    groqReq.write(payload);
    groqReq.end();
  });
};
