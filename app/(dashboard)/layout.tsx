// app/(dashboard)/layout.tsx
import ProvidersWrapper from "@/app/(dashboard)/providers-wrapper";

// Ensure the layout is dynamic and does not cache data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove the data fetching - let the context handle it
  return (
    <ProvidersWrapper>
      {children}
    </ProvidersWrapper>
  );
}