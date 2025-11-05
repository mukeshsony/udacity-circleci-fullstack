const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations/sql');

async function run() {
  const cmd = process.argv[2] || 'up';
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });
  await client.connect();
  try {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
    if (cmd === 'up') {
      for (const file of files) {
        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
        console.log('Running', file);
        await client.query(sql);
      }
      console.log('Migrations applied.');
    } else if (cmd === 'down') {
      // run down migrations (files with suffix .down.sql)
      const downFiles = files.filter(f => f.endsWith('.down.sql'));
      for (const file of downFiles) {
        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
        console.log('Running', file);
        await client.query(sql);
      }
      console.log('Down migrations applied.');
    } else {
      console.log('Unknown command', cmd);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
