/*
 * ProjectPage (/projects/[projectId]) needs to be asynchronous because its a dynamic
 * route (uses [ ] in route/path). This prevents it from being a client-component,
 * which is nescessary to use contexts (ProjectContext). To get around this, this
 * component needs to be made to encapsulate all client logic.
 */

'use client';
import { TaskManager } from "@/app/components/tasks/TaskManager";
import { BackButton } from "@/app/components/ui/back-button";
import { useProjectContext } from "@/app/contexts/ProjectContext";

interface ProjectPageComponentProps {
    projectId: string;
}

// async function getProject(projectId: string) {
//   try {
//     const baseUrl =
//       process.env.NODE_ENV === "production"
//         ? "https://nextjs-todo-lake.vercel.app"
//         : "http://localhost:3000";

//     const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
//       next: { revalidate: 60 },
//     });

//     if (!response.ok) {
//       return null;
//     }

//     const data = await response.json();
//     return data.project;
//   } catch (error) {
//     console.error("Error fetching project:", error);
//     return null;
//   }
// }

// async function getProjectTasks(projectId: string) {
//   try {
//     const baseUrl =
//       process.env.NODE_ENV === "production"
//         ? "https://nextjs-todo-lake.vercel.app"
//         : "http://localhost:3000";

//     const response = await fetch(`${baseUrl}/api/projects/${projectId}/tasks`, {
//       next: { revalidate: 30 },
//     });

//     if (!response.ok) {
//       return [];
//     }

//     const data = await response.json();
//     return data.tasks || [];
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     return [];
//   }
// }

export default function ProjectPageComponent({ projectId }: ProjectPageComponentProps) {
    const { getProjectById } = useProjectContext();
    const project = getProjectById(projectId);

    if (!project) throw new Error('Unabale to get project - ' + projectId);

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
        {/* Task Manager */}
        <TaskManager project={project} />
        </div>
    );
}
