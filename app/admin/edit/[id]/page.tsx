import type { Metadata } from "next";
import AdminWorkspace from "@/components/admin/AdminWorkspace";
export const metadata: Metadata = { title: "글 편집 · Ivy Bloom", robots: { index: false, follow: false } };
export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminWorkspace mode="edit" documentId={id} />;
}
