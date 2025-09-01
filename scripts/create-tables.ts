// scripts/create-tables.ts
import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

async function createTables() {
  const databaseUrl = process.env.DIRECT_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DIRECT_DATABASE_URL environment variable is not set.');
  }

  const sql = neon(databaseUrl);

  try {
    console.log('Creating tables...');

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        hex_color VARCHAR(6),
        icon VARCHAR(255),
        creation_date_time TIMESTAMPTZ NOT NULL,
        last_modified_date_time TIMESTAMPTZ NOT NULL
      )`
    ;

    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_done BOOLEAN DEFAULT FALSE,
        ordinal INTEGER,
        expected_completion_date_time TIMESTAMPTZ,
        creation_date_time TIMESTAMPTZ NOT NULL,
        last_modified_date_time TIMESTAMPTZ NOT NULL
      )`
    ;

    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id)`;

    console.log('Tables created successfully!');

  } catch (error) {
    console.error('Failed to create tables:', error);
    process.exit(1);
  }
}

createTables();
