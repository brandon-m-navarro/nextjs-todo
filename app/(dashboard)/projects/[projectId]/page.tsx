import Link from "next/link";
import { TaskManager } from "@/app/components/tasks/TaskManager";

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

  if (!project) {
    return (
      <div className="p-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-red-600">Project not found</h1>
      </div>
    );
  }

  // Add project info to each task
  // const tasksWithProject = tasks.map((task: Task) => ({
  //   ...task,
  //   projectName: project.name,
  //   projectColor: project.hexColor,
  // }));

  return (
    <div className="p-8 text-black">
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6 transition-colors group"
      >
        <svg
          className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to All Projects
      </Link>

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
