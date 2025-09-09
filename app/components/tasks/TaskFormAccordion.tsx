'use client';

import { useState, useRef, useEffect } from 'react';
import TaskForm from './TaskForm';
import { Project } from '@/app/lib/definitions';

interface TaskFormAccordionProps {
  projectId: string;
  projects: Project[]; // Add projects prop
}

export function TaskFormAccordion({ projectId, projects }: TaskFormAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
        aria-expanded={isOpen}
      >
        {/* ... rest of the button code remains the same */}
      </button>

      {/* Collapsible Content with Smooth Height Animation */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ height: isOpen ? `${contentHeight}px` : '0px' }}
      >
        <div ref={contentRef} className="p-6 border-t border-gray-200">
          <TaskForm 
            projects={projects} 
            initialProjectId={projectId} 
          />
        </div>
      </div>
    </div>
  );
}
