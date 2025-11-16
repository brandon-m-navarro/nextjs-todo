import { config } from "dotenv";
config({ path: ".env" });

import { Tasks, Projects } from "../lib/placeholder-data";
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const sql = neon(databaseUrl);

  try {
    console.log("🌱 Starting database seed...");
    await sql`BEGIN`;

    console.log("🧹 Clearing existing data...");
    await sql`TRUNCATE TABLE tasks, projects RESTART IDENTITY CASCADE`;

    // ---------------------
    // PROJECTS
    // ---------------------
    console.log("📦 Seeding projects...");
    for (const project of Projects) {
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
          ${new Date(project.creationDateTime)},
          ${new Date(project.lastModifiedDateTime)}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          hex_color = EXCLUDED.hex_color,
          icon = EXCLUDED.icon,
          last_modified_date_time = EXCLUDED.last_modified_date_time
      `;
    }

    // ---------------------
    // TASKS
    // ---------------------
    console.log("📝 Seeding tasks...");
    for (const task of Tasks) {
      await sql`
        INSERT INTO tasks (
          id, project_id, title, description, is_done, ordinal,
          expected_completion_date_time, creation_date_time, last_modified_date_time
        ) VALUES (
          ${task.id},
          ${task.projectId},
          ${task.title},
          ${task.description},
          ${task.isDone},
          ${task.ordinal},
          ${task.expectedCompletionDateTime ? new Date(task.expectedCompletionDateTime) : null},
          ${new Date(task.creationDateTime)},
          ${new Date(task.lastModifiedDateTime)}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          is_done = EXCLUDED.is_done,
          ordinal = EXCLUDED.ordinal,
          expected_completion_date_time = EXCLUDED.expected_completion_date_time,
          last_modified_date_time = EXCLUDED.last_modified_date_time
      `;
    }

    await sql`COMMIT`;
    console.log("✅ Seed completed successfully!");

  } catch (err) {
    await sql`ROLLBACK`;
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

main();
