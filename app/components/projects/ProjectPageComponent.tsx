"use client";
import Accordion from "../ui/accordion";
import BackButton from "@/app/components/ui/back-button";
import { TaskManager } from "@/app/components/tasks/TaskManager";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface ProjectPageComponentProps {
  projectId: string;
}

export default function ProjectPageComponent({
  projectId,
}: ProjectPageComponentProps) {
  const router = useRouter();
  const { getProjectById } = useProjectContext();
  const project = getProjectById(projectId);

  // Show loading state if project is not yet available
  if (!project) {
    return (
      <div className="p-8 text-black">
        <BackButton text="All Projects" overrideRouter={"/projects"} />
        <div>Loading project...</div>
      </div>
    );
  }

  return (
    <div className="p-8 text-black max-w-6xl mx-auto">
      <div className="relative flex">
        <BackButton text="All Projects" />
        <Button
          onClick={() => {
            router.push(`/projects/${project.id}/edit`);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-auto"
        >
          Edit Project
        </Button>
      </div>
      {project.description && (
        <Accordion
          render={({ isOpen, toggle, contentHeight, contentRef }) => (
            <>
              <div
                className="p-4 cursor-pointer flex justify-between items-center bg-blue-50"
                onClick={toggle}
              >
                <h1 className="text-2xl font-bold mb-2">
                  Project: {project.name}
                </h1>
                <span className="transform transition-transform duration-300">
                  {isOpen ? "▼" : "►"}
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
            </>
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
