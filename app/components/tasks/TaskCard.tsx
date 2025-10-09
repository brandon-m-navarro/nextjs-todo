"use client";
import { Task } from "../../lib/definitions";
import Image from "next/image";

type TaskCardProps = {
  color?: string;
  task: Task;
};

export default function TaskCard({ color, task }: TaskCardProps) {
  return (
    <div className="rounded-md" style={{ backgroundColor: color || "#f0f0f0" }}>
      <div className="flex items-center gap-2 p-2">
        <Image
          src="/icons/task.svg"
          alt="Task Icon"
          width={24}
          height={24}
          className="h-6 w-6"
        />
        <span>{task.title}</span>
      </div>
    </div>
  );
}
