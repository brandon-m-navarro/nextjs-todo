"use client";

import DatePicker from "../ui/datepicker";
import { manrope } from "@/app/components/ui/fonts";
import SelectBox from "../ui/select-box";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";
import SimpleAnimation from "../ui/animation";

import { useState } from "react";
import { db } from "@/app/lib/db";
import { generateId } from "@/app/lib/utilities";

interface TaskFormProps {
  projectId: string;
}

export default function TaskForm({ projectId }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; // Prevent submission if title is empty
    setIsSubmitting(true);

    try {
      await db.projects.create(
        generateId('PRO'),
        title,
        description,
       '#f0f0f0', // Default color
        'task.png' // Default icon
      )
      setTitle(''); // Clear the title input after successful submission
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
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
                  // type="date"
                  name="dueDate"
                  // className="w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  // placeholder="Select due date"
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
