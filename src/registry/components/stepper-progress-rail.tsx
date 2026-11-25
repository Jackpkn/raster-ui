"use client";

import { useEffect, useState } from "react";

export interface StepperProgressRailProps {
  /** Pipeline stage labels rendered left-to-right. */
  steps?: string[];
  /** Active node and traveling pulse beam accent color. */
  accentColor?: string;
  /** Cycle speed multiplier. */
  speed?: number;
  /** Pause stage advancement. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_STEPS = ["Build", "Verify", "Sign", "Deploy"];

/**
 * Hardware Pipeline Stepper Progress Rail.
 * Cycles smoothly across discrete milestone nodes with a glowing active fill beam and zero dependencies.
 */
export function StepperProgressRail({
  steps = DEFAULT_STEPS,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: StepperProgressRailProps) {
  const safeSteps = steps.length >= 2 ? steps : DEFAULT_STEPS;
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const ms = Math.max(650, Math.round(1650 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeSteps.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [safeSteps.length, speed, paused]);

  const progressPct = (activeIndex / (safeSteps.length - 1)) * 100;

  return (
    <div className={`w-full max-w-md px-3 ${className}`} role="status" aria-label="Pipeline progress">
      <div className="relative flex items-center justify-between">
        {/* Static hairline track */}
        <div
          aria-hidden="true"
          className="absolute left-3 right-3 top-3.5 h-[1.5px] bg-white/12"
        />

        {/* Animated luminous progress beam */}
        <div
          aria-hidden="true"
          className="absolute left-3 top-3.5 h-[1.5px] transition-all duration-500 ease-out"
          style={{
            width: `calc((100% - 24px) * ${progressPct / 100})`,
            backgroundColor: accentColor,
            boxShadow: `0 0 12px ${accentColor}`,
          }}
        />

        {safeSteps.map((label, idx) => {
          const done = idx < activeIndex;
          const active = idx === activeIndex;
          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] transition-all duration-300"
                style={{
                  backgroundColor: active || done ? "#0b0b10" : "#07070a",
                  borderColor: active || done ? accentColor : "rgba(248, 245, 240, 0.18)",
                  color: active || done ? "#f8f5f0" : "#78746e",
                  boxShadow: active ? `0 0 14px -2px ${accentColor}` : "none",
                }}
              >
                {done ? "✓" : `0${idx + 1}`}
              </div>
              <span
                className="font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors duration-300"
                style={{ color: active ? "#f8f5f0" : done ? "#b8b3aa" : "#6e6a64" }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
