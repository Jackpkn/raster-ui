"use client";

import { useState } from "react";

export interface GlassToastStackProps {
  /** Accent highlight for active toast badge and trigger button. */
  accentColor?: string;
  className?: string;
}

const PRESET_TOASTS = [
  { title: "Copied single-file TSX", sub: "grain-gradient-orbs.tsx · 6.4 KB" },
  { title: "Registry JSON verified", sub: "100 components · 0 dependencies" },
  { title: "Edge preview deployed", sub: "Static pages live in 1.8s" },
  { title: "Palette synced to Prism", sub: "Violet / Cyan / Cobalt LUT active" },
];

/**
 * Interactive Sonner-Style Stacked Obsidian Toast Launcher.
 * Click the pill trigger to push fresh glass notifications onto a depth-faded 3-card stack.
 */
export function GlassToastStack({
  accentColor = "#f27c63",
  className = "",
}: GlassToastStackProps) {
  const [seq, setSeq] = useState(0);

  function pushToast() {
    setSeq((n) => n + 1);
  }

  const stack = [0, 1, 2].map((offset) => {
    const idx = (seq - offset + PRESET_TOASTS.length * 100) % PRESET_TOASTS.length;
    return { ...PRESET_TOASTS[idx]!, key: `${seq - offset}-${idx}` };
  });

  return (
    <div className={`flex w-full max-w-xs flex-col items-center gap-3 ${className}`}>
      <div className="relative h-[76px] w-full">
        {stack.map((item, depth) => {
          const isFront = depth === 0;
          return (
            <div
              key={item.key}
              className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                zIndex: 3 - depth,
                backgroundColor: isFront ? "#11111a" : "#0a0a10",
                borderColor: isFront ? `${accentColor}77` : "rgba(248, 245, 240, 0.12)",
                transform: `translateY(${depth * 9}px) scale(${1 - depth * 0.055})`,
                opacity: isFront ? 1 : depth === 1 ? 0.65 : 0.35,
                boxShadow: isFront
                  ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 14px 28px -12px rgba(0,0,0,0.9)"
                  : "none",
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-[#f8f5f0]">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.title}</span>
                </div>
                <div className="mt-0.5 truncate pl-3.5 font-mono text-[9.5px] text-[#8d8880]">
                  {item.sub}
                </div>
              </div>
              <span className="font-mono text-[9px] text-[#6e6a64] shrink-0">now</span>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={pushToast}
        className="rounded-full border border-white/14 bg-[#0d0d14] px-3.5 py-1 font-mono text-[10.5px] text-[#f8f5f0] hover:border-white/30 cursor-pointer transition-colors"
      >
        + Trigger Toast
      </button>
    </div>
  );
}
