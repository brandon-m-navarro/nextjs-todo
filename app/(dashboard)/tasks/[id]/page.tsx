import BackButton from "@/app/components/ui/back-button";
import Link from "next/link";
import TaskDetail from "@/app/components/tasks/TaskDetails";

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  // Dynamic routes must be awaited
  const { id } = await params;

  return (
    <div className="max-w-6xl mx-auto pb-15 sm:p-8">
      <div className="mb-8">
        <BackButton />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
          <Link
            href={`/tasks/${id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit Task
          </Link>
        </div>
      </div>

      <TaskDetail taskId={id} />
    </div>
  );
}
