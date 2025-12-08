import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utilities";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Project } from "@/lib/definitions";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, hexColor, icon, userId } = body;

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
      userId: userId || null,
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

// Fetch all projects, both public and those that are associated with the user
export async function GET() {
  try {
    const session = await auth.api.getSession();
    const user = session?.user;

    console.log("API Route User:", user);

    const publicProjects = await prisma.project.findMany({
      where: { userId: null },
      orderBy: { creationDateTime: 'desc' }
    });

    let privateProjects:Project[] = [];
    if (user) {
      privateProjects = await prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { creationDateTime: 'desc' }
      });
    }

    // For now, combine both public and private projects into a single list
    const projects = [...privateProjects, ...publicProjects];

    return NextResponse.json({
      success: true,
      projects: projects,
      public: publicProjects,
      private: privateProjects
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
