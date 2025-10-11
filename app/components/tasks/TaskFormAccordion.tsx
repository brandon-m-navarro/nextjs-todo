"use client";
import Accordion from "../ui/accordion";
import TaskForm from "./TaskForm";

interface TaskFormAccordionProps {
  projectId: string;
}

export default function TaskFormAccordion({ projectId }: TaskFormAccordionProps) {
  return (
    <div className="mb-8">
      <Accordion
        render={({ isOpen, toggle, resize, contentHeight, contentRef }) => (
          <>
            {/* Toggle Button */}
            <button
              onClick={toggle}
              className="cursor-pointer w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
            >
              {isOpen ? "Close" : "Add New Task"}
            </button>

            {/* Collapsible Content with Smooth Height Animation */}
            <div
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{ height: isOpen ? `${contentHeight}px` : "0px" }}
            >
              <div ref={contentRef} className="p-6 border-t border-gray-200">
                <TaskForm
                  initialProjectId={projectId}
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
          </>
        )}
      />
    </div>
  );
}
