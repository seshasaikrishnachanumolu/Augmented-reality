import { ARViewer } from "@/components/ar/ARViewer";

export default async function ARPage({ params }: PageProps<"/ar/[id]">) {
  const { id } = await params;
  return <ARViewer sceneId={id} />;
}
