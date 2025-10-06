import { NextRequest, NextResponse } from 'next/server';
import { db, mapProjectDbToType } from '@/app/lib/db';
import { generateId } from '@/app/lib/utilities';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, hexColor, icon } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Project name is required' },
                { status: 400 }
            );
        }

        const projectId = generateId('PRO');
        const dbProject = await db.projects.create(
            projectId,
            name,
            description,
            hexColor,
            icon
        );

        // Map DB result to camelCase
        const project = mapProjectDbToType(dbProject);

        return NextResponse.json(
            { success: true, project },
            { status: 201 }
        );
    } catch (error) {
        console.error('Failed to create project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const dbProjects = await db.projects.getAll();
        // Map all projects to camelCase
        const projects = dbProjects.map(mapProjectDbToType);
        return NextResponse.json({ success: true, projects });
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}
