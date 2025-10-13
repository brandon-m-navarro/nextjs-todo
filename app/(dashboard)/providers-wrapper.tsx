"use client";
import { TaskProvider } from "@/app/contexts/TaskContext";
import { ProjectProvider } from "@/app/contexts/ProjectContext";
// import { Task, Project } from "@/app/lib/definitions";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

export default function ProvidersWrapper({
  children
}: ProvidersWrapperProps) {
  return (
    <ProjectProvider>
      <TaskProvider>{children}</TaskProvider>
    </ProjectProvider>
  );
}
