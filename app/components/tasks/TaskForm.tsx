"use client";

import DatePicker from "../ui/datepicker";
import { manrope } from "@/app/components/ui/fonts";
import SelectBox from "../ui/select-box";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";
import SimpleAnimation from "../ui/animation";
import SpinnerComponent  from "../ui/spinner";
import { useSpinner } from "../ui/spinner";
import { useState } from "react";
import { Project } from "@/app/lib/definitions";
import { Task } from "@/app/lib/definitions";

interface TaskFormProps {
  projects: Project[];
  initialProjectId?: string;
  onTaskCreated?: (task: Task) => void;
}

export default function TaskForm({ projects, initialProjectId = '', onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    spinnerState,
    showSpinner,
    hideSpinner,
    showSpinnerLoading,
    showSpinnerSuccess,
    showSpinnerError
  } = useSpinner();

  // Find the initial project name based on the initialProjectId
  const initialProject = projects.find(p => p.id === initialProjectId);
  const initialProjectName = initialProject ? initialProject.name : '';

  const handleSubmit = async (e: React.FormEvent) => {
    showSpinner();

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
        showSpinnerError();
        throw new Error(errorData.error || 'Failed to create task');
      }

      // showSpinnerSuccess();
      showSpinnerLoading();

      // Construct Task object from response
      const data = await response.json();
      const newTask = data.task;

      // Show the task was created

      onTaskCreated?.(newTask);

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
      className="text-black w-full max-w-6xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
        {/* Animation Section - Visible on larger screens */}
        {/* <div className="hidden lg:flex flex-col items-center justify-center flex-shrink-0">
          <div className="w-[250px] h-[250px]">
            <SimpleAnimation />
          </div>
        </div> */}

        {/* Form Section */}
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-6 pt-8 w-full">
          <div className="flex lg:hidden justify-center mb-6">
            <div className="w-[150px] h-[150px]">
              {/* <SimpleAnimation /> */}
              <SpinnerComponent spinnerState={spinnerState} />
            </div>
          </div>

          <h1 className={`${manrope.className} text-2xl md:text-3xl lg:text-[36px] mb-6 text-center lg:text-left`}>
            Add New Task
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Project and Title */}
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">Project</label>
                <div className="h-12 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white flex items-center">
                  <SelectBox
                    name="project"
                    options={projects.map(p => p.name)}
                    value={initialProjectName}
                    onChange={handleProjectChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                  className="w-full h-12 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task title..."
                  required
                />
              </div>
            </div>

            {/* Right Column - Due Date and Description */}
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">Due Date</label>
                <DatePicker
                  value={dueDate}
                  onChange={handleDateChange}
                  name="dueDate"
                  className="h-12"
                />
              </div>

              <div className="flex flex-col lg:row-span-2">
                <label className="text-lg font-medium mb-2">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={256}
                  name="description"
                  className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none resize-vertical"
                  placeholder="Enter task description"
                />
              </div>
            </div>
          </div>

          {/* Full width button */}
          <div className="flex justify-center lg:justify-end">
            <Button
              className="text-lg w-full lg:w-auto min-w-[200px] h-12 cursor-pointer flex items-center justify-center gap-2"
              type="submit"
              disabled={isSubmitting || !title.trim() || !selectedProjectId}
            >
              {isSubmitting ? "Adding..." : "Add Task"}
              <ArrowRightIcon className="h-5 w-5 text-gray-50" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
