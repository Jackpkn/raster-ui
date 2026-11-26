"use client";

import { useEffect, useState } from "react";

export interface MetricItem {
  value: number;
  suffix: string;
  label: string;
}

export interface AnimatedMetricStripProps {
  /** Three headline KPI metrics animated smoothly from zero. */
  metrics?: MetricItem[];
  /** Highlight accent color for suffix and top indicator hairline. */
  accentColor?: string;
  /** Count-up duration speed multiplier. */
  speed?: number;
  /** Skip animation and show final values immediately. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_METRICS: MetricItem[] = [
  { value: 100, suffix: "+", label: "Components" },
  { value: 0, suffix: " KB", label: "External Deps" },
  { value: 60, suffix: " FPS", label: "Canvas Motion" },
];

/**
 * 3-Column Startup KPI Count-Up Strip.
 * Animates crisp tabular figures with cubic ease-out inside an obsidian hairline container.
 */
export function AnimatedMetricStrip({
  metrics = DEFAULT_METRICS,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: AnimatedMetricStripProps) {
  const [progress, setProgress] = useState(paused ? 1 : 0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) {
      setProgress(1);
      return;
    }

    let rafId = 0;
    const durMs = Math.max(550, Math.round(1400 / Math.max(0.4, speed)));
    const start = performance.now();

    const tick = (now: number) => {
      const u = Math.max(0, Math.min(1, (now - start) / durMs));
      const eased = 1 - Math.pow(1 - u, 3);
      setProgress(eased);
      if (u < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [speed, paused]);

  return (
    <div
      className={`grid w-full max-w-md grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/14 bg-[#08080d] ${className}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      {metrics.map((m) => (
        <div key={m.label} className="px-3.5 py-4 text-center">
          <div className="font-mono text-2xl font-semibold tracking-tight text-[#f8f5f0] tabular-nums">
            {Math.round(m.value * progress)}
            <span className="text-sm font-medium" style={{ color: accentColor }}>
              {m.suffix}
            </span>
          </div>
          <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#8d8880]">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
