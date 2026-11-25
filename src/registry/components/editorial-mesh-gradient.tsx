"use client";

export interface EditorialMeshGradientProps {
  /** Choose painterly warm alabaster gallery or deep obsidian atmosphere. */
  variant?: "obsidian" | "alabaster";
  /** Drift animation duration in seconds (8-32). */
  durationSec?: number;
  /** Toggle fine tactile linen grain overlay. */
  linenGrain?: boolean;
  /** Pause gentle mesh drift. */
  paused?: boolean;
  className?: string;
}

/**
 * Pure CSS Painterly Editorial Mesh Gradient with Woven Linen Grain.
 * Zero WebGL overhead; cleanly shifts between warm light gallery and obsidian dark surfaces.
 */
export function EditorialMeshGradient({
  variant = "obsidian",
  durationSec = 18,
  linenGrain = true,
  paused = false,
  className = "",
}: EditorialMeshGradientProps) {
  const isDark = variant === "obsidian";

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: isDark ? "#0b0a0e" : "#fbf9f6" }}
    >
      <style>{`
        @keyframes raster-mesh-float-a {
          0%, 100% { transform: translate3d(-4%, -3%, 0) scale(1); }
          50% { transform: translate3d(6%, 5%, 0) scale(1.08); }
        }
        @keyframes raster-mesh-float-b {
          0%, 100% { transform: translate3d(5%, 4%, 0) scale(1.04); }
          50% { transform: translate3d(-6%, -5%, 0) scale(0.96); }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-mesh-orb { animation: none !important; }
        }
      `}</style>

      <div
        className="raster-mesh-orb pointer-events-none absolute -top-1/3 -left-1/4 h-[110%] w-[78%] rounded-full blur-3xl"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(242, 124, 99, 0.22) 0%, rgba(180, 145, 130, 0.08) 48%, transparent 74%)"
            : "radial-gradient(circle, rgba(251, 182, 162, 0.52) 0%, rgba(246, 212, 178, 0.25) 52%, transparent 74%)",
          animation: paused ? "none" : `raster-mesh-float-a ${durationSec}s ease-in-out infinite`,
        }}
      />

      <div
        className="raster-mesh-orb pointer-events-none absolute -bottom-1/3 -right-1/4 h-[110%] w-[78%] rounded-full blur-3xl"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(110, 145, 198, 0.2) 0%, rgba(160, 168, 196, 0.07) 50%, transparent 74%)"
            : "radial-gradient(circle, rgba(165, 214, 235, 0.54) 0%, rgba(208, 224, 240, 0.24) 52%, transparent 74%)",
          animation: paused
            ? "none"
            : `raster-mesh-float-b ${Math.round(durationSec * 1.2)}s ease-in-out infinite`,
        }}
      />

      {linenGrain && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "radial-gradient(rgba(255,250,245,0.045) 0.75px, transparent 0.75px), radial-gradient(rgba(255,250,245,0.025) 0.75px, transparent 0.75px)"
              : "radial-gradient(rgba(26,23,21,0.05) 0.75px, transparent 0.75px), radial-gradient(rgba(26,23,21,0.03) 0.75px, transparent 0.75px)",
            backgroundSize: "6px 6px",
            backgroundPosition: "0 0, 3px 3px",
          }}
        />
      )}
    </div>
  );
}
