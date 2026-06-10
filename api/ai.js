// Vercel Serverless Function — /api/ai
// GROQ_KEY được đặt trong Vercel Dashboard > Settings > Environment Variables

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GROQ_KEY = process.env.GROQ_KEY;
  if (!GROQ_KEY) return res.status(503).json({ error: 'AI chưa được cấu hình. Thêm GROQ_KEY vào Vercel Environment Variables.' });

  const { messages, max_tokens = 800 } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages là bắt buộc' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        messages,
        temperature: 0.7,
        max_tokens
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({ error: errData?.error?.message || 'Groq API lỗi' });
    }

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content || '';
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi server' });
  }
};
