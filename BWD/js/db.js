/**
 * db.js — Central Connect Data Layer v3.0
 * ─────────────────────────────────────────────────────────────────────
 * Hỗ trợ 3 chế độ (ưu tiên từ cao đến thấp):
 *   1. CC_USE_API = true     → REST API (Node.js + SQL Server)
 *   2. CC_USE_FIREBASE = true → Firebase Firestore
 *   3. Mặc định             → localStorage (offline)
 *
 * API toàn cục: window.ccDB
 * ─────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // ══ Helpers localStorage ══════════════════════════════════════════
  function lsGet(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
  }

  // ══ BroadcastChannel (đồng bộ qua các tab) ═══════════════════════
  let _bc;
  try { _bc = new BroadcastChannel('cc-data-sync'); } catch { _bc = null; }
  function broadcast(type, payload) {
    if (_bc) _bc.postMessage({ type, payload, ts: Date.now() });
  }
  if (_bc) {
    _bc.onmessage = ({ data }) => {
      if (data.type === 'points') {
        const el = document.getElementById('userPoints');
        if (el) el.textContent = '🌾 ' + data.payload;
      }
      if (data.type === 'auth-change') {
        // reload nav state
        if (typeof applyNavigationState === 'function') applyNavigationState();
      }
    };
  }

  // ══ makeInitials (shared util) ════════════════════════════════════
  function makeInitials(name) {
    if (!name) return 'TK';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }
  window.ccMakeInitials = makeInitials;

  // ══ Server timestamp helper ═══════════════════════════════════════
  function serverTs() {
    return (typeof firebase !== 'undefined' && typeof CC_USE_FIREBASE !== 'undefined' && CC_USE_FIREBASE)
      ? firebase.firestore.FieldValue.serverTimestamp()
      : Date.now();
  }
  function increment(n) {
    return (typeof firebase !== 'undefined' && typeof CC_USE_FIREBASE !== 'undefined' && CC_USE_FIREBASE)
      ? firebase.firestore.FieldValue.increment(n)
      : n;
  }

  // ══ Firestore reference (lazy) ════════════════════════════════════
  function db() { return window._ccFirestore || null; }

  // ══ API mode helpers ══════════════════════════════════════════════
  function useApi() {
    return typeof CC_USE_API !== 'undefined' && CC_USE_API === true;
  }

  async function apiCall(method, path, body) {
    const base = (typeof CC_API_URL !== 'undefined' ? CC_API_URL : 'http://localhost:3000');
    const url  = base + '/api' + path;
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error('[API ' + res.status + '] ' + txt);
    }
    return res.json();
  }

  // ══ Polling helper cho "real-time" khi dùng API mode ═════════════
  function startPolling(fetchFn, callback, intervalMs) {
    let active = true;
    (async function poll() {
      try { callback(await fetchFn()); } catch { }
      if (active) setTimeout(poll, intervalMs);
    })();
    return () => { active = false; };
  }

  // ══════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════════════
  const ccDB = {

    // ── USER ────────────────────────────────────────────────────────

    /** Lưu profile người dùng (upsert) */
    async saveUser(user) {
      lsSet('cc_user', user);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', user.displayName || '');

      if (useApi() && user.uid) {
        // Call API and propagate errors so callers (UI) can react
        await apiCall('POST', '/users', {
          uid:          user.uid,
          email:        user.email,
          displayName:  user.displayName  || '',
          initials:     user.initials     || makeInitials(user.displayName),
          points:       user.points       ?? 100,
          prefs:        user.prefs        || [],
          fromLocation: user.from         || user.fromLocation || '',
          phone:        user.phone        || '',
          provider:     user.provider     || 'email',
          photoURL:     user.photoURL     || ''
        });
        broadcast('auth-change', {});
        return;
      }

      if (db() && user.uid) {
        await db().collection('users').doc(user.uid).set({
          displayName:  user.displayName,
          email:        user.email,
          initials:     user.initials || makeInitials(user.displayName),
          points:       user.points ?? 100,
          prefs:        user.prefs   || [],
          from:         user.from    || '',
          phone:        user.phone   || '',
          updatedAt:    serverTs()
        }, { merge: true });
      }
      broadcast('auth-change', {});
    },

    /** Lấy profile người dùng theo uid */
    async getUser(uid) {
      if (useApi() && uid) {
        try {
          return await apiCall('GET', '/users/' + encodeURIComponent(uid));
        } catch { }
      }
      if (db() && uid) {
        try {
          const snap = await db().collection('users').doc(uid).get();
          if (snap.exists) return { uid, ...snap.data() };
        } catch { }
      }
      return lsGet('cc_user', null);
    },

    /** Lấy user hiện tại từ localStorage (đồng bộ, không async) */
    currentUser() {
      return lsGet('cc_user', null);
    },

    /** Xóa session người dùng */
    clearUser() {
      localStorage.removeItem('cc_user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      broadcast('auth-change', {});
    },

    // ── ĐIỂM HẠT BÀU ───────────────────────────────────────────────

    /** Cộng điểm cho người dùng hiện tại */
    async addPoints(amount, reason) {
      const user = lsGet('cc_user', null);
      if (!user) throw new Error('User not logged in');

      // Thử ghi lên server trước (nếu dùng API)
      if (useApi() && user.uid) {
        try {
          const res = await apiCall('POST', '/points', {
            uid: user.uid, displayName: user.displayName, amount, reason: reason || ''
          });
          // Cập nhật user local từ server response
          if (res.points !== undefined) {
            user.points = res.points;
            lsSet('cc_user', user);
            broadcast('points', user.points);
            const el = document.getElementById('userPoints');
            if (el) el.textContent = '🌾 ' + user.points;
          }
          return res.points || user.points;
        } catch (e) {
          // API thất bại → không ghi điểm local, throw lỗi
          console.warn('[ccDB.addPoints] API failed:', e.message);
          throw e;
        }
      }

      // Fallback: Firestore hoặc localStorage
      user.points = (user.points || 0) + amount;
      lsSet('cc_user', user);
      broadcast('points', user.points);

      // Cập nhật UI ngay lập tức
      const el = document.getElementById('userPoints');
      if (el) el.textContent = '🌾 ' + user.points;

      if (db() && user.uid) {
        try {
          await db().collection('users').doc(user.uid).update({
            points: firebase.firestore.FieldValue.increment(amount)
          });
          await db().collection('points_log').add({
            uid:         user.uid,
            displayName: user.displayName,
            amount,
            reason:      reason || '',
            timestamp:   serverTs()
          });
        } catch { }
      }
      if (reason && typeof ccShowToast === 'function') ccShowToast('+' + amount + ' Hạt Bàu 🌾 · ' + reason);
      else if (reason && typeof ccShowToastMsg === 'function') ccShowToastMsg('+' + amount + ' Hạt Bàu 🌾 · ' + reason);

      return user.points;
    },

    // ── BẢNG XẾP HẠNG ──────────────────────────────────────────────

    /** Lấy bảng xếp hạng (top N) */
    async getLeaderboard(limitN = 10) {
      if (useApi()) {
        try {
          return await apiCall('GET', '/leaderboard?limit=' + limitN);
        } catch (e) { console.warn('[ccDB.getLeaderboard] API:', e.message); }
      }
      if (db()) {
        try {
          const snap = await db().collection('users')
            .orderBy('points', 'desc').limit(limitN).get();
          return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        } catch { }
      }
      // Fallback: user hiện tại + mock users
      const user = lsGet('cc_user', null);
      const mock = [
        { displayName: 'Trần Thị Hương',   points: 1240, initials: 'TH' },
        { displayName: 'Lê Minh Đức',      points: 980,  initials: 'LĐ' },
        { displayName: 'Nguyễn Thị Lan',   points: 850,  initials: 'NL' },
        { displayName: 'Phạm Thu Hà',      points: 710,  initials: 'PH' },
        { displayName: 'Hoàng Văn Tùng',   points: 630,  initials: 'HT' },
        { displayName: 'Võ Thị Thanh',     points: 550,  initials: 'VT' },
        { displayName: 'Đặng Minh Quân',   points: 420,  initials: 'ĐQ' },
        { displayName: 'Bùi Thị Ngọc',     points: 310,  initials: 'BN' },
      ];
      if (user) {
        mock.push({ displayName: user.displayName + ' ★', points: user.points, initials: user.initials, isMe: true });
        mock.sort((a, b) => b.points - a.points);
      }
      return mock.slice(0, limitN);
    },

    /** Lắng nghe bảng xếp hạng real-time (trả về unsubscribe fn) */
    onLeaderboard(callback, limitN = 10) {
      if (useApi()) {
        return startPolling(() => this.getLeaderboard(limitN), callback, 15000);
      }
      if (db()) {
        return db().collection('users')
          .orderBy('points', 'desc').limit(limitN)
          .onSnapshot(snap => {
            callback(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
          }, () => this.getLeaderboard(limitN).then(callback));
      }
      this.getLeaderboard(limitN).then(callback);
      return () => { };
    },

    // ── CHECK-IN ────────────────────────────────────────────────────

    /** Check-in địa điểm (+30 điểm), chỉ 1 lần/địa điểm */
    async checkIn(placeId, placeName) {
      const user = lsGet('cc_user', null);
      if (!user) return { success: false, reason: 'not-logged-in' };

      const key = 'cc_checkin_' + String(placeId).replace(/\s+/g, '_');
      if (localStorage.getItem(key)) return { success: false, reason: 'already' };

      if (useApi() && user.uid) {
        try {
          const res = await apiCall('POST', '/checkins', {
            placeId, placeName, uid: user.uid, displayName: user.displayName
          });
          if (res.already) return { success: false, reason: 'already' };
          
          // Thử ghi điểm; nếu thất bại, revert checkin
          try {
            await this.addPoints(30, 'Check-in: ' + placeName);
            localStorage.setItem(key, Date.now().toString());
            return { success: true };
          } catch (pointsError) {
            // Điểm ghi thất bại → return error
            return { success: false, reason: 'points-failed', error: pointsError.message };
          }
        } catch (e) { 
          return { success: false, reason: 'api-failed', error: e.message };
        }
      }

      // Fallback: Firestore hoặc localStorage
      localStorage.setItem(key, Date.now().toString());

      if (db() && user.uid) {
        try {
          await db().collection('checkins').add({
            placeId, placeName,
            uid:         user.uid,
            displayName: user.displayName,
            timestamp:   serverTs()
          });
        } catch { }
      }

      try {
        await this.addPoints(30, 'Check-in: ' + placeName);
      } catch { 
        // Nếu addPoints thất bại ở Firestore mode, vẫn return success vì đã mark checkin
        // (local fallback được ghi rồi)
      }
      return { success: true };
    },

    /** Kiểm tra đã check-in chưa */
    hasCheckedIn(placeId) {
      return !!localStorage.getItem('cc_checkin_' + placeId.replace(/\s+/g, '_'));
    },

    // ── CÂU CHUYỆN CỘNG ĐỒNG ───────────────────────────────────────

    /** Đăng câu chuyện mới */
    async submitStory({ title, content, place, tags }) {
      const user = lsGet('cc_user', null);
      if (!user) return { success: false, reason: 'not-logged-in' };

      if (useApi()) {
        try {
          const res = await apiCall('POST', '/stories', {
            title, content, place, tags: tags || [],
            authorName: user.displayName,
            authorUid:  user.uid || null,
            initials:   user.initials || makeInitials(user.displayName)
          });
          
          // Thử ghi điểm
          try {
            await this.addPoints(50, 'Chia sẻ câu chuyện cộng đồng');
            return { success: true, storyId: res.id };
          } catch (pointsError) {
            // Story đã được tạo nhưng điểm ghi thất bại → vẫn return success nhưng warn
            console.warn('[submitStory] Points failed but story created:', pointsError.message);
            return { success: true, storyId: res.id };
          }
        } catch (e) { 
          return { success: false, reason: 'api-failed', error: e.message };
        }
      }

      const story = {
        title, content, place, tags: tags || [],
        authorName: user.displayName,
        authorUid:  user.uid || null,
        initials:   user.initials || makeInitials(user.displayName),
        likes:      0,
        timestamp:  Date.now()
      };

      if (db()) {
        try {
          const ref = await db().collection('stories').add({ ...story, timestamp: serverTs() });
          try {
            await this.addPoints(50, 'Chia sẻ câu chuyện cộng đồng');
          } catch { }
          return { success: true, storyId: ref.id };
        } catch (e) {
          return { success: false, reason: 'firestore-failed', error: e.message };
        }
      }

      // localStorage fallback
      const stories = lsGet('cc_stories', []);
      story.id = 'ls_' + Date.now();
      stories.unshift(story);
      lsSet('cc_stories', stories.slice(0, 100));
      try {
        await this.addPoints(50, 'Chia sẻ câu chuyện cộng đồng');
      } catch { }
      return { success: true, storyId: story.id };
    },

    /** Lấy danh sách câu chuyện */
    async getStories(limitN = 20) {
      if (useApi()) {
        try {
          return await apiCall('GET', '/stories?limit=' + limitN);
        } catch (e) { console.warn('[ccDB.getStories] API:', e.message); }
      }
      if (db()) {
        try {
          const snap = await db().collection('stories')
            .orderBy('timestamp', 'desc').limit(limitN).get();
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch { }
      }
      return lsGet('cc_stories', []).slice(0, limitN);
    },

    /** Lắng nghe stories real-time */
    onStories(callback, limitN = 20) {
      if (useApi()) {
        return startPolling(() => this.getStories(limitN), callback, 10000);
      }
      if (db()) {
        return db().collection('stories')
          .orderBy('timestamp', 'desc').limit(limitN)
          .onSnapshot(snap => {
            callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          }, () => this.getStories(limitN).then(callback));
      }
      this.getStories(limitN).then(callback);
      return () => { };
    },

    /** Like một câu chuyện */
    async likeStory(storyId) {
      const likedKey = 'cc_liked_' + storyId;
      if (localStorage.getItem(likedKey)) return false;
      localStorage.setItem(likedKey, '1');

      const user = lsGet('cc_user', null);

      if (useApi()) {
        try {
          const res = await apiCall('POST', '/stories/' + storyId + '/like', {
            uid: user ? user.uid : 'anon_' + Date.now()
          });
          return !res.already;
        } catch (e) { console.warn('[ccDB.likeStory] API:', e.message); }
      }

      if (db()) {
        try {
          await db().collection('stories').doc(String(storyId)).update({
            likes: firebase.firestore.FieldValue.increment(1)
          });
        } catch { }
      } else {
        const stories = lsGet('cc_stories', []);
        const s = stories.find(s => s.id === storyId);
        if (s) { s.likes = (s.likes || 0) + 1; lsSet('cc_stories', stories); }
      }
      return true;
    },

    // ── GÂY QUỸ ─────────────────────────────────────────────────────

    _defaultProjects: [
      { id: 'my-son-2026',   name: 'Trùng tu Thánh địa Mỹ Sơn',   goal: 50000000, raised: 32000000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/My_Son_Sanctuary_2.jpg/640px-My_Son_Sanctuary_2.jpg',            status: 'urgent' },
      { id: 'hoian-green',   name: 'Phố cổ Hội An xanh hơn',        goal: 50000000, raised: 40500000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Hoi_An_Covered_Bridge.jpg/640px-Hoi_An_Covered_Bridge.jpg',           status: 'active' },
      { id: 'manthai-craft', name: 'Làng chài Mân Thái — hồi sinh', goal: 30000000, raised: 11000000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/My_Khe_Beach_Da_Nang.jpg/640px-My_Khe_Beach_Da_Nang.jpg', status: 'active' },
    ],

    /** Lấy thông tin dự án gây quỹ */
    async getProject(projectId) {
      if (useApi()) {
        try {
          return await apiCall('GET', '/projects/' + encodeURIComponent(projectId));
        } catch { }
      }
      if (db()) {
        try {
          const doc = await db().collection('projects').doc(projectId).get();
          if (doc.exists) return { id: doc.id, ...doc.data() };
        } catch { }
      }
      return this._defaultProjects.find(p => p.id === projectId) || null;
    },

    /** Lấy tất cả dự án */
    async getProjects() {
      if (useApi()) {
        try {
          return await apiCall('GET', '/projects');
        } catch (e) { console.warn('[ccDB.getProjects] API:', e.message); }
      }
      if (db()) {
        try {
          const snap = await db().collection('projects').orderBy('createdAt', 'desc').get();
          if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch { }
      }
      // Seed localStorage nếu trống
      let projects = lsGet('cc_projects', null);
      if (!projects) {
        projects = this._defaultProjects;
        lsSet('cc_projects', projects);
      }
      return projects;
    },

    /** Quyên góp cho dự án */
    async donate({ projectId, amount }) {
      const user = lsGet('cc_user', null);
      if (!user) return { success: false, reason: 'not-logged-in' };

      if (useApi()) {
        try {
          await apiCall('POST', '/donations', {
            projectId, amount,
            uid:         user.uid  || null,
            displayName: user.displayName
          });
          
          // Thử ghi điểm
          try {
            await this.addPoints(Math.max(5, Math.floor(amount / 10000)), 'Quyên góp bảo tồn di sản');
            return { success: true };
          } catch (pointsError) {
            // Donation đã được tạo nhưng điểm ghi thất bại → vẫn return success
            console.warn('[donate] Points failed but donation recorded:', pointsError.message);
            return { success: true };
          }
        } catch (e) {
          return { success: false, reason: 'api-failed', error: e.message };
        }
      }

      const donation = {
        projectId, amount,
        uid:         user.uid || null,
        displayName: user.displayName,
        timestamp:   Date.now()
      };

      if (db()) {
        try {
          await db().collection('donations').add({ ...donation, timestamp: serverTs() });
          await db().collection('projects').doc(projectId).set(
            { raised: firebase.firestore.FieldValue.increment(amount), updatedAt: serverTs() },
            { merge: true }
          );
        } catch { }
      } else {
        const donations = lsGet('cc_donations', []);
        donations.unshift(donation);
        lsSet('cc_donations', donations);

        const projects = lsGet('cc_projects', this._defaultProjects);
        const proj = projects.find(p => p.id === projectId);
        if (proj) { proj.raised = (proj.raised || 0) + amount; lsSet('cc_projects', projects); }
      }

      try {
        await this.addPoints(Math.max(5, Math.floor(amount / 10000)), 'Quyên góp bảo tồn di sản');
      } catch { }
      return { success: true };
    },

    /** Lắng nghe tiến độ dự án real-time */
    onProject(projectId, callback) {
      if (useApi()) {
        return startPolling(() => this.getProject(projectId), callback, 8000);
      }
      if (db()) {
        return db().collection('projects').doc(projectId)
          .onSnapshot(snap => {
            if (snap.exists) callback({ id: snap.id, ...snap.data() });
            else this.getProject(projectId).then(callback);
          }, () => { this.getProject(projectId).then(callback); });
      }
      this.getProject(projectId).then(callback);
      return () => { };
    },

    // ── SỰ KIỆN ─────────────────────────────────────────────────────

    /** Đăng ký tham dự sự kiện */
    async rsvpEvent(eventId, eventName) {
      const user = lsGet('cc_user', null);
      if (!user) return false;

      const key = 'cc_rsvp_' + eventId;
      if (localStorage.getItem(key)) return 'already';

      if (useApi() && user.uid) {
        try {
          const res = await apiCall('POST', '/rsvps', {
            eventId, eventName, uid: user.uid, displayName: user.displayName
          });
          if (res.already) return 'already';
          localStorage.setItem(key, '1');
          await this.addPoints(10, 'Đăng ký tham dự: ' + eventName);
          return true;
        } catch (e) { console.warn('[ccDB.rsvpEvent] API:', e.message); }
      }

      localStorage.setItem(key, '1');

      if (db() && user.uid) {
        try {
          await db().collection('rsvps').add({
            eventId, eventName,
            uid:         user.uid,
            displayName: user.displayName,
            timestamp:   serverTs()
          });
          await db().collection('events').doc(eventId).update({
            attendees: firebase.firestore.FieldValue.increment(1)
          });
        } catch { }
      }
      await this.addPoints(10, 'Đăng ký tham dự: ' + eventName);
      return true;
    },

    hasRsvped(eventId) {
      return !!localStorage.getItem('cc_rsvp_' + eventId);
    },

    // ── THỐNG KÊ TỔNG QUAN (cho index.html) ─────────────────────────

    async getSiteStats() {
      if (useApi()) {
        try {
          return await apiCall('GET', '/stats');
        } catch (e) { console.warn('[ccDB.getSiteStats] API:', e.message); }
      }
      if (db()) {
        try {
          const [uSnap, sSnap, cSnap] = await Promise.all([
            db().collection('users').get(),
            db().collection('stories').get(),
            db().collection('checkins').get()
          ]);
          return {
            members:  uSnap.size,
            stories:  sSnap.size,
            checkins: cSnap.size
          };
        } catch { }
      }
      return {
        members:  lsGet('cc_user', null) ? 1 : 0,
        stories:  lsGet('cc_stories', []).length,
        checkins: 0
      };
    },

    // ── SEED PROJECTS vào Firestore (gọi 1 lần) ─────────────────────

    async seedProjectsIfEmpty() {
      if (!db()) return;
      try {
        const snap = await db().collection('projects').limit(1).get();
        if (!snap.empty) return;
        const batch = db().batch();
        this._defaultProjects.forEach(p => {
          batch.set(db().collection('projects').doc(p.id), {
            name: p.name, goal: p.goal, raised: p.raised,
            img: p.img, status: p.status,
            createdAt: serverTs()
          });
        });
        await batch.commit();
        console.info('[CC] 🌱 Projects seeded to Firestore');
      } catch { }
    }
  };

  // ══ Export global ════════════════════════════════════════════════
  window.ccDB = ccDB;

  // ══ Tự động seed khi Firebase sẵn sàng ══════════════════════════
  document.addEventListener('cc:firebase-ready', () => {
    ccDB.seedProjectsIfEmpty();
  });

})();
