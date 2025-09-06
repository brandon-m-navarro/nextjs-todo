import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { generateId } from '@/app/lib/utilities';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const tasks = await db.tasks.getByProjectId(projectId);
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
