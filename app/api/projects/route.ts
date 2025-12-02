import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utilities";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, hexColor, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const projectId = generateId("PRO");

    const project = await prisma.project.create({ data: {
      id: projectId,
      name,
      description: description || null,
      hexColor: hexColor || null,
      icon: icon || null,
      creationDateTime: new Date(),
      lastModifiedDateTime: new Date(),
    } })

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { creationDateTime: 'desc' } });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
