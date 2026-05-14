import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utilities";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const tasks = await prisma.task.findMany({ where: { projectId: projectId } })

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
    const { title, userId, description, isDone, ordinal, expectedCompletionDateTime } =
      body;

    if (!title) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const taskId = generateId("TSK");

    const task = await prisma.task.create({ data: {
      projectId: projectId,
      id: taskId,
      userId,
      title,
      description: description || null,
      isDone: isDone || false,
      ordinal: ordinal || null,
      expectedCompletionDateTime: expectedCompletionDateTime
        ? new Date(expectedCompletionDateTime)
        : null,
      creationDateTime: new Date(),
      lastModifiedDateTime: new Date(),
    } })

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
