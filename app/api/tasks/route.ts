import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { generateId } from '@/app/lib/utilities';
import { Task } from '@/app/lib/definitions';

function mapTaskDbToType(taskFromDb: any): Task {
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
        // Add other fields as needed
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { projectId, title, description, isDone, ordinal, expectedCompletionDateTime } = body;

        if (!projectId || !title) {
            return NextResponse.json(
                { error: 'Project ID and task title are required' },
                { status: 400 }
            );
        }

        const taskId = generateId('TSK');
        const dbTask = await db.tasks.create({
            projectId,
            id: taskId,
            title,
            description,
            isDone: isDone || false,
            ordinal,
            expectedCompletionDateTime
        });

        // Map DB result to camelCase
        const task = mapTaskDbToType(dbTask);

        return NextResponse.json(
            { success: true, task },
            { status: 201 }
        );
    } catch (error) {
        console.error('Failed to create task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        let dbTasks;
        if (projectId) {
            dbTasks = await db.tasks.getByProjectId(projectId);
        } else {
            dbTasks = await db.tasks.getAll();
        }

        // Map all tasks to camelCase
        const tasks = dbTasks.map(mapTaskDbToType);

        return NextResponse.json({ success: true, tasks });
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}
