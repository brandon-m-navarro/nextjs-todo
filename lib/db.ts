import "server-only";
import { neon } from "@neondatabase/serverless";
import type {
  TaskFromDb,
  ProjectFromDb,
  Project,
  Task,
} from "@/lib/definitions";

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
    getAll: async (): Promise<Project[]> => {
      const result = await sql`
                SELECT * FROM projects ORDER BY creation_date_time DESC
            `;
      const projectsFromDb = result as ProjectFromDb[];
      const projectsMapped = projectsFromDb.map(mapProjectDbToType);
      return projectsMapped;
    },

    // Get a project by ID
    getById: async (id: string): Promise<Project | null> => {
      const result = await sql`
                SELECT * FROM projects WHERE id = ${id}
            `;
      const projectFromDb = result.length > 0 ? (result[0] as ProjectFromDb) : null;
      const projectMapped = projectFromDb ? mapProjectDbToType(projectFromDb) : null;
      return projectMapped;
    },

    // Create a new project
    create: async (
      id: string,
      name: string,
      description?: string,
      hexColor?: string,
      icon?: string
    ): Promise<Project> => {
      const now = new Date();
      const result = await sql`
                INSERT INTO projects (id, name, description, hex_color, icon, creation_date_time, last_modified_date_time)
                VALUES (${id}, ${name}, ${description || null}, ${
        hexColor || null
      }, ${icon || null}, ${now}, ${now})
                RETURNING *
            `;

      const projectFromDb = result[0] as ProjectFromDb;
      const projectMapped = mapProjectDbToType(projectFromDb);
      return projectMapped;
    },

    // Update a project
    update: async (
      id: string,
      updates: {
        name?: string;
        description?: string | null;
        hexColor: string;
        icon?: string;
      }
    ): Promise<Project | null> => {
      const now = new Date();

      const result = await sql`
        UPDATE projects
        SET 
            name = ${updates.name ?? undefined},
            description = ${updates.description ?? undefined},
            hex_color = ${updates.hexColor ?? undefined},
            icon = ${updates.icon ?? undefined},
            last_modified_date_time = ${now}
        WHERE id = ${id}
        RETURNING *
    `;
      const projectFromDb = result.length > 0 ? (result[0] as ProjectFromDb) : null;
      const projectMapped = projectFromDb ? mapProjectDbToType(projectFromDb) : null;
      return projectMapped;
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
    getById: async (id: string): Promise<Task | null> => {
      const result = await sql`
                SELECT * FROM tasks WHERE id = ${id}
            `;
      const taskFromDb = result.length > 0 ? (result[0] as TaskFromDb) : null;
      const taskMapped = taskFromDb ? mapTaskDbToType(taskFromDb) : null;
      return taskMapped;
    },

    // Get tasks by project ID
    getByProjectId: async (projectId: string): Promise<Task[]> => {
      const result = await sql`
                SELECT * FROM tasks WHERE project_id = ${projectId} ORDER BY creation_date_time DESC
            `;
      const tasksFromDb = result as TaskFromDb[];
      const tasksMapped = tasksFromDb.map(mapTaskDbToType);
      return tasksMapped;
    },

    // Create a new task
    create: async (
      task: Omit<Task, "creationDateTime" | "lastModifiedDateTime">
    ): Promise<Task> => {
      const now = new Date();
      const result = await sql`
                INSERT INTO tasks (
                    project_id, id, title, description, is_done, ordinal, 
                    expected_completion_date_time, creation_date_time, last_modified_date_time
                ) VALUES (
                    ${task.projectId}, ${task.id}, ${task.title}, 
                    ${task.description || null}, ${task.isDone}, 
                    ${task.ordinal || null}, 
                    ${
                      task.expectedCompletionDateTime
                        ? new Date(
                            task.expectedCompletionDateTime
                          ).toISOString()
                        : null
                    },
                    ${now}, ${now}
                )
                RETURNING *
            `;
      const taskFromDb = result[0] as TaskFromDb;
      const taskMapped = mapTaskDbToType(taskFromDb);
      return taskMapped;
    },

    // Update a task
    update: async (
      id: string,
      updates: Partial<Task>
    ): Promise<Task | null> => {
      const now = new Date();

      // Validate non-nullable fields first
      if (updates.title !== undefined) {
        if (updates.title === null || updates.title.trim() === '') {
          throw new Error('Title cannot be null or empty');
        }
      }
      if (updates.isDone !== undefined && typeof updates.isDone !== 'boolean') {
        throw new Error('is_done must be a boolean');
      }

      const result = await sql`
        UPDATE tasks
        SET 
          last_modified_date_time = ${now}
          ${updates.projectId !== undefined ? sql`, project_id = ${updates.projectId}` : sql``}
          ${updates.title !== undefined ? sql`, title = ${updates.title}` : sql``}
          ${updates.description !== undefined ? sql`, description = ${updates.description}` : sql``}
          ${updates.isDone !== undefined ? sql`, is_done = ${updates.isDone}` : sql``}
          ${updates.ordinal !== undefined ? sql`, ordinal = ${updates.ordinal}` : sql``}
          ${
            updates.expectedCompletionDateTime !== undefined 
              ? sql`, expected_completion_date_time = ${
                  updates.expectedCompletionDateTime 
                    ? new Date(updates.expectedCompletionDateTime)
                    : null
                }`
              : sql``
          }
        WHERE id = ${id}
        RETURNING *
      `;

      const taskFromDb = result.length > 0 ? (result[0] as TaskFromDb) : null;
      const taskMapped = taskFromDb ? mapTaskDbToType(taskFromDb) : null;
      return taskMapped;
    },

    // Delete a task
    delete: async (id: string): Promise<boolean> => {
      await sql`DELETE FROM tasks WHERE id = ${id}`;
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
    getAll: async (): Promise<Task[]> => {
      const result = await sql`
                SELECT * FROM tasks ORDER BY creation_date_time DESC
            `;
      const tasksFromDb = result as TaskFromDb[];
      const tasksMapped = tasksFromDb.map(mapTaskDbToType);
      return tasksMapped;
    },
  },
};
