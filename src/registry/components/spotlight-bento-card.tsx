"use client";

import { useState, type ReactNode } from "react";

export interface SpotlightBentoCardProps {
  /** Radial glow color as RGB string e.g. "242, 124, 99". */
  glowRgb?: string;
  /** Spotlight diameter in CSS px. */
  radiusPx?: number;
  /** Background surface color. */
  backgroundColor?: string;
  /** Card content. */
  children?: ReactNode;
  className?: string;
}

/**
 * Cursor-Tracking Spotlight Bento Card with Architectural Dot-Grid Reveal.
 * Illuminates a subtle radial sheen and dot lattice wherever the pointer hovers.
 */
export function SpotlightBentoCard({
  glowRgb = "242, 124, 99",
  radiusPx = 280,
  backgroundColor = "#09090d",
  children,
  className = "",
}: SpotlightBentoCardProps) {
  const [pos, setPos] = useState({ x: 180, y: 110, active: false });

  return (
    <div
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        });
      }}
      onPointerLeave={() => setPos((p) => ({ ...p, active: false }))}
      className={`relative overflow-hidden rounded-2xl border border-white/12 p-6 ${className}`}
      style={{ backgroundColor }}
    >
      {/* Revealed micro dot grid masked tightly to pointer spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0.25,
          backgroundImage: "radial-gradient(rgba(255,250,245,0.22) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          WebkitMaskImage: `radial-gradient(${radiusPx}px circle at ${pos.x}px ${pos.y}px, black 0%, transparent 72%)`,
          maskImage: `radial-gradient(${radiusPx}px circle at ${pos.x}px ${pos.y}px, black 0%, transparent 72%)`,
        }}
      />

      {/* Soft color spotlight sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0.35,
          background: `radial-gradient(${radiusPx}px circle at ${pos.x}px ${pos.y}px, rgba(${glowRgb}, 0.16), transparent 68%)`,
        }}
      />

      <div className="relative z-10">
        {children ?? (
          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9c978f]">
              Hover Spotlight Mask
            </span>
            <h3 className="text-lg font-semibold text-[#f8f5f0]">
              Move your pointer across the surface
            </h3>
            <p className="text-xs leading-relaxed text-[#9c978f]">
              Combines a CSS radial mask over a 14px architectural dot grid with a feathered glow
              sheen. Zero external packages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
