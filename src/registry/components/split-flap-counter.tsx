"use client";

import { useEffect, useState } from "react";

export interface SplitFlapCounterProps {
  /** Sequence of values cycled smoothly across the mechanical split-flap board. */
  values?: string[];
  /** Accent tint for the active status indicator dot. */
  accentColor?: string;
  /** Optional caption shown underneath. */
  caption?: string;
  /** Cycle speed multiplier. */
  speed?: number;
  /** Pause cycling. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_VALUES = ["00184", "00429", "01280", "03642", "09815"];

/**
 * Mechanical Braun / Departure-Board Split-Flap Counter.
 * Cycles padded tabular glyphs across crisp split-hinged dark tiles with zero dependencies.
 */
export function SplitFlapCounter({
  values = DEFAULT_VALUES,
  accentColor = "#f27c63",
  caption = "LIVE VERIFIED ROLES INDEXED",
  speed = 1,
  paused = false,
  className = "",
}: SplitFlapCounterProps) {
  const safeValues = values.length > 0 ? values : DEFAULT_VALUES;
  const maxLen = safeValues.reduce((m, s) => Math.max(m, s.length), 1);
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused || safeValues.length <= 1) return;

    const cycleMs = Math.max(850, Math.round(2200 / Math.max(0.4, speed)));
    let resetTimer = 0;
    const interval = window.setInterval(() => {
      setFlipping(true);
      setIndex((i) => (i + 1) % safeValues.length);
      resetTimer = window.setTimeout(() => setFlipping(false), 260);
    }, cycleMs);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(resetTimer);
    };
  }, [safeValues.length, speed, paused]);

  const current = (safeValues[index] ?? "").padStart(maxLen, " ");

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <div className="inline-flex items-center gap-1.5">
        {Array.from(current).map((ch, idx) => (
          <div
            key={idx}
            className="relative flex h-14 w-10 sm:h-16 sm:w-12 items-center justify-center overflow-hidden rounded-lg border border-white/14 bg-[#101016] font-mono text-2xl sm:text-3xl font-semibold text-[#f8f5f0] tabular-nums"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 18px -10px rgba(0,0,0,0.9)",
              transform: flipping ? "scaleY(0.92)" : "scaleY(1)",
              transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Upper flap subtle sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/[0.03]"
            />
            {/* Mechanical center split hairline */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-black/75"
            />
            <span className="relative z-10">{ch === " " ? "\u00A0" : ch}</span>
          </div>
        ))}
      </div>

      {caption && (
        <div className="inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.14em] text-[#9c978f]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          />
          <span>{caption}</span>
        </div>
      )}
    </div>
  );
}
