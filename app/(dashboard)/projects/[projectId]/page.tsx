import { TaskManager } from "@/app/components/tasks/TaskManager";
import { BackButton } from "@/app/components/ui/back-button";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

async function getProject(projectId: string) {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://nextjs-todo-lake.vercel.app"
        : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

async function getProjectTasks(projectId: string) {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://nextjs-todo-lake.vercel.app"
        : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/projects/${projectId}/tasks`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Await the params object first
  const { projectId } = await params;

  // Fetch both project and tasks from API routes
  const [project, tasks] = await Promise.all([
    getProject(projectId),
    getProjectTasks(projectId),
  ]);

  return (
    <div className="p-8 text-black">
      <BackButton text="All Projects" />

      {/* Project Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Project: {project.name}</h1>
        {project.description && (
          <p className="text-gray-600 text-sm max-w-md">
            {project.description}
          </p>
        )}
      </div>

      {/* Task Form Accordion */}
      <TaskManager project={project} initialTasks={tasks} />
    </div>
  );
}
