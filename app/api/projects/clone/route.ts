import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { generateId } from "@/lib/utilities";
import { Task } from "@/lib/definitions";

export async function POST(
  request: NextRequest,
) {
    const body = await request.json();
  const { projectId } = body;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the original project
    const originalProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!originalProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const generatedProjectId = generateId("PRO");
    
    // Clone the project (excluding the id and timestamps)
    const clonedProject = await prisma.project.create({
      data: {
        id: generatedProjectId,
        name: originalProject.name + " (Clone)",
        description: originalProject.description,
        hexColor: originalProject.hexColor,
        icon: originalProject.icon,
        userId: user.id,
      },
    });

    // Create tasks associated with the cloned project
    const originalTasks = await prisma.task.findMany({
      where: { projectId: originalProject.id },
    });

    const clonedTasksData:Task[] = originalTasks.map((task) => ({
      id: generateId("TSK"),
      title: task.title,
      description: task.description,
      isDone: task.isDone,
      ordinal: task.ordinal,
      expectedCompletionDateTime: task.expectedCompletionDateTime,
      projectId: clonedProject.id, // Associate with the cloned project
      userId: user.id,
      creationDateTime: task.creationDateTime,
      lastModifiedDateTime: task.lastModifiedDateTime
    }));

    const clonedTasks: Task[] = await prisma.task.createManyAndReturn({
      data: clonedTasksData,
    });

    return NextResponse.json(
      { success: true, project: clonedProject, tasks: clonedTasks },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error cloning project:", error);
    return NextResponse.json(
      { error: "Failed to clone project" },
      { status: 500 }
    );
  }
}
