-- ============================================================
--  CENTRAL CONNECT — MySQL Setup (Schema + Seed Data)
--  Chạy 1 lần duy nhất để khởi tạo toàn bộ database:
--
--    mysql -u root -p123456 < database/setup.sql
--
--  Hoặc mở MySQL Workbench → File → Open SQL Script → Run All
-- ============================================================

CREATE DATABASE IF NOT EXISTS CentralConnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE CentralConnect;

-- ============================================================
--  BẢNG USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  uid           VARCHAR(128)   NOT NULL PRIMARY KEY,
  email         VARCHAR(255)   NOT NULL,
  displayName   VARCHAR(255),
  initials      VARCHAR(10),
  points        INT            NOT NULL DEFAULT 100,
  prefs         TEXT,
  fromLocation  VARCHAR(255),
  phone         VARCHAR(50),
  provider      VARCHAR(50)    DEFAULT 'email',
  photoURL      VARCHAR(1000),
  createdAt     DATETIME       DEFAULT NOW(),
  updatedAt     DATETIME       DEFAULT NOW() ON UPDATE NOW()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG POINTS_LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS points_log (
  id            INT            AUTO_INCREMENT PRIMARY KEY,
  uid           VARCHAR(128),
  displayName   VARCHAR(255),
  amount        INT            NOT NULL,
  reason        VARCHAR(500),
  timestamp     DATETIME       DEFAULT NOW()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG CHECKINS
-- ============================================================
CREATE TABLE IF NOT EXISTS checkins (
  id            INT            AUTO_INCREMENT PRIMARY KEY,
  placeId       VARCHAR(255)   NOT NULL,
  placeName     VARCHAR(255),
  uid           VARCHAR(128)   NOT NULL,
  displayName   VARCHAR(255),
  timestamp     DATETIME       DEFAULT NOW(),
  UNIQUE KEY UQ_checkin (placeId, uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG STORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS stories (
  id            INT            AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(500),
  content       TEXT           NOT NULL,
  place         VARCHAR(255),
  tags          TEXT,
  authorName    VARCHAR(255),
  authorUid     VARCHAR(128),
  initials      VARCHAR(10),
  likes         INT            NOT NULL DEFAULT 0,
  timestamp     DATETIME       DEFAULT NOW()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG STORY_LIKES
-- ============================================================
CREATE TABLE IF NOT EXISTS story_likes (
  id            INT            AUTO_INCREMENT PRIMARY KEY,
  storyId       INT            NOT NULL,
  uid           VARCHAR(128)   NOT NULL,
  timestamp     DATETIME       DEFAULT NOW(),
  UNIQUE KEY UQ_story_like (storyId, uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG PROJECTS (gây quỹ)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id            VARCHAR(100)   NOT NULL PRIMARY KEY,
  name          VARCHAR(255)   NOT NULL,
  goal          BIGINT         NOT NULL DEFAULT 0,
  raised        BIGINT         NOT NULL DEFAULT 0,
  img           VARCHAR(1000),
  status        VARCHAR(50)    DEFAULT 'active',
  description   TEXT,
  createdAt     DATETIME       DEFAULT NOW(),
  updatedAt     DATETIME       DEFAULT NOW() ON UPDATE NOW()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG DONATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS donations (
  id            INT            AUTO_INCREMENT PRIMARY KEY,
  projectId     VARCHAR(100)   NOT NULL,
  amount        BIGINT         NOT NULL,
  uid           VARCHAR(128),
  displayName   VARCHAR(255),
  timestamp     DATETIME       DEFAULT NOW(),
  FOREIGN KEY (projectId) REFERENCES projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG EVENTS (sự kiện) — đầy đủ tất cả cột
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id            VARCHAR(255)   NOT NULL PRIMARY KEY,
  name          VARCHAR(500)   NOT NULL,
  description   TEXT,
  eventDate     DATETIME,
  location      VARCHAR(500),
  attendees     INT            NOT NULL DEFAULT 0,
  imgUrl        VARCHAR(1000),
  cat           VARCHAR(50)    DEFAULT NULL,
  time_range    VARCHAR(100)   DEFAULT NULL,
  price         VARCHAR(200)   DEFAULT NULL,
  spots         INT            DEFAULT 0,
  tags          TEXT           DEFAULT NULL,
  featured      TINYINT        DEFAULT 0,
  sold          TINYINT        DEFAULT 0,
  createdAt     DATETIME       DEFAULT NOW()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG RSVPS
-- ============================================================
CREATE TABLE IF NOT EXISTS rsvps (
  id            INT            AUTO_INCREMENT PRIMARY KEY,
  eventId       VARCHAR(255)   NOT NULL,
  eventName     VARCHAR(500),
  uid           VARCHAR(128)   NOT NULL,
  displayName   VARCHAR(255),
  timestamp     DATETIME       DEFAULT NOW(),
  UNIQUE KEY UQ_rsvp (eventId, uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG PLACES (địa điểm du lịch)
-- ============================================================
CREATE TABLE IF NOT EXISTS places (
  id          INT           NOT NULL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  loc         VARCHAR(255),
  province    VARCHAR(50),
  type        VARCHAR(50),
  icon        VARCHAR(10),
  lat         DECIMAL(10,6),
  lng         DECIMAL(10,6),
  rating      DECIMAL(3,1)  DEFAULT 4.5,
  reviews     INT           DEFAULT 0,
  hours       VARCHAR(100),
  price       VARCHAR(100),
  description TEXT,
  audio       VARCHAR(255),
  img         VARCHAR(1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  BẢNG FOODS (ẩm thực)
-- ============================================================
CREATE TABLE IF NOT EXISTS foods (
  id        INT           NOT NULL PRIMARY KEY,
  name      VARCHAR(255)  NOT NULL,
  shop      VARCHAR(255),
  cat       VARCHAR(50),
  lat       DECIMAL(10,6),
  lng       DECIMAL(10,6),
  rating    DECIMAL(3,1)  DEFAULT 4.5,
  reviews   INT           DEFAULT 0,
  price     VARCHAR(100),
  hours     VARCHAR(100),
  since     VARCHAR(10),
  img       VARCHAR(1000),
  story     TEXT,
  menu      TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  INDEX tăng tốc truy vấn
-- ============================================================
ALTER TABLE users    ADD INDEX IF NOT EXISTS IX_users_points       (points DESC);
ALTER TABLE stories  ADD INDEX IF NOT EXISTS IX_stories_timestamp  (timestamp DESC);
ALTER TABLE checkins ADD INDEX IF NOT EXISTS IX_checkins_uid_place (uid, placeId);
ALTER TABLE donations ADD INDEX IF NOT EXISTS IX_donations_project (projectId);

-- ============================================================
--  DỮ LIỆU MẪU — Dự án gây quỹ
-- ============================================================
INSERT IGNORE INTO projects (id, name, goal, raised, img, status, description) VALUES
  ('my-son-2026',
   'Trùng tu Thánh địa Mỹ Sơn',
   50000000, 32000000,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/My_Son_Sanctuary_2.jpg/640px-My_Son_Sanctuary_2.jpg',
   'urgent',
   'Dự án khẩn cấp phục dựng các tháp Chăm bị xuống cấp tại khu Di sản UNESCO Mỹ Sơn.'),
  ('hoian-green',
   'Phố cổ Hội An xanh hơn',
   50000000, 40500000,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Hoi_An_Covered_Bridge.jpg/640px-Hoi_An_Covered_Bridge.jpg',
   'active',
   'Lắp đặt đèn LED tiết kiệm năng lượng, trồng cây xanh dọc phố cổ Hội An.'),
  ('manthai-craft',
   'Làng chài Mân Thái — hồi sinh',
   30000000, 11000000,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/My_Khe_Beach_Da_Nang.jpg/640px-My_Khe_Beach_Da_Nang.jpg',
   'active',
   'Hỗ trợ ngư dân làng chài Mân Thái khôi phục nghề thủ công truyền thống.');

-- ============================================================
--  DỮ LIỆU MẪU — Địa điểm du lịch (mô tả đầy đủ)
-- ============================================================
INSERT IGNORE INTO places (id, name, loc, province, type, icon, lat, lng, rating, reviews, hours, price, description, audio, img) VALUES
(1,  'Hội An Cổ Phố',
     'Hội An, Quảng Nam cũ',         'quangnam', 'lich-su',     '🏮', 15.880100, 108.338000, 4.9, 2840,
     '06:00 – 22:00', '120.000đ',
     'Phố cổ Hội An là Di sản Văn hóa Thế giới UNESCO từ năm 1999, nổi tiếng với những ngôi nhà gỗ cổ kính, đèn lồng rực rỡ và dòng sông Thu Bồn hiền hòa. Nơi đây lưu giữ hơn 1.000 công trình kiến trúc từ thế kỷ XV–XIX.',
     'Nhạc bài chòi Hội An',
     'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80&auto=format&fit=crop'),

(2,  'Thánh Địa Mỹ Sơn',
     'Duy Xuyên, Quảng Nam cũ',      'quangnam', 'lich-su',     '🏛', 15.771000, 108.124000, 4.8, 1560,
     '06:30 – 17:00', '150.000đ',
     'Quần thể tháp Chăm Mỹ Sơn được UNESCO công nhận năm 1999, là thánh địa Ấn Độ giáo tuyệt đẹp của vương quốc Champa cổ đại từ thế kỷ IV–XIII. Kiến trúc đá độc đáo giữa thung lũng xanh.',
     'Nhạc trống Chăm cổ',
     'https://images.unsplash.com/photo-1603392395794-e1c9f4c59896?w=800&q=80&auto=format&fit=crop'),

(3,  'Bà Nà Hills',
     'Hòa Vang, Đà Nẵng',         'danang',   'thien-nhien', '🌿', 15.997000, 107.988000, 4.7, 3200,
     '08:00 – 21:00', '550.000đ–900.000đ',
     'Khu du lịch Bà Nà Hills tọa lạc ở độ cao 1.487m, nơi có Cầu Vàng nổi tiếng thế giới với hai bàn tay khổng lồ đỡ cầu. Khí hậu mát mẻ quanh năm, cảnh quan núi rừng hùng vĩ.',
     'Tiếng suối và chim rừng Bà Nà',
     'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?w=800&q=80&auto=format&fit=crop'),

(4,  'Làng Gốm Thanh Hà',
     'Hội An, Quảng Nam cũ',          'quangnam', 'lang-nghe',   '🏺', 15.892000, 108.310000, 4.6,  890,
     '07:00 – 18:00', 'Miễn phí',
     'Làng gốm Thanh Hà có lịch sử hơn 500 năm, là một trong những làng gốm lâu đời nhất Việt Nam. Du khách có thể trực tiếp ngồi bàn xoay và nặn gốm theo hướng dẫn của nghệ nhân.',
     'Tiếng bàn xoay gốm truyền thống',
     'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop'),

(5,  'Biển Mỹ Khê',
     'Sơn Trà, Đà Nẵng',          'danang',   'bien',        '🏖', 16.062000, 108.247000, 4.8, 4100,
     'Cả ngày', 'Miễn phí',
     'Bãi biển Mỹ Khê được Forbes bình chọn là một trong 6 bãi biển quyến rũ nhất hành tinh. Bãi cát trắng mịn trải dài 900m, nước biển xanh trong vắt, lý tưởng cho tắm biển và thể thao dưới nước.',
     'Tiếng sóng biển Mỹ Khê',
     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop'),

(6,  'Ngũ Hành Sơn',
     'Ngũ Hành Sơn, Đà Nẵng',    'danang',   'lich-su',     '🗿', 16.002000, 108.263000, 4.7, 2200,
     '07:00 – 17:30', '40.000đ',
     'Quần thể 5 ngọn núi đá cẩm thạch thiêng liêng: Kim, Mộc, Thủy, Hỏa, Thổ Sơn. Bên trong hang động là chùa chiền cổ kính, tượng Phật khổng lồ và tầm nhìn toàn cảnh Đà Nẵng tuyệt đẹp.',
     'Tiếng kinh cầu Ngũ Hành Sơn',
     'https://images.unsplash.com/photo-1609430199078-9b5c4baeff2a?w=800&q=80&auto=format&fit=crop'),

(7,  'Làng Rau Trà Quế',
     'Hội An, Quảng Nam cũ',          'quangnam', 'lang-nghe',   '🌱', 15.902000, 108.351000, 4.5,  760,
     '06:00 – 18:00', 'Miễn phí',
     'Làng rau Trà Quế nằm bên cạnh hồ Trà Quế thơ mộng, nổi tiếng với hơn 20 loại rau thơm đặc biệt. Du khách có thể tham gia trải nghiệm trồng rau và chế biến món ăn truyền thống cùng dân làng.',
     'Tiếng gió qua đồng rau Trà Quế',
     'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80&auto=format&fit=crop'),

(8,  'Sơn Trà & Bán đảo',
     'Sơn Trà, Đà Nẵng',          'danang',   'thien-nhien', '🐒', 16.106000, 108.280000, 4.6, 1800,
     'Cả ngày (xe máy)', 'Miễn phí',
     'Bán đảo Sơn Trà là "lá phổi xanh" của Đà Nẵng với 4.000ha rừng nguyên sinh. Nơi đây là môi trường sống của voọc chà vá chân nâu – loài linh trưởng quý hiếm bậc nhất thế giới.',
     'Tiếng voọc và rừng xanh Sơn Trà',
     'https://images.unsplash.com/photo-1596401057633-54a8aecf3441?w=800&q=80&auto=format&fit=crop'),

(9,  'Cầu Rồng Đà Nẵng',
     'Hải Châu, Đà Nẵng',         'danang',   'lich-su',     '🐉', 16.061000, 108.227000, 4.8, 5200,
     'Cả ngày | Phun lửa T7-CN 21:00', 'Miễn phí',
     'Cầu Rồng là biểu tượng của Đà Nẵng hiện đại, dài 666m bắc qua sông Hàn. Đây là cây cầu phun lửa và phun nước duy nhất tại Việt Nam, vào cuối tuần thu hút hàng nghìn du khách đến xem biểu diễn.',
     'Âm thanh lễ hội sông Hàn',
     'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80&auto=format&fit=crop'),

(10, 'Phố Cổ Hội An ban đêm',
     'Hội An, Quảng Nam cũ',          'quangnam', 'lich-su',     '🏮', 15.876000, 108.336000, 4.9, 3100,
     '18:00 – 23:00', 'Included',
     'Hội An về đêm lung linh hơn bao giờ hết với hàng ngàn đèn lồng đủ màu sắc phản chiếu xuống mặt sông Thu Bồn. Lễ hội đèn lồng vào ngày rằm hằng tháng là trải nghiệm không thể quên.',
     'Tiếng đàn bầu và hò khoan đêm phố cổ',
     'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80&auto=format&fit=crop'),

(11, 'Bãi biển Cửa Đại',
     'Hội An, Quảng Nam cũ',          'quangnam', 'bien',        '🌊', 15.855000, 108.405000, 4.5, 1200,
     'Cả ngày', 'Miễn phí',
     'Bãi biển Cửa Đại trải dài 7km với cát trắng mịn và nước biển xanh ngọc. Đây là điểm lý tưởng để tắm biển yên tĩnh, ngắm hoàng hôn và thưởng thức hải sản tươi ngay trên bãi.',
     'Tiếng sóng và gió biển Cửa Đại',
     'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80&auto=format&fit=crop'),

(12, 'Làng Đúc Đồng Phước Kiều',
     'Điện Bàn, Quảng Nam cũ',       'quangnam', 'lang-nghe',   '⚒', 15.930000, 108.218000, 4.4,  420,
     '07:00 – 17:00', 'Miễn phí',
     'Làng đúc đồng Phước Kiều hơn 400 năm tuổi, nổi tiếng với tiếng đúc cồng chiêng và nhạc cụ dân tộc. Du khách có thể trực tiếp quan sát nghệ nhân đúc đồng theo phương pháp truyền thống.',
     'Tiếng cồng chiêng làng Phước Kiều',
     'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop');

-- ============================================================
--  DỮ LIỆU MẪU — Ẩm thực (story + menu đầy đủ)
-- ============================================================
INSERT IGNORE INTO foods (id, name, shop, cat, lat, lng, rating, reviews, price, hours, since, img, story, menu) VALUES
(1,  'Mì Quảng Bà Vị',
     'Quán Bà Vị – 6B Phan Châu Trinh',      'mi-quang',  15.879400, 108.335600, 4.9, 1820,
     '35.000đ–55.000đ', '06:00–14:00', '1978',
     'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80&auto=format&fit=crop',
     'Bà Vị bắt đầu bán mì Quảng từ năm 1978 với gánh nhỏ trước nhà. Bí quyết nằm ở nước lèo hầm xương heo 6 tiếng, bánh mì Quảng tự tráng buổi sáng sớm, và rau sống hái từ vườn Trà Quế. Hơn 40 năm, chưa thay đổi công thức.',
     '[{"n":"Mì Quảng tôm thịt","p":"45.000đ"},{"n":"Mì Quảng gà","p":"40.000đ"},{"n":"Mì Quảng bò","p":"55.000đ"},{"n":"Mì Quảng chay","p":"35.000đ"}]'),

(2,  'Cao Lầu Ông Hai',
     'Quán Ông Hai – 22 Lê Lợi, Hội An',     'cao-lau',   15.876200, 108.333900, 4.8, 1340,
     '40.000đ–60.000đ', '07:00–21:00', '1965',
     'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80&auto=format&fit=crop',
     'Cao Lầu là món ăn đặc trưng chỉ có ở Hội An. Sợi mì được làm từ nước giếng Bá Lễ duy nhất tại Hội An và tro từ cây củi đặc biệt. Ông Hai đã giữ bí quyết gia truyền 3 đời, từ thời ông nội.',
     '[{"n":"Cao Lầu đặc biệt","p":"55.000đ"},{"n":"Cao Lầu thường","p":"40.000đ"},{"n":"Cao Lầu chay","p":"35.000đ"},{"n":"Cao Lầu chua","p":"45.000đ"}]'),

(3,  'Bánh Mì Phượng',
     'Bánh Mì Phượng – 2B Phan Châu Trinh',   'banh-mi',   15.877400, 108.334800, 4.9, 4560,
     '25.000đ–45.000đ', '06:30–20:00', '1988',
     'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80&auto=format&fit=crop',
     'Anthony Bourdain gọi đây là "bánh mì ngon nhất thế giới" năm 2009. Bà Phượng tự làm bánh mì mỗi sáng, thịt xá xíu ướp 2 ngày, nước sốt đặc biệt pha từ 12 gia vị. Mỗi ngày bán hơn 1.500 ổ.',
     '[{"n":"Bánh mì đặc biệt","p":"40.000đ"},{"n":"Bánh mì xá xíu","p":"35.000đ"},{"n":"Bánh mì pate","p":"25.000đ"},{"n":"Bánh mì trứng","p":"30.000đ"}]'),

(4,  'Bánh Tráng Cuốn Thịt Heo Bảy Hoàng',
     'Quán Bảy Hoàng – 25 Trần Phú',          'banh-trang',16.067800, 108.220700, 4.7,  980,
     '80.000đ–150.000đ/người', '10:00–22:00', '1992',
     'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600&q=80&auto=format&fit=crop',
     'Bánh tráng cuốn thịt heo là đặc sản số 1 Đà Nẵng, không thể nhầm lẫn với nơi khác. Ông Bảy Hoàng chọn heo từ làng Cẩm Lệ, luộc vừa chín tới, kèm rau sống 12 loại và tương đặc biệt ủ 3 tháng.',
     '[{"n":"Set 2 người","p":"160.000đ"},{"n":"Set 4 người","p":"300.000đ"},{"n":"Thêm bánh tráng","p":"20.000đ"},{"n":"Thêm thịt","p":"60.000đ"}]'),

(5,  'Chè Bà Bốn Hội An',
     'Quán Chè Bà Bốn – 1 Nguyễn Huệ',       'che',       15.881000, 108.337000, 4.6,  760,
     '15.000đ–30.000đ', '08:00–22:30', '1975',
     'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&auto=format&fit=crop',
     'Chè Hội An có hơn 20 loại chè truyền thống, từ chè bắp, chè đậu ván, chè sâm bổ lượng. Bà Bốn là thế hệ thứ 3 giữ nghề từ 1975, nguyên liệu chọn lọc từ vùng đồng bằng Thăng Bình.',
     '[{"n":"Chè bắp","p":"20.000đ"},{"n":"Chè đậu ván","p":"20.000đ"},{"n":"Sâm bổ lượng","p":"30.000đ"},{"n":"Chè thập cẩm","p":"25.000đ"}]'),

(6,  'Hải Sản Bờ Biển Thanh',
     'Quán Thanh – 18 Võ Nguyên Giáp',        'hai-san',   16.063800, 108.247600, 4.8, 2100,
     '150.000đ–500.000đ/người', '10:00–23:00', '2001',
     'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80&auto=format&fit=crop',
     'Ngay trên bãi biển Mỹ Khê, quán Thanh nổi tiếng với hải sản tươi từ ngư dân Thanh Khê đánh về mỗi sáng. Ghẹ rang me, tôm hùm nướng, sò điệp phô mai là những món khách quay lại mãi không chán.',
     '[{"n":"Ghẹ rang me (kg)","p":"350.000đ"},{"n":"Tôm hùm nướng (con)","p":"480.000đ"},{"n":"Sò điệp phô mai","p":"80.000đ"},{"n":"Mực nướng","p":"150.000đ"}]'),

(7,  'Mì Quảng Tuân Quán',
     'Tuân Quán – 64 Hùng Vương',             'mi-quang',  16.071200, 108.224300, 4.7, 1200,
     '30.000đ–50.000đ', '06:00–12:00', '2003',
     'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80&auto=format&fit=crop',
     'Tuân Quán mang công thức Mì Quảng thuần chất từ Duy Xuyên ra Đà Nẵng. Khác với mì Quảng phố thị, ở đây vẫn dùng bánh dày truyền thống, nước lèo ngọt thanh không bột ngọt.',
     '[{"n":"Mì Quảng gà ta","p":"45.000đ"},{"n":"Mì Quảng ếch","p":"50.000đ"},{"n":"Mì Quảng bò","p":"45.000đ"},{"n":"Mì Quảng chay","p":"30.000đ"}]'),

(8,  'Bánh Mì Bà Lan',
     'Bánh Mì Bà Lan – 8 Đống Đa',            'banh-mi',   16.065200, 108.215300, 4.5,  620,
     '20.000đ–35.000đ', '05:30–10:00', '1995',
     'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80&auto=format&fit=crop',
     'Bà Lan chỉ bán buổi sáng sớm, bánh nướng mỗi 30 phút một lần. Không có nhân cầu kỳ, chỉ pate, chả lụa, dưa leo – nhưng bánh giòn và tươi đến mức không thể cưỡng lại.',
     '[{"n":"Bánh mì pate chả","p":"25.000đ"},{"n":"Bánh mì thịt đặc","p":"35.000đ"},{"n":"Bánh mì trứng","p":"20.000đ"},{"n":"Bánh mì không","p":"5.000đ"}]'),

(9,  'Chè 3 Màu Ngọc Mai',
     'Ngọc Mai – 30 Lê Duẩn',                 'che',       16.068900, 108.221900, 4.4,  430,
     '10.000đ–25.000đ', '14:00–23:00', '2010',
     'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&auto=format&fit=crop',
     'Một hàng chè nhỏ nhưng có tâm ở góc phố Lê Duẩn. Chè 3 màu ở đây nức tiếng nhờ thạch đen nhà làm từ cây sương sáo, đậu xanh không đường hóa học và nước cốt dừa tươi mỗi ngày.',
     '[{"n":"Chè 3 màu","p":"20.000đ"},{"n":"Chè thạch đen","p":"15.000đ"},{"n":"Sinh tố bơ","p":"25.000đ"},{"n":"Chè bưởi","p":"20.000đ"}]'),

(10, 'Hải Sản Bình Dân Cô Ba',
     'Cô Ba – Chợ Hàn, Đà Nẵng',             'hai-san',   16.068500, 108.222500, 4.6, 1560,
     '50.000đ–200.000đ/người', '17:00–22:00', '1998',
     'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80&auto=format&fit=crop',
     'Cô Ba bán hải sản vỉa hè ngay cạnh chợ Hàn suốt 25 năm. Giá rẻ bình dân nhưng chất lượng không thua – ngao, sò, mực, cá thu đều từ tàu cập bến sáng hôm đó.',
     '[{"n":"Ngao xào sả ớt","p":"60.000đ"},{"n":"Sò huyết nướng","p":"80.000đ"},{"n":"Mực chiên giòn","p":"90.000đ"},{"n":"Cá thu kho tiêu","p":"120.000đ"}]');

-- ============================================================
--  DỮ LIỆU MẪU — Sự kiện (mô tả đầy đủ)
-- ============================================================
INSERT IGNORE INTO events (id, name, description, eventDate, location, attendees, imgUrl, cat, time_range, price, spots, tags, featured, sold) VALUES
('0',
 'Lễ Hội Đèn Lồng Hội An – Đêm Rằm Tháng 5',
 'Hàng nghìn đèn lồng rực rỡ phản chiếu trên sông Thu Bồn, âm nhạc dân gian, múa Chăm và nghi lễ thả đèn cầu nguyện trên sông. Lễ hội diễn ra mỗi tháng vào đêm rằm, tháng 6 có thêm biểu diễn nhạc cụ truyền thống đặc biệt.',
 '2026-06-11 18:00:00', 'Phố cổ Hội An, Quảng Nam cũ', 0,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Hoi_An_market.jpg/1280px-Hoi_An_market.jpg',
 'le-hoi', '18:00–23:00', 'Miễn phí', 3000, '["UNESCO","Truyền thống","Phố cổ"]', 1, 0),

('1',
 'Triển Lãm Nhiếp Ảnh Di Sản Miền Trung',
 'Hơn 120 tác phẩm nhiếp ảnh ghi lại vẻ đẹp và giá trị văn hóa di sản Đà Nẵng – Quảng Nam cũ từ thập niên 1970 đến nay. Triển lãm kết hợp công nghệ AR cho phép xem ảnh thực địa.',
 '2026-06-15 09:00:00', 'Bảo tàng Đà Nẵng, 24 Trần Phú', 0,
 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80&auto=format&fit=crop',
 'nghe-thuat', '09:00–18:00', 'Miễn phí', 500, '["Nhiếp ảnh","Di sản","AR"]', 0, 0),

('2',
 'Lễ Hội Ẩm Thực Phố Hội – Food Fest 2026',
 '50+ gian hàng đặc sản từ Đà Nẵng, Hội An, Mỹ Sơn và các tỉnh miền Trung. Workshop nấu ăn, thi tài nấu Mì Quảng và Cao Lầu, biểu diễn nghệ thuật ẩm thực trực tiếp.',
 '2026-06-20 10:00:00', 'Công viên An Hội, Hội An', 0,
 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop',
 'am-thuc', '10:00–22:00', 'Vào cửa miễn phí', 2000, '["Ẩm thực","Hội An","Trải nghiệm"]', 0, 0),

('3',
 'Giải Chạy Di Sản Đà Nẵng Marathon 2026',
 'Đường chạy đẹp nhất Việt Nam qua Cầu Rồng, bờ biển Mỹ Khê, Bán đảo Sơn Trà. 3 cự ly: 42km (Marathon), 21km và 10km. Huy chương di sản đặc biệt cho người hoàn thành.',
 '2026-06-22 05:00:00', 'Quảng trường 29/3, Đà Nẵng', 0,
 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80&auto=format&fit=crop',
 'the-thao', '05:00–12:00', '350.000đ (42km) · 200.000đ (10km)', 8000, '["Thể thao","Marathon","Di sản"]', 0, 0),

('4',
 'Workshop Sơn Mài & Nghề Gốm Thanh Hà',
 'Học làm gốm truyền thống từ nghệ nhân làng Thanh Hà 500 năm tuổi. Tự tay tạo ra tác phẩm gốm mang về. Bữa trưa tại nhà nghệ nhân, tham quan công đoạn nung gốm lửa củi.',
 '2026-06-28 08:00:00', 'Làng Gốm Thanh Hà, Hội An', 0,
 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop',
 'bao-ton', '08:00–17:00', '150.000đ/người', 30, '["Workshop","Làng nghề","Gốm"]', 0, 1),

('5',
 'Đêm Nhạc Dân Gian Bên Sông Hàn',
 'Đêm nhạc ngoài trời với các tiết mục dân ca miền Trung, hát bội, bài chòi và múa rối nước. Ngồi bên sông Hàn ngắm Cầu Rồng chiếu sáng cùng âm nhạc truyền thống.',
 '2026-07-04 19:30:00', 'Bờ Đông Sông Hàn, Đà Nẵng', 0,
 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80&auto=format&fit=crop',
 'le-hoi', '19:30–22:00', 'Miễn phí', 1500, '["Âm nhạc","Dân gian","Sông Hàn"]', 0, 0),

('6',
 'Triển Lãm Điêu Khắc Champa – Mỹ Sơn',
 'Triển lãm ngoài trời 40 tác phẩm phục chế điêu khắc Champa thế kỷ VII–XIII. Hướng dẫn viên chuyên gia UNESCO, audio guide tiếng Việt và Anh, VR trải nghiệm Mỹ Sơn thời Champa.',
 '2026-07-10 08:00:00', 'Thánh địa Mỹ Sơn, Quảng Nam cũ', 0,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/My_Son_sanctuary.jpg/1280px-My_Son_sanctuary.jpg',
 'nghe-thuat', '08:00–17:00', 'Included với vé vào cửa', 800, '["Champa","UNESCO","Di tích"]', 0, 0),

('7',
 'Trồng San Hô – Bảo Vệ Biển Sơn Trà',
 'Hoạt động tình nguyện bảo vệ rạn san hô Sơn Trà. Huấn luyện lặn ngắm san hô (snorkeling), trồng san hô nhân tạo, dọn rác biển. Nhận chứng chỉ tình nguyện viên bảo tồn.',
 '2026-07-19 06:30:00', 'Bãi Bắc, Bán đảo Sơn Trà', 0,
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
 'bao-ton', '06:30–12:00', '200.000đ (bao gồm thiết bị lặn)', 40, '["Môi trường","Tình nguyện","Biển"]', 0, 0);

-- ============================================================
--  KIỂM TRA KẾT QUẢ
-- ============================================================
SELECT CONCAT(
  '✅ Setup thành công! ',
  'places=',   (SELECT COUNT(*) FROM places),   ' | ',
  'foods=',    (SELECT COUNT(*) FROM foods),    ' | ',
  'events=',   (SELECT COUNT(*) FROM events),   ' | ',
  'projects=', (SELECT COUNT(*) FROM projects)
) AS status;
