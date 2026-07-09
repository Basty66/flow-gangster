import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let pool;
let migrated = false;

function getPool() {
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
    runMigrations();
  }
  return pool;
}

async function runMigrations() {
  if (migrated) return;
  const p = getPool();
  try {
    await p.query(`CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    const { rows: done } = await p.query('SELECT name FROM _migrations');
    const doneNames = new Set(done.map((r) => r.name));

    const dir = path.join(__dirname, '..', 'migrations');
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

    for (const file of files) {
      if (doneNames.has(file)) continue;
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await p.query(sql);
      await p.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      console.log(`Migration ${file} executed`);
    }
  } catch (e) {
    console.error('Migration error:', e);
  }
  migrated = true;
}

export default getPool;
export { runMigrations };
