import Link from 'next/link';
import { db } from '@/app/lib/db';
import SimpleAnimation from '@/app/components/ui/animation';
import { TaskWithProject } from './lib/definitions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch some data to showcase
  const [projects, recentTasks] = await Promise.allSettled([
    db.projects.getAll().then(projects => projects.slice(0, 3)),
    getRecentTasksPreview()
  ]);

  const projectsData = projects.status === 'fulfilled' ? projects.value : [];
  const tasksData = recentTasks.status === 'fulfilled' ? recentTasks.value : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-6">
            {`You Didn't Need This. Neither Did I.`}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            But here it is anyway. A simple, beautiful todo app built with Next.js and Tailwind CSS.
          </p>
          <div className="flex justify-center">
            <SimpleAnimation />
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-lg font-semibold"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Stay Organized
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl text-black font-semibold mb-3">Project Management</h3>
              <p className="text-gray-600">
                Organize tasks into projects with custom colors and descriptions. 
                Keep your work and personal life separate but accessible.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Smart Tasks</h3>
              <p className="text-gray-600">
                Create tasks with due dates, priorities, and descriptions. 
                Mark them as complete and watch your productivity soar.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Beautiful UI</h3>
              <p className="text-gray-600">
                This is an objective statement. Enjoy a clean, modern interface that makes task management 
                a pleasure rather than a chore.
              </p>
            </div>
          </div>

          {/* Live Data Preview */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Recent Projects Preview */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-4 text-black">Recent Projects</h3>
              {projectsData.length > 0 ? (
                <div className="space-y-3">
                  {projectsData.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `#${project.hex_color || '3B82F6'}` }}
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
                <p className="text-gray-500 italic">No projects yet. Create your first one!</p>
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
              <h3 className="text-2xl font-semibold mb-4 text-black">Recent Activity</h3>
              {tasksData.length > 0 ? (
                <div className="space-y-3">
                  {tasksData.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-white rounded-lg border-l-4"
                      style={{ borderLeftColor: `#${task.projectColor || '3B82F6'}` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className={task.isDone ? 'line-through text-gray-500' : 'text-gray-900'}>
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
                <p className="text-gray-500 italic">No tasks yet. Add your first task!</p>
              )}
              <Link
                href="/tasks"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                View all tasks →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Organized?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join at least one other user (me) who is already boosting their productivity with this todo app!
          </p>
          <Link
            href="/"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold inline-block"
          >
            Start Your Journey Now
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function to get recent tasks with project info
async function getRecentTasksPreview() {
  try {
    const projects = await db.projects.getAll();
    const allTasks: TaskWithProject[] = [];

    for (const project of projects) {
      const tasks = await db.tasks.getByProjectId(project.id);
      const tasksWithProject = tasks.map(task => ({
        ...task,
        projectId: task.project_id,
        isDone: task.is_done,
        creationDateTime: task.creation_date_time,
        lastModifiedDateTime: task.last_modified_date_time,
        projectName: project.name,
        projectColor: project.hex_color,
      }));
      allTasks.push(...tasksWithProject);
    }

    return allTasks
      .sort((a, b) => new Date(b.creationDateTime).getTime() - new Date(a.creationDateTime).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching tasks preview:', error);
    return [];
  }
}