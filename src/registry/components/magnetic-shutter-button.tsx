"use client";

import { useState } from "react";

export interface MagneticShutterButtonProps {
  /** Primary button label. */
  label?: string;
  /** Optional alternate label rolled in on hover (defaults to label). */
  hoverLabel?: string;
  /** Accent indicator dot and border tint color. */
  accentColor?: string;
  /** Maximum magnetic pull travel in px (4-14). */
  pullPx?: number;
  onClick?: () => void;
  className?: string;
}

/**
 * Magnetic Obsidian Button with Vertical Double-Shutter Text Roll.
 * Tracks cursor position for gentle magnetic attraction and rolls typography smoothly on hover.
 */
export function MagneticShutterButton({
  label = "Deploy Circuit",
  hoverLabel,
  accentColor = "#f27c63",
  pullPx = 8,
  onClick,
  className = "",
}: MagneticShutterButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0, hovered: false });
  const secondary = hoverLabel || label;

  function handleMove(e: React.PointerEvent<HTMLButtonElement>) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setOffset({ x: 0, y: 0, hovered: true });
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const clampPull = Math.max(4, Math.min(14, pullPx));
    setOffset({ x: dx * clampPull, y: dy * clampPull, hovered: true });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerEnter={() => setOffset((prev) => ({ ...prev, hovered: true }))}
      onPointerLeave={() => setOffset({ x: 0, y: 0, hovered: false })}
      className={`group relative inline-flex h-11 items-center gap-3 rounded-full border bg-[#0c0c12] px-6 text-xs font-semibold tracking-wide text-[#f8f5f0] cursor-pointer active:scale-[0.98] ${className}`}
      style={{
        borderColor: offset.hovered ? `${accentColor}88` : "rgba(248, 245, 240, 0.16)",
        transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
        transition: offset.hovered
          ? "transform 110ms ease-out, border-color 200ms ease"
          : "transform 340ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms ease",
        boxShadow: offset.hovered
          ? `inset 0 1px 0 rgba(255,255,255,0.16), 0 12px 30px -12px ${accentColor}66`
          : "inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      <span
        className="h-2 w-2 rounded-full transition-transform duration-200"
        style={{
          backgroundColor: accentColor,
          transform: offset.hovered ? "scale(1.25)" : "scale(1)",
        }}
        aria-hidden="true"
      />

      <span className="relative block h-4 overflow-hidden leading-4">
        <span
          className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: offset.hovered ? "translateY(-100%)" : "translateY(0%)" }}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            color: accentColor,
            transform: offset.hovered ? "translateY(-100%)" : "translateY(0%)",
          }}
        >
          {secondary}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="font-mono text-[11px] text-[#9c978f] transition-transform duration-200"
        style={{ transform: offset.hovered ? "translateX(2px)" : "translateX(0)" }}
      >
        -&gt;
      </span>
    </button>
  );
}
