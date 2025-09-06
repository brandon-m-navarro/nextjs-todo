import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    // You might need to add a getById method to your tasks db functions
    // For now, this is a placeholder
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const updates = await request.json();
    const task = await db.tasks.update(params.taskId, updates);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    await db.tasks.delete(params.taskId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
