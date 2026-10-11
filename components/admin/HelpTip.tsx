"use client";
import { useId, useState, type ReactNode } from "react";
import s from "./local-studio.module.css";

export default function HelpTip({ text, label = "도움말", children, id, dismissOnClick = false }: { text: string; label?: string; children?: ReactNode; id?: string; dismissOnClick?: boolean }) {
  const generatedId = useId();
  const tooltipId = id || generatedId;
  const [dismissed, setDismissed] = useState(false);
  const [pinned, setPinned] = useState(false);
  return <span className={`${s.helpTip} ${dismissed ? s.helpDismissed : ""} ${pinned ? s.helpPinned : ""}`}
    onClick={() => { if (dismissOnClick) { setDismissed(true); setPinned(false); } }}
    onMouseEnter={() => setDismissed(false)} onFocus={() => setDismissed(false)}
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPinned(false); }}
    onKeyDown={e => { if (e.key === "Escape") { setDismissed(true); setPinned(false); } }}>
    {children || <button type="button" className={s.helpTrigger} aria-label={label} aria-describedby={tooltipId} aria-expanded={pinned}
      onClick={e => { e.preventDefault(); setDismissed(false); setPinned(v => !v); }}>{label.replace(/ 도움말$/, "")}</button>}
    <span id={tooltipId} role="tooltip" className={s.helpText}>{text}</span>
  </span>;
}
