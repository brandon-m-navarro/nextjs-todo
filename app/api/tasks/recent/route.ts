import { db } from "@/app/lib/db";
import { TaskWithProject } from "@/app/lib/definitions";
import { NextResponse, NextRequest } from "next/server";

async function getRecentTasksPreview() {
  try {
    const projects = await db.projects.getAll();
    const allTasks: TaskWithProject[] = [];

    for (const project of projects) {
      const tasks = await db.tasks.getByProjectId(project.id);
      const tasksWithProject = tasks.map((task) => ({
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
