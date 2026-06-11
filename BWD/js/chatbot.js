(function () {
  const ROOT = window.location.href.includes('/pages/') ? '../' : '';
  // API_BASE: localhost khi dev, rỗng (relative) khi production
  const API_BASE = (typeof CC_API_URL !== 'undefined')
    ? CC_API_URL
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000' : '');
  const HAS_KEY = true; // key được giữ an toàn trên server

  // Tri thức nền về di sản Đà Nẵng (dùng khi không có API)
  const KB = {
    'ngũ hành sơn': 'Ngũ Hành Sơn là quần thể 5 ngọn núi đá cẩm thạch nổi tiếng ở Đà Nẵng. Tên 5 núi là Kim, Mộc, Thủy, Hỏa, Thổ — biểu trưng cho Ngũ Hành. Đây là di tích cấp quốc gia đặc biệt với nhiều hang động, chùa chiền cổ. Từ VKU chỉ 3km, đi khoảng 8 phút.',
    'hội an': 'Hội An là phố cổ thuộc Đà Nẵng (khu vực tỉnh Quảng Nam cũ), được UNESCO công nhận Di sản Văn hóa Thế giới năm 1999. Nổi tiếng với kiến trúc giao thoa Việt - Hoa - Nhật, đèn lồng rực rỡ và các làng nghề truyền thống. Vé tham quan phố cổ là 120.000đ.',
    'mỹ sơn': 'Thánh địa Mỹ Sơn là quần thể đền tháp Chăm Pa 4-14 thế kỷ, Di sản Thế giới UNESCO từ năm 1999. Cách Hội An 40km. Đây là trung tâm tôn giáo của vương quốc Chăm Pa cổ đại.',
    'bà nà': 'Bà Nà Hills là khu du lịch trên đỉnh núi Bà Nà cao 1.487m. Nổi tiếng với Cầu Vàng (tay khổng lồ đỡ cầu), Làng Pháp và Fantasy Park. Cáp treo Bà Nà giữ nhiều kỷ lục thế giới.',
    'mỹ khê': 'Biển Mỹ Khê là bãi biển đẹp nhất Đà Nẵng, lọt top 6 bãi biển hấp dẫn nhất châu Á theo tạp chí Forbes. Cát trắng mịn, nước trong xanh, sóng lý tưởng để lướt ván.',
    'sơn trà': 'Bán đảo Sơn Trà là "lá phổi xanh" của Đà Nẵng với rừng nguyên sinh, đàn voọc chà vá chân nâu quý hiếm và chùa Linh Ứng với tượng Phật Bà cao 67m nhìn ra biển.',
    'ẩm thực': 'Đặc sản Đà Nẵng: Mì Quảng, Bún bò, Bánh tráng cuốn thịt heo, Bánh xèo, Cơm hến. Đặc sản Hội An: Cao Lầu, Cơm gà phố Hội, Bánh mì Phượng. Hải sản tươi ngon ở đường Võ Nguyên Giáp.',
    'vku': 'Trường Đại học Công nghệ VKU (Vietnam-Korea University of Information and Communication Technology) nằm ở Quận Ngũ Hành Sơn, Đà Nẵng. Trường do Chính phủ Hàn Quốc hỗ trợ đầu tư, đào tạo các ngành CNTT và Điện tử - Viễn thông.',
    'gây quỹ': 'Central Connect có hệ thống gây quỹ bảo tồn di sản. Mỗi lần check-in tại địa điểm di sản, bạn tích điểm "Hạt Bàu". Điểm có thể đổi voucher hoặc đóng góp trực tiếp vào quỹ phục dựng di tích.',
    'lịch trình': 'AI lịch trình của Central Connect có thể tạo kế hoạch du lịch cá nhân hóa theo số ngày, điểm xuất phát và sở thích. Hỗ trợ từ 1–5 ngày, tích hợp thời gian di chuyển thực tế.'
  };

  function getLocalAnswer(q) {
    const lower = q.toLowerCase();
    for (const [key, val] of Object.entries(KB)) {
      if (lower.includes(key)) return val;
    }
    return null;
  }

  // Inject HTML vào body
  function injectChatbot() {
    // Tránh inject hai lần
    if (document.getElementById('ai-chat-btn')) return;

    // Link CSS
    if (!document.querySelector('link[href*="chatbot.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = ROOT + 'css/chatbot.css';
      document.head.appendChild(link);
    }

    document.body.insertAdjacentHTML('beforeend', `
    <!-- AI CHATBOT BUTTON -->
    <button id="ai-chat-btn" title="Hỏi AI về di sản" aria-label="Mở chatbot AI">
      🤖
      <div class="chat-badge">AI</div>
    </button>

    <!-- AI CHAT WINDOW -->
    <div id="ai-chat-window" role="dialog" aria-label="Chatbot AI di sản">
      <div class="chat-header">
        <div class="chat-header-avatar">🏛</div>
        <div class="chat-header-info">
          <div class="chat-header-name">Central AI · Di sản số</div>
          <div class="chat-header-status">
            <div class="chat-status-dot"></div>
            Sẵn sàng tư vấn 24/7
          </div>
        </div>
        <button class="chat-close-btn" id="chatCloseBtn" aria-label="Đóng chatbot">✕</button>
      </div>

      <div class="chat-messages" id="chatMessages">
        <!-- Welcome message -->
        <div class="msg ai">
          <div class="msg-avatar">🏛</div>
          <div class="msg-bubble">
            Xin chào! Tôi là <strong>Central AI</strong> — trợ lý di sản số của bạn. 👋<br><br>
            Hỏi tôi về <em>Ngũ Hành Sơn, Hội An, Mỹ Sơn, ẩm thực địa phương</em> hoặc bất kỳ điều gì về hành trình của bạn!
          </div>
        </div>
      </div>

      <div class="chat-chips" id="chatChips">
        <button class="chat-chip" onclick="sendChip(this)">🗿 Ngũ Hành Sơn</button>
        <button class="chat-chip" onclick="sendChip(this)">🏮 Hội An</button>
        <button class="chat-chip" onclick="sendChip(this)">🍜 Ẩm thực đặc sản</button>
        <button class="chat-chip" onclick="sendChip(this)">🗓 Lịch trình AI</button>
      </div>

      <div class="chat-input-bar">
        <input
          class="chat-input" id="chatInput"
          type="text"
          placeholder="Hỏi về di sản Đà Nẵng..."
          maxlength="300"
          autocomplete="off"
        />
        <button class="chat-send-btn" id="chatSendBtn" title="Gửi">➤</button>
      </div>
    </div>
    `);

    // Events
    document.getElementById('ai-chat-btn').addEventListener('click', toggleChat);
    document.getElementById('chatCloseBtn').addEventListener('click', closeChat);
    document.getElementById('chatSendBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }

  let isOpen = false;

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    isOpen = true;
    document.getElementById('ai-chat-window').classList.add('open');
    document.getElementById('chatInput').focus();
    // Ẩn badge
    const badge = document.querySelector('.chat-badge');
    if (badge) badge.style.display = 'none';
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('ai-chat-window').classList.remove('open');
  }

  function sendChip(btn) {
    const text = btn.textContent.replace(/^[^\w\u00C0-\u024F\u1E00-\u1EFF\u0100-\u017F]+/, '').trim();
    document.getElementById('chatInput').value = text;
    sendMessage();
  }
  window.sendChip = sendChip;

  async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text  = input.value.trim();
    if (!text) return;

    input.value = '';
    document.getElementById('chatSendBtn').disabled = true;

    addMessage('user', text);
    showTyping();

    let reply;
    if (HAS_KEY) {
      reply = await callGemini(text);
    } else {
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      const local = getLocalAnswer(text);
      reply = local || 'Xin lỗi, tôi chưa có thông tin về chủ đề này. Hãy thử hỏi về Ngũ Hành Sơn, Hội An, Mỹ Sơn hoặc ẩm thực Đà Nẵng nhé! 😊';
    }

    hideTyping();
    addMessage('ai', reply);
    document.getElementById('chatSendBtn').disabled = false;
    input.focus();
  }

  async function callGemini(userMsg) {
    const systemCtx = `Bạn là Central AI, trợ lý du lịch và di sản văn hóa của nền tảng Central Connect tại Đà Nẵng, Việt Nam.
Nhiệm vụ: tư vấn về các địa điểm di sản (Ngũ Hành Sơn, Hội An, Mỹ Sơn, Bà Nà Hills, Sơn Trà...), ẩm thực địa phương, lịch trình du lịch và văn hóa miền Trung.
Phong cách: thân thiện, ngắn gọn (2-4 câu), có dùng emoji phù hợp. Trả lời bằng tiếng Việt.
Nếu câu hỏi ngoài phạm vi du lịch Đà Nẵng, hãy lịch sự hướng dẫn người dùng quay lại chủ đề.`;

    try {
      const res = await fetch(API_BASE + '/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemCtx },
            { role: 'user', content: userMsg }
          ],
          max_tokens: 300
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Lỗi cấu hình key → hiển thị rõ, không dùng fallback chung chung
        if (res.status === 503) return '⚙️ AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.';
        if (res.status === 401 || res.status === 403) return '🔑 API key không hợp lệ. Cần cập nhật GROQ_KEY.';
        return '⚠️ AI lỗi tạm thời (' + res.status + '). ' + (data.error || 'Hãy thử lại sau!');
      }
      return data.content || 'Xin lỗi, tôi gặp lỗi khi xử lý. Hãy thử lại nhé!';
    } catch (err) {
      const local = getLocalAnswer(userMsg);
      if (local) return '📚 ' + local;
      return '🔌 Kết nối AI gián đoạn. Hãy thử hỏi về Ngũ Hành Sơn, Hội An hoặc ẩm thực Đà Nẵng!';
    }
  }

  function addMessage(role, text) {
    const msgs = document.getElementById('chatMessages');
    const div  = document.createElement('div');
    div.className = 'msg ' + role;
    div.innerHTML = `
      <div class="msg-avatar">${role === 'ai' ? '🏛' : '👤'}</div>
      <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  let typingEl = null;
  function showTyping() {
    const msgs = document.getElementById('chatMessages');
    typingEl = document.createElement('div');
    typingEl.className = 'msg ai';
    typingEl.id = 'typingMsg';
    typingEl.innerHTML = `
      <div class="msg-avatar">🏛</div>
      <div class="msg-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    msgs.appendChild(typingEl);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('typingMsg');
    if (el) el.remove();
  }

  // Khởi động khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectChatbot);
  } else {
    injectChatbot();
  }
})();