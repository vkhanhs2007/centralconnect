const https = require('https');

// Da Nang coordinates
const LAT = '16.0544';
const LON = '108.2022';

const WMO_VI = {
  0: 'Trời quang', 1: 'Ít mây', 2: 'Mây rải rác', 3: 'Nhiều mây',
  45: 'Sương mù', 48: 'Sương giá',
  51: 'Mưa phùn nhẹ', 53: 'Mưa phùn', 55: 'Mưa phùn dày',
  61: 'Mưa nhẹ', 63: 'Mưa vừa', 65: 'Mưa to',
  80: 'Mưa rào nhẹ', 81: 'Mưa rào', 82: 'Mưa rào mạnh',
  95: 'Dông', 96: 'Dông có mưa đá', 99: 'Dông mạnh',
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate'); // cache 10 phút

  if (req.method === 'OPTIONS') return res.status(200).end();

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m` +
    `&timezone=Asia%2FBangkok&forecast_days=1`;

  return new Promise((resolve) => {
    https.get(url, (apiRes) => {
      let body = '';
      apiRes.on('data', chunk => body += chunk);
      apiRes.on('end', () => {
        try {
          const data  = JSON.parse(body);
          const cur   = data.current;
          const code  = cur.weather_code;

          res.status(200).json({
            temp     : Math.round(cur.temperature_2m),
            code     : code,
            desc     : WMO_VI[code] ?? 'Không xác định',
            wind     : Math.round(cur.wind_speed_10m),
            humidity : Math.round(cur.relative_humidity_2m),
            city     : 'Đà Nẵng',
            updated  : new Date().toISOString(),
          });
        } catch {
          res.status(502).json({ error: 'Parse lỗi từ Open-Meteo' });
        }
        resolve();
      });
    }).on('error', err => {
      res.status(502).json({ error: 'Không kết nối được Open-Meteo: ' + err.message });
      resolve();
    }).setTimeout(8000, function () {
      this.destroy();
      res.status(504).json({ error: 'Timeout' });
      resolve();
    });
  });
};
