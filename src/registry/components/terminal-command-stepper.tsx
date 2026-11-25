"use client";

import { useEffect, useState } from "react";

export interface TerminalStep {
  command?: string;
  output: string;
  tone?: "muted" | "success" | "accent";
}

export interface TerminalCommandStepperProps {
  /** Sequence of CLI lines revealed sequentially. */
  steps?: TerminalStep[];
  /** Window header title. */
  title?: string;
  /** Highlight accent color for prompt & active glyphs. */
  accentColor?: string;
  /** Playback speed multiplier. */
  speed?: number;
  /** Pause step loop. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_STEPS: TerminalStep[] = [
  { command: "npx shadcn@latest add raster/bayer-dither-wave", output: "Fetching registry item..." },
  { output: "Verified 0 external dependencies (5.8 KB)", tone: "muted" },
  { output: "Installed components/raster/bayer-dither-wave.tsx", tone: "success" },
  { output: "Ready in 180ms (prefers-reduced-motion enabled)", tone: "accent" },
];

/**
 * Animated Agent / CLI Command Stepper Terminal.
 * Reveals command lines step by step with a blinking hardware cursor and zero dependencies.
 */
export function TerminalCommandStepper({
  steps = DEFAULT_STEPS,
  title = "raster-cli",
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: TerminalCommandStepperProps) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) {
      setVisibleCount(steps.length);
      return;
    }

    const intervalMs = Math.max(420, Math.round(1150 / Math.max(0.4, speed)));
    const timer = window.setInterval(() => {
      setVisibleCount((prev) => (prev >= steps.length ? 1 : prev + 1));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [steps.length, speed, paused]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/14 bg-[#07070b] font-mono text-xs ${className}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      <style>{`
        @keyframes raster-term-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-term-cursor { animation: none !important; }
        }
      `}</style>

      {/* Window Chrome */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <span className="text-[11px] text-[#8d8880]">{title}</span>
        <span className="text-[10px] text-[#6d6860]">zsh</span>
      </div>

      {/* Animated Output Lines */}
      <div className="min-h-[144px] space-y-2 p-4 leading-relaxed">
        {steps.slice(0, visibleCount).map((step, idx) => (
          <div key={idx} className="space-y-1">
            {step.command && (
              <div className="flex items-center gap-2 text-[#f8f5f0]">
                <span style={{ color: accentColor }}>$</span>
                <span className="truncate">{step.command}</span>
              </div>
            )}
            <div
              className="pl-4"
              style={{
                color:
                  step.tone === "success"
                    ? "#34d399"
                    : step.tone === "accent"
                      ? accentColor
                      : "#9c978f",
              }}
            >
              {step.tone === "success" ? "✓ " : "· "}
              {step.output}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 pt-1 text-[#9c978f]">
          <span style={{ color: accentColor }}>$</span>
          <span
            className="raster-term-cursor inline-block h-3.5 w-2"
            style={{
              backgroundColor: accentColor,
              animation: paused ? "none" : "raster-term-blink 1s steps(1) infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}
