import type { Metadata } from "next";
import AdminWorkspace from "@/components/admin/AdminWorkspace";

export const metadata: Metadata = {
  title: "글 관리 · Ivy Bloom",
  robots: { index: false, follow: false },
};

export default function AdminPage() { return <AdminWorkspace />; }
