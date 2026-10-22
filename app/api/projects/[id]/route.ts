import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getClerkSession as getSession } from "@/lib/server/clerkSession";
import type { SceneData } from "@/types/scene";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project || project.userId !== session.userId) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  let scenes: SceneData[] = [];
  try {
    scenes = JSON.parse(project.scenesJson);
  } catch {
    scenes = [];
  }

  return NextResponse.json({
    project: {
      id: project.id,
      name: project.name,
      color: project.color,
      scenes,
      activeSceneId: project.activeSceneId,
    },
  });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, scenes, activeSceneId } = (body ?? {}) as {
    name?: string;
    scenes?: SceneData[];
    activeSceneId?: string;
  };

  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() || existing.name } : {}),
      ...(scenes !== undefined ? { scenesJson: JSON.stringify(scenes) } : {}),
      ...(activeSceneId !== undefined ? { activeSceneId } : {}),
    },
  });

  return NextResponse.json({
    project: {
      id: updated.id,
      name: updated.name,
      color: updated.color,
      updatedAt: updated.updatedAt.getTime(),
    },
  });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
