"use client";

import { useState } from "react";

export interface BrowserFrameMockupProps {
  /** URL displayed in browser address pill. */
  url?: string;
  /** Active viewport button and frame highlight accent color. */
  accentColor?: string;
  className?: string;
}

const VIEWPORTS = [
  { id: "desktop", label: "Desktop", widthPct: 100, cols: 3 },
  { id: "tablet", label: "Tablet", widthPct: 68, cols: 2 },
  { id: "mobile", label: "Mobile", widthPct: 40, cols: 1 },
] as const;

/**
 * Interactive Responsive Viewport Morpher Browser Frame.
 * Click Desktop, Tablet, or Mobile to smoothly animate an obsidian browser window width
 * and reflow its interior wireframe grid with zero external dependencies.
 */
export function BrowserFrameMockup({
  url = "raster.dev/showcase",
  accentColor = "#f27c63",
  className = "",
}: BrowserFrameMockupProps) {
  const [vpIdx, setVpIdx] = useState(0);
  const vp = VIEWPORTS[vpIdx] ?? VIEWPORTS[0];

  return (
    <div className={`flex w-full flex-col items-center gap-2.5 ${className}`}>
      {/* Viewport Switcher Bar */}
      <div className="inline-flex items-center rounded-full border border-white/12 bg-[#0a0a10] p-0.5 font-mono text-[10px]">
        {VIEWPORTS.map((item, idx) => {
          const active = idx === vpIdx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setVpIdx(idx)}
              className="rounded-full px-2.5 py-0.5 cursor-pointer transition-colors"
              style={{
                backgroundColor: active ? `${accentColor}26` : "transparent",
                color: active ? accentColor : "#8d8880",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Morphing Browser Frame */}
      <div
        className="overflow-hidden rounded-xl border border-white/14 bg-[#08080d] transition-[width] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${vp.widthPct}%` }}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.02] px-2.5 py-1.5">
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
          <span className="truncate font-mono text-[9px] text-[#8d8880]">{url}</span>
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          />
        </div>

        {/* Live Reflowing Mini Grid (fixed vertical budget for zero layout shift) */}
        <div
          className="grid h-[78px] gap-1.5 p-2"
          style={{ gridTemplateColumns: `repeat(${vp.cols}, minmax(0, 1fr))` }}
        >
          {[0, 1, 2].map((cell) => (
            <div
              key={cell}
              className="rounded-md border px-1.5 py-1 flex flex-col justify-between"
              style={{
                borderColor: cell === 0 ? `${accentColor}55` : "rgba(248, 245, 240, 0.08)",
                backgroundColor: cell === 0 ? `${accentColor}12` : "rgba(255,255,255,0.02)",
              }}
            >
              <div
                className="h-1 w-6 rounded-full"
                style={{
                  backgroundColor: cell === 0 ? accentColor : "rgba(248, 245, 240, 0.2)",
                }}
              />
              <div className="h-1 w-full rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
