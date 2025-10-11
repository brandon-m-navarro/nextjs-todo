import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { generateId } from "@/app/lib/utilities";

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
    const project = await db.projects.create(
      projectId,
      name,
      description,
      hexColor,
      icon
    );

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
    const projects = await db.projects.getAll();

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
