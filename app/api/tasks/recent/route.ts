import { db } from '@/app/lib/db';
import { TaskWithProject } from '@/app/lib/definitions';

// Helper function to get recent tasks with project info
async function getRecentTasksPreview() {
  try {
    const projects = await db.projects.getAll();
    const allTasks: TaskWithProject[] = [];

    for (const project of projects) {
      const tasks = await db.tasks.getByProjectId(project.id);
      const tasksWithProject = tasks.map(task => ({
        ...task,
        projectId: task.project_id,
        isDone: task.is_done,
        creationDateTime: task.creation_date_time,
        lastModifiedDateTime: task.last_modified_date_time,
        projectName: project.name,
        projectColor: project.hex_color,
      }));
      allTasks.push(...tasksWithProject);
    }

    return allTasks
      .sort((a, b) => new Date(b.creationDateTime).getTime() - new Date(a.creationDateTime).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching tasks preview:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  
  // Your existing getRecentTasksPreview logic here
  const tasks = await getRecentTasksPreview();
  return Response.json({ 
    tasks: tasks.slice(0, limit),
    generatedAt: new Date().toISOString()
  });
}
