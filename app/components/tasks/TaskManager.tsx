// components/tasks/TaskManager.tsx
"use client";
import TaskList from "./TaskList";
import TaskFormAccordion from "./TaskFormAccordion";
import { Project } from "@/app/lib/definitions";

interface TaskManagerProps {
  project: Project;
}

export default function TaskManager({ project }: TaskManagerProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <TaskFormAccordion projectId={project.id} />
      <TaskList projectId={project.id} />
    </div>
  );
}
