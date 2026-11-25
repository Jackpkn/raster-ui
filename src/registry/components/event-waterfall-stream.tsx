"use client";

import { useEffect, useState } from "react";

export interface TraceSpanItem {
  label: string;
  startPct: number;
  widthPct: number;
  ms: string;
  highlight?: boolean;
}

export interface EventWaterfallStreamProps {
  /** Distributed trace span rows rendered on the millisecond timeline. */
  spans?: TraceSpanItem[];
  /** Highlight accent color for critical path spans. */
  accentColor?: string;
  /** Sweep cycle speed multiplier. */
  speed?: number;
  /** Pause active span scanner. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_SPANS: TraceSpanItem[] = [
  { label: "edge.auth", startPct: 2, widthPct: 18, ms: "14ms" },
  { label: "db.fetch", startPct: 16, widthPct: 30, ms: "38ms" },
  { label: "vector.rank", startPct: 38, widthPct: 34, ms: "46ms", highlight: true },
  { label: "stream.emit", startPct: 68, widthPct: 28, ms: "32ms", highlight: true },
];

/**
 * Distributed Trace & Event Waterfall Stream Timeline.
 * Cycles a glowing telemetry highlight across staggered microservice latency spans with zero dependencies.
 */
export function EventWaterfallStream({
  spans = DEFAULT_SPANS,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: EventWaterfallStreamProps) {
  const safeSpans = spans.length > 0 ? spans : DEFAULT_SPANS;
  const [activeIdx, setActiveIdx] = useState(2);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const ms = Math.max(480, Math.round(1200 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % safeSpans.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [safeSpans.length, speed, paused]);

  return (
    <div
      className={`w-full rounded-2xl border border-white/12 bg-[#08080c] p-4 font-mono text-[11px] space-y-2.5 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[10px] text-[#7c7870]">
        <span>TRACE / REQ-94A2</span>
        <span>0ms · 50ms · 100ms · 140ms</span>
      </div>

      <div className="space-y-2">
        {safeSpans.map((span, idx) => {
          const isActive = idx === activeIdx;
          const isAccent = isActive || span.highlight;
          return (
            <div key={span.label} className="grid grid-cols-[84px_1fr_36px] items-center gap-2.5">
              <span
                className="truncate transition-colors duration-200"
                style={{ color: isActive ? "#f8f5f0" : "#9c978f" }}
              >
                {span.label}
              </span>

              <div className="relative h-4 overflow-hidden rounded bg-white/[0.04]">
                <div
                  className="absolute top-0.5 bottom-0.5 rounded-sm transition-all duration-300"
                  style={{
                    left: `${span.startPct}%`,
                    width: `${span.widthPct}%`,
                    backgroundColor: isActive
                      ? accentColor
                      : isAccent
                        ? `${accentColor}66`
                        : "rgba(248, 245, 240, 0.24)",
                    boxShadow: isActive ? `0 0 12px ${accentColor}99` : "none",
                  }}
                />
              </div>

              <span
                className="text-right tabular-nums text-[10px]"
                style={{ color: isActive ? accentColor : "#7c7870" }}
              >
                {span.ms}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
