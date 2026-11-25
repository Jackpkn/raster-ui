"use client";

import { useEffect, useState } from "react";

export interface ActivityEventItem {
  id: string;
  tag: string;
  title: string;
  meta: string;
}

export interface LiveActivityStackProps {
  /** Feed events rotated continuously into the top stack slot. */
  events?: ActivityEventItem[];
  /** Status dot and active tag accent color. */
  accentColor?: string;
  /** Rotation cadence speed multiplier. */
  speed?: number;
  /** Pause automatic rotation. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_EVENTS: ActivityEventItem[] = [
  { id: "e1", tag: "SYNC", title: "Edge index verified", meta: "12ms" },
  { id: "e2", tag: "FLOW", title: "Stream batch committed", meta: "48 rows" },
  { id: "e3", tag: "AUTH", title: "Session token rotated", meta: "ok" },
  { id: "e4", tag: "MESH", title: "EU-W replica converged", meta: "19ms" },
];

/**
 * Flowing Real-Time Event Card Stack.
 * Smoothly cycles live telemetry/notification cards with subtle depth scaling and zero dependencies.
 */
export function LiveActivityStack({
  events = DEFAULT_EVENTS,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: LiveActivityStackProps) {
  const safeEvents = events.length >= 3 ? events : DEFAULT_EVENTS;
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const ms = Math.max(900, Math.round(2100 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setCursor((c) => (c + 1) % safeEvents.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [safeEvents.length, speed, paused]);

  const visible = [0, 1, 2].map((offset) => safeEvents[(cursor + offset) % safeEvents.length]!);

  return (
    <div className={`w-full max-w-sm space-y-2 ${className}`} aria-live="polite">
      <style>{`
        @keyframes raster-stack-enter {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-stack-top { animation: none !important; }
        }
      `}</style>

      {visible.map((item, idx) => {
        const isTop = idx === 0;
        return (
          <div
            key={`${item.id}-${cursor}-${idx}`}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-all duration-300 ${
              isTop ? "raster-stack-top" : ""
            }`}
            style={{
              backgroundColor: isTop ? "#101017" : "#0a0a0f",
              borderColor: isTop ? `${accentColor}66` : "rgba(248, 245, 240, 0.1)",
              opacity: idx === 0 ? 1 : idx === 1 ? 0.72 : 0.44,
              transform: `scale(${1 - idx * 0.03})`,
              animation: isTop && !paused ? "raster-stack-enter 320ms cubic-bezier(0.22,1,0.36,1)" : "none",
            }}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: isTop ? accentColor : "rgba(248, 245, 240, 0.28)" }}
                aria-hidden="true"
              />
              <span
                className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9.5px]"
                style={{ color: isTop ? accentColor : "#9c978f" }}
              >
                {item.tag}
              </span>
              <span className="truncate text-xs font-medium text-[#f8f5f0]">{item.title}</span>
            </div>

            <span className="shrink-0 font-mono text-[10.5px] text-[#8d8880] tabular-nums">
              {item.meta}
            </span>
          </div>
        );
      })}
    </div>
  );
}
