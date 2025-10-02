'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/app/lib/definitions';

interface Project {
  id: string;
  name: string;
  hexColor?: string;
}

// interface Task {
//   id: string;
//   title: string;
//   description?: string | null;
//   isDone: boolean;
//   ordinal?: number | null;
//   expectedCompletionDateTime?: Date | null;
//   creationDateTime: Date;
//   lastModifiedDateTime: Date;
//   projectId: string;
//   projectName: string;
//   projectColor?: string | null;
// }

interface TaskEditFormProps {
  task: Task;
  projects: Project[];
}

export function TaskEditForm({ task, projects }: TaskEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    isDone: task.isDone,
    ordinal: task.ordinal || null,
    expectedCompletionDateTime: task.expectedCompletionDateTime 
      ? new Date(task.expectedCompletionDateTime).toISOString().slice(0, 16)
      : '',
    projectId: task.projectId
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
              : type === 'number' ? Number(value)
              : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    console.log('Submitting form data:', formData);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          is_done: formData.isDone,
          project_id: formData.projectId,
          ordinal: formData.ordinal ? Number(formData.ordinal) : null,
          expected_completion_date_time: formData.expectedCompletionDateTime 
            ? new Date(formData.expectedCompletionDateTime).toISOString()
            : null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }
      console.log('ASYNC: Task updated successfully', await response.json());


      // Create Task from response
      // const updatedTask = {
      //   ...formData,
      //   id: task.id,
      //   ordinal: formData.ordinal ? Number(formData.ordinal) : null,
      //   expectedCompletionDateTime: formData.expectedCompletionDateTime
      //     ? new Date(formData.expectedCompletionDateTime)
      //     : null,
      //   creationDateTime: task.creationDateTime,
      //   lastModifiedDateTime: new Date(),
      //   projectName: projects.find(p => p.id === formData.projectId)?.name || '',
      //   projectColor: projects.find(p => p.id === formData.projectId)?.hexColor || ''
      // };
      // setTaskState(updatedTask);

      // Redirect to task detail page on success
      router.replace(`/tasks/${task.id}`); // Use replace to avoid going back to edit on back button
      router.back(); // Go back to the previous page
      router.refresh(); // Refresh the server components
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task');
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {projects.map(project => (
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
          <label htmlFor="ordinal" className="block text-sm font-medium text-gray-700 mb-2">
            Priority (lower number = higher priority)
          </label>
          <input
            type="number"
            id="ordinal"
            name="ordinal"
            value={formData.ordinal + ''}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="expectedCompletionDateTime" className="block text-sm font-medium text-gray-700 mb-2">
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
        <div className="flex gap-4 pt-6 border-t border-gray-200">
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
            {isSubmitting ? 'Updating...' : 'Update Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
