import Link from "next/link";
import { Project } from "@/app/lib/definitions";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">
          No projects yet. Create your first project!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow block"
        >
          <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
          {project.description && (
            <p className="text-gray-600 text-sm mb-3">{project.description}</p>
          )}
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: `#${project.hexColor || "3B82F6"}` }}
          />
        </Link>
      ))}
    </div>
  );
}
