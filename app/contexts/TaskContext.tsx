'use client';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Task } from '@/app/lib/definitions';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task, callback?: (response?: Response) => void) => void;
  deleteTask: (taskId: string, callback?: (response?: Response) => void) => void;
  setInitialTasks: (tasks: Task[]) => void;
  getTaskById: (taskId: string) => Task | undefined;
}

interface TaskProviderProps {
  children: ReactNode;
  initialTasks?: Task[];
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<TaskProviderProps> = ({ 
  children, 
  initialTasks = [] 
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

// Optional: Sync if initialTasks changes
//   useEffect(() => {
//     setTasks(initialTasks);
//   }, [initialTasks]);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [task, ...prevTasks]);
  };

  const updateTask = async (updatedTask: Task, callback?: Function) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description || null,
          is_done: updatedTask.isDone,
          project_id: updatedTask.projectId,
          ordinal: updatedTask.ordinal ? Number(updatedTask.ordinal) : null,
          expected_completion_date_time: updatedTask.expectedCompletionDateTime 
            ? new Date(updatedTask.expectedCompletionDateTime).toISOString()
            : null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      if (callback) {
        await callback(response);
      }
    } catch (error) {
        throw new Error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string, callback?: Function) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      if (callback) {
        await callback(response);
      }
    } catch (error) {
        throw new Error('Failed to delete task');
    }
  };

  const setInitialTasks = (initialTasks: Task[]) => {
    setTasks(initialTasks);
  }

  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, setInitialTasks, getTaskById }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => {
  const context = React.useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
