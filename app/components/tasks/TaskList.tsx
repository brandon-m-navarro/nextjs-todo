'use client';

import Link from 'next/link';
import { Task } from '@/app/lib/definitions';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.isDone}
                readOnly
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`${task.isDone ? 'line-through text-gray-500' : 'text-gray-900'} font-medium`}>
                {task.title}
              </span>
            </div>
            <Link
              href={`/projects/${task.projectId}`}
              className="text-sm text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              View
            </Link>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mt-2 ml-8">{task.description}</p>
          )}
          
          {/* Optional: Show due date if exists */}
          {task.expectedCompletionDateTime && (
            <div className="text-xs text-gray-500 mt-2 ml-8">
              Due: {new Date(task.expectedCompletionDateTime).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
