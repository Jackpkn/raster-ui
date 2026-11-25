"use client";

export interface CrtScanlineTextProps {
  /** Display headline text. */
  text?: string;
  /** Scanline stripe gap in px (2-4). */
  scanlineSize?: number;
  /** Cloud drift duration in seconds (4-24). */
  durationSec?: number;
  /** Accent cloud highlight hex tint. */
  highlightColor?: string;
  /** Pause the drifting light sheen. */
  paused?: boolean;
  className?: string;
}

/**
 * Pure CSS CRT Scanline + Animated Cloud-Masked Display Typography.
 * Zero JavaScript RAF loop, zero external dependencies, honors prefers-reduced-motion.
 */
export function CrtScanlineText({
  text = "Ship your craft. We run it.",
  scanlineSize = 2,
  durationSec = 11,
  highlightColor = "#f5f2ec",
  paused = false,
  className = "",
}: CrtScanlineTextProps) {
  const s = Math.max(1, Math.min(6, Math.round(scanlineSize)));
  const doubleS = s * 2;

  return (
    <>
      <style>{`
        @keyframes raster-crt-drift {
          0% { background-position: 0% 45%; }
          50% { background-position: 100% 55%; }
          100% { background-position: 0% 45%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-crt-text { animation: none !important; }
        }
      `}</style>
      <span
        className={`raster-crt-text inline-block font-extrabold tracking-[-0.045em] leading-[1.02] select-none ${className}`}
        style={{
          color: "transparent",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          backgroundImage: [
            `repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${s}px, rgba(6,6,9,0.68) ${s}px, rgba(6,6,9,0.68) ${doubleS}px)`,
            `linear-gradient(108deg, #3c3a37 0%, #8a857e 26%, ${highlightColor} 49%, #69655f 72%, #32302d 100%)`,
          ].join(", "),
          backgroundSize: "100% 100%, 240% 100%",
          animation: paused ? "none" : `raster-crt-drift ${durationSec}s ease-in-out infinite`,
        }}
      >
        {text}
      </span>
    </>
  );
}
