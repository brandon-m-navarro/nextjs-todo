// import { ProjectSidebar } from "./components/project-sidebar";

export default function DashboardLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* <ProjectSidebar /> */}
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
