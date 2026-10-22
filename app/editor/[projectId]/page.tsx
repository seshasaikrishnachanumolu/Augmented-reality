import { EditorShell } from "@/components/layout/EditorShell";

export default async function EditorPage({ params }: PageProps<"/editor/[projectId]">) {
  const { projectId } = await params;
  return <EditorShell projectId={projectId} />;
}
