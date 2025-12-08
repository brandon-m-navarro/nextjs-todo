"use client";
import Accordion from "../ui/accordion";
import TaskForm from "./TaskForm";

interface TaskFormAccordionProps {
  projectId: string;
  isPrivate: boolean;
}

export default function TaskFormAccordion({
  projectId,
  isPrivate=false
}: TaskFormAccordionProps) {
  return (
    <div className="mb-8">
      <Accordion
        render={({ isOpen, toggle, resize, contentHeight, contentRef }) => (
          <div>
            {/* Toggle Button */}
            <button
              onClick={toggle}
              className="cursor-pointer w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
            >
              <span>{isOpen ? "Close" : "Add New Task"}</span>{" "}
            </button>

            {/* Collapsible Content with Smooth Height Animation */}
            <div
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{ height: isOpen ? `${contentHeight}px` : "0px" }}
            >
              <div ref={contentRef} className="p-2 sm:p-6 border-t border-gray-200">
                <TaskForm
                  initialProjectId={projectId}
                  isPrivate={isPrivate}
                  onTaskCreated={() => {
                    // Delay to let success animation finish
                    setTimeout(() => {
                      toggle();
                    }, 750);
                  }}
                  onError={resize}
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
