import Link from 'next/link';
import { TaskList } from '@/app/components/tasks/TaskList';
import { TaskFilters } from '@/app/components/tasks/TaskFilters';
import { Task, Project } from '@/app/lib/definitions';

async function getTasks() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://nextjs-todo-lake.vercel.app' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/tasks`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    const data = await response.json();
    // Return just the tasks array from the response
    return data.tasks || data.data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

async function getProjects() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://nextjs-todo-lake.vercel.app' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/projects`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const data = await response.json();
    // Return just the projects array from the response
    return data.projects || data.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Define the search params type
interface SearchParams {
  project?: string;
  status?: 'all' | 'active' | 'completed';
  sort?: 'newest' | 'oldest' | 'due-date';
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  
  // Fetch data from API routes
  const [allTasks, projects] = await Promise.all([
    getTasks(),
    getProjects()
  ]);

  // Apply filters
  const filteredTasks = allTasks.filter((task: Task) => {
    // Project filter
    if (resolvedSearchParams?.project && task.projectId !== resolvedSearchParams.project) {
      return false;
    }
    
    // Status filter
    if (resolvedSearchParams?.status === 'active' && task.isDone) {
      return false;
    }
    if (resolvedSearchParams?.status === 'completed' && !task.isDone) {
      return false;
    }
    
    return true;
  });

  // Apply sorting
  const sortedTasks = filteredTasks.sort((a: Task, b: Task) => {
    switch (resolvedSearchParams?.sort) {
      case 'oldest':
        return new Date(a.creationDateTime).getTime() - new Date(b.creationDateTime).getTime();
      case 'due-date':
        if (!a.expectedCompletionDateTime) return 1;
        if (!b.expectedCompletionDateTime) return -1;
        return new Date(a.expectedCompletionDateTime).getTime() - new Date(b.expectedCompletionDateTime).getTime();
      case 'newest':
      default:
        return new Date(b.creationDateTime).getTime() - new Date(a.creationDateTime).getTime();
    }
  });

  const activeTasks = allTasks.filter((task: Task) => !task.isDone);
  const completedTasks = allTasks.filter((task: Task) => task.isDone);

  return (
    <div className="max-w-6xl mx-auto text-black">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/"
          className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600 mt-2">
              Manage tasks across all your projects
            </p>
          </div>
          <Link
            href="/tasks/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + New Task
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">{allTasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">{activeTasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <TaskFilters
          projects={projects}
          currentProject={resolvedSearchParams?.project}
          currentStatus={resolvedSearchParams?.status}
          currentSort={resolvedSearchParams?.sort}
        />
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            Tasks ({filteredTasks.length})
            {resolvedSearchParams?.project && (
              <span className="text-gray-600 text-lg font-normal ml-2">
                in {projects.find((p: Project) => p.id === resolvedSearchParams.project)?.name}
              </span>
            )}
          </h2>
        </div>

        {filteredTasks.length > 0 ? (
          <TaskList tasks={sortedTasks} showProject={true} />
        ) : (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {allTasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {allTasks.length === 0 
                ? 'Create your first task to get started' 
                : 'Try changing your filters or create a new task'
              }
            </p>
            <Link
              href="/tasks/new"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Task
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}