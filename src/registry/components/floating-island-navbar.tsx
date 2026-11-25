"use client";

import { useState } from "react";

export interface FloatingIslandNavbarProps {
  /** Brand wordmark on left. */
  brand?: string;
  /** Navigation link labels. */
  links?: string[];
  /** CTA button label on right. */
  ctaLabel?: string;
  /** Brand indicator dot and CTA highlight accent color. */
  accentColor?: string;
  className?: string;
}

const DEFAULT_LINKS = ["Product", "Components", "Pricing", "Docs"];

/**
 * Floating Obsidian Island Navigation Bar.
 * Glides a frosted glass hover capsule seamlessly behind hovered navigation links
 * with a crisp top specular rim and zero animation libraries.
 */
export function FloatingIslandNavbar({
  brand = "raster",
  links = DEFAULT_LINKS,
  ctaLabel = "Start",
  accentColor = "#f27c63",
  className = "",
}: FloatingIslandNavbarProps) {
  const [activeIdx, setActiveIdx] = useState(1);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const focusIdx = hoverIdx ?? activeIdx;

  return (
    <nav
      aria-label="Primary floating navigation"
      className={`inline-flex items-center gap-3 rounded-full border border-white/14 bg-[#0b0b10]/90 px-2.5 py-1.5 backdrop-blur-md ${className}`}
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 36px -16px rgba(0,0,0,0.92)",
      }}
    >
      {/* Brand mark */}
      <div className="flex items-center gap-1.5 pl-2 pr-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        <span className="font-mono text-xs font-semibold tracking-tight text-[#f8f5f0]">
          {brand}
        </span>
      </div>

      {/* Sliding hover pill links */}
      <div
        onMouseLeave={() => setHoverIdx(null)}
        className="relative inline-grid items-center"
        style={{ gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/[0.08] transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${100 / links.length}%`,
            transform: `translateX(${focusIdx * 100}%)`,
          }}
        />
        {links.map((label, idx) => (
          <button
            key={label}
            type="button"
            onMouseEnter={() => setHoverIdx(idx)}
            onClick={() => setActiveIdx(idx)}
            className="relative z-10 h-7 px-3 text-[11px] font-medium cursor-pointer transition-colors whitespace-nowrap"
            style={{ color: idx === focusIdx ? "#f8f5f0" : "#9c978f" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        className="h-7 rounded-full px-3.5 text-[11px] font-semibold text-[#060609] cursor-pointer transition-opacity hover:opacity-90 whitespace-nowrap"
        style={{ backgroundColor: accentColor }}
      >
        {ctaLabel}
      </button>
    </nav>
  );
}
