// app/projects/layout.tsx
import { TaskProvider } from '@/app/contexts/TaskContext';

async function getAllTasks() {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://nextjs-todo-lake.vercel.app"
        : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/tasks`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const data = await response.json();
    // Return just the tasks array from the response
    return data.tasks || data.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tasks = await getAllTasks(); // Or fetch initial data
  
  return (
    <TaskProvider initialTasks={tasks}>
      {children}
    </TaskProvider>
  );
}
