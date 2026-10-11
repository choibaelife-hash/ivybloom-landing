import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession, SESSION_COOKIE } from "@/lib/admin/auth";
import AccountForm from "@/components/admin/AccountForm";

export const metadata: Metadata = { title: "로그인 · Ivy Bloom", robots: { index: false, follow: false } };
export default async function LoginPage() {
  const session = await getSession((await cookies()).get(SESSION_COOKIE)?.value).catch(() => null);
  if (session) redirect("/admin");
  return <AccountForm />;
}
