import React from 'react';
import { notFound } from 'next/navigation';
import { TaskEditForm } from '@/app/components/tasks/TaskEditForm';
import { BackButton } from '@/app/components/ui/back-button';

interface TaskEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-black">
      {/* Header with Back Button */}
      <div className="mb-8">
        <BackButton text="Task Details"/>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Task</h1>
        <p className="text-gray-600">Update the task details below</p>
      </div>

      {/* Edit Form */}
      <TaskEditForm taskId={id} />
    </div>
  );
}
