"use client";

import DatePicker from "./datepicker";
import { lusitana } from "@/app/ui/fonts";
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

export default function EditTaskForm() {
  // const [errorMessage, formAction, isPending] = useActionState(
  //   authenticate,
  //   undefined,
  // );

  return (
    <form
      action={
        /*formAction*/ () => {
          console.log("submit task - ");
        }
      }
      className="space-y-3"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 w-[28rem]">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>Add Task</h1>
        <div className="w-full h-fit">
          <div>

            <div className="flex flex-col h-[64px] relative">
              <span className="text-[12px] leading-[22px]">
                Project
              </span>
              <div className="h-[42px] w-full">
                <SelectBox
                  name="project"
                  options={["Project A", "Project B", "Project C"]}
                />
              </div>
            </div>

            <div className="flex flex-col h-[64px] relative">
              <span className="text-[12px] leading-[22px]">
                Title
              </span>
              <div className="h-[42px] w-full">
                <input
                  type="text"
                  name="title"
                  className="w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task title"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col min-h-[64px] relative">
              <span className="text-[12px] leading-[22px]">
                Description
              </span>
              <div className="w-full">
                <textarea
                  rows={3}
                  maxLength={256}
                  name="description"
                  className="resize-y min-h-[64px] max-h-[220px] w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task description"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col h-[64px] relative">
              <span className="text-[12px] leading-[22px]">
                Due Date
              </span>
              <div className="h-[42px] w-full">
                <DatePicker
                  // type="date"
                  // name="dueDate"
                  // className="w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  // placeholder="Select due date"
                />
              </div>
            </div>

          </div>
        </div>
        <Button className="mt-4 w-full h-[42px] cursor-pointer">
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
