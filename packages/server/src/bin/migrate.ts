import pg from 'pg';
import { loadConfig } from '../config.js';
import { migrate } from '../store/migrate.js';

const config = loadConfig();
const pool = new pg.Pool({ connectionString: config.databaseUrl });
try {
  const applied = await migrate(pool);
  process.stdout.write(applied.length ? `applied ${applied.join(', ')}\n` : 'database is up to date\n');
} finally {
  await pool.end();
}
