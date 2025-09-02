import { neon } from '@neondatabase/serverless';
import { Task } from '@/app/lib/definitions';
import { Project } from '@/app/lib/definitions';

const sql = neon(process.env.DATABASE_URL!);

// Database interaction functions

export const db = {

    /* Project operations */
    projects: {
        // Get all projects
        getAll: async (): Promise<Project[]> => {
            const result = await sql`
                SELECT * FROM projects ORDER BY creation_date_time DESC
            `;
            return result as Project[];
        },

        // Get a project by ID
        getById: async (id: string): Promise<Project | null> => {
            const result = await sql`
                SELECT * FROM projects WHERE id = ${id}
            `;
            return result.length > 0 ? (result[0] as Project) : null;
        },

        // Create a new project
        create: async (name: string, description?: string): Promise<Project> => {
            const now = Date.now();
            const result = await sql`
                INSERT INTO projects (name, description, creation_date_time, last_modified_date_time)
                VALUES (${name}, ${description || null}, ${now}, ${now})
                RETURNING *
            `;
            return result[0] as Project;
        },

        // Update a project
        update: async (id: string, name: string, description?: string): Promise<Project | null> => {
            const now = Date.now();
            const result = await sql`
                UPDATE projects
                SET name = ${name}, description = ${description || null}, last_modified_date_time = ${now}
                WHERE id = ${id}
                RETURNING *
            `;
            return result.length > 0 ? (result[0] as Project) : null;
        },

        // Delete a project
        delete: async (id: string): Promise<boolean> => {
            const result = await sql`
                DELETE FROM projects WHERE id = ${id}
            `;
            return result.length > 0;
        },
    },

    /* Task operations */
    tasks: {
        // Get tasks by project ID
        getByProjectId: async (projectId: string): Promise<Task[]> => {
            const result = await sql`
                SELECT * FROM tasks WHERE project_id = ${projectId} ORDER BY creation_date_time DESC
            `;
            return result as Task[];
        },

        // Create a new task
        create: async (task: Omit<Task, 'creationDateTime' | 'lastModifiedDateTime'>): Promise<Task> => {
            const now = Date.now();
            const result = await sql`
                INSERT INTO tasks (project_id, title, description, is_done, ordinal, expected_completion_date_time, creation_date_time, last_modified_date_time)
                VALUES (${task.projectId}, ${task.title}, ${task.description || null}, ${task.isDone}, ${task.ordinal || null}, ${task.expectedCompletionDateTime || null}, ${now}, ${now})
                RETURNING *
            `;
            return result[0] as Task;
        },

        // Update a task
        update: async (id: number, updates: Partial<Omit<Task, 'projectId' | 'creationDateTime' | 'lastModifiedDateTime'>>): Promise<Task | null> => {
            const now = Date.now();
            const fields = Object.keys(updates).map(key => `${key} = ${updates[key as keyof typeof updates]}`);
            if (fields.length === 0) return null;
            const fieldString = fields.join(', ');

            const result = await sql`
                UPDATE tasks
                SET ${fieldString}, last_modified_date_time = ${now}
                WHERE id = ${id}
                RETURNING *
            `;
            return result.length > 0 ? (result[0] as Task) : null;
        },

        // Delete a task
        delete: async (id: number): Promise<boolean> => {
            const result = await sql`
                DELETE FROM tasks WHERE id = ${id}
            `;
            return result.length > 0;
        },
    },
}
