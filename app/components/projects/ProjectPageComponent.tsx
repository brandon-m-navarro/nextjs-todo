"use client";
import { TaskManager } from "@/app/components/tasks/TaskManager";
import { BackButton } from "@/app/components/ui/back-button";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import { Accordion } from "../ui/accordion";

interface ProjectPageComponentProps {
  projectId: string;
}

export default function ProjectPageComponent({
  projectId,
}: ProjectPageComponentProps) {
  const { getProjectById } = useProjectContext();
  const project = getProjectById(projectId);

  if (!project) throw new Error("Unable to get project - " + projectId);

  return (
    <div className="p-8 text-black">
      <BackButton text="All Projects" />
      <Accordion
        render={({ isOpen, toggle, contentHeight, contentRef }) => (
          <>
            <div
              className="p-4 cursor-pointer flex justify-between items-center bg-blue-50"
              onClick={toggle}
            >
              <h3 className="font-semibold text-blue-800">Custom Header</h3>
              <span className="transform transition-transform duration-300">
                {isOpen ? "▼" : "►"}
              </span>
            </div>

            <div
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{ height: isOpen ? `${contentHeight}px` : "0px" }}
            >
              <div ref={contentRef} className="p-6 border-t border-gray-200">
                <p>Your animated content here!</p>
              </div>
            </div>
          </>
        )}
      />
      {/* Project Header - No ref needed for static content
      <Accordion>
        {(isOpen, toggle, open, close) => (
                <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Project: {project.name}</h1>
            {project.description && (
              <p className="text-gray-600">
                {project.description}
              </p>
            )}
          </div>
        </div>
        )}
      </Accordion> */}

      {/* Task Manager */}
      <TaskManager project={project} />
    </div>
  );
}
