import Link from "next/link";
import { getProjects } from '@/app/lib/db';
import { Project } from '@/app/lib/definitions';

export async function ProjectSidebar() {
  const projects = await getProjects();

  return (
    <aside className="w-64 bg-gray-100 p-4 h-full">
        <h2 className="text-xl font-bold mb-4">Projects</h2>
        <nav className="space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-200"
              >Overview</Link>

            {projects.map((project: Project) => (
                <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block px-4 py-2 rounded hover:bg-gray-200"
                >
                    {project.name}
                </Link>
            ))}

            <Link href="/projects/new" className="block px-4 py-2 rounded hover:bg-gray-200"
              >+ New Project</Link>
        </nav>
    </aside>
  );
}