"use client";
import { TaskProvider } from "@/app/contexts/TaskContext";
import { ProjectProvider } from "@/app/contexts/ProjectContext";
import { UserProvider } from "@/app/contexts/UserContext";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

export default function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <UserProvider>
      <ProjectProvider>
        <TaskProvider>{children}</TaskProvider>
      </ProjectProvider>
    </UserProvider>
  );
}
