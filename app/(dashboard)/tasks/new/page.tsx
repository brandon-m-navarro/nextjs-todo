import BackButton from "@/app/components/ui/back-button";
import TaskForm from "@/app/components/tasks/TaskForm";

interface NewTaskPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function NewTaskPage({ params }: NewTaskPageProps) {
  const resolvedParams = await params;

  const initialProjectId = resolvedParams.id || "";

  return (
    <div className="max-w-6xl mx-auto p-0 pb-15 sm:p-8">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Task
        </h1>
        <p className="text-gray-600">Add a new task to your project</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TaskForm initialProjectId={initialProjectId} />
      </div>
    </div>
  );
}
