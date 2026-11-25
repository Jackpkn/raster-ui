"use client";

import { useEffect, useState } from "react";

export interface AgentReasoningOrbitProps {
  /** Central autonomous agent badge label. */
  agentLabel?: string;
  /** Tool nodes invoked sequentially around the orbit. */
  tools?: string[];
  /** Active tool call beam and indicator accent color. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Tool dispatch cadence speed multiplier. */
  speed?: number;
  /** Pause active tool stepping. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_TOOLS = ["SEARCH", "SQL", "CODE", "MEMORY", "SHELL"];

/**
 * Autonomous AI Agent Tool-Calling Orbit Schematic.
 * Pure SVG radial architecture showing a central reasoning core sequentially
 * dispatching live luminous calls to five external tool nodes.
 */
export function AgentReasoningOrbit({
  agentLabel = "AGENT",
  tools = DEFAULT_TOOLS,
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: AgentReasoningOrbitProps) {
  const safeTools = tools.length >= 3 ? tools.slice(0, 6) : DEFAULT_TOOLS;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const ms = Math.max(550, Math.round(1400 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % safeTools.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [safeTools.length, speed, paused]);

  const cx = 210;
  const cy = 100;
  const rx = 136;
  const ry = 66;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <svg
        viewBox="0 0 420 200"
        className="h-full w-full max-w-[490px]"
        role="img"
        aria-label="Autonomous agent tool invocation orbit"
      >
        {/* Dashed orbital guide ellipse */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="rgba(248, 245, 240, 0.1)"
          strokeDasharray="4 5"
          strokeWidth="1"
        />

        {/* Tool links and nodes */}
        {safeTools.map((label, idx) => {
          const angle = -Math.PI / 2 + (idx / safeTools.length) * Math.PI * 2;
          const nx = cx + Math.cos(angle) * rx;
          const ny = cy + Math.sin(angle) * ry;
          const isActive = idx === activeIdx;

          return (
            <g key={label}>
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke={isActive ? accentColor : "rgba(248, 245, 240, 0.14)"}
                strokeWidth={isActive ? 1.8 : 1}
              />
              {isActive && (
                <circle
                  cx={cx + (nx - cx) * 0.56}
                  cy={cy + (ny - cy) * 0.56}
                  r="3"
                  fill="#f8f5f0"
                  stroke={accentColor}
                  strokeWidth="1.6"
                />
              )}
              <rect
                x={nx - 32}
                y={ny - 13}
                width="64"
                height="26"
                rx="7"
                fill={isActive ? "#141016" : "#0c0c12"}
                stroke={isActive ? accentColor : "rgba(248, 245, 240, 0.2)"}
                strokeWidth={isActive ? 1.35 : 1}
              />
              <text
                x={nx}
                y={ny + 3.5}
                textAnchor="middle"
                fill={isActive ? "#f8f5f0" : "#9c978f"}
                fontSize="9.5"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Central Autonomous Core */}
        <circle cx={cx} cy={cy} r="32" fill={`${accentColor}16`} />
        <circle
          cx={cx}
          cy={cy}
          r="24"
          fill="#0d0d14"
          stroke={accentColor}
          strokeWidth="1.5"
        />
        <text
          x={cx}
          y={cy + 3.5}
          textAnchor="middle"
          fill="#f8f5f0"
          fontSize="9.5"
          fontWeight="600"
          fontFamily="monospace"
        >
          {agentLabel}
        </text>
      </svg>
    </div>
  );
}
