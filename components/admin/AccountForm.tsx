"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import s from "./account.module.css";
import AdminShell from "./AdminShell";

export default function AccountForm({ email }: { email?: string }) {
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    if (email && form.get("newPassword") !== form.get("confirmPassword")) {
      setError("새 비밀번호가 서로 다릅니다."); return;
    }
    setBusy(true); setError("");
    try {
      const response = await fetch(email ? "/admin/password" : "/admin/session", {
        method: "POST", headers: { "Content-Type": "application/json", "x-ivy-admin-request": "1" },
        body: JSON.stringify(email ? { currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") }
          : { email: form.get("email"), password: form.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "다시 시도해 주세요.");
      window.location.assign(email ? "/admin/login?changed=1" : "/admin");
    } catch (e) { setError(e instanceof Error ? e.message : "다시 시도해 주세요."); setBusy(false); }
  }
  const form = <section className={`${s.screen} ${email ? s.accountScreen : ""}`}>
    <div className={s.card}>
      <p className={s.eyebrow}>IVY BLOOM CONSULTING</p>
      <h1>{email ? "마이페이지" : "관리자 로그인"}</h1>
      <p className={s.intro}>{email ? "로그인 비밀번호를 변경할 수 있습니다." : "Ivy Bloom의 글을 관리하려면 로그인해 주세요."}</p>
      {params.get("changed") === "1" && !email && <p role="status" className={s.success}>비밀번호가 변경되었습니다. 다시 로그인해 주세요.</p>}
      {error && <p role="alert" className={s.error}>{error}</p>}
      <form onSubmit={submit}>
        <fieldset disabled={busy}>
          <label>이메일<input name="email" type="email" autoComplete="username" required maxLength={254} defaultValue={email} readOnly={!!email} /></label>
          {email ? <>
            <label>현재 비밀번호<input name="currentPassword" type="password" autoComplete="current-password" required maxLength={128} /></label>
            <label>새 비밀번호<input name="newPassword" type="password" autoComplete="new-password" required minLength={6} maxLength={128} aria-describedby="password-help" /></label>
            <label>새 비밀번호 확인<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={6} maxLength={128} /></label>
            <p id="password-help" className={s.help}>6~128자로 입력하세요. 비밀번호를 변경하면 모든 기기에서 로그아웃됩니다.</p>
          </> : <label>비밀번호<input name="password" type="password" autoComplete="current-password" required maxLength={128} /></label>}
          <button type="submit">{busy ? "처리 중…" : email ? "비밀번호 변경" : "로그인"}</button>
        </fieldset>
      </form>
      <Link className={s.back} href={email ? "/admin" : "/"}>{email ? "글 관리로 돌아가기" : "홈페이지로 돌아가기"}</Link>
    </div>
  </section>;
  return email ? <AdminShell email={email} title="마이페이지" disabled={busy}>{form}</AdminShell> : form;
}
