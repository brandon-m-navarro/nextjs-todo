import { Project } from "@/app/lib/definitions";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      key={project.id}
      href={`/projects/${project.id}`}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div
          className="w-8 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: `#${project.hexColor || "3B82F6"}` }}
        />
        <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
      </div>

      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>View Details →</span>
        <span>{new Date(project.creationDateTime).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
