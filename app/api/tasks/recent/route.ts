import { TaskWithProject, Task } from "@/lib/definitions";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getRecentTasksPreview() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const user = session?.user;

    let recentTasks: Task[] = [];
    if (user) {
      recentTasks = await prisma.task.findMany({
        orderBy: { lastModifiedDateTime: "desc" },
        take: 5,
        where: {
          OR: [
            { userId: user.id }, // matches the logged-in user's tasks
            { userId: null }, // and tasks that are not assigned to any user
          ],
        },
      });
    } else {
      recentTasks = await prisma.task.findMany({
        orderBy: { lastModifiedDateTime: "desc" },
        take: 5,
        where: { userId: null },
      });
    }

    // Loop through recent tasks to get collection of reference projectIds
    const projectIds: string[] = [];
    for (let i = 0; i < recentTasks.length; i++) {
      if (!projectIds.includes(recentTasks[i].projectId)) {
        projectIds.push(recentTasks[i].projectId);
      }
    }

    // Fetch projects
    const projects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
    });

    // Loop through Tasks and match them with their project
    const allTasks: TaskWithProject[] = [];
    for (let i = 0; i < recentTasks.length; i++) {
      const associatedProject = projects.find((project) => {
        return project.id === recentTasks[i].projectId;
      });

      if (associatedProject) {
        const taskWithProject = {
          ...recentTasks[i],
          projectName: associatedProject.name,
          projectColor: associatedProject.hexColor,
        };

        allTasks.push(taskWithProject);

        // Stop processing when we get needed number of Tasks
        if (allTasks.length > 5) {
          break;
        }
      } else {
        console.error("Error finding associated task with project");
      }
    }

    return allTasks
      .sort(
        (a, b) =>
          new Date(b.lastModifiedDateTime).getTime() -
          new Date(a.lastModifiedDateTime).getTime()
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
