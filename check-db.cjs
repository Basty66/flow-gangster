const { Client } = require('pg');
const url = 'postgresql://neondb_owner:npg_41hUzHelRYKO@ep-icy-bonus-at168pq3-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const c = new Client({ connectionString: url });
c.connect()
  .then(() => c.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
  .then(r => {
    console.log('Tablas:', r.rows.map(x => x.table_name).join(', '));
    return c.query("SELECT count(*) as c FROM productos");
  })
  .then(r => { console.log('Productos:', r.rows[0].c); process.exit(0); })
  .catch(e => { console.error(e.message); process.exit(1); });
