require('dotenv').config();
const sql = (process.env.DB_AUTH || 'windows') === 'windows' ? require('mssql/msnodesqlv8') : require('mssql');

function normalizeServer(raw){ return (raw||'localhost').replace(/\\\\/g,'\\'); }
const rawServer = process.env.DB_SERVER || 'localhost';
const normalizedServer = normalizeServer(rawServer);
const [serverName, instanceName] = normalizedServer.split('\\');

const dbConfig = {
  server: serverName || 'localhost',
  database: process.env.DB_NAME || 'CentralConnect',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};
if (instanceName) dbConfig.options.instanceName = instanceName; else dbConfig.port = parseInt(process.env.DB_PORT || '1433');

if ((process.env.DB_AUTH || 'windows') === 'windows') {
  dbConfig.driver = 'msnodesqlv8';
  dbConfig.options.trustedConnection = true;
  dbConfig.connectionString = `Driver={ODBC Driver 18 for SQL Server};Server=${normalizedServer};Database=${dbConfig.database};Trusted_Connection=Yes;Encrypt=yes;TrustServerCertificate=yes;`;
} else {
  dbConfig.user = process.env.DB_USER;
  dbConfig.password = process.env.DB_PASSWORD;
}

async function run() {
  console.log('[cleanup] Connecting to DB...', dbConfig.server, dbConfig.database);
  const pool = await sql.connect(dbConfig);
  console.log('[cleanup] Connected. Running deletions.');

  // UIDs to remove
  const uids = ['test-api-uid-2026'];
  // also remove e2e-* users created during tests
  // fetch any users with uid like 'e2e-%' to include
  const found = await pool.request().query("SELECT uid FROM users WHERE uid LIKE 'e2e-%'");
  found.recordset.forEach(r => uids.push(r.uid));

  console.log('[cleanup] Target UIDs:', uids);

  // Delete dependent rows first
  for (const uid of uids) {
    console.log('[cleanup] Deleting for uid=', uid);
    await pool.request().input('uid', sql.NVarChar(128), uid)
      .query('DELETE FROM story_likes WHERE uid = @uid');
    await pool.request().input('uid', sql.NVarChar(128), uid)
      .query('DELETE FROM stories WHERE authorUid = @uid');
    await pool.request().input('uid', sql.NVarChar(128), uid)
      .query('DELETE FROM points_log WHERE uid = @uid');
    await pool.request().input('uid', sql.NVarChar(128), uid)
      .query('DELETE FROM donations WHERE uid = @uid');
    await pool.request().input('uid', sql.NVarChar(128), uid)
      .query('DELETE FROM checkins WHERE uid = @uid');
    await pool.request().input('uid', sql.NVarChar(128), uid)
      .query('DELETE FROM rsvps WHERE uid = @uid');
    const res = await pool.request().input('uid', sql.NVarChar(128), uid)
      .query('DELETE FROM users WHERE uid = @uid');
    console.log('[cleanup] Deleted users rows:', res.rowsAffected);
  }

  console.log('[cleanup] Done.');
  process.exit(0);
}

run().catch(e => { console.error('[cleanup] Error', e); process.exit(2); });
