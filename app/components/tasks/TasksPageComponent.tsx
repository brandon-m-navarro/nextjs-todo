'use client'
import Link from "next/link";
import { TaskList } from "@/app/components/tasks/TaskList";
import { TaskFilters } from "@/app/components/tasks/TaskFilters";
import { Task, Project } from "@/app/lib/definitions";
import { useTaskContext } from "@/app/contexts/TaskContext";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import { useSearchParams } from "next/navigation";

// Define the search params type
interface SearchParams {
  project?: string;
  status?: "all" | "active" | "completed";
  sort?: "newest" | "oldest" | "due-date";
}

export default function TasksPageComponent() {
  const searchParams = useSearchParams();

  // Get individual params with proper typing
  const project = searchParams.get('project') || undefined;
  const status = searchParams.get('status') as "all" | "active" | "completed" | undefined;
  const sort = searchParams.get('sort') as "newest" | "oldest" | "due-date" | undefined;

  const resolvedSearchParams = { project, status, sort };

  // Fetch data from contexts
  const { tasks } = useTaskContext();
  const { projects } = useProjectContext();

  // Apply filters
  const filteredTasks = tasks.filter((task: Task) => {
    // Project filter
    if (
      resolvedSearchParams?.project &&
      task.projectId !== resolvedSearchParams.project
    ) {
      return false;
    }

    // Status filter
    if (resolvedSearchParams?.status === "active" && task.isDone) {
      return false;
    }
    if (resolvedSearchParams?.status === "completed" && !task.isDone) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedTasks = filteredTasks.sort((a: Task, b: Task) => {
    switch (resolvedSearchParams?.sort) {
      case "oldest":
        return (
          new Date(a.creationDateTime).getTime() -
          new Date(b.creationDateTime).getTime()
        );
      case "due-date":
        if (!a.expectedCompletionDateTime) return 1;
        if (!b.expectedCompletionDateTime) return -1;
        return (
          new Date(a.expectedCompletionDateTime).getTime() -
          new Date(b.expectedCompletionDateTime).getTime()
        );
      case "newest":
      default:
        return (
          new Date(b.creationDateTime).getTime() -
          new Date(a.creationDateTime).getTime()
        );
    }
  });

  const activeTasks = tasks.filter((task: Task) => !task.isDone);
  const completedTasks = tasks.filter((task: Task) => task.isDone);

  return (
    <div className="max-w-6xl mx-auto text-black">

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">
            {activeTasks.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {completedTasks.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <TaskFilters
          projects={projects}
          currentProject={resolvedSearchParams?.project}
          currentStatus={resolvedSearchParams?.status}
          currentSort={resolvedSearchParams?.sort}
        />
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            Tasks ({filteredTasks.length})
            {resolvedSearchParams?.project && (
              <span className="text-gray-600 text-lg font-normal ml-2">
                in{" "}
                {
                  projects.find(
                    (p: Project) => p.id === resolvedSearchParams.project
                  )?.name
                }
              </span>
            )}
          </h2>
        </div>

        {sortedTasks.length > 0 ? (
          <TaskList tasksToShow={sortedTasks} />
        ) : (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {tasks.length === 0
                ? "No tasks yet"
                : "No tasks match your filters"}
            </h3>
            <p className="text-gray-600 mb-6">
              {tasks.length === 0
                ? "Create your first task to get started"
                : "Try changing your filters or create a new task"}
            </p>
            <Link
              href="/tasks/new"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Task
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
