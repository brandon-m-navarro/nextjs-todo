import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

// Update to expect a Promise for params
interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams  // ← params is now a Promise
) {
  try {
    // Await the params first
    const { projectId } = await params;
    
    const project = await db.projects.getById(projectId);  // ← Use the awaited projectId
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
