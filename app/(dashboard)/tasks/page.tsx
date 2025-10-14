import BackButton from "@/app/components/ui/back-button";
import Link from "next/link";
import TasksPageComponent from "@/app/components/tasks/TasksPageComponent";

export default function TasksPage() {
  return (
    <div className="max-w-6xl mx-auto sm:p-8 text-black">
      <BackButton text="Dashboard" overrideRouter={"/"} />

      {/* <div className="flex justify-between items-center"> */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-600 mt-2">
            Manage tasks across all your projects
          </p>
        </div>
        <Link
          href="/tasks/new"
          // className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-150"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-150 text-center sm:inline-block w-full sm:w-auto"
        >
          + New Task
        </Link>
      </div>
      <TasksPageComponent />
    </div>
  );
}
