import ProjectChooser from "@/app/components/projects/ProjectChooser";
import { BackButton } from "@/app/components/ui/back-button";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="mb-8">
      <BackButton />
      <div className="flex justify-between items-center mb-8">
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
      <ProjectChooser></ProjectChooser>
    </div>
  );
}
