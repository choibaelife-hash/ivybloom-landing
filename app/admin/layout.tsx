import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="pt-16">{children}</div>
    </>
  );
}
