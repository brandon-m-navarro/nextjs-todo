'use client';

import Link from "next/link";
import { db } from "@/app/lib/db";
import { TaskList } from "@/app/components/tasks/TaskList";
import { ProjectGrid } from "@/app/components/projects/ProjectGrid";
import { Task, TaskWithProject, ProjectFromDb, TaskFromDb } from "../lib/definitions";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your task management dashboard',
};


export default async function DashboardPage() {
  // Fetch data in parallel for better performance
  const [projects, recentTasks] = await Promise.all([
    db.projects.getAll(),
    getRecentTasks(),
  ]);

  const incompleteTasks = recentTasks.filter((task) => !task.isDone);
  const completedTasks = recentTasks.filter((task) => task.isDone);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link
            href="/projects/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            New Project
          </Link>
          <Link
            href="/tasks/new"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            New Task
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
          <p className="text-3xl font-bold">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold">{incompleteTasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completed Today</h3>
          <p className="text-3xl font-bold">{completedTasks.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link href="/tasks" className="text-blue-500 hover:text-blue-700">
              View All →
            </Link>
          </div>
          <TaskList tasks={recentTasks.slice(0, 5)} />
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            <Link
              href="/projects"
              className="text-blue-500 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>
          <ProjectGrid
            projects={projects.slice(0, 3).map((project: ProjectFromDb) => ({
              ...project,
              hexColor: project.hex_color ?? "#000000",
              creationDateTime: project.creation_date_time ?? new Date().toISOString(),
              lastModifiedDateTime: project.last_modified_date_time ?? new Date().toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to get recent tasks across all projects
async function getRecentTasks() {
  try {
    const projects = await db.projects.getAll();
    const allTasks: Task[] = [];
    const allTaskWithProject: TaskWithProject[] = [];

    // Get tasks for each project
    for (const project of projects) {
      const tasksFromDb = await db.tasks.getByProjectId(project.id);
      // Map TaskFromDb to Task by adding missing properties
      const tasks: Task[] = tasksFromDb.map((task: TaskFromDb) => ({
        ...task,
        projectId: project.id,
        isDone: task.is_done ?? false,
        expectedCompletionDateTime: task.expected_completion_date_time
          ? new Date(task.expected_completion_date_time)
          : null,
        creationDateTime: task.creation_date_time
          ? new Date(task.creation_date_time)
          : new Date(),
        lastModifiedDateTime: task.last_modified_date_time
          ? new Date(task.last_modified_date_time)
          : new Date(),
      }));
      allTasks.push(...tasks);
    }

    // Add project info to each task
    allTasks
      .sort(
        (a, b) =>
          new Date(b.creationDateTime).getTime() -
          new Date(a.creationDateTime).getTime()
      )
      .forEach((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        if (project) {
          allTaskWithProject.push({
            ...task,
            projectName: project.name,
            projectColor: project.hex_color,
          });
        }
      });

      return allTaskWithProject;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}
