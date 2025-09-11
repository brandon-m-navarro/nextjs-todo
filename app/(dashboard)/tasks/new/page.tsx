import Link from 'next/link';
import TaskForm from '@/app/components/tasks/TaskForm';

interface NewTaskPageProps {
  params: Promise<{
    id?: string; // Optional if you want to support pre-selecting a project
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
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        return data.projects || data.data || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

export default async function NewTaskPage({ params }: NewTaskPageProps) {
  const resolvedParams = await params;
  const projects = await getProjects();

  // Optional: If you want to pre-select a project from URL params
  const initialProjectId = resolvedParams.id || '';

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <Link 
          href="/tasks"
          className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6 transition-colors group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Tasks
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Task</h1>
        <p className="text-gray-600">Add a new task to your project</p>
      </div>

      {/* Task Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <TaskForm 
          projects={projects} 
          initialProjectId={initialProjectId} 
        />
      </div>
    </div>
  );
}
