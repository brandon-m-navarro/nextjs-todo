import { Project } from "@/app/lib/definitions";

interface ProjectCardProps {
  project: Project;
  isNavigating?: boolean;
  onNavigate?: () => void;
}

export default function ProjectCard({ project, isNavigating = false, onNavigate }: ProjectCardProps) {
  return (
    <div 
      onClick={onNavigate}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-6 
        cursor-pointer transition-all duration-200 
        hover:shadow-md hover:border-blue-300
        ${isNavigating ? 'opacity-50 scale-95' : 'hover:scale-105'}
        ${isNavigating ? 'animate-pulse' : ''}
      `}
    >
      {isNavigating && (
        <div className="flex justify-center mb-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="flex items-center space-x-3 mb-4">
        {project.hexColor && (
          <div
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: `#${project.hexColor}` }}
          />
        )}
        <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
      </div>
      
      {project.description && (
        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        Created: {new Date(project.creationDateTime).toLocaleDateString()}
      </div>
    </div>
  );
}
