"use client";

export interface SpotlightHeroBadgeProps {
  /** Leading status chip label. */
  tag?: string;
  /** Announcement headline text. */
  label?: string;
  /** Rotating border beam and indicator dot accent color. */
  accentColor?: string;
  /** Beam rotation speed multiplier. */
  speed?: number;
  /** Pause rotating border glint. */
  paused?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Conic-Beam Hero Announcement Pill Badge.
 * Wraps a crisp obsidian announcement chip in a smoothly orbiting luminous conic hairline
 * with pure CSS transforms and zero dependencies.
 */
export function SpotlightHeroBadge({
  tag = "v3.0",
  label = "100 zero-dependency components live",
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  onClick,
  className = "",
}: SpotlightHeroBadgeProps) {
  const dur = Math.max(1.8, 4.2 / Math.max(0.4, speed));

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex overflow-hidden rounded-full p-[1.25px] cursor-pointer active:scale-[0.98] transition-transform ${className}`}
    >
      <style>{`
        @keyframes raster-badge-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-badge-beam { animation: none !important; }
        }
      `}</style>

      {/* Rotating conic light arc clipped to 1.25px border ring */}
      <span
        aria-hidden="true"
        className="raster-badge-beam pointer-events-none absolute top-1/2 left-1/2 h-[320%] w-[320%]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 275deg, ${accentColor} 325deg, #f8f5f0 350deg, transparent 360deg)`,
          animation: paused ? "none" : `raster-badge-spin ${dur.toFixed(2)}s linear infinite`,
        }}
      />

      {/* Inner obsidian capsule */}
      <span className="relative z-10 inline-flex items-center gap-2.5 rounded-full bg-[#09090e] px-3.5 py-1.5 text-xs text-[#f8f5f0]">
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
          style={{ backgroundColor: `${accentColor}26`, color: accentColor }}
        >
          {tag}
        </span>
        <span className="text-[#e7e2da]">{label}</span>
        <span
          aria-hidden="true"
          className="font-mono text-[11px] text-[#9c978f] transition-transform duration-200 group-hover:translate-x-0.5"
        >
          -&gt;
        </span>
      </span>
    </button>
  );
}
