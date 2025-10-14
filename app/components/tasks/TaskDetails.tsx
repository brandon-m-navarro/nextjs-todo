"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTaskContext } from "@/app/contexts/TaskContext";
import { useRouter } from "next/navigation";
import { Task } from "@/app/lib/definitions";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import { Project } from "@/app/lib/definitions";

interface TaskDetailProps {
  taskId: string;
}

export default function TaskDetail({ taskId }: TaskDetailProps) {
  const { updateTask, deleteTask, getTaskById, isLoading } = useTaskContext();
  const { getProjectById } = useProjectContext();
  const router = useRouter();
  const task = getTaskById(taskId);
  const [isDelete, setIsDelete] = useState(false);
  const [taskState, setTaskState] = useState<Task | null>(null);

  // Initialize taskState when task loads
  useEffect(() => {
    if (task && !taskState) {
      setTaskState(task);
    }
  }, [task, taskState]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
        
        <div className="space-y-6">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        <div className="mt-8 flex gap-4 pt-6 border-t border-gray-200">
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    );
  }

  // Show error states after loading is complete
  if (!task && !isDelete) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Task Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Unable to find task with ID: {taskId}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const associatedProject: Project | undefined = task
    ? getProjectById(task.projectId)
    : undefined;

  if (!associatedProject && !isDelete) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Project Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Unable to find associated project for this task
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Early return if deleting or data not ready
  if (isDelete || !task || !associatedProject || !taskState) {
    return null;
  }

  const handleToggleDone = () => {
    const updatedTask = {
      ...taskState,
      isDone: !taskState.isDone,
      lastModifiedDateTime: new Date(),
    };

    setTaskState(updatedTask);
    updateTask(updatedTask, () => {
      setTaskState(updatedTask);
    });
  };

  const handleDelete = () => {
    setIsDelete(true);
    if (confirm("Are you sure you want to delete this task?")) {
      // Optimistically navigate back
      router.back();
      deleteTask(taskState.id, (res) => {
        router.refresh();
        console.log("Deleted! - ", res);
      });
    } else {
      // If user cancels, reset delete state
      setIsDelete(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={taskState.isDone}
            onChange={handleToggleDone}
            className="h-6 w-6 rounded border-gray-300 text-blue-600 cursor-pointer"
          />
          <h2 className="text-2xl font-semibold text-gray-900">
            {taskState.title}
          </h2>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            taskState.isDone
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {taskState.isDone ? "Completed" : "Active"}
        </span>
      </div>

      {/* Task Content */}
      <div className="space-y-6">
        {/* Description */}
        {taskState.description && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 select-all">
              Description
            </h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
              {taskState.description}
            </p>
          </div>
        )}

        {/* Project Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project</h3>
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: "#" + associatedProject?.hexColor || "#3B82F6",
              }}
            />
            <span className="text-gray-700">{associatedProject?.name || 'PROJECT NOT FOUND'}</span>
            <Link
              href={`/projects/${taskState.projectId}`}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              View Project →
            </Link>
          </div>
        </div>

        {/* Due Date */}
        {taskState.expectedCompletionDateTime && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Due Date
            </h3>
            <p className="text-gray-600">
              {new Date(
                taskState.expectedCompletionDateTime
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}

        {/* Task Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Created
            </h3>
            <p className="text-gray-900">
              {new Date(taskState.creationDateTime).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Last Updated
            </h3>
            <p className="text-gray-900">
              {new Date(taskState.lastModifiedDateTime).toLocaleDateString()}
            </p>
          </div>

          {taskState.ordinal !== null && taskState.ordinal !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Priority
              </h3>
              <p className="text-gray-900">#{taskState.ordinal + 1}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete Task
        </button>
        <button
          onClick={handleToggleDone}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {taskState.isDone ? "Mark as Undone" : "Mark as Done"}
        </button>
      </div>
    </div>
  );
}
