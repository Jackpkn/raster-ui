"use client";

import { useState } from "react";

export interface PricingToggleCardProps {
  /** Plan tier heading. */
  planName?: string;
  /** Monthly price in USD. */
  monthlyPrice?: number;
  /** Annual effective monthly price in USD. */
  annualPrice?: number;
  /** Specular top border and badge accent color. */
  accentColor?: string;
  className?: string;
}

/**
 * Interactive Monthly / Annual Obsidian Pricing Card.
 * Smoothly switches billing cadence with tabular numeric readout, savings pill,
 * and specular top hairline highlight using zero external dependencies.
 */
export function PricingToggleCard({
  planName = "Pro Studio",
  monthlyPrice = 29,
  annualPrice = 22,
  accentColor = "#f27c63",
  className = "",
}: PricingToggleCardProps) {
  const [annual, setAnnual] = useState(true);
  const price = annual ? annualPrice : monthlyPrice;

  return (
    <div
      className={`relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/14 bg-[#0a0a0f] p-4 space-y-3.5 ${className}`}
      style={{
        boxShadow: `inset 0 1px 0 ${accentColor}77, 0 20px 44px -20px rgba(0,0,0,0.92)`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#f8f5f0]">{planName}</span>
        <div className="inline-flex items-center rounded-full border border-white/12 bg-black/50 p-0.5 font-mono text-[10px]">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className="rounded-full px-2.5 py-0.5 cursor-pointer transition-colors"
            style={{
              backgroundColor: !annual ? "rgba(255,255,255,0.1)" : "transparent",
              color: !annual ? "#f8f5f0" : "#8d8880",
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className="rounded-full px-2.5 py-0.5 cursor-pointer transition-colors"
            style={{
              backgroundColor: annual ? `${accentColor}26` : "transparent",
              color: annual ? accentColor : "#8d8880",
            }}
          >
            Annual -24%
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-semibold tracking-tight text-[#f8f5f0] tabular-nums">
          ${price}
        </span>
        <span className="font-mono text-[11px] text-[#8d8880]">/ month</span>
      </div>

      <ul className="space-y-1 text-[11px] text-[#b8b3aa]">
        <li className="flex items-center gap-2">
          <span style={{ color: accentColor }}>✓</span>
          <span>Unlimited copy-paste TSX components</span>
        </li>
        <li className="flex items-center gap-2">
          <span style={{ color: accentColor }}>✓</span>
          <span>Private shadcn registry &amp; team seats</span>
        </li>
      </ul>
    </div>
  );
}
