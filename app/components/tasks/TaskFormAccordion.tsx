'use client';

import { useState, useRef, useEffect } from 'react';
import TaskForm from './TaskForm';

interface TaskFormAccordionProps {
  projectId: string;
}

export function TaskFormAccordion({ projectId }: TaskFormAccordionProps) {
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
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full bg-blue-500 transition-all duration-300 ${
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`} />
          <span className="text-lg font-semibold text-gray-900 transition-colors duration-200">
            Add New Task
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`text-sm text-gray-500 transition-all duration-300 ${
            isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            {isOpen ? 'Click to collapse' : 'Click to expand'}
          </span>
          <svg 
            className={`w-5 h-5 text-gray-500 transform transition-all duration-300 ${
              isOpen ? 'rotate-180 text-blue-600' : 'rotate-0'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible Content with Smooth Height Animation */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ height: isOpen ? `${contentHeight}px` : '0px' }}
      >
        <div ref={contentRef} className="p-6 border-t border-gray-200">
          <TaskForm projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
