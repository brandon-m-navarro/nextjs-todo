'use client';
import { Project } from '@/lib/definitions';
import ProjectCard from './ProjectCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectChooser({projects}: {projects: Project[]}) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  const handleNavigation = (href: string, id?: string) => {
    setIsNavigating(id || href);
    router.push(href);
  };

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-4">
      {/* Projects Grid */}
      {projects.length == 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h2>
          <p className="text-gray-600 mb-6">Create your first project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              isNavigating={isNavigating === project.id}
              onNavigate={() => handleNavigation(`/projects/${project.id}`, project.id)}
            />
          ))} 
        </div>
      )}
    </div>
  );
}
