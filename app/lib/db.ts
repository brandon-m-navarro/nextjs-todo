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
                VALUES (${id}, ${name}, ${description || null}, ${hexColor || null}, ${icon || null}, ${now}, ${now})
                RETURNING *
            `;
            return result[0] as Project;
        },

        // Update a project
        update: async (
            id: string, 
            updates: { 
                name?: string; 
                description?: string; 
                hexColor?: string; 
                icon?: string 
            }
        ): Promise<Project | null> => {
            const now = new Date();
            const result = await sql`
                UPDATE projects
                SET 
                    name = COALESCE(${updates.name}, name),
                    description = COALESCE(${updates.description}, description),
                    hex_color = COALESCE(${updates.hexColor}, hex_color),
                    icon = COALESCE(${updates.icon}, icon),
                    last_modified_date_time = ${now}
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
            // For DELETE operations without RETURNING, result is usually an empty array
            // We'll assume success if no error was thrown
            return true;
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
            const now = new Date();
            const result = await sql`
                INSERT INTO tasks (
                    project_id, id, title, description, is_done, ordinal, 
                    expected_completion_date_time, creation_date_time, last_modified_date_time
                ) VALUES (
                    ${task.projectId}, ${task.id}, ${task.title}, 
                    ${task.description || null}, ${task.isDone}, 
                    ${task.ordinal || null}, 
                    ${task.expectedCompletionDateTime ? new Date(task.expectedCompletionDateTime) : null},
                    ${now}, ${now}
                )
                RETURNING *
            `;
            return result[0] as Task;
        },

        // Update a task
        update: async (id: string, updates: Partial<Omit<Task, 'id' | 'projectId' | 'creationDateTime'>>): Promise<Task | null> => {
            const now = new Date();
            const result = await sql`
                UPDATE tasks
                SET 
                    title = COALESCE(${updates.title}, title),
                    description = COALESCE(${updates.description}, description),
                    is_done = COALESCE(${updates.isDone}, is_done),
                    ordinal = COALESCE(${updates.ordinal}, ordinal),
                    expected_completion_date_time = COALESCE(${updates.expectedCompletionDateTime ? new Date(updates.expectedCompletionDateTime) : null}, expected_completion_date_time),
                    last_modified_date_time = ${now}
                WHERE id = ${id}
                RETURNING *
            `;
            return result.length > 0 ? (result[0] as Task) : null;
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
        toggleComplete: async (id: string): Promise<Task | null> => {
            const now = new Date();
            const result = await sql`
                UPDATE tasks 
                SET is_done = NOT is_done, last_modified_date_time = ${now}
                WHERE id = ${id}
                RETURNING *
            `;
            return result.length > 0 ? (result[0] as Task) : null;
        },
    },
};
