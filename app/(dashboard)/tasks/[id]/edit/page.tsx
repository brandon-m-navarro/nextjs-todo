import BackButton from "@/app/components/ui/back-button";
import React from "react";
import { notFound } from "next/navigation";
import TaskEditForm from "@/app/components/tasks/TaskEditForm";

interface TaskEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  // Dynamic routes must be awaited
  const { id } = await params;
  if (!id) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 sm:p-8 text-black">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Task</h1>
        <p className="text-gray-600">Update the task details below</p>
      </div>

      <TaskEditForm taskId={id} />
    </div>
  );
}
