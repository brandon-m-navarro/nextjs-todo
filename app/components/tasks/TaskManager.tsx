// components/tasks/TaskManager.tsx
'use client';

import { useState } from 'react';
import { TaskList } from './TaskList';
import { TaskFormAccordion } from './TaskFormAccordion';
import { Project, Task } from '@/app/lib/definitions';

interface TaskManagerProps {
  project: Project;
  initialTasks: Task[];
}

export function TaskManager({ initialTasks, project }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (newTask: Task) => {
    console.log('New task added:', newTask);
    setTasks(prevTasks => [newTask, ...prevTasks]);
    
    // Optional: API here
    // await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(newTask) });
  };

  return (
    <div className="bg-white rounded-lg shadow">
        <TaskFormAccordion projectId={project.id} projects={[project]} taskSubmitCallback={handleAddTask} />
        <TaskList initialTasks={tasks}/>
    </div>
  );
}
