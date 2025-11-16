import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

async function createTables() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const sql = neon(databaseUrl);

  try {
    console.log('Creating tables...');

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50), -- nullable now
        name VARCHAR(255) NOT NULL,
        description TEXT,
        hex_color VARCHAR(6),
        icon VARCHAR(255),
        creation_date_time TIMESTAMPTZ NOT NULL,
        last_modified_date_time TIMESTAMPTZ NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50), -- nullable now
        project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_done BOOLEAN DEFAULT FALSE,
        ordinal INTEGER,
        expected_completion_date_time TIMESTAMPTZ,
        creation_date_time TIMESTAMPTZ NOT NULL,
        last_modified_date_time TIMESTAMPTZ NOT NULL
      )
    `;

    // Indexes (optional, still good for queries)
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`;

    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Failed to create tables:', error);
    process.exit(1);
  }
}

createTables();
