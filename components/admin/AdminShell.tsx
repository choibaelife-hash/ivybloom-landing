"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, PenLine, UserRound, ArrowUpRight } from "lucide-react";
import type { ReactNode, MouseEvent } from "react";
import AccountMenu from "./AccountMenu";
import s from "./local-studio.module.css";

export default function AdminShell({ email, title, children, documentCount, onNavigate, unsavedChanges = false, disabled = false }: {
  email: string; title: string; children: ReactNode; documentCount?: number;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void; unsavedChanges?: boolean; disabled?: boolean;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/admin", label: "글 관리", icon: FileText, active: pathname === "/admin" },
    { href: "/admin/write", label: "새 글 작성", icon: PenLine, active: pathname === "/admin/write" || pathname.startsWith("/admin/edit/") },
    { href: "/admin/mypage", label: "마이페이지", icon: UserRound, active: pathname === "/admin/mypage" },
  ];
  return <div className={s.app}>
    <aside className={s.sidebar}>
      <Link className={s.brand} href="/admin" onClick={onNavigate}><img className={s.brandLogo} src="/ivybloom logo.jpg" alt="아이비블룸 컨설팅" /></Link>
      <nav aria-label="관리자 메뉴">{links.map(item => <Link key={item.href} href={item.href} className={item.active ? s.navActive : s.navLink} aria-current={item.active ? "page" : undefined} onClick={onNavigate}><item.icon size={17} />{item.label}{item.href === "/admin" && documentCount !== undefined && <span>{documentCount}</span>}</Link>)}</nav>
      <div className={s.sidebarBottom}><a href="/" target="_blank" rel="noreferrer">홈페이지 보기 <ArrowUpRight size={14} /></a></div>
    </aside>
    <main className={s.main}>
      <header className={s.topbar}><span>관리자 / <strong>{title}</strong></span><AccountMenu email={email} unsavedChanges={unsavedChanges} disabled={disabled} /></header>
      {children}
    </main>
  </div>;
}
