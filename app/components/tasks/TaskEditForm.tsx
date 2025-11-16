"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/lib/definitions";
import { useTaskContext } from "@/app/contexts/TaskContext";
import { useProjectContext } from "@/app/contexts/ProjectContext";

interface TaskEditFormProps {
  taskId: string;
}

export default function TaskEditForm({ taskId }: TaskEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { getTaskById, updateTask, isLoading } = useTaskContext();
  const { projects, isLoading: projectsLoading } = useProjectContext();
  const task = getTaskById(taskId);

  // Initialize form data with task or empty values
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    isDone: task?.isDone || false,
    ordinal: task?.ordinal || null,
    expectedCompletionDateTime: task?.expectedCompletionDateTime
      ? new Date(task.expectedCompletionDateTime).toISOString().slice(0, 16)
      : "",
    projectId: task?.projectId || "",
  });

  // Update form data when task loads
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        isDone: task.isDone,
        ordinal: task.ordinal || null,
        expectedCompletionDateTime: task.expectedCompletionDateTime
          ? new Date(task.expectedCompletionDateTime).toISOString().slice(0, 16)
          : "",
        projectId: task.projectId,
      });
    }
  }, [task]);

  // Show loading state while data is being fetched
  if (isLoading || projectsLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="space-y-6">
          {/* Title Skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>

          {/* Description Skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>

          {/* Project Selection Skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>

          {/* Status Skeleton */}
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32 ml-2"></div>
          </div>

          {/* Priority Skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>

          {/* Due Date Skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div className="h-12 bg-gray-200 rounded w-24"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if task not found
  if (!task) {
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const updatedTask: Task = {
        ...task,
        id: task.id,
        title: formData.title,
        description: formData.description || null,
        isDone: formData.isDone,
        projectId: formData.projectId,
        ordinal: formData.ordinal ? Number(formData.ordinal) : null,
        expectedCompletionDateTime: formData.expectedCompletionDateTime
          ? new Date(formData.expectedCompletionDateTime)
          : null,
      };
      updateTask(updatedTask, (res) => {
        if (res?.success === false) {
          setError(res.error || "Failed to update task");
          return;
        } else if (res?.task) {
          router.replace(`/tasks/${task.id}`);
          router.back();
          router.refresh();
        }
      });
    } catch (error) {
      console.error("Error updating task:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update task"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Project Selection */}
        <div>
          <label
            htmlFor="projectId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Project
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDone"
            name="isDone"
            checked={formData.isDone}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isDone" className="ml-2 block text-sm text-gray-900">
            Mark as completed
          </label>
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="ordinal"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Priority (lower number = higher priority)
          </label>
          <input
            type="number"
            id="ordinal"
            name="ordinal"
            value={formData.ordinal + ""}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Due Date */}
        <div>
          <label
            htmlFor="expectedCompletionDateTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Due Date
          </label>
          <input
            type="datetime-local"
            id="expectedCompletionDateTime"
            name="expectedCompletionDateTime"
            value={formData.expectedCompletionDateTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-between sm:justify-self-start sm:gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Updating..." : "Update Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
