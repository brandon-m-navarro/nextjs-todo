"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Task } from "@/lib/definitions";
import { useUserContext } from "./UserContext";

interface TaskContextType {
  tasks: Task[];
  publicTasks: Task[];
  privateTasks: Task[];
  isLoading : boolean;
  addTask: (
    task: Omit<Task, "id" | "creationDateTime" | "lastModifiedDateTime">,
    isPrivate: boolean,
    callback?: (response?: {
      success: boolean;
      task?: Task;
      error?: string;
    }) => void
  ) => Promise<Task | void>;
  updateTask: (
    task: Task,
    callback?: (response?: {
      success: boolean;
      task?: Task;
      error?: string;
    }) => void
  ) => Promise<Task | void>;
  deleteTask: (
    taskId: string,
    callback?: (response?: {
      success: boolean;
      task?: Task;
      error?: string;
    }) => void
  ) => Promise<Task | void>;
  getTaskById: (taskId: string) => Task | undefined;
  getTasksForProject: (projectId: string) => Task[];
  updateTasksContext: (tasks: Task[]) => void;
}

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

export const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [privateTasks, setPrivateTasks] = useState<Task[]>([]);
  const [publicTasks, setPublicTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useUserContext();

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks || []);
        } else {
          console.error('Failed to fetch tasks:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add Task with optimistic update and rollback on failure
  const addTask = async (
    task: Omit<Task, "id" | "creationDateTime" | "lastModifiedDateTime">,
    isPrivate: boolean,
    callback?: (response?: {
      success: boolean;
      task?: Task;
      error?: string;
    }) => void
  ) => {
    let rollback: (() => void) | null = null;
    const tempTask: Task = {
      ...task,
      id: `TSK-temp-${crypto.randomUUID()}`,
      creationDateTime: new Date(),
      lastModifiedDateTime: new Date(),
    };
    const originalTasks = [...tasks];
    const originalPrivateTasks = [...privateTasks];
    const originalPublicTasks = [...publicTasks];

    try {
      // Store rollback function
      rollback = () => {
        // setTasks((prevTasks) => prevTasks.filter((t) => t.id !== tempTask.id));
        setTasks(originalTasks);
        setPrivateTasks(originalPrivateTasks);
        setPublicTasks(originalPublicTasks);
      };

      // Optimistic update
      setTasks((prevTasks) => [tempTask, ...prevTasks]);
      if (isPrivate) {
        setPrivateTasks((prevTasks) => [...prevTasks, tempTask]);
      } else {
        setPublicTasks((prevTasks) => [...prevTasks, tempTask]);
      }

      const response = await fetch(`/api/projects/${task.projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description || null,
          ordinal: task.ordinal || null,
          expectedCompletionDateTime: task.expectedCompletionDateTime
            ? new Date(task.expectedCompletionDateTime).toISOString()
            : null,
          isDone: task.isDone,
          userId: isPrivate ? userId : null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      // Parse response ONCE
      const data = await response.json();
      const serverTask: Task = data.task;

      // Replace temporary project with server version
      setTasks((prev) =>
        prev.map((t) => (t.id === tempTask.id ? serverTask : t))
      );
      if (isPrivate) {
        setPrivateTasks((prev) =>
          prev.map((t) => (t.id === tempTask.id ? serverTask : t))
        )
      } else {
        setPublicTasks((prev) =>
          prev.map((t) => (t.id === tempTask.id ? serverTask : t))
        )
      }

      // Call callback with success data
      callback?.({ success: true, task: serverTask });

      return serverTask;
    } catch (error) {
      // Rollback on error
      if (rollback) {
        rollback();
      }

      console.error("Failed to add task:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add task";

      // Call callback with error
      callback?.({ success: false, error: errorMessage });

      throw error;
    }
  };

  const updateTask = async (
    updatedTask: Task,
    callback?: (response?: {
      success: boolean;
      task?: Task;
      error?: string;
    }) => void
  ) => {
    let rollback: (() => void) | null = null;
    try {
      // Store previous state for potential rollback
      const previousTask = tasks.find((task) => task.id === updatedTask.id);
      if (!previousTask) {
        throw new Error("Task not found for update");
      }

      // Define rollback function
      rollback = () => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === previousTask.id ? previousTask : task
          )
        );
      };

      // Update context optimistically
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );

      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description || null,
          isDone: updatedTask.isDone,
          projectId: updatedTask.projectId,
          ordinal: updatedTask.ordinal ? Number(updatedTask.ordinal) : null,
          expectedCompletionDateTime: updatedTask.expectedCompletionDateTime
            ? new Date(updatedTask.expectedCompletionDateTime).toISOString()
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      // Call callback with success data
      const data = await response.json();
      const serverTask: Task = data.task;
      callback?.({ success: true, task: serverTask });
    } catch (error) {
      // Rollback on error
      if (rollback) {
        rollback();
      }
      callback?.({
        success: false,
        error: error instanceof Error ? error.message : "Failed to update task",
      });
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (
    taskId: string,
    callback?: (response?: {
      success: boolean;
      task?: Task;
      error?: string;
    }) => void
  ) => {
    let rollback: (() => void) | null = null;

    try {
      // Store previous state for potential rollback
      const previousTask = tasks.find((task) => task.id === taskId);
      if (!previousTask) {
        throw new Error("Task not found for deletion");
      }

      // Define rollback function
      rollback = () => {
        setTasks((prevTasks) => [previousTask!, ...prevTasks]);
      };

      // Update context optimistically
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      // Call callback with success data
      const data = await response.json();
      const serverTask: Task = data.task;
      callback?.({ success: true, task: serverTask });
    } catch (error) {
      // Rollback on error
      if (rollback) {
        rollback();
      }
      console.error("Failed to delete task:", error);
      callback?.({
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete task",
      });
    }
  };

  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.find((task) => task.id === taskId);
  };

  const getTasksForProject = (projectId: string): Task[] => {
    return tasks.filter((task) => {
      return task.projectId == projectId;
    });
  };

  const updateTasksContext = (tasks: Task[]) => {
    setTasks((prevTasks) => [...prevTasks, ...tasks]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        privateTasks,
        publicTasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksForProject,
        updateTasksContext
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = React.useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
