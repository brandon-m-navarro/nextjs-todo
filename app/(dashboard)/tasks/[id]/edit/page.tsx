import React from 'react';
import { notFound } from 'next/navigation';
import { TaskEditForm } from '@/app/components/tasks/TaskEditForm';
import { BackButton } from '@/app/components/ui/back-button';

interface TaskEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getBaseUrl() {
    return process.env.NODE_ENV === 'production'
        ? 'https://nextjs-todo-lake.vercel.app'
        : 'http://localhost:3000';
}

async function getProjects() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/projects`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.projects || data.data || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  const { id } = await params;
  const [projects] = await Promise.all([
    getProjects()
  ]);

  if (!id) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-black">
      {/* Header with Back Button */}
      <div className="mb-8">
        <BackButton text="Task Details"/>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Task</h1>
        <p className="text-gray-600">Update the task details below</p>
      </div>

      {/* Edit Form */}
      <TaskEditForm taskId={id} projects={projects} />
    </div>
  );
}
