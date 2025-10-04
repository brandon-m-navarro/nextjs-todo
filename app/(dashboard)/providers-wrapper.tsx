'use client';
import { TaskProvider } from '@/app/contexts/TaskContext';
import { ProjectProvider } from '@/app/contexts/ProjectContext';
import { Task, Project } from '@/app/lib/definitions';

interface ProvidersWrapperProps {
  children: React.ReactNode;
  initialTasks: Task[];
  initialProjects: Project[];
}

export default function ProvidersWrapper({ 
  children, 
  initialTasks, 
  initialProjects 
}: ProvidersWrapperProps) {
  return (
    <ProjectProvider initialProjects={initialProjects}>
      <TaskProvider initialTasks={initialTasks}>
        {children}
      </TaskProvider>
    </ProjectProvider>
  );
}
