import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { generateId } from '@/app/lib/utilities';

// Update to expect a Promise for params
interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams  // ← params is now a Promise
) {
  try {
    // Await the params first
    const { projectId } = await params;
    
    const tasks = await db.tasks.getByProjectId(projectId);  // ← Use the awaited projectId
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
  { params }: RouteParams  // ← params is now a Promise
) {
  try {
    // Await the params first
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
    const task = await db.tasks.create({
      projectId: projectId,  // ← Use the awaited projectId
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
