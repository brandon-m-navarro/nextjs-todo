// components/tasks/TaskList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Task } from '@/app/lib/definitions';
import { Project } from '@/app/lib/definitions';

interface TaskListProps {
  initialTasks: Task[];
  showProject?: boolean;
  projects?: Project[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Sync internal state with prop changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No tasks found
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <input
                type="checkbox"
                checked={task.isDone}
                readOnly
                className="h-5 w-5 rounded border-gray-300 text-blue-600 mt-0.5"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${task.isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                </div>
                
                {task.description && (
                  <p className="text-gray-600 text-sm mt-2">{task.description}</p>
                )}
                {task.expectedCompletionDateTime && (
                  <div className="text-xs text-gray-500 mt-2">
                    Due: {new Date(task.expectedCompletionDateTime).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            
            <Link
              href={`/tasks/${task.id}`}
              className="ml-4 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
