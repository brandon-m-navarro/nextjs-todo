import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { Project, ProjectFromDb } from '@/app/lib/definitions';

// Mapping function: snake_case DB fields to camelCase Project type
function mapProjectDbToType(projectFromDb: ProjectFromDb): Project {
    return {
        id: projectFromDb.id,
        name: projectFromDb.name,
        description: projectFromDb.description,
        hexColor: projectFromDb.hex_color,
        icon: projectFromDb.icon,
        creationDateTime: projectFromDb.creation_date_time,
        lastModifiedDateTime: projectFromDb.last_modified_date_time,
    };
}

// Update to expect a Promise for params
interface RouteParams {
    params: Promise<{
        projectId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        // Await the params first
        const { projectId } = await params;

        const dbProject = await db.projects.getById(projectId);

        if (!dbProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Map DB result to camelCase
        const project = mapProjectDbToType(dbProject);

        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        // Await the params first
        const { projectId } = await params;

        const deletedCount = await db.projects.delete(projectId);

        console.log('Promise awaited: ', deletedCount);
        // if (deletedCount === 0) {
        //     return NextResponse.json(
        //         { error: 'Project not found or already deleted' },
        //         { status: 404 }
        //     );
        // }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        // Await the params first
        const { projectId } = await params;
        const body = await request.json();

        const project = await db.projects.update(projectId, body);

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}
