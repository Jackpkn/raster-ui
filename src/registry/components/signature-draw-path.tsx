"use client";

export interface SignatureDrawPathProps {
  /** Author / founder caption beneath signature. */
  caption?: string;
  /** Ink stroke accent color. */
  accentColor?: string;
  /** Stroke draw cycle speed multiplier. */
  speed?: number;
  /** Pause continuous redraw loop. */
  paused?: boolean;
  className?: string;
}

/**
 * Calligraphic SVG Path-Draw Signature & Editorial Flourish.
 * Animates a continuous fountain-pen stroke using pure CSS stroke-dashoffset
 * with a clean baseline rule and zero external dependencies.
 */
export function SignatureDrawPath({
  caption = "RASTER FOUNDRY · EDITION 01",
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: SignatureDrawPathProps) {
  const dur = Math.max(2, 4.6 / Math.max(0.4, speed));

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <style>{`
        @keyframes raster-sig-draw {
          0% { stroke-dashoffset: 620; opacity: 0.4; }
          65% { stroke-dashoffset: 0; opacity: 1; }
          88% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -620; opacity: 0.2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-sig-stroke { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 320 96"
        className="h-20 w-64 sm:w-72"
        role="img"
        aria-label="Animated calligraphic signature"
      >
        {/* Subtle parchment/obsidian editorial guide line */}
        <line
          x1="24"
          y1="74"
          x2="296"
          y2="74"
          stroke="rgba(248, 245, 240, 0.14)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {/* Faint ghost under-trace */}
        <path
          d="M 32 68 C 44 18, 72 14, 66 56 C 62 76, 86 24, 102 58 C 110 74, 128 34, 142 54 C 152 68, 168 20, 180 56 C 188 74, 206 38, 224 52 C 242 64, 254 32, 274 44 C 248 64, 174 72, 118 70"
          fill="none"
          stroke="rgba(248, 245, 240, 0.1)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated ink stroke */}
        <path
          d="M 32 68 C 44 18, 72 14, 66 56 C 62 76, 86 24, 102 58 C 110 74, 128 34, 142 54 C 152 68, 168 20, 180 56 C 188 74, 206 38, 224 52 C 242 64, 254 32, 274 44 C 248 64, 174 72, 118 70"
          fill="none"
          stroke="#f8f5f0"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="620"
          className="raster-sig-stroke"
          style={{
            animation: paused
              ? "none"
              : `raster-sig-draw ${dur.toFixed(2)}s cubic-bezier(0.37, 0, 0.63, 1) infinite`,
          }}
        />

        {/* Accent underline flourish */}
        <path
          d="M 146 78 C 192 72, 236 70, 286 68"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="160"
          className="raster-sig-stroke"
          style={{
            animation: paused
              ? "none"
              : `raster-sig-draw ${dur.toFixed(2)}s cubic-bezier(0.37, 0, 0.63, 1) 0.25s infinite`,
          }}
        />
      </svg>

      {caption && (
        <span className="font-mono text-[10px] tracking-[0.16em] text-[#8d8880]">{caption}</span>
      )}
    </div>
  );
}
