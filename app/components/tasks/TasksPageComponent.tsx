"use client";
import Link from "next/link";
import TaskList from "@/app/components/tasks/TaskList";
import TaskFilters from "@/app/components/tasks/TaskFilters";
import { Task, Project } from "@/lib/definitions";
import { useTaskContext } from "@/app/contexts/TaskContext";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import { useSearchParams } from "next/navigation";
import { Toggle } from "../ui/toggle";
import { useUserContext } from "@/app/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function TasksPageComponent() {
  const { tasks, isLoading } = useTaskContext();
  const { projects } = useProjectContext();
  const { userId, isLoggedIn } = useUserContext();

  // Search and filter rely on URL params
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get individual params with safety checks
  const project = searchParams?.get("project") || undefined;
  const status = searchParams?.get("status") as
    | "all"
    | "active"
    | "completed"
    | undefined;
  const sort = searchParams?.get("sort") as
    | "newest"
    | "oldest"
    | "due-date"
    | undefined;
  
  // Get isPrivate parameter and handle all cases
  const isPrivateParam = searchParams?.get("isPrivate");
  const showPrivateOnly = isLoggedIn && isPrivateParam === "true";

  // Filter projects based on isPrivate
  const projectsToShow = showPrivateOnly 
    ? projects.filter((project: Project) => project.userId === userId)
    : projects;

  // Filter tasks based on isPrivate
  const filteredByPrivate = tasks.filter((task: Task) => {
    if (!isLoggedIn) {
      return !task.userId;
    }
    
    // Show only user's own tasks
    if (showPrivateOnly) {
      return task.userId === userId;
    }
    
    // Show all tasks (both user's own and public)
    return true;
  });

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/tasks?${params.toString()}`);
  };

  // Apply other filters
  const filteredTasks = filteredByPrivate.filter((task: Task) => {
    if (project && task.projectId !== project) {
      return false;
    }
    if (status === "active" && task.isDone) {
      return false;
    }
    if (status === "completed" && !task.isDone) {
      return false;
    }
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a: Task, b: Task) => {
    switch (sort) {
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

  // Calculate task counts based on the filtered tasks
  const activeTasks = filteredByPrivate.filter((task: Task) => !task.isDone);
  const completedTasks = filteredByPrivate.filter((task: Task) => task.isDone);
  const currentProject = project
    ? projectsToShow.find((p: Project) => p.id === project)
    : null;

  return (
    <div className="max-w-6xl mx-auto text-black">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow text-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
            Total
          </h3>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-blue-500 mx-auto"></div>
          ) : (
            <p className="text-lg sm:text-xl md:text-3xl font-bold">
              {filteredByPrivate.length}
            </p>
          )}
        </div>
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow text-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
            Active
          </h3>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-blue-500 mx-auto"></div>
          ) : (
            <p className="text-lg sm:text-xl md:text-3xl font-bold text-blue-600">
              {activeTasks.length}
            </p>
          )}
        </div>
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow text-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
            Completed
          </h3>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-blue-500 mx-auto"></div>
          ) : (
            <p className="text-lg sm:text-xl md:text-3xl font-bold text-green-600">
              {completedTasks.length}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      {isLoading ? (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
          <div className="flex justify-center items-center h-24 sm:h-32">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            {isLoggedIn && (
              <Toggle
                label="Show only my tasks"
                className="ml-auto"
                onChange={(pressed) => {
                  updateUrl({ isPrivate: pressed ? "true" : "" });
                }}
              />
            )}
          </div>
          <TaskFilters
            projects={projectsToShow}
            currentProject={project}
            currentStatus={status}
            currentSort={sort}
          />
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          {!isLoading && (
            <h2 className="text-lg sm:text-xl font-semibold">
              Tasks ({filteredTasks.length})
              {project && currentProject && (
                <span className="text-gray-600 text-base sm:text-lg font-normal ml-2">
                  in {currentProject.name}
                </span>
              )}
            </h2>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedTasks.length > 0 ? (
          <TaskList tasksToShow={sortedTasks} />
        ) : (
          <div className="p-6 sm:p-12 text-center">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📝</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {tasks.length === 0
                ? "No tasks yet"
                : "No tasks match your filters"}
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {tasks.length === 0
                ? "Create your first task to get started"
                : "Try changing your filters or create a new task"}
            </p>
            <Link
              href="/tasks/new"
              className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              Create Task
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}