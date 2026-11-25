"use client";

import { useEffect, useState } from "react";

export interface PcbLogicGatesProps {
  /** Active high-voltage signal accent color. */
  accentColor?: string;
  /** Inactive copper trace color. */
  traceColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Auto-clock toggle speed multiplier. */
  speed?: number;
  /** Pause automatic clock edge pulses. */
  paused?: boolean;
  className?: string;
}

/**
 * Interactive Digital Logic PCB Schematic.
 * Click input switches (A, B) or watch the live CLK pulse propagate through
 * routed 45-degree PCB traces, AND / XOR logic blocks, and a final output latch.
 */
export function PcbLogicGates({
  accentColor = "#f27c63",
  traceColor = "rgba(248, 245, 240, 0.2)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: PcbLogicGatesProps) {
  const [inA, setInA] = useState(true);
  const [inB, setInB] = useState(false);
  const [clk, setClk] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const ms = Math.max(450, Math.round(1350 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setClk((prev) => !prev);
    }, ms);
    return () => window.clearInterval(id);
  }, [speed, paused]);

  const xorOut = inA !== inB;
  const andOut = inB && clk;
  const finalOut = xorOut || andOut;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{ backgroundColor }}
    >
      <svg
        viewBox="0 0 420 200"
        className="h-full w-full max-w-[480px]"
        role="img"
        aria-label="Interactive PCB logic gate circuit"
      >
        {/* Subtle PCB background silkscreen grid */}
        <defs>
          <pattern id="raster-pcb-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.7" fill="rgba(248, 245, 240, 0.1)" />
          </pattern>
        </defs>
        <rect width="420" height="200" fill="url(#raster-pcb-grid)" />

        {/* Input A -> XOR top */}
        <path
          d="M 56 46 H 132 L 146 58 H 170"
          fill="none"
          stroke={inA ? accentColor : traceColor}
          strokeWidth={inA ? 2 : 1.2}
        />

        {/* Input B -> splits to XOR bottom and AND top */}
        <path
          d="M 56 100 H 124 L 138 78 H 170"
          fill="none"
          stroke={inB ? accentColor : traceColor}
          strokeWidth={inB ? 2 : 1.2}
        />
        <path
          d="M 104 100 L 122 124 H 170"
          fill="none"
          stroke={inB ? accentColor : traceColor}
          strokeWidth={inB ? 2 : 1.2}
        />
        <circle cx="104" cy="100" r="3" fill={inB ? accentColor : "#272733"} />

        {/* CLK -> AND bottom */}
        <path
          d="M 56 154 H 134 L 146 144 H 170"
          fill="none"
          stroke={clk ? accentColor : traceColor}
          strokeWidth={clk ? 2 : 1.2}
        />

        {/* XOR -> OR top */}
        <path
          d="M 232 68 H 264 L 280 90 H 298"
          fill="none"
          stroke={xorOut ? accentColor : traceColor}
          strokeWidth={xorOut ? 2 : 1.2}
        />

        {/* AND -> OR bottom */}
        <path
          d="M 232 134 H 264 L 280 112 H 298"
          fill="none"
          stroke={andOut ? accentColor : traceColor}
          strokeWidth={andOut ? 2 : 1.2}
        />

        {/* OR -> OUT pad */}
        <path
          d="M 358 101 H 386"
          fill="none"
          stroke={finalOut ? accentColor : traceColor}
          strokeWidth={finalOut ? 2.2 : 1.2}
        />

        {/* Interactive Switch A */}
        <g
          onClick={() => setInA((v) => !v)}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setInA((v) => !v);
          }}
        >
          <rect
            x="18"
            y="32"
            width="38"
            height="28"
            rx="6"
            fill={inA ? `${accentColor}22` : "#0e0e14"}
            stroke={inA ? accentColor : "rgba(248,245,240,0.22)"}
            strokeWidth="1.2"
          />
          <text
            x="37"
            y="50"
            textAnchor="middle"
            fill={inA ? "#f8f5f0" : "#9c978f"}
            fontSize="10"
            fontFamily="monospace"
          >
            A:{inA ? "1" : "0"}
          </text>
        </g>

        {/* Interactive Switch B */}
        <g
          onClick={() => setInB((v) => !v)}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setInB((v) => !v);
          }}
        >
          <rect
            x="18"
            y="86"
            width="38"
            height="28"
            rx="6"
            fill={inB ? `${accentColor}22` : "#0e0e14"}
            stroke={inB ? accentColor : "rgba(248,245,240,0.22)"}
            strokeWidth="1.2"
          />
          <text
            x="37"
            y="104"
            textAnchor="middle"
            fill={inB ? "#f8f5f0" : "#9c978f"}
            fontSize="10"
            fontFamily="monospace"
          >
            B:{inB ? "1" : "0"}
          </text>
        </g>

        {/* Live CLK Node */}
        <g
          onClick={() => setClk((v) => !v)}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setClk((v) => !v);
          }}
        >
          <rect
            x="18"
            y="140"
            width="38"
            height="28"
            rx="6"
            fill={clk ? `${accentColor}22` : "#0e0e14"}
            stroke={clk ? accentColor : "rgba(248,245,240,0.22)"}
            strokeWidth="1.2"
          />
          <text
            x="37"
            y="158"
            textAnchor="middle"
            fill={clk ? "#f8f5f0" : "#9c978f"}
            fontSize="9.5"
            fontFamily="monospace"
          >
            CLK
          </text>
        </g>

        {/* XOR Gate Package */}
        <rect
          x="170"
          y="46"
          width="62"
          height="44"
          rx="8"
          fill="#0d0d13"
          stroke={xorOut ? accentColor : "rgba(248,245,240,0.24)"}
          strokeWidth="1.2"
        />
        <text
          x="201"
          y="72"
          textAnchor="middle"
          fill={xorOut ? "#f8f5f0" : "#9c978f"}
          fontSize="10.5"
          fontFamily="monospace"
        >
          XOR
        </text>

        {/* AND Gate Package */}
        <rect
          x="170"
          y="112"
          width="62"
          height="44"
          rx="8"
          fill="#0d0d13"
          stroke={andOut ? accentColor : "rgba(248,245,240,0.24)"}
          strokeWidth="1.2"
        />
        <text
          x="201"
          y="138"
          textAnchor="middle"
          fill={andOut ? "#f8f5f0" : "#9c978f"}
          fontSize="10.5"
          fontFamily="monospace"
        >
          AND
        </text>

        {/* OR Output Stage */}
        <rect
          x="298"
          y="79"
          width="60"
          height="44"
          rx="8"
          fill="#0d0d13"
          stroke={finalOut ? accentColor : "rgba(248,245,240,0.24)"}
          strokeWidth="1.2"
        />
        <text
          x="328"
          y="105"
          textAnchor="middle"
          fill={finalOut ? "#f8f5f0" : "#9c978f"}
          fontSize="10.5"
          fontFamily="monospace"
        >
          OUT
        </text>

        {/* Output Beacon Solder Pad */}
        <circle
          cx="392"
          cy="101"
          r="9"
          fill={finalOut ? `${accentColor}2e` : "transparent"}
          stroke={finalOut ? accentColor : "rgba(248,245,240,0.2)"}
          strokeWidth="1.2"
        />
        <circle
          cx="392"
          cy="101"
          r="4"
          fill={finalOut ? accentColor : "#3a3a44"}
        />
      </svg>
    </div>
  );
}
