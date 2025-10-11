import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { generateId } from "@/app/lib/utilities";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const tasks = await db.tasks.getByProjectId(projectId);

    // Map all tasks (snake_case -> camelCase)
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const body = await request.json();
    const { title, description, isDone, ordinal, expectedCompletionDateTime } =
      body;

    if (!title) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const taskId = generateId("TSK");

    // db expects snake_case for properties
    const task = await db.tasks.create({
      projectId: projectId,
      id: taskId,
      title,
      description,
      isDone: isDone || false,
      ordinal,
      expectedCompletionDateTime: expectedCompletionDateTime,
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
