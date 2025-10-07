import TasksPageComponent from "@/app/components/tasks/TasksPageComponent";
import { BackButton } from "@/app/components/ui/back-button";
import Link from "next/link";

export default function TasksPage() {
  return (
    <div className="mb-8 max-w-6xl mx-auto p-8 text-black">
      <BackButton text="Dashboard" overrideRouter={'/'} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-600 mt-2">
            Manage tasks across all your projects
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          + New Task
        </Link>
      </div>
      <TasksPageComponent/>
    </div>
  );
}
