import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TaskDetail } from '@/app/components/tasks/TaskDetails';

// Update interface to match Next.js 15 expectations
interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getTask(id: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://nextjs-todo-lake.vercel.app' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/tasks/${id}`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    
    const data = await response.json();
    return data.task || data.data || null;
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  // Await the params first
  const { id } = await params;
  
  const task = await getTask(id);  // Use the awaited id
  console.log('Fetched task:', task);

  if (!task) {
    notFound();
  }

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
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
          <Link
            href={`/tasks/${id}/edit`}  // Use the awaited id
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit Task
          </Link>
        </div>
      </div>

      {/* Task Detail Component */}
      <TaskDetail task={task} />
    </div>
  );
}
