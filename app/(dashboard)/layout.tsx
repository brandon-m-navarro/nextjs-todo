// app/projects/layout.tsx
import ProvidersWrapper from '@/app/(dashboard)/providers-wrapper';
import { db, mapProjectDbToType, mapTaskDbToType } from '@/app/lib/db';
import { Project, Task } from '@/app/lib/definitions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAllTasks() {
  try {
    // Direct database call - always fresh, no caching issues
    const tasksFromDb = await db.tasks.getAll();
    const tasks: Task[] = tasksFromDb.map((task) => mapTaskDbToType(task));
    
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

async function getAllProjects() {
  try {
    // Direct database call - always fresh, no caching issues
    const projectsFromDb = await db.projects.getAll();
    const projects: Project[] = projectsFromDb.map((project) => mapProjectDbToType(project));
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tasks = await getAllTasks();
  const projects = await getAllProjects();
  
  return (
    <ProvidersWrapper initialTasks={tasks} initialProjects={projects}>
      {children}
    </ProvidersWrapper>
  );
}
