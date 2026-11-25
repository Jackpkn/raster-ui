"use client";

export interface DataBeamHubProps {
  /** Center hub badge label. */
  hubLabel?: string;
  /** Left source node labels (up to 3). */
  sources?: [string, string, string];
  /** Right destination node labels (up to 2). */
  targets?: [string, string];
  /** Flowing luminous beam accent color. */
  accentColor?: string;
  /** Static cable path color. */
  railColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Beam flow speed multiplier. */
  speed?: number;
  /** Pause flowing beams. */
  paused?: boolean;
  className?: string;
}

/**
 * Multi-Input to Multi-Output Animated Data Beam Hub.
 * Pure SVG cubic-Bezier conduits streaming GPU-composited luminous data pulses
 * from three upstream sources through a central routing core to two downstream targets.
 */
export function DataBeamHub({
  hubLabel = "CORE",
  sources = ["API", "DB", "WEB"],
  targets = ["EDGE", "SYNC"],
  accentColor = "#f27c63",
  railColor = "rgba(248, 245, 240, 0.16)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: DataBeamHubProps) {
  const dur = Math.max(1.1, 2.8 / Math.max(0.4, speed));

  const paths = [
    { id: "in-0", d: "M 74 42 C 145 42, 145 100, 190 100", delay: "0s" },
    { id: "in-1", d: "M 74 100 L 190 100", delay: `${(dur * 0.32).toFixed(2)}s` },
    { id: "in-2", d: "M 74 158 C 145 158, 145 100, 190 100", delay: `${(dur * 0.64).toFixed(2)}s` },
    { id: "out-0", d: "M 230 100 C 282 100, 282 64, 346 64", delay: `${(dur * 0.18).toFixed(2)}s` },
    { id: "out-1", d: "M 230 100 C 282 100, 282 136, 346 136", delay: `${(dur * 0.52).toFixed(2)}s` },
  ];

  const sourceY = [42, 100, 158];
  const targetY = [64, 136];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <style>{`
        @keyframes raster-beam-flow {
          from { stroke-dashoffset: 180; }
          to { stroke-dashoffset: -180; }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-beam-pulse { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 420 200"
        className="h-full w-full max-w-[490px]"
        role="img"
        aria-label="Multi-node animated data flow hub"
      >
        <defs>
          <filter id="raster-beam-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static hairline conduits + animated luminous packet streaks */}
        {paths.map((p) => (
          <g key={p.id}>
            <path d={p.d} fill="none" stroke={railColor} strokeWidth="1.25" />
            <path
              d={p.d}
              fill="none"
              stroke={accentColor}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeDasharray="34 150"
              filter="url(#raster-beam-glow)"
              className="raster-beam-pulse"
              style={{
                animation: paused
                  ? "none"
                  : `raster-beam-flow ${dur.toFixed(2)}s linear ${p.delay} infinite`,
              }}
            />
          </g>
        ))}

        {/* Upstream Source Nodes */}
        {sources.map((label, idx) => {
          const y = sourceY[idx]!;
          return (
            <g key={label}>
              <rect
                x="18"
                y={y - 15}
                width="56"
                height="30"
                rx="8"
                fill="#0d0d13"
                stroke="rgba(248, 245, 240, 0.2)"
                strokeWidth="1.1"
              />
              <circle cx="30" cy={y} r="2.2" fill={accentColor} />
              <text
                x="48"
                y={y + 3.5}
                textAnchor="middle"
                fill="#f8f5f0"
                fontSize="9.5"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Central Hub Core */}
        <g>
          <circle cx="210" cy="100" r="32" fill={`${accentColor}14`} />
          <rect
            x="182"
            y="72"
            width="56"
            height="56"
            rx="14"
            fill="#0e0e15"
            stroke={accentColor}
            strokeWidth="1.4"
          />
          <rect
            x="190"
            y="80"
            width="40"
            height="40"
            rx="9"
            fill="#14141e"
            stroke="rgba(248, 245, 240, 0.16)"
            strokeWidth="1"
          />
          <text
            x="210"
            y="103.5"
            textAnchor="middle"
            fill="#f8f5f0"
            fontSize="10"
            fontWeight="600"
            fontFamily="monospace"
          >
            {hubLabel}
          </text>
        </g>

        {/* Downstream Target Nodes */}
        {targets.map((label, idx) => {
          const y = targetY[idx]!;
          return (
            <g key={label}>
              <rect
                x="346"
                y={y - 15}
                width="58"
                height="30"
                rx="8"
                fill="#0d0d13"
                stroke="rgba(248, 245, 240, 0.2)"
                strokeWidth="1.1"
              />
              <circle cx="358" cy={y} r="2.2" fill={accentColor} />
              <text
                x="379"
                y={y + 3.5}
                textAnchor="middle"
                fill="#f8f5f0"
                fontSize="9.5"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
