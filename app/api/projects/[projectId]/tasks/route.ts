import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { generateId } from '@/app/lib/utilities';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const tasks = await db.tasks.getByProjectId(params.projectId);
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json();
    const taskId = generateId('TSK');
    const task = await db.tasks.create({
      ...body,
      id: taskId,
      projectId: params.projectId,
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
