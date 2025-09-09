import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { generateId } from '@/app/lib/utilities';

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
    const task = await db.tasks.create({
      projectId,
      id: taskId,
      title,
      description,
      isDone: isDone || false,
      ordinal,
      expectedCompletionDateTime
    });

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
    // Get query parameters for filtering if needed
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    let tasks;
    if (projectId) {
      // Get tasks for a specific project
      tasks = await db.tasks.getByProjectId(projectId);
    } else {
      // Get all tasks
      tasks = await db.tasks.getAll();
    }
    
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
