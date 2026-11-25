"use client";

import { useState } from "react";

export interface RadialContextMenuProps {
  /** Action petal labels arrayed around the wheel (up to 6). */
  actions?: string[];
  /** Active center trigger and selected petal accent color. */
  accentColor?: string;
  onAction?: (action: string) => void;
  className?: string;
}

const DEFAULT_ACTIONS = ["Copy", "Fork", "Share", "Pin", "Run", "Edit"];

/**
 * Interactive Circular Radial Pie Action Wheel.
 * Click the central obsidian hub to smoothly bloom six precision radial petals
 * around the cursor axis with live selection feedback and zero external dependencies.
 */
export function RadialContextMenu({
  actions = DEFAULT_ACTIONS,
  accentColor = "#f27c63",
  onAction,
  className = "",
}: RadialContextMenuProps) {
  const safeActions = actions.slice(0, 6);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<string>(safeActions[0] ?? "Copy");

  return (
    <div className={`relative flex h-40 w-56 items-center justify-center ${className}`}>
      {/* Subtle circular orbit ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-28 w-28 rounded-full border border-dashed border-white/12 transition-all duration-300"
        style={{
          transform: open ? "scale(1)" : "scale(0.45)",
          opacity: open ? 1 : 0,
        }}
      />

      {/* Blooming radial action petals */}
      {safeActions.map((label, idx) => {
        const angle = -Math.PI / 2 + (idx / safeActions.length) * Math.PI * 2;
        const rad = open ? 60 : 0;
        const tx = Math.cos(angle) * rad;
        const ty = Math.sin(angle) * rad;
        const isSelected = selected === label;

        return (
          <button
            key={label}
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setSelected(label);
              onAction?.(label);
            }}
            className="absolute flex h-7 min-w-[48px] items-center justify-center rounded-full border px-2.5 font-mono text-[10px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${open ? 1 : 0.4})`,
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              backgroundColor: isSelected ? "#16121a" : "#0b0b11",
              borderColor: isSelected ? accentColor : "rgba(248, 245, 240, 0.16)",
              color: isSelected ? accentColor : "#d8d3ca",
            }}
          >
            {label}
          </button>
        );
      })}

      {/* Center Hub Toggle Button */}
      <button
        type="button"
        aria-expanded={open}
        aria-label="Toggle radial menu"
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full border bg-[#0e0e15] font-mono text-[9.5px] font-semibold text-[#f8f5f0] cursor-pointer transition-transform active:scale-95"
        style={{
          borderColor: accentColor,
          boxShadow: `0 0 22px -6px ${accentColor}`,
        }}
      >
        <span>{open ? selected : "+"}</span>
      </button>
    </div>
  );
}
