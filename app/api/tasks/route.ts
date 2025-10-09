import { NextRequest, NextResponse } from "next/server";
import { db, mapTaskDbToType } from "@/app/lib/db";
import { generateId } from "@/app/lib/utilities";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      title,
      description,
      isDone,
      ordinal,
      expectedCompletionDateTime,
    } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: "Project ID and task title are required" },
        { status: 400 }
      );
    }

    const taskId = generateId("TSK");

    // Use snake_case for db properties
    const dbTask = await db.tasks.create({
      project_id: projectId,
      id: taskId,
      title,
      description,
      is_done: isDone || false,
      ordinal,
      expected_completion_date_time: expectedCompletionDateTime,
    });

    // Map db result (snake_case -> camelCase)
    const task = mapTaskDbToType(dbTask);

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let dbTasks;
    if (projectId) {
      dbTasks = await db.tasks.getByProjectId(projectId);
    } else {
      dbTasks = await db.tasks.getAll();
    }

    // Map all tasks (snake_case -> camelCase)
    const tasks = dbTasks.map(mapTaskDbToType);

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
