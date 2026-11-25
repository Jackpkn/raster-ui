"use client";

export interface ShimmerCommandPillProps {
  /** Main CTA or announcement text. */
  label?: string;
  /** Optional shortcut hint badge (e.g. "⌘K" or "NEW"). */
  badge?: string;
  /** Specular glint highlight color. */
  accentColor?: string;
  /** Shimmer sweep duration in seconds (2-8). */
  durationSec?: number;
  /** Pause shimmer sweep. */
  paused?: boolean;
  /** Click callback. */
  onClick?: () => void;
  className?: string;
}

/**
 * Metallic Shimmer Obsidian Command Pill.
 * Pure CSS diagonal specular glint sweeping across a dark architectural button with zero runtime JS.
 */
export function ShimmerCommandPill({
  label = "Open Command Palette",
  badge = "⌘K",
  accentColor = "#f27c63",
  durationSec = 3.6,
  paused = false,
  onClick,
  className = "",
}: ShimmerCommandPillProps) {
  return (
    <>
      <style>{`
        @keyframes raster-pill-shimmer {
          0% { transform: translateX(-140%) skewX(-22deg); }
          55%, 100% { transform: translateX(240%) skewX(-22deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-pill-glint { animation: none !important; opacity: 0; }
        }
      `}</style>
      <button
        type="button"
        onClick={onClick}
        className={`group relative inline-flex h-11 items-center gap-3 overflow-hidden rounded-full border border-white/16 bg-[#0b0b10] px-5 text-xs font-semibold text-[#f8f5f0] cursor-pointer transition-transform active:scale-[0.98] hover:border-white/30 ${className}`}
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 28px -12px rgba(0,0,0,0.85)",
        }}
      >
        <span
          aria-hidden="true"
          className="raster-pill-glint pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 48%, ${accentColor}44 62%, transparent 100%)`,
            animation: paused ? "none" : `raster-pill-shimmer ${durationSec}s ease-in-out infinite`,
          }}
        />
        <span
          className="relative z-10 h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        <span className="relative z-10 tracking-tight">{label}</span>
        {badge && (
          <kbd className="relative z-10 rounded-md border border-white/14 bg-white/6 px-2 py-0.5 font-mono text-[10px] text-[#c7c2ba]">
            {badge}
          </kbd>
        )}
      </button>
    </>
  );
}
