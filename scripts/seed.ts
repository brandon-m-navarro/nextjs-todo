import { config } from 'dotenv';
config({ path: '.env.local' }); // Load environment variables from .env file

// scripts/seed.ts
import { neon } from '@neondatabase/serverless';
import * as data from '../app/lib/placeholder-data'; // Adjust path if needed

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const sql = neon(databaseUrl);

  try {
    console.log('Starting database seed...');

    // Begin transaction
    await sql`BEGIN`;

    // Reset tables if they exist
    await sql`DROP TABLE IF EXISTS tasks, projects CASCADE`;

    // Create tables if they don't exist
    async function ensureTablesExist(sql: any) {
        // Use backticks here too
        const tableCheck = await sql`
            SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'projects'
            )`
        ;
        
        if (!tableCheck[0].exists) {
            console.log('Creating missing tables...');
            await sql`
            CREATE TABLE projects (
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
            CREATE TABLE tasks (
                id SERIAL PRIMARY KEY,
                project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                is_done BOOLEAN DEFAULT FALSE,
                ordinal INTEGER,
                expected_completion_date_time TIMESTAMPTZ,
                creation_date_time TIMESTAMPTZ NOT NULL,
                last_modified_date_time TIMESTAMPTZ NOT NULL,
                UNIQUE (project_id, title)
            )`
            ;
            // await sql`
            // CREATE TABLE tasks (
            //     id SERIAL PRIMARY KEY,
            //     project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            //     title VARCHAR(255) NOT NULL,
            //     description TEXT,
            //     is_done BOOLEAN DEFAULT FALSE,
            //     ordinal INTEGER,
            //     expected_completion_date_time TIMESTAMPTZ,
            //     creation_date_time TIMESTAMPTZ NOT NULL,
            //     last_modified_date_time TIMESTAMPTZ NOT NULL
            // )`
            // ;
            
            await sql`CREATE INDEX idx_tasks_project_id ON tasks(project_id)`;
        }
    }

    // Ensure tables exist
    await ensureTablesExist(sql);

    // Clear existing data - CAREFUL WITH THIS IN PRODUCTION!
    console.log('Clearing existing data...');
    await sql`TRUNCATE TABLE tasks, projects RESTART IDENTITY CASCADE;`;

    // Insert Projects first (they're referenced by Tasks)
    console.log('Seeding projects...');
    for (const project of data.Projects) {
      await sql`
        INSERT INTO projects (
          id, name, description, hex_color, icon, 
          creation_date_time, last_modified_date_time
        ) VALUES (
          ${project.id}, 
          ${project.name}, 
          ${project.description}, 
          ${project.hexColor}, 
          ${project.icon}, 
          TO_TIMESTAMP(${project.creationDateTime} / 1000.0), 
          TO_TIMESTAMP(${project.lastModifiedDateTime} / 1000.0)
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          hex_color = EXCLUDED.hex_color,
          icon = EXCLUDED.icon,
          last_modified_date_time = EXCLUDED.last_modified_date_time;
      `;
    }

    // Insert Tasks
    console.log('Seeding tasks...');
    for (const task of data.Tasks) {
      await sql`
        INSERT INTO tasks (
          project_id, title, description, is_done, ordinal,
          expected_completion_date_time, creation_date_time, last_modified_date_time
        ) VALUES (
          ${task.projectId},
          ${task.title},
          ${task.description},
          ${task.isDone},
          ${task.ordinal},
          ${task.expectedCompletionDateTime ? 
            sql`TO_TIMESTAMP(${task.expectedCompletionDateTime} / 1000.0)` : 
            sql`NULL`},
          TO_TIMESTAMP(${task.creationDateTime} / 1000.0),
          TO_TIMESTAMP(${task.lastModifiedDateTime} / 1000.0)
        )
        ON CONFLICT (project_id, title) DO UPDATE SET
          description = EXCLUDED.description,
          is_done = EXCLUDED.is_done,
          ordinal = EXCLUDED.ordinal,
          expected_completion_date_time = EXCLUDED.expected_completion_date_time,
          last_modified_date_time = EXCLUDED.last_modified_date_time;
      `;
    }

    // Commit transaction
    await sql`COMMIT`;
    console.log('Seed completed successfully!');

  } catch (error) {
    await sql`ROLLBACK`;
    console.error('Seed failed!', error);
    process.exit(1);
  }
}

main();
