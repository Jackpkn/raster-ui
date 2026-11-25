"use client";

export interface OrbitalRingLoaderProps {
  /** Overall SVG diameter in CSS px (48-160). */
  sizePx?: number;
  /** Active arc and core beacon accent color. */
  accentColor?: string;
  /** Secondary dashed ring color. */
  ringColor?: string;
  /** Rotation speed multiplier. */
  speed?: number;
  /** Pause ring rotation. */
  paused?: boolean;
  className?: string;
}

/**
 * Pure SVG + CSS Counter-Harmonic Orbital Telemetry Loader.
 * Zero JavaScript runtime overhead; concentric dashed arcs spin in opposing phases around a core beacon.
 */
export function OrbitalRingLoader({
  sizePx = 96,
  accentColor = "#f27c63",
  ringColor = "rgba(248, 245, 240, 0.28)",
  speed = 1,
  paused = false,
  className = "",
}: OrbitalRingLoaderProps) {
  const outerSec = Math.max(2, 7.5 / Math.max(0.4, speed));
  const midSec = Math.max(1.5, 4.8 / Math.max(0.4, speed));
  const innerSec = Math.max(1, 3.1 / Math.max(0.4, speed));

  return (
    <div
      role="status"
      aria-label="Processing"
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      <style>{`
        @keyframes raster-orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes raster-orbit-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-orbit-ring { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 100 100"
        width={sizePx}
        height={sizePx}
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke={ringColor}
          strokeWidth="1.2"
          strokeDasharray="6 6"
          className="raster-orbit-ring"
          style={{
            transformOrigin: "50px 50px",
            animation: paused ? "none" : `raster-orbit-cw ${outerSec}s linear infinite`,
          }}
        />
        <circle
          cx="50"
          cy="50"
          r="32"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="44 160"
          className="raster-orbit-ring"
          style={{
            transformOrigin: "50px 50px",
            animation: paused ? "none" : `raster-orbit-ccw ${midSec}s linear infinite`,
          }}
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          stroke={ringColor}
          strokeWidth="1.2"
          strokeDasharray="18 14"
          className="raster-orbit-ring"
          style={{
            transformOrigin: "50px 50px",
            animation: paused ? "none" : `raster-orbit-cw ${innerSec}s linear infinite`,
          }}
        />
        <circle cx="50" cy="50" r="4.5" fill={accentColor} />
        <circle cx="50" cy="50" r="9" stroke={accentColor} strokeOpacity="0.28" strokeWidth="1" />
      </svg>
    </div>
  );
}
