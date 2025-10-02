// components/tasks/TaskManager.tsx
'use client';
import { TaskList } from './TaskList';
import { TaskFormAccordion } from './TaskFormAccordion';
import { Project } from '@/app/lib/definitions';

interface TaskManagerProps {
  project: Project;
}

export function TaskManager({ project }: TaskManagerProps) {
  // console.log('Project set in TaskManager - ', project)
  return (
    <div className="bg-white rounded-lg shadow">
        <TaskFormAccordion projectId={project.id} projects={[project]} />
        <TaskList projectId={project.id}/>
    </div>
  );
}
