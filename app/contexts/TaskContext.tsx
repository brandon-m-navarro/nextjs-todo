'use client';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Task } from '@/app/lib/definitions';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
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

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
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
