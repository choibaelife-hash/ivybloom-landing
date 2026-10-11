"use client";
import { useState } from "react";

export default function AccountMenu({ unsavedChanges = false, email, disabled = false }: { unsavedChanges?: boolean; email?: string; disabled?: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function logout() {
    if (unsavedChanges && !window.confirm("저장하지 않은 변경이 있습니다. 로그아웃할까요?")) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/admin/session", { method: "DELETE", headers: { "x-ivy-admin-request": "1" } });
      if (!response.ok) throw new Error("로그아웃하지 못했습니다. 다시 시도해 주세요.");
      window.location.assign("/admin/login");
    } catch (e) { setError(e instanceof Error ? e.message : "다시 시도해 주세요."); setBusy(false); }
  }
  return <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", letterSpacing: 0 }}>
    {email && <span>관리자 로그인 · {email}</span>}
    <a href="/admin/mypage" onClick={event => { if (disabled || (unsavedChanges && !window.confirm("저장하지 않은 변경이 있습니다. 마이페이지로 이동할까요?"))) event.preventDefault(); }}>마이페이지</a>
    <button type="button" onClick={logout} disabled={busy || disabled} style={{ border: 0, background: "none" }}>로그아웃</button>
    {error && <span role="alert">{error}</span>}
  </div>;
}
