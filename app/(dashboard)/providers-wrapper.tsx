'use client';
import { TaskProvider } from '@/app/contexts/TaskContext';
import { ProjectProvider } from '@/app/contexts/ProjectContext';

interface ProvidersWrapperProps {
  children: React.ReactNode;
  initialTasks: any[];
  initialProjects: any[];
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
