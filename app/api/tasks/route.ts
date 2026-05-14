import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utilities";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Task } from "@/lib/definitions";
import { headers } from "next/headers";

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
    const task = await prisma.task.create({
      data: {
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
      },
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    const user = session?.user;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const isPrivate = searchParams.get("private");

    let tasks: Task[] = [];
    if (projectId) {
      tasks = await prisma.task.findMany({ where: { projectId: projectId } });
    } else if (isPrivate) {
      if (user) {
        tasks = await prisma.task.findMany({
          where: { userId: user.id },
          orderBy: { lastModifiedDateTime: "desc" },
        });
      }
    } else {
      let privateTasks: Task[] = [];
      if (user) {
        privateTasks = await prisma.task.findMany({
          where: { userId: user.id },
          orderBy: { lastModifiedDateTime: "desc" },
        });
      }
      const publicTasks = await prisma.task.findMany({
        where: { userId: null },
        orderBy: { lastModifiedDateTime: "desc" },
      });

      tasks = [...privateTasks, ...publicTasks].sort(
        (a, b) =>
          new Date(b.lastModifiedDateTime).getTime() -
          new Date(a.lastModifiedDateTime).getTime()
      );
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
