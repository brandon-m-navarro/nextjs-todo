import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const response = await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
      response: response,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: body.name,
        description: body.description || null,
        hexColor: body.hexColor || null,
        userId: body.userId || null,
        icon: body.icon || null,
        lastModifiedDateTime: new Date(),
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Now that the project is updated, update all associated tasks' privacy if userId changed
    if (body.userId !== undefined) {
      await prisma.task.updateMany({
        where: { projectId: projectId },
        data: {
          userId: body.userId,
        },
      });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
