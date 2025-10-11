import ProvidersWrapper from "@/app/(dashboard)/providers-wrapper";
import { db } from "@/app/lib/db";

// Ensure the layout is dynamic and does not cache data
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAllTasks() {
  try {
    const tasks = await db.tasks.getAll();
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

async function getAllProjects() {
  try {
    const projects = await db.projects.getAll();
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
 console.log(projects);
 console.log(tasks);
  return (
    <ProvidersWrapper initialTasks={tasks} initialProjects={projects}>
      {children}
    </ProvidersWrapper>
  );
}
