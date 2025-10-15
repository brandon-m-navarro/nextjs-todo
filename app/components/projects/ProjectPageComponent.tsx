"use client";
import Accordion from "../ui/accordion";
import BackButton from "@/app/components/ui/back-button";
import TaskManager from "@/app/components/tasks/TaskManager";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import Link from "next/link";
interface ProjectPageComponentProps {
  projectId: string;
}

export default function ProjectPageComponent({
  projectId,
}: ProjectPageComponentProps) {
  const { getProjectById, isLoading } = useProjectContext();
  const project = getProjectById(projectId);

  // Show loading state while projects are being fetched
  if (isLoading) {
    return (
      <div className="p-8 text-black">
        <BackButton overrideRouter={"/projects"} />
        <div>Loading projects...</div>
      </div>
    );
  }

  // Show loading state if project is not yet available
  if (!project) {
    return (
      <div className="p-8 text-black">
        <BackButton overrideRouter={"/projects"} />
        <div>Project not found</div>
      </div>
    );
  }

  return (
    <div className="p-0 pb-8 sm:p-8 text-black max-w-6xl mx-auto">
      <div className="relative flex flex-col mb-6 sm:flex-row sm:items-center sm:mb-8 sm:justify-between">
        <BackButton />
        <Link
          href={`/projects/${project.id}/edit`}
          className="px-4 py-2 bg-blue-500 sm:ml-auto text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-150 text-center sm:inline-block w-full sm:w-auto"
        >
          Edit Project
        </Link>
      </div>
      {project.description && (
        <Accordion
          render={({ isOpen, toggle, contentHeight, contentRef }) => (
            <div>
              <div
                className="p-4 cursor-pointer flex justify-between items-center bg-blue-50"
                onClick={toggle}
              >
                <h1 className="text-2xl font-bold mb-2">
                  Project: {project.name}
                </h1>
                <span className="transform transition-transform duration-300">
                  {isOpen ? <span>▼</span> : <span>►</span>}
                </span>
              </div>

              <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{ height: isOpen ? `${contentHeight}px` : "0px" }}
              >
                <div ref={contentRef} className="p-6 border-t border-gray-200">
                  {project.description && (
                    <p className="text-gray-600">{project.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        />
      )}
      {project.name && !project.description && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-4 flex justify-between items-center bg-blue-50">
            <h1 className="text-2xl font-bold mb-2">Project: {project.name}</h1>
          </div>
        </div>
      )}

      <TaskManager project={project} />
    </div>
  );
}
