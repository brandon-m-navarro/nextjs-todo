import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { Task } from "@/app/lib/definitions";

// Update the interface to expect a Promise
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

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
      projectColor: project?.hexColor || null,
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
