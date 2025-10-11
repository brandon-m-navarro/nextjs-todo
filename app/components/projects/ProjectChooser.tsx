'use client';
import Link from 'next/link';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import ProjectCard from './ProjectCard';

export default function ProjectChooser() {
  const { projects } = useProjectContext();
  console.log(projects);

  return (
    <div className="max-w-6xl mx-auto">

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
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
