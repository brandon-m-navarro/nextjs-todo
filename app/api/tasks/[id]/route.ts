import { NextRequest, NextResponse } from "next/server";
import { db, mapTaskDbToType } from "@/app/lib/db";

// Update the interface to expect a Promise
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams // ← params is now a Promise
) {
  try {
    // Await the params first
    const { id } = await params;

    const dbTask = await db.tasks.getById(id);
    if (!dbTask) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    const task = mapTaskDbToType(dbTask);
    const project = await db.projects.getById(task.projectId);

    const taskWithProject = {
      ...task,
      projectName: project?.name || "Unknown Project",
      projectColor: project?.hex_color || null,
    };

    return NextResponse.json({ success: true, task: taskWithProject });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const task = await db.tasks.update(id, body);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await db.tasks.delete(id);

    return NextResponse.json({ 
      success: true, 
      message: "Task deleted successfully",
      response: response
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
