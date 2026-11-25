"use client";

import { useState } from "react";

export interface BeforeAfterSliderProps {
  /** Left panel label. */
  beforeLabel?: string;
  /** Right panel label. */
  afterLabel?: string;
  /** Initial divider split percentage (15-85). */
  initialPct?: number;
  /** Divider line and handle accent color. */
  accentColor?: string;
  className?: string;
}

/**
 * Interactive Draggable Before/After Split Comparison Surface.
 * Scrubs cleanly via pointer move or drag to compare two obsidian visual states with zero dependencies.
 */
export function BeforeAfterSlider({
  beforeLabel = "Legacy Bundle (184 KB)",
  afterLabel = "Raster Zero-Dep (4.2 KB)",
  initialPct = 52,
  accentColor = "#f27c63",
  className = "",
}: BeforeAfterSliderProps) {
  const [pct, setPct] = useState(Math.max(15, Math.min(85, initialPct)));
  const [dragging, setDragging] = useState(false);

  function updateFromPointer(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = ((e.clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(10, Math.min(90, ratio)));
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Before and after comparison"
      aria-valuemin={10}
      aria-valuemax={90}
      aria-valuenow={Math.round(pct)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPct((p) => Math.max(10, p - 5));
        if (e.key === "ArrowRight") setPct((p) => Math.min(90, p + 5));
      }}
      onPointerDown={(e) => {
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromPointer(e);
      }}
      onPointerMove={(e) => {
        if (dragging) updateFromPointer(e);
      }}
      onPointerUp={() => setDragging(false)}
      className={`relative overflow-hidden rounded-xl border border-white/14 bg-[#07070b] select-none cursor-ew-resize ${className}`}
    >
      {/* After Layer (Full Background: Crisp Obsidian Precision) */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 bg-[#07070c]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative z-10 flex justify-end">
          <span
            className="rounded-full border px-2.5 py-0.5 font-mono text-[10px]"
            style={{
              borderColor: `${accentColor}66`,
              backgroundColor: "#0e0c12",
              color: accentColor,
            }}
          >
            {afterLabel}
          </span>
        </div>
        <div className="relative z-10 ml-auto text-right space-y-1">
          <div className="font-mono text-2xl font-semibold text-[#f8f5f0] tabular-nums">60 FPS</div>
          <div className="font-mono text-[10px] text-[#9c978f]">0 external packages</div>
        </div>
      </div>

      {/* Before Layer (Clipped Left Region) */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-4 bg-[#111116]"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgba(255,255,255,0.22) 0 1px, transparent 1px 10px)",
          }}
        />
        <div className="relative z-10 flex justify-start">
          <span className="rounded-full border border-white/15 bg-black/50 px-2.5 py-0.5 font-mono text-[10px] text-[#a5a097]">
            {beforeLabel}
          </span>
        </div>
        <div className="relative z-10 space-y-1">
          <div className="font-mono text-2xl font-semibold text-[#8d8880] tabular-nums">28 FPS</div>
          <div className="font-mono text-[10px] text-[#6d6962]">3 heavy runtime libs</div>
        </div>
      </div>

      {/* Draggable Vertical Hairline + Handle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-20 w-[1.5px]"
        style={{ left: `${pct}%`, backgroundColor: accentColor }}
      >
        <div
          className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-[#0c0c12] font-mono text-[10px] text-[#f8f5f0]"
          style={{
            borderColor: accentColor,
            boxShadow: `0 0 18px -4px ${accentColor}`,
          }}
        >
          &lt;&gt;
        </div>
      </div>
    </div>
  );
}
