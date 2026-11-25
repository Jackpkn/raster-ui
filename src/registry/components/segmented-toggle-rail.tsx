"use client";

import { useState } from "react";

export interface SegmentedToggleRailProps {
  /** Tab items displayed across the segmented obsidian rail. */
  options?: string[];
  /** Active indicator dot and subtle rim highlight color. */
  accentColor?: string;
  /** Initial active tab index. */
  defaultIndex?: number;
  onChange?: (index: number, label: string) => void;
  className?: string;
}

const DEFAULT_OPTIONS = ["Overview", "Streams", "Circuits", "Logs"];

/**
 * Interactive Hardware-Style Segmented Control Rail.
 * Glides an elevated dark specular pill smoothly behind the active tab with zero dependencies.
 */
export function SegmentedToggleRail({
  options = DEFAULT_OPTIONS,
  accentColor = "#f27c63",
  defaultIndex = 1,
  onChange,
  className = "",
}: SegmentedToggleRailProps) {
  const safeOptions = options.length >= 2 ? options : DEFAULT_OPTIONS;
  const [activeIdx, setActiveIdx] = useState(
    Math.max(0, Math.min(safeOptions.length - 1, defaultIndex))
  );

  function select(idx: number) {
    setActiveIdx(idx);
    onChange?.(idx, safeOptions[idx]!);
  }

  return (
    <div
      role="tablist"
      aria-label="View mode"
      className={`relative inline-grid rounded-full border border-white/14 bg-[#09090e] p-1 ${className}`}
      style={{ gridTemplateColumns: `repeat(${safeOptions.length}, minmax(0, 1fr))` }}
    >
      {/* Smooth GPU-composited sliding active capsule */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-full border border-white/16 bg-[#15151f] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 8px) / ${safeOptions.length})`,
          transform: `translateX(${activeIdx * 100}%)`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 6px 16px -8px ${accentColor}88`,
        }}
      />

      {safeOptions.map((label, idx) => {
        const isActive = idx === activeIdx;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => select(idx)}
            className="relative z-10 inline-flex h-8 items-center justify-center gap-1.5 px-3.5 text-xs font-medium cursor-pointer transition-colors duration-200 whitespace-nowrap"
            style={{ color: isActive ? "#f8f5f0" : "#8d8880" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-opacity duration-200"
              style={{
                backgroundColor: accentColor,
                opacity: isActive ? 1 : 0,
              }}
              aria-hidden="true"
            />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
