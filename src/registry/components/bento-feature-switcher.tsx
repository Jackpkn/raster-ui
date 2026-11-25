"use client";

import { useEffect, useState } from "react";

export interface FeatureTabSpec {
  id: string;
  code: string;
  title: string;
  metric: string;
  summary: string;
}

export interface BentoFeatureSwitcherProps {
  /** Feature tabs cycled automatically or clicked directly. */
  features?: FeatureTabSpec[];
  /** Active progress bar and metric accent color. */
  accentColor?: string;
  /** Auto-advance speed multiplier. */
  speed?: number;
  /** Pause automatic tab cycling. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_FEATURES: FeatureTabSpec[] = [
  {
    id: "edge",
    code: "01",
    title: "Sub-20ms Render",
    metric: "16.6ms",
    summary: "Canvas2D loops pause automatically via IntersectionObserver when off-screen.",
  },
  {
    id: "zero",
    code: "02",
    title: "Zero Bloat",
    metric: "0 deps",
    summary: "Drop any single TSX file into your app with no WebGL or physics bundle overhead.",
  },
  {
    id: "a11y",
    code: "03",
    title: "Accessible",
    metric: "WCAG AA",
    summary: "Built-in prefers-reduced-motion fallbacks and high-contrast obsidian ink tokens.",
  },
];

/**
 * Stripe/Linear-Style Auto-Advancing Feature Showcase Switcher.
 * Pairs clickable feature rows with a synchronized accent progress hairline and live preview pane.
 */
export function BentoFeatureSwitcher({
  features = DEFAULT_FEATURES,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: BentoFeatureSwitcherProps) {
  const safeFeatures = features.length > 0 ? features : DEFAULT_FEATURES;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused || safeFeatures.length <= 1) return;

    const ms = Math.max(1200, Math.round(3000 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % safeFeatures.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [safeFeatures.length, speed, paused]);

  const current = safeFeatures[activeIdx] ?? safeFeatures[0]!;

  return (
    <div
      className={`grid w-full max-w-md grid-cols-12 overflow-hidden rounded-2xl border border-white/14 bg-[#08080c] ${className}`}
    >
      {/* Left Feature Tabs */}
      <div className="col-span-5 divide-y divide-white/8 border-r border-white/10">
        {safeFeatures.map((feat, idx) => {
          const active = idx === activeIdx;
          return (
            <button
              key={feat.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className="relative flex w-full flex-col gap-0.5 px-3 py-2.5 text-left cursor-pointer transition-colors"
              style={{ backgroundColor: active ? "rgba(255,255,255,0.04)" : "transparent" }}
            >
              <span
                className="font-mono text-[9px]"
                style={{ color: active ? accentColor : "#6e6a64" }}
              >
                {feat.code}
              </span>
              <span
                className="text-[11px] font-medium truncate"
                style={{ color: active ? "#f8f5f0" : "#8d8880" }}
              >
                {feat.title}
              </span>
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[2px]"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Active Detail Stage */}
      <div className="col-span-7 flex flex-col justify-between p-4">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#7c7870]">
          SPEC / {current.code}
        </div>
        <div
          className="my-1 font-mono text-2xl font-semibold tracking-tight tabular-nums"
          style={{ color: accentColor }}
        >
          {current.metric}
        </div>
        <p className="text-[11px] leading-relaxed text-[#b8b3aa]">{current.summary}</p>
      </div>
    </div>
  );
}
