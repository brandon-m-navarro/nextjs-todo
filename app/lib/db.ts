import "server-only";
import { neon } from "@neondatabase/serverless";
import type {
  TaskFromDb,
  ProjectFromDb,
  Project,
  Task,
} from "@/app/lib/definitions";

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL!);

// Mapping function: snake_case DB fields to camelCase Project type
export function mapProjectDbToType(projectFromDb: ProjectFromDb): Project {
  return {
    id: projectFromDb.id,
    name: projectFromDb.name,
    description: projectFromDb.description,
    hexColor: projectFromDb.hex_color,
    icon: projectFromDb.icon,
    creationDateTime: projectFromDb.creation_date_time,
    lastModifiedDateTime: projectFromDb.last_modified_date_time,
  };
}

// Mapping function: snake_case DB fields to camelCase Task type
export function mapTaskDbToType(taskFromDb: TaskFromDb): Task {
  return {
    projectId: taskFromDb.project_id,
    id: taskFromDb.id,
    title: taskFromDb.title,
    description: taskFromDb.description,
    isDone: taskFromDb.is_done,
    ordinal: taskFromDb.ordinal,
    expectedCompletionDateTime: taskFromDb.expected_completion_date_time,
    creationDateTime: taskFromDb.creation_date_time,
    lastModifiedDateTime: taskFromDb.last_modified_date_time,
  };
}

export const db = {

  /* Project operations */
  projects: {

    // Get all projects
    getAll: async (): Promise<ProjectFromDb[]> => {
      const result = await sql`
                SELECT * FROM projects ORDER BY creation_date_time DESC
            `;
      return result as ProjectFromDb[];
    },

    // Get a project by ID
    getById: async (id: string): Promise<ProjectFromDb | null> => {
      const result = await sql`
                SELECT * FROM projects WHERE id = ${id}
            `;
      return result.length > 0 ? (result[0] as ProjectFromDb) : null;
    },

    // Create a new project
    create: async (
      id: string,
      name: string,
      description?: string,
      hexColor?: string,
      icon?: string
    ): Promise<ProjectFromDb> => {
      const now = new Date();
      const result = await sql`
                INSERT INTO projects (id, name, description, hex_color, icon, creation_date_time, last_modified_date_time)
                VALUES (${id}, ${name}, ${description || null}, ${
        hexColor || null
      }, ${icon || null}, ${now}, ${now})
                RETURNING *
            `;
      return result[0] as ProjectFromDb;
    },

    // Update a project
    update: async (
      id: string,
      updates: {
        name?: string;
        description?: string | null;
        hex_color: string;
        icon?: string;
      }
    ): Promise<ProjectFromDb | null> => {
      const now = new Date();

      const result = await sql`
        UPDATE projects
        SET 
            name = ${updates.name ?? undefined},
            description = ${updates.description ?? undefined},
            hex_color = ${updates.hex_color ?? undefined},
            icon = ${updates.icon ?? undefined},
            last_modified_date_time = ${now}
        WHERE id = ${id}
        RETURNING *
    `;
      return result.length > 0 ? (result[0] as ProjectFromDb) : null;
    },

    // Delete a project
    delete: async (id: string): Promise<boolean> => {
      await sql`
                DELETE FROM projects WHERE id = ${id}
            `;
      await sql`
                DELETE FROM tasks WHERE project_id = ${id}
            `;
      // Assume success if no error was thrown
      return true;
    },
  },

  /* Task operations */
  tasks: {

    // Get task by ID
    getById: async (id: string): Promise<TaskFromDb | null> => {
      const result = await sql`
                SELECT * FROM tasks WHERE id = ${id}
            `;
      return result.length > 0 ? (result[0] as TaskFromDb) : null;
    },

    // Get tasks by project ID
    getByProjectId: async (projectId: string): Promise<TaskFromDb[]> => {
      const result = await sql`
                SELECT * FROM tasks WHERE project_id = ${projectId} ORDER BY creation_date_time DESC
            `;
      return result as TaskFromDb[];
    },

    // Create a new task
    create: async (
      task: Omit<TaskFromDb, "creation_date_time" | "last_modified_date_time">
    ): Promise<TaskFromDb> => {
      const now = new Date();
      const result = await sql`
                INSERT INTO tasks (
                    project_id, id, title, description, is_done, ordinal, 
                    expected_completion_date_time, creation_date_time, last_modified_date_time
                ) VALUES (
                    ${task.project_id}, ${task.id}, ${task.title}, 
                    ${task.description || null}, ${task.is_done}, 
                    ${task.ordinal || null}, 
                    ${
                      task.expected_completion_date_time
                        ? new Date(task.expected_completion_date_time).toISOString()
                        : null
                    },
                    ${now}, ${now}
                )
                RETURNING *
            `;
      return result[0] as TaskFromDb;
    },

    // Update a task
    update: async (
      id: string,
      updates: Partial<
        Omit<TaskFromDb, "id" | "project_id" | "creation_date_time">
      >
    ): Promise<TaskFromDb | null> => {
      const now = new Date();
      const result = await sql`
                UPDATE tasks
                SET 
                    title = COALESCE(${updates.title}, title),
                    description = COALESCE(${updates.description}, description),
                    is_done = COALESCE(${updates.is_done}, is_done),
                    ordinal = COALESCE(${updates.ordinal}, ordinal),
                    expected_completion_date_time = COALESCE(${
                      updates.expected_completion_date_time
                        ? new Date(updates.expected_completion_date_time)
                        : null
                    }, expected_completion_date_time),
                    last_modified_date_time = ${now}
                WHERE id = ${id}
                RETURNING *
            `;
      return result.length > 0 ? (result[0] as TaskFromDb) : null;
    },

    // Delete a task
    delete: async (id: string): Promise<boolean> => {
      await sql`
                DELETE FROM tasks WHERE id = ${id}
            `;
      // Assume success if no error was thrown
      return true;
    },

    // Toggle task completion
    toggleComplete: async (id: string): Promise<TaskFromDb | null> => {
      const now = new Date();
      const result = await sql`
                UPDATE tasks 
                SET is_done = NOT is_done, last_modified_date_time = ${now}
                WHERE id = ${id}
                RETURNING *
            `;
      return result.length > 0 ? (result[0] as TaskFromDb) : null;
    },

    // Get all tasks
    getAll: async (): Promise<TaskFromDb[]> => {
      const result = await sql`
                SELECT * FROM tasks ORDER BY creation_date_time DESC
            `;
      return result as TaskFromDb[];
    },
  },
};
