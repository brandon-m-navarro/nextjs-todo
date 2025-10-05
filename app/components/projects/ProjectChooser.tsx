'use client';
import Link from 'next/link';
import { BackButton } from '@/app/components/ui/back-button';
import { useProjectContext } from '@/app/contexts/ProjectContext';

export default function ProjectChooser() {
  const { projects } = useProjectContext();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <BackButton overrideRouter={'/'} />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
            <p className="text-gray-600 mt-2">
              Manage your projects and organize your tasks
            </p>
          </div>
          <Link
            href="/projects/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + New Project
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h2>
          <p className="text-gray-600 mb-6">Create your first project to get started</p>
          <Link
            href="/projects/new"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `#${project.hexColor || '3B82F6'}` }}
                />
                <h3 className="font-semibold text-lg text-gray-900">
                  {project.name}
                </h3>
              </div>

              {project.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>View Details →</span>
                <span>
                  {new Date(project.creationDateTime).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
