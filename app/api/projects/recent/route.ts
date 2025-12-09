import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Project } from "@/lib/definitions";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const user = session?.user;

  // searchParams is used to get the limit query parameter
  const { searchParams } = new URL(request.url);

  // limit is optional, default to 5
  const limit = parseInt(searchParams.get("limit") || "5");

  // Fetch public projects
  const publicProjects = await prisma.project.findMany({
    where: { userId: null },
    orderBy: { creationDateTime: 'desc' },
    take: 5
  });

  let privateProjects:Project[] = [];
  if (user) {
    privateProjects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { creationDateTime: 'desc' },
      take: 5
    });
  }

  const projects = [...privateProjects, ...publicProjects];

  return NextResponse.json({
    success: true,
    projects: projects.slice(0, limit),
    privateProjects: [],
    publicProjects: [],
  });
}
