"use client";

import DatePicker from "./datepicker";
import { manrope } from "@/app/ui/fonts";
import SelectBox from "./select-box";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useActionState } from "react";
// import { authenticate } from '@/app/lib/actions';
import SimpleAnimation from "./animation";


export default function EditTaskForm() {
  // const [errorMessage, formAction, isPending] = useActionState(
  //   authenticate,
  //   undefined,
  // );

  return (
    <form
      action={(formData: FormData) => {
        const task = {
          project: formData.get("project"),
          title: formData.get("title"),
          description: formData.get("description"),
          dueDate: formData.get("dueDate"),
        };
        console.log("submit task - ", task);

        // Here you would typically handle the form submission,
        // such as sending the task data to an API or updating local storage.

        // Reset the form after submission
        formData.set("project", "");
        formData.set("title", "");
        formData.set("description", "");
        formData.set("dueDate", "");
      }}

      className="space-y-3"
    >

      <SimpleAnimation/>

      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 w-[28rem]">
        <h1 className={`${manrope.className} text-[36px] ml-[6px] mb-[12px] mt-[0px]`}>Add Task</h1>
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
              <span className="text-[18px] leading-[18px] mb-[6px]">
                Title
              </span>
              <div className="h-[48px] w-full">
                <input
                  type="text"
                  name="title"
                  className="box-border w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task title"
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
        <Button className="text-[20px] mt-4 w-[calc(100%-12px)] m-auto h-[48px] cursor-pointer">
          Save<ArrowRightIcon className="ml-auto h-[24px] w-[24px] text-gray-50" />
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
