require('dotenv').config();
const sql = require('mssql');
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'CentralConnect',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};
if ((process.env.DB_AUTH || 'windows') === 'windows') {
  config.driver = 'msnodesqlv8';
  config.options.trustedConnection = true;
} else {
  config.user = process.env.DB_USER;
  config.password = process.env.DB_PASSWORD;
}
console.log('CONFIG', JSON.stringify(config, null, 2));
(async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT 1 AS ok');
    console.log('CONNECTED', result.recordset);
    pool.close();
  } catch (err) {
    console.error('ERROR', err);
  }
})();