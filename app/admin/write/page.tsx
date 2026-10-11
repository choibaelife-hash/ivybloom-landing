import type { Metadata } from "next";
import AdminWorkspace from "@/components/admin/AdminWorkspace";
export const metadata: Metadata = { title: "새 글 작성 · Ivy Bloom", robots: { index: false, follow: false } };
export default function WritePage() { return <AdminWorkspace mode="write" />; }
