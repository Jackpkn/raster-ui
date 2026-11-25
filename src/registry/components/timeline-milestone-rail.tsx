"use client";

import { useState } from "react";

export interface MilestoneEntry {
  version: string;
  date: string;
  title: string;
}

export interface TimelineMilestoneRailProps {
  /** Vertical changelog or roadmap entries. */
  entries?: MilestoneEntry[];
  /** Glowing spine and active milestone accent color. */
  accentColor?: string;
  className?: string;
}

const DEFAULT_ENTRIES: MilestoneEntry[] = [
  { version: "v2.4", date: "Nov 25", title: "Website Essentials & Editorial Kit" },
  { version: "v2.0", date: "Nov 18", title: "Circuits, Data Streams & AI Agents" },
  { version: "v1.0", date: "Nov 04", title: "4x4 Bayer Dither & shadcn Registry" },
];

/**
 * Vertical Editorial Changelog & Roadmap Timeline Rail.
 * Interactive obsidian release list with a luminous left spine and clickable version spotlight.
 */
export function TimelineMilestoneRail({
  entries = DEFAULT_ENTRIES,
  accentColor = "#f27c63",
  className = "",
}: TimelineMilestoneRailProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className={`relative w-full max-w-sm pl-5 space-y-2.5 ${className}`}>
      {/* Static vertical timeline spine */}
      <div
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-1.5 w-[1.5px] bg-white/12"
      />
      {/* Illuminated active spine segment */}
      <div
        aria-hidden="true"
        className="absolute left-1.5 w-[1.5px] transition-all duration-300"
        style={{
          top: `${12 + activeIdx * 48}px`,
          height: "24px",
          backgroundColor: accentColor,
          boxShadow: `0 0 10px ${accentColor}`,
        }}
      />

      {entries.map((entry, idx) => {
        const active = idx === activeIdx;
        return (
          <button
            key={entry.version}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className="relative flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: active ? "#101018" : "#08080c",
              borderColor: active ? `${accentColor}66` : "rgba(248, 245, 240, 0.1)",
            }}
          >
            {/* Spine node dot */}
            <span
              aria-hidden="true"
              className="absolute -left-[17px] h-2.5 w-2.5 rounded-full border-2 transition-colors"
              style={{
                backgroundColor: active ? accentColor : "#08080c",
                borderColor: active ? accentColor : "rgba(248, 245, 240, 0.28)",
              }}
            />

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 font-mono text-[9.5px]">
                <span style={{ color: active ? accentColor : "#9c978f" }}>{entry.version}</span>
                <span className="text-[#6e6a64]">{entry.date}</span>
              </div>
              <div className="truncate text-xs font-medium text-[#f8f5f0]">{entry.title}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
