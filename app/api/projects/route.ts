import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession } from "@/lib/server/auth";
import type { SceneData } from "@/types/scene";

function toSummary(project: {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: project.id,
    name: project.name,
    color: project.color,
    createdAt: project.createdAt.getTime(),
    updatedAt: project.updatedAt.getTime(),
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ projects: projects.map(toSummary) });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, color, scenes } = (body ?? {}) as {
    name?: string;
    color?: string;
    scenes?: SceneData[];
  };

  if (!Array.isArray(scenes) || scenes.length === 0) {
    return NextResponse.json({ error: "A project needs at least one scene." }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      userId: session.userId,
      name: name?.trim() || "Untitled CoSpace",
      color: color || "#8b5cf6",
      scenesJson: JSON.stringify(scenes),
      activeSceneId: scenes[0].id,
    },
  });

  return NextResponse.json({ project: toSummary(project) });
}
