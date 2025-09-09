'use client';

import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  isDone: boolean;
  ordinal?: number | null;
  expectedCompletionDateTime?: Date | null;
  creationDateTime: Date;
  lastModifiedDateTime: Date;
  projectId: string;
  projectName: string;
  projectColor?: string | null;
}

interface TaskDetailProps {
  task: Task;
}

export function TaskDetail({ task }: TaskDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={task.isDone}
            readOnly
            className="h-6 w-6 rounded border-gray-300 text-blue-600"
          />
          <h2 className="text-2xl font-semibold text-gray-900">
            {task.title}
          </h2>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          task.isDone 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {task.isDone ? 'Completed' : 'Active'}
        </span>
      </div>

      {/* Task Content */}
      <div className="space-y-6">
        {/* Description */}
        {task.description && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
              {task.description}
            </p>
          </div>
        )}

        {/* Project Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project</h3>
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: `#${task.projectColor || '3B82F6'}` }}
            />
            <span className="text-gray-700">{task.projectName}</span>
            <Link
              href={`/projects/${task.projectId}`}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              View Project →
            </Link>
          </div>
        </div>

        {/* Due Date */}
        {task.expectedCompletionDateTime && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Due Date</h3>
            <p className="text-gray-600">
              {new Date(task.expectedCompletionDateTime).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* Task Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
            <p className="text-gray-900">
              {new Date(task.creationDateTime).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
            <p className="text-gray-900">
              {new Date(task.lastModifiedDateTime).toLocaleDateString()}
            </p>
          </div>
          
          {task.ordinal !== null && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
              <p className="text-gray-900">#{task.ordinal ? task.ordinal + 1 : 'N/A'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4 pt-6 border-t border-gray-200">
        <Link
          href={`/tasks/${task.id}/edit`}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Edit Task
        </Link>
        
        <Link
          href={`/projects/${task.projectId}`}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Project Tasks
        </Link>
      </div>
    </div>
  );
}
