"use client";

import { useState } from "react";

export interface ThermalHeatmapCalendarProps {
  /** Number of columns/weeks rendered (8-18). */
  weeks?: number;
  /** Peak contribution intensity accent color. */
  accentColor?: string;
  /** Header caption. */
  label?: string;
  className?: string;
}

const LEVELS = [0.06, 0.24, 0.48, 0.74, 0.96];

/**
 * Interactive Contribution & Uptime Thermal Heatmap Calendar.
 * Deterministic multi-week activity lattice with live hover tooltip readout and zero dependencies.
 */
export function ThermalHeatmapCalendar({
  weeks = 16,
  accentColor = "#f27c63",
  label = "90-DAY DEPLOY VELOCITY",
  className = "",
}: ThermalHeatmapCalendarProps) {
  const safeWeeks = Math.max(8, Math.min(18, Math.round(weeks)));
  const totalCells = safeWeeks * 7;
  const [hovered, setHovered] = useState<{ dayIdx: number; count: number } | null>(null);

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const hash = ((i * 37 + Math.floor(i / 7) * 19 + 11) % 23) / 23;
    const level = hash > 0.84 ? 4 : hash > 0.62 ? 3 : hash > 0.4 ? 2 : hash > 0.18 ? 1 : 0;
    const count = level === 0 ? 0 : level * 3 + (i % 4);
    return { i, level, count };
  });

  const totalCommits = cells.reduce((sum, c) => sum + c.count, 0);

  return (
    <div
      className={`inline-flex flex-col gap-2.5 rounded-2xl border border-white/12 bg-[#08080c] p-3.5 font-mono ${className}`}
    >
      <div className="flex items-center justify-between gap-4 text-[10px]">
        <span className="text-[#9c978f]">{label}</span>
        <span className="tabular-nums" style={{ color: accentColor }}>
          {hovered
            ? `Day ${hovered.dayIdx + 1}: ${hovered.count} events`
            : `${totalCommits} events`}
        </span>
      </div>

      <div
        className="grid grid-flow-col grid-rows-7 gap-1"
        onPointerLeave={() => setHovered(null)}
      >
        {cells.map((cell) => {
          const isFocus = hovered?.dayIdx === cell.i;
          return (
            <button
              key={cell.i}
              type="button"
              aria-label={`Day ${cell.i + 1}: ${cell.count} events`}
              onPointerEnter={() => setHovered({ dayIdx: cell.i, count: cell.count })}
              className="h-3 w-3 rounded-[3px] transition-transform duration-150 cursor-crosshair"
              style={{
                backgroundColor:
                  cell.level === 0 ? "rgba(248, 245, 240, 0.06)" : accentColor,
                opacity: cell.level === 0 ? 1 : LEVELS[cell.level],
                transform: isFocus ? "scale(1.28)" : "scale(1)",
                outline: isFocus ? "1px solid #f8f5f0" : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
