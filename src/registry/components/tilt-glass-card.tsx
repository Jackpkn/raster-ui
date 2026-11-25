"use client";

import { useState, type ReactNode } from "react";

export interface TiltGlassCardProps {
  /** Maximum 3D tilt angle in degrees (4-18). */
  maxTiltDeg?: number;
  /** Specular glare tint color. */
  accentColor?: string;
  /** Background obsidian card surface. */
  backgroundColor?: string;
  /** Card content. */
  children?: ReactNode;
  className?: string;
}

/**
 * Zero-Dependency 3D Perspective Pointer-Tilt Card with Dynamic Specular Glare.
 * Uses hardware-accelerated CSS perspective transforms and angle-tracking surface sheen.
 */
export function TiltGlassCard({
  maxTiltDeg = 10,
  accentColor = "#f27c63",
  backgroundColor = "#0a0a0f",
  children,
  className = "",
}: TiltGlassCardProps) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 20, active: false });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const clamped = Math.max(4, Math.min(20, maxTiltDeg));

    setTilt({
      rx: reduced ? 0 : (0.5 - py) * clamped * 2,
      ry: reduced ? 0 : (px - 0.5) * clamped * 2,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  }

  return (
    <div style={{ perspective: "900px" }} className={className}>
      <div
        onPointerMove={handleMove}
        onPointerLeave={() => setTilt({ rx: 0, ry: 0, gx: 50, gy: 20, active: false })}
        className="relative overflow-hidden rounded-2xl border border-white/14 p-6 will-change-transform"
        style={{
          backgroundColor,
          transform: `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
          transition: tilt.active
            ? "transform 90ms ease-out"
            : "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.14), 0 24px 48px -22px rgba(0,0,0,0.88)",
        }}
      >
        {/* Dynamic specular glare layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            opacity: tilt.active ? 1 : 0.3,
            background: `radial-gradient(240px circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.14), ${accentColor}1c 40%, transparent 72%)`,
          }}
        />

        <div className="relative z-10">
          {children ?? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9c978f]">
                  3D Tilt Card
                </span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#f8f5f0]">
                Pointer-tracked perspective plane
              </h3>
              <p className="text-xs leading-relaxed text-[#9c978f]">
                Glide across the card to tilt the obsidian slab in 3D space with real-time angle
                glare and zero animation libraries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
