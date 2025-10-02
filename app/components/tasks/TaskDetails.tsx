'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTaskContext } from '@/app/contexts/TaskContext';
import { useRouter } from 'next/navigation';

interface TaskDetails {
  id: string;
  title: string;
  description: string | null;
  isDone: boolean;
  ordinal: number;
  expectedCompletionDateTime: Date | null;
  creationDateTime: Date;
  lastModifiedDateTime: Date;
  projectId: string;
  // projectName: string;
  // projectColor?: string | null;
}

interface TaskDetailProps {
  taskId: string;
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const { updateTask, deleteTask, getTaskById } = useTaskContext();
  const router = useRouter();
  const task = getTaskById(taskId);
  const [taskState, setTaskState] = useState<TaskDetails>(task);

  // Handle marking task as done/undone
  const handleToggleDone = () => {
    const updatedTask = {
      ...taskState,
      isDone: !taskState.isDone,
      lastModifiedDateTime: new Date()
    };
    
    setTaskState(updatedTask);
    updateTask(
      updatedTask,
      () => { setTaskState(updatedTask) }
    );
  };

  // Handle delete
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskState.id, (res) => {
        console.log('Deleted! - ', res);
        router.back();
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Task Header */}
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
        
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          taskState.isDone 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {taskState.isDone ? 'Completed' : 'Active'}
        </span>
      </div>

      {/* Task Content */}
      <div className="space-y-6">
        {/* Description */}
        {taskState.description && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
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
              style={{ backgroundColor: taskState.projectColor || '#3B82F6' }}
            />
            <span className="text-gray-700">{taskState.projectName}</span>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Due Date</h3>
            <p className="text-gray-600">
              {new Date(taskState.expectedCompletionDateTime).toLocaleDateString('en-US', {
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
              {new Date(taskState.creationDateTime).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
            <p className="text-gray-900">
              {new Date(taskState.lastModifiedDateTime).toLocaleDateString()}
            </p>
          </div>
          
          {taskState.ordinal !== null && taskState.ordinal !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
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
          {taskState.isDone ? 'Mark as Undone' : 'Mark as Done'}
        </button>
      </div>
    </div>
  );
}
