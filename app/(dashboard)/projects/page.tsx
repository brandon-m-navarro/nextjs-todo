import BackButton from "@/app/components/ui/back-button";
import Link from "next/link";
import ProjectChooser from "@/app/components/projects/ProjectChooser";

export default function ProjectsPage() {
  return (
    <div className="p-0 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <BackButton />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Projects</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your projects and organize your tasks
          </p>
        </div>
        <Link
          href="/projects/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-150 text-center sm:inline-block w-full sm:w-auto"
        >
          + New Project
        </Link>
      </div>
      <ProjectChooser />
    </div>
  );
}
