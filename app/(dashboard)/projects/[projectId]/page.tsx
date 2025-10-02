import ProjectPageComponent from "@/app/components/projects/ProjectPageComponent";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  return (
    <ProjectPageComponent projectId={projectId}></ProjectPageComponent>
  );
}
