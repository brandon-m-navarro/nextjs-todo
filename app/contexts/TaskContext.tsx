'use client';
import React, { createContext, useState, ReactNode } from 'react';
import { Task } from '@/app/lib/definitions';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task, callback?: (response?: Response) => void) => void;
  updateTask: (task: Task, callback?: (response?: Response) => void) => void;
  deleteTask: (taskId: string, callback?: (response?: Response) => void) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getTasksForProject: (projectId: string) => Task[];
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

  const addTask = async (task: Task, callback?: (response?: Response) => void) => {
    setTasks((prevTasks) => [task, ...prevTasks]);
    callback?.();

    // try {
    //   const response = await fetch(`/api/tasks/${task.id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       projectId: task.projectId,
    //       id: task.id,
    //       title: task.title,
    //       description: task.description || null,
    //       is_done: task.isDone,
    //       project_id: task.projectId,
    //       ordinal: task.ordinal ? Number(task.ordinal) : null,
    //       expected_completion_date_time: task.expectedCompletionDateTime 
    //         ? new Date(task.expectedCompletionDateTime)
    //         : null,
    //       creation_date_time: new Date(),
    //       last_modified_date_time: new Date()
    //     }),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || 'Failed to update task');
    //   }

    //   if (callback) {
    //     callback(response);
    //   }
    // } catch (error) {
    //   throw new Error('Failed to add task!' + error);
    // }
  };

  const updateTask = async (updatedTask: Task, callback?: (response?: Response) => void) => {
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
        callback(response);
      }
    } catch (error) {
        throw new Error('Failed to update task - ' + error);
    }
  };

  const deleteTask = async (taskId: string, callback?: (response?: Response) => void) => {
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

      // Update context
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      if (callback) {
        callback(response);
      }
    } catch (error) {
        throw new Error('Failed to delete task - ' + error);
    }
  };

  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  }
  
  const getTasksForProject = (projectId: string): Task[] => {
    return tasks.filter((task) => {return task.projectId == projectId})
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTaskById, getTasksForProject }}>
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
