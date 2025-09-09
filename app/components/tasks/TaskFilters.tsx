// components/tasks/TaskFilters.tsx
'use client';

import { useRouter } from 'next/navigation';

interface TaskFiltersProps {
  projects: Array<{ id: string; name: string }>;
  currentProject?: string;
  currentStatus?: string;
  currentSort?: string;
}

export function TaskFilters({ projects, currentProject, currentStatus, currentSort }: TaskFiltersProps) {
  const router = useRouter();

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`/tasks?${params.toString()}`);
  };

  // Add null/undefined check before mapping
  const safeProjects = projects || [];

  return (
    <div className="flex flex-wrap gap-4">
      <select 
        value={currentProject || ''}
        onChange={(e) => updateUrl({ project: e.target.value })}
        className="px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">All Projects</option>
        {safeProjects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <select 
        value={currentStatus || 'all'}
        onChange={(e) => updateUrl({ status: e.target.value })}
        className="px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="all">All Tasks</option>
        <option value="active">Active Only</option>
        <option value="completed">Completed Only</option>
      </select>

      <select 
        value={currentSort || 'newest'}
        onChange={(e) => updateUrl({ sort: e.target.value })}
        className="px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="due-date">Due Date</option>
      </select>

      {(currentProject || currentStatus || currentSort) && (
        <button
          onClick={() => router.push('/tasks')}
          className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
