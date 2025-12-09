import { TaskWithProject, Task, Project } from "@/lib/definitions";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getRecentTasksPreview() {
  try {
    const session = await auth.api.getSession();
    const user = session?.user;

    const publicProjects = await prisma.project.findMany({
      orderBy: { lastModifiedDateTime: "desc" },
      take: 5,
      where: { userId: null },
    });

    let privateProjects: Project[] = [];
    if (user) {
      privateProjects = await prisma.project.findMany({
        orderBy: { lastModifiedDateTime: "desc" },
        take: 5,
        where: { userId: user.id },
      });
    }

    const projects = [...publicProjects, ...privateProjects];
    const allTasks: TaskWithProject[] = [];

    for (const project of projects) {
      const publicTasks = await prisma.task.findMany({
        orderBy: { lastModifiedDateTime: "desc" },
        take: 5,
        where: { userId: null },
      });

      let privateTasks: Task[] = [];
      if (user) {
        privateTasks = await prisma.task.findMany({
          orderBy: { lastModifiedDateTime: "desc" },
          take: 5,
          where: { userId: user.id },
        });
      }
      const tasks = [...privateTasks, ...publicTasks];

      const tasksWithProject = tasks.map((task: Task) => ({
        ...task,
        projectId: task.projectId,
        isDone: task.isDone,
        creationDateTime: task.creationDateTime,
        lastModifiedDateTime: task.lastModifiedDateTime,
        projectName: project.name,
        projectColor: project.hexColor,
      }));
      allTasks.push(...tasksWithProject);
    }

    return allTasks
      .sort(
        (a, b) =>
          new Date(b.creationDateTime).getTime() -
          new Date(a.creationDateTime).getTime()
      )
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching tasks preview:", error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  // searchParams is used to get the limit query parameter
  const { searchParams } = new URL(request.url);

  // limit is optional, default to 5
  const limit = parseInt(searchParams.get("limit") || "5");

  // Fetch recent tasks with project info
  const tasks = await getRecentTasksPreview();

  return NextResponse.json({ success: true, tasks: tasks.slice(0, limit) });
}
