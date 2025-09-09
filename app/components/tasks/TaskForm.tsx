"use client";

import DatePicker from "../ui/datepicker";
import { manrope } from "@/app/components/ui/fonts";
import SelectBox from "../ui/select-box";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";
import SimpleAnimation from "../ui/animation";
import { useState } from "react";
import { Project } from "@/app/lib/definitions";

interface TaskFormProps {
  projects: Project[];
  initialProjectId?: string; // Make it optional
  onTaskCreated?: () => void;
}

export default function TaskForm({ projects, initialProjectId = '', onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const initialProject = projects.find(p => p.id === initialProjectId);
  const initialProjectName = initialProject ? initialProject.name : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedProjectId) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/projects/${selectedProjectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          expectedCompletionDateTime: dueDate || null,
          isDone: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      onTaskCreated?.();

      // Clear the form
      setTitle('');
      setDescription('');
      setDueDate('');
      setSelectedProjectId('');

    } catch (error) {
      console.error("Error creating task:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create task. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDateChange = (date: string) => {
    setDueDate(date);
  }

  const handleProjectChange = (projectName: string) => {
    const project = projects.find(p => p.name === projectName);
    if (project) {
      setSelectedProjectId(project.id);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 text-black"
    >
      <SimpleAnimation />

      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 w-[28rem]">
        <h1 className={`${manrope.className} text-[36px] ml-[6px] mb-[12px] mt-[0px]`}>
          Add New Task
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="w-[calc(100%-24px)] h-fit m-auto">
          <div>
            <div className="flex flex-col h-[72px] relative mb-[12px]">
              <span className="text-[18px] leading-[18px] mb-[6px]">
                Project
              </span>
              <div className="h-[48px] w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white flex items-center">
                <SelectBox
                  name="project"
                  options={projects.map(p => p.name)}
                  value={initialProjectName}
                  onChange={handleProjectChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col h-[72px] relative mb-[12px]">
              <span className="text-[18px] leading-[18px] mb-[6px]">Title</span>
              <div className="h-[48px] w-full">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                  className="box-border w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task title..."
                  required
                />
              </div>
            </div>

            <div className="flex flex-col relative mb-[12px]">
              <span className="text-[18px] leading-[18px] mb-[6px]">
                Description
              </span>
              <div className="w-full">
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={256}
                  name="description"
                  className="box-border resize-y min-h-[64px] max-h-[220px] w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task description"
                />
              </div>
            </div>
            <div className="flex flex-col h-[72px] relative mb-[12px]">
              <span className="text-[18px] leading-[18px] mb-[6px]">
                Due Date
              </span>
              <div className="h-[48px] w-full">
                <DatePicker
                  value={dueDate}
                  onChange={handleDateChange}
                  name="dueDate"
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          className="text-[20px] mt-4 w-[calc(100%-12px)] m-auto h-[48px] cursor-pointer"
          type="submit"
          disabled={isSubmitting || !title.trim() || !selectedProjectId}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
          <ArrowRightIcon className="ml-auto h-[24px] w-[24px] text-gray-50" />
        </Button>
      </div>
    </form>
  );
}