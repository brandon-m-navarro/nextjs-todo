"use client";

import DatePicker from "../ui/datepicker";
import { manrope } from "@/app/components/ui/fonts";
import SelectBox from "../ui/select-box";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";
import SimpleAnimation from "../ui/animation";

import { useState } from "react";

interface TaskFormProps {
  projectId: string;
}

export default function TaskForm({ projectId }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      // Send POST request to the API route for creating tasks
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
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

      // Clear the form after successful submission
      setTitle('');
      setDescription('');
      setDueDate('');
      
      // Optional: Refresh the page or trigger a callback to update the task list
      window.location.reload(); // Or use a state management solution

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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <SimpleAnimation />

      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 w-[28rem]">
        <h1
          className={`${manrope.className} text-[36px] ml-[6px] mb-[12px] mt-[0px]`}
        > Add New Task
        </h1>
        
        {/* Error Message */}
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
              <div className="h-[48px] w-full">
                <SelectBox
                  name="project"
                  options={["Project A", "Project B", "Project C"]}
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
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
          <ArrowRightIcon className="ml-auto h-[24px] w-[24px] text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        ></div>
      </div>
    </form>
  );
}