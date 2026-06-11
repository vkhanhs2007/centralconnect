const https = require("https");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "API chat is running" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROQ_KEY || "";

  if (!GROQ_API_KEY) {
    return res.status(503).json({
      error: "Chưa cấu hình GROQ_API_KEY trên Vercel.",
    });
  }

  const body = req.body || {};
  let messages = body.messages;

  if (!messages && body.message) {
    messages = [
      {
        role: "user",
        content: body.message,
      },
    ];
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: "Thiếu message hoặc messages",
    });
  }

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const maxTokens = Math.min(parseInt(body.max_tokens) || 800, 4096);

  const payload = JSON.stringify({
    model,
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GROQ_API_KEY,
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const groqReq = https.request(options, (groqRes) => {
      let responseBody = "";

      groqRes.on("data", (chunk) => {
        responseBody += chunk;
      });

      groqRes.on("end", () => {
        try {
          const data = JSON.parse(responseBody);

          if (groqRes.statusCode !== 200) {
            return res.status(groqRes.statusCode).json({
              error: data?.error?.message || "Groq API lỗi",
            });
          }

          const aiText = data.choices?.[0]?.message?.content || "";

          return res.status(200).json({
            reply: aiText,
            content: aiText,
          });
        } catch (error) {
          return res.status(500).json({
            error: "Groq trả về dữ liệu không hợp lệ",
          });
        } finally {
          resolve();
        }
      });
    });

    groqReq.on("error", (err) => {
      res.status(500).json({
        error: "Lỗi kết nối Groq: " + err.message,
      });
      resolve();
    });

    groqReq.setTimeout(25000, () => {
      groqReq.destroy();
      res.status(504).json({
        error: "Groq timeout, thử lại sau.",
      });
      resolve();
    });

    groqReq.write(payload);
    groqReq.end();
  });
};
