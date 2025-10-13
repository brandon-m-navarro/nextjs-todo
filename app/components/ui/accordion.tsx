"use client";
import { useState, useRef, useEffect } from "react";

export interface AccordionHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

interface AccordionProps {
  children?: React.ReactNode;
  render?: (props: {
    isOpen: boolean;
    toggle: () => void;
    resize: () => void;
    open: () => void;
    close: () => void;
    contentHeight: number;
    contentRef: React.RefObject<HTMLDivElement>;
  }) => React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({
  children,
  render,
  defaultOpen = false
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const resize = function () {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  };

  // Adjust height on open/close
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  // Render prop pattern
  if (render) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden transition-all duration-300 hover:shadow-md">
        {render({
          isOpen,
          toggle: () => setIsOpen((prev) => !prev),
          resize: () => resize(),
          open: () => setIsOpen(true),
          close: () => setIsOpen(false),
          contentHeight,
          contentRef,
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h3 className="font-semibold">Accordion Title</h3>
        <span className="transform transition-transform duration-300">
          {isOpen ? <span>▼</span> : <span>►</span>}
        </span>
      </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ height: isOpen ? `${contentHeight}px` : "0px" }}
      >
        <div ref={contentRef} className="p-6 border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}
