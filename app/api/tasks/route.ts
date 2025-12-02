import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utilities";
import { prisma } from "@/lib/prisma";

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
    const task = await prisma.task.create({ data: {
      projectId: projectId,
      id: taskId,
      title,
      description: description || null,
      isDone: isDone || false,
      ordinal: ordinal || null,
      expectedCompletionDateTime: expectedCompletionDateTime
        ? new Date(expectedCompletionDateTime)
        : null,
      creationDateTime: new Date(),
      lastModifiedDateTime: new Date(),
    } });

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

    let tasks;
    if (projectId) {
      tasks = await prisma.task.findMany({ where: { projectId: projectId } })
    } else {
      tasks = await prisma.task.findMany({ orderBy: { creationDateTime: 'desc' } })
    }

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
