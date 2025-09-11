export default function DashboardLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';