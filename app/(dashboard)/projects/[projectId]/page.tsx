import { TaskForm } from "@/app/components/tasks/TaskForm";
import { TaskList } from "@/app/components/tasks/TaskList";
import { getTasksByProjectId } from '@/app/lib/data';

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = params;
  const tasks = await getTasksByProjectId(projectId);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Project: {projectId}</h1>
      <TaskForm projectId={projectId} />
      <TaskList tasks={tasks} />
    </div>
  );
}
