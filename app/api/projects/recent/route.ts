import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // searchParams is used to get the limit query parameter
  const { searchParams } = new URL(request.url);

  // limit is optional, default to 5
  const limit = parseInt(searchParams.get("limit") || "5");

  // Fetch recent projects
  const projects = await prisma.project.findMany({
    orderBy: { lastModifiedDateTime: 'desc' }
  });

  return NextResponse.json({ success: true, projects: projects.slice(0, limit) });
}
