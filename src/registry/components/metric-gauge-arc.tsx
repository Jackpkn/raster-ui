"use client";

import { useEffect, useState } from "react";

export interface MetricGaugeArcProps {
  /** Metric title displayed below readout. */
  label?: string;
  /** Target percentage values cycled smoothly across the dial (0-100). */
  values?: number[];
  /** Unit suffix (e.g. "%", "ms"). */
  unit?: string;
  /** Luminous progress arc accent color. */
  accentColor?: string;
  /** Cycle cadence speed multiplier. */
  speed?: number;
  /** Pause target value cycling. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_VALUES = [84, 96, 91, 99];

/**
 * Calibrated Precision SVG Radial Instrument Gauge.
 * Sweeps a luminous progress arc over hairline radial ticks with smooth tabular telemetry readout.
 */
export function MetricGaugeArc({
  label = "EDGE SLA",
  values = DEFAULT_VALUES,
  unit = "%",
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: MetricGaugeArcProps) {
  const safeValues = values.length > 0 ? values : DEFAULT_VALUES;
  const [idx, setIdx] = useState(1);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused || safeValues.length <= 1) return;

    const ms = Math.max(900, Math.round(2100 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % safeValues.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [safeValues.length, speed, paused]);

  const pct = Math.max(0, Math.min(100, safeValues[idx] ?? 96));
  const r = 44;
  const arcLen = Math.PI * 1.45 * r;
  const dashOffset = arcLen * (1 - pct / 100);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 120 112" width="144" height="134" role="img" aria-label={`${label} ${pct}${unit}`}>
        {/* Calibrated radial tick marks */}
        {Array.from({ length: 19 }, (_, i) => {
          const deg = 140 + (i / 18) * 260;
          const rad = (deg * Math.PI) / 180;
          const major = i % 3 === 0;
          const r1 = major ? 51 : 53;
          const r2 = 56;
          return (
            <line
              key={i}
              x1={60 + Math.cos(rad) * r1}
              y1={60 + Math.sin(rad) * r1}
              x2={60 + Math.cos(rad) * r2}
              y2={60 + Math.sin(rad) * r2}
              stroke={major ? "rgba(248, 245, 240, 0.32)" : "rgba(248, 245, 240, 0.14)"}
              strokeWidth={major ? 1.2 : 0.8}
            />
          );
        })}

        {/* Background arc rail */}
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(248, 245, 240, 0.12)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${arcLen} 400`}
          transform="rotate(140 60 60)"
        />

        {/* Animated luminous value arc */}
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={accentColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${arcLen} 400`}
          strokeDashoffset={dashOffset}
          transform="rotate(140 60 60)"
          style={{
            transition: "stroke-dashoffset 680ms cubic-bezier(0.22, 1, 0.36, 1)",
            filter: `drop-shadow(0 0 6px ${accentColor}88)`,
          }}
        />

        {/* Center telemetry readout */}
        <text
          x="60"
          y="61"
          textAnchor="middle"
          fill="#f8f5f0"
          fontSize="20"
          fontWeight="600"
          fontFamily="monospace"
        >
          {pct}
          <tspan fontSize="11" fill="#9c978f">
            {unit}
          </tspan>
        </text>
        <text
          x="60"
          y="78"
          textAnchor="middle"
          fill="#8d8880"
          fontSize="8.5"
          fontFamily="monospace"
          letterSpacing="1.2"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
