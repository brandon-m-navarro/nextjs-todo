import BackButton from "@/app/components/ui/back-button";
import React from "react";
import { notFound } from "next/navigation";
import ProjectEditForm from "@/app/components/projects/ProjectEditForm";

interface ProjectEditPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectEditPage({
  params,
}: ProjectEditPageProps) {
  // Dynamic routes must be awaited
  const { projectId } = await params;
  if (!projectId) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-8 text-black">
      <div className="mb-8">
        <BackButton text="Project Details" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
        <p className="text-gray-600">Update the project details below</p>
      </div>

      <ProjectEditForm projectId={projectId} />
    </div>
  );
}
