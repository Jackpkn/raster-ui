"use client";

export interface MarqueeLogoRibbonProps {
  /** Labels or metrics repeated seamlessly along the ticker. */
  items?: string[];
  /** Accent dot color separating items. */
  accentColor?: string;
  /** Full loop duration in seconds (10-45). */
  durationSec?: number;
  /** Scroll right-to-left or reverse. */
  reverse?: boolean;
  /** Pause marquee scroll. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_ITEMS = [
  "ZERO WEBGL DEPS",
  "4X4 BAYER MATRIX",
  "PURE CANVAS2D",
  "SHADCN REGISTRY",
  "60FPS COMPOSITED",
  "REDUCED MOTION SAFE",
  "NEXT.JS 16 READY",
];

/**
 * Pure CSS Seamless Infinite Marquee Ribbon with Edge Feathered Mask.
 * Automatically pauses on hover and wraps cleanly under prefers-reduced-motion.
 */
export function MarqueeLogoRibbon({
  items = DEFAULT_ITEMS,
  accentColor = "#f27c63",
  durationSec = 24,
  reverse = false,
  paused = false,
  className = "",
}: MarqueeLogoRibbonProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className={`raster-marquee-root relative overflow-hidden py-4 ${className}`}
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes raster-marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .raster-marquee-root:hover .raster-marquee-track {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-marquee-track {
            animation: none !important;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>

      <div
        className="raster-marquee-track flex w-max items-center gap-6"
        style={{
          animation: paused
            ? "none"
            : `raster-marquee-scroll ${durationSec}s linear infinite ${reverse ? "reverse" : "normal"}`,
        }}
      >
        {doubled.map((label, idx) => (
          <div
            key={`${label}-${idx}`}
            className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-[#0d0d13] px-4 py-1.5 font-mono text-xs tracking-[0.06em] text-[#e7e2da] whitespace-nowrap"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
