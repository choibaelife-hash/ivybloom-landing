import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession, SESSION_COOKIE } from "@/lib/admin/auth";
import { newDocument } from "@/lib/local-studio";
import LocalStudio from "./LocalStudio";

export default async function AdminWorkspace({ mode = "list", documentId }: { mode?: "list" | "write" | "edit"; documentId?: string }) {
  const session = await getSession((await cookies()).get(SESSION_COOKIE)?.value).catch(() => null);
  if (!session) redirect("/admin/login");
  return <LocalStudio key={`${mode}:${documentId || ""}`} email={session.email} initialDocument={mode === "write" ? newDocument("journalPost") : undefined} documentId={documentId} />;
}
