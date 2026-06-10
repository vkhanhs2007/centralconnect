require('dotenv').config();
const util = require('util');
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
  console.log('[cleanup-dbg] Connecting to DB...', dbConfig.server, dbConfig.database);
  const pool = await sql.connect(dbConfig);
  console.log('[cleanup-dbg] Connected. Running deletions.');

  const uids = ['test-api-uid-2026'];
  const found = await pool.request().query("SELECT uid FROM users WHERE uid LIKE 'e2e-%'");
  found.recordset.forEach(r => uids.push(r.uid));

  console.log('[cleanup-dbg] Target UIDs:', uids);

  for (const uid of uids) {
    console.log('[cleanup-dbg] Deleting for uid=', uid);
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
    console.log('[cleanup-dbg] Deleted users rows:', res.rowsAffected);
  }

  console.log('[cleanup-dbg] Done.');
  process.exit(0);
}

run().catch(e => {
  console.error('[cleanup-dbg] Error', util.inspect(e, {showHidden:true, depth:5}));
  try {
    console.error('[cleanup-dbg] Error properties:', Object.getOwnPropertyNames(e));
    console.error('[cleanup-dbg] e.cause:', util.inspect(e.cause, {showHidden:true, depth:5}));
    console.error('[cleanup-dbg] e.originalError:', util.inspect(e.originalError, {showHidden:true, depth:5}));
    console.error('[cleanup-dbg] e.nativeError:', util.inspect(e.nativeError, {showHidden:true, depth:5}));
  } catch (x) { console.error('[cleanup-dbg] failed to inspect nested error', x); }
  process.exit(2);
});
