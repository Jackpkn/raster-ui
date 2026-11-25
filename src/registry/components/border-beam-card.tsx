"use client";

import type { ReactNode } from "react";

export interface BorderBeamCardProps {
  /** Primary glowing beam accent color. */
  accentColor?: string;
  /** Secondary trailing beam tint. */
  secondaryColor?: string;
  /** Full orbit duration in seconds (3-18). */
  durationSec?: number;
  /** Card surface background color. */
  backgroundColor?: string;
  /** Pause orbital beam animation. */
  paused?: boolean;
  /** Inner card content. */
  children?: ReactNode;
  className?: string;
}

/**
 * Pure CSS Orbital Border Beam Card.
 * Traces a crisp luminous arc continuously around a rounded obsidian hairline border with zero JS loops.
 */
export function BorderBeamCard({
  accentColor = "#f27c63",
  secondaryColor = "#f8f5f0",
  durationSec = 7,
  backgroundColor = "#09090d",
  paused = false,
  children,
  className = "",
}: BorderBeamCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-[1px] ${className}`}
      style={{
        backgroundColor: "rgba(255, 250, 245, 0.11)",
      }}
    >
      <style>{`
        @keyframes raster-beam-orbit {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-beam-arc { animation: none !important; opacity: 0.45; }
        }
      `}</style>

      {/* Moving luminous orbital trail clipped to the 1px border ring */}
      <div
        aria-hidden="true"
        className="raster-beam-arc pointer-events-none absolute top-0 left-0 h-16 w-40 blur-[2px]"
        style={{
          offsetPath: "rect(0 auto auto 0 round 1rem)",
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 52%, ${secondaryColor} 82%, transparent 100%)`,
          animation: paused ? "none" : `raster-beam-orbit ${durationSec}s linear infinite`,
        }}
      />

      {/* Inner card surface */}
      <div
        className="relative z-10 h-full w-full rounded-[15px] p-6"
        style={{
          backgroundColor,
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
      >
        {children ?? (
          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9c978f]">
              Orbital Border Beam
            </span>
            <h3 className="text-lg font-semibold text-[#f8f5f0]">
              Pure CSS offset-path illumination
            </h3>
            <p className="text-xs leading-relaxed text-[#9c978f]">
              Zero JavaScript runtime, hardware-composited border sweep that pauses cleanly under
              reduced-motion preferences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
