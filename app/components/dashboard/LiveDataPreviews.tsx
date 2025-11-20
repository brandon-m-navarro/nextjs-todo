"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface ProjectPreview {
  id: string;
  name: string;
  description?: string;
  hexColor?: string;
}

interface TaskPreview {
  id: string;
  title: string;
  isDone: boolean;
  projectName: string;
  projectColor?: string;
}

export default function LiveDataPreviews() {
  const [projects, setProjects] = useState<ProjectPreview[]>([]);
  const [tasks, setTasks] = useState<TaskPreview[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live data on component mount, which will happen on navigation
  useEffect(() => {
    async function fetchLiveData() {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("/api/projects?limit=3"),
          fetch("/api/tasks/recent?limit=5"),
        ]);

        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();

        setProjects(projectsData.projects || []);
        setTasks(tasksData.tasks || []);
      } catch (error) {
        console.error("Error fetching live data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveData();
  }, []);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <button
        className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-lg font-semibold"
        onClick={async () => {
          // const session = authClient.getSession();
          // console.log("Current session:", session);
        }}
      >
        Test Auth Client
      </button>
      {/* Recent Projects Preview */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-4 text-black">
          Recent Projects
        </h3>
        {projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: `#${project.hexColor || "3B82F6"}`,
                    }}
                  />
                  <span className="font-medium text-black">{project.name}</span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {project.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No projects yet. Create your first one!
          </p>
        )}
        <Link
          href="/projects"
          className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          View all projects →
        </Link>
      </div>

      {/* Recent Tasks Preview */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-4 text-black">
          Recent Activity
        </h3>
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white rounded-lg border-l-4"
                style={{ borderLeftColor: `#${task.projectColor || "3B82F6"}` }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      task.isDone
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }
                  >
                    {task.title}
                  </span>
                  {task.isDone && (
                    <span className="text-green-500 text-sm">✓ Done</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  in {task.projectName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No tasks yet. Add your first task!
          </p>
        )}
        <Link
          href="/tasks"
          className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          View all tasks →
        </Link>
      </div>
    </div>
  );
}
