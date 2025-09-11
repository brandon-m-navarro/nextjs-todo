import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { generateId } from '@/app/lib/utilities';
import { Task, TaskFromDb } from '@/app/lib/definitions';

// Mapping function: snake_case DB fields to camelCase Task type
function mapTaskDbToType(taskFromDb: TaskFromDb): Task {
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

// Update to expect a Promise for params
interface RouteParams {
    params: Promise<{
        projectId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { projectId } = await params;
        const dbTasks = await db.tasks.getByProjectId(projectId);
        // Map all tasks to camelCase
        const tasks = dbTasks.map(mapTaskDbToType);
        return NextResponse.json({ success: true, tasks });
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { projectId } = await params;
        const body = await request.json();
        const { title, description, isDone, ordinal, expectedCompletionDateTime } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Task title is required' },
                { status: 400 }
            );
        }

        const taskId = generateId('TSK');
        const dbTask = await db.tasks.create({
            project_id: projectId,
            id: taskId,
            title,
            description,
            is_done: isDone || false,
            ordinal,
            expected_completion_date_time: expectedCompletionDateTime
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
