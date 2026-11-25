"use client";

export interface LiquidMetaballBlobProps {
  /** Primary molten liquid droplet color. */
  accentColor?: string;
  /** Secondary silver-ivory droplet color. */
  secondaryColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Orbit & merge cycle speed multiplier. */
  speed?: number;
  /** Pause organic droplet motion. */
  paused?: boolean;
  className?: string;
}

/**
 * Pure SVG Organic Liquid Metaball Droplets.
 * Uses an SVG Gaussian blur + alpha color-matrix threshold filter so orbiting spheres
 * organically fuse, stretch, and separate like molten mercury with zero JS runtime loops.
 */
export function LiquidMetaballBlob({
  accentColor = "#f27c63",
  secondaryColor = "#e7e2da",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: LiquidMetaballBlobProps) {
  const durA = Math.max(2.5, 6.2 / Math.max(0.4, speed));
  const durB = Math.max(3, 7.8 / Math.max(0.4, speed));

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <style>{`
        @keyframes raster-meta-left {
          0%, 100% { transform: translateX(-56px) scale(0.92); }
          50% { transform: translateX(46px) scale(1.06); }
        }
        @keyframes raster-meta-right {
          0%, 100% { transform: translateX(58px) translateY(-10px) scale(0.88); }
          50% { transform: translateX(-44px) translateY(12px) scale(1.04); }
        }
        @keyframes raster-meta-vert {
          0%, 100% { transform: translateY(-28px) scale(0.84); }
          50% { transform: translateY(30px) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-meta-orb { animation: none !important; }
        }
      `}</style>

      <svg viewBox="0 0 360 180" className="h-full w-full max-w-[440px]">
        <defs>
          <filter id="raster-gooey-metaball">
            <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        <g filter="url(#raster-gooey-metaball)">
          {/* Anchor center mass */}
          <circle cx="180" cy="90" r="28" fill={accentColor} />

          {/* Orbiting merging spheres */}
          <circle
            cx="180"
            cy="90"
            r="22"
            fill={accentColor}
            className="raster-meta-orb"
            style={{
              transformOrigin: "180px 90px",
              animation: paused
                ? "none"
                : `raster-meta-left ${durA.toFixed(2)}s ease-in-out infinite`,
            }}
          />
          <circle
            cx="180"
            cy="90"
            r="19"
            fill={secondaryColor}
            className="raster-meta-orb"
            style={{
              transformOrigin: "180px 90px",
              animation: paused
                ? "none"
                : `raster-meta-right ${durB.toFixed(2)}s ease-in-out infinite`,
            }}
          />
          <circle
            cx="180"
            cy="90"
            r="15"
            fill={accentColor}
            className="raster-meta-orb"
            style={{
              transformOrigin: "180px 90px",
              animation: paused
                ? "none"
                : `raster-meta-vert ${(durA * 1.15).toFixed(2)}s ease-in-out infinite`,
            }}
          />
        </g>
      </svg>
    </div>
  );
}
