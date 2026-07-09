import pg from 'pg';
const { Pool } = pg;

let pool;

export default function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    const cleanUrl = url?.includes('channel_binding=require')
      ? url.replace('&channel_binding=require', '')
      : url;
    pool = new Pool({
      connectionString: cleanUrl,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}
