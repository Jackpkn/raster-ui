"use client";

import { useState } from "react";

export interface ShortcutKeySpec {
  id: string;
  glyph: string;
  action: string;
}

export interface KbdShortcutDockProps {
  /** Tactile sculpted keycaps rendered in a dark mechanical row. */
  keys?: ShortcutKeySpec[];
  /** Active pressed keycap glow accent color. */
  accentColor?: string;
  className?: string;
}

const DEFAULT_KEYS: ShortcutKeySpec[] = [
  { id: "cmd", glyph: "⌘", action: "Command" },
  { id: "k", glyph: "K", action: "Quick Search" },
  { id: "p", glyph: "P", action: "Palette Mode" },
  { id: "c", glyph: "C", action: "Copy TSX" },
  { id: "ret", glyph: "↵", action: "Run Action" },
];

/**
 * Tactile 3D Sculpted Mechanical Keycap Cluster.
 * Click any sculpted obsidian keycap to depress it with spring travel, glowing rim accent,
 * and a live command readout underneath.
 */
export function KbdShortcutDock({
  keys = DEFAULT_KEYS,
  accentColor = "#f27c63",
  className = "",
}: KbdShortcutDockProps) {
  const [activeId, setActiveId] = useState<string>(keys[1]?.id ?? "k");
  const activeSpec = keys.find((k) => k.id === activeId) ?? keys[0];

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <div className="inline-flex items-center gap-2">
        {keys.map((item) => {
          const pressed = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              aria-pressed={pressed}
              className="flex h-11 w-11 items-center justify-center rounded-xl border font-mono text-sm font-semibold cursor-pointer transition-all duration-150"
              style={{
                backgroundColor: pressed ? "#14111a" : "#0c0c12",
                borderColor: pressed ? accentColor : "rgba(248, 245, 240, 0.16)",
                color: pressed ? accentColor : "#e7e2da",
                transform: pressed ? "translateY(2px)" : "translateY(0)",
                boxShadow: pressed
                  ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 0 0 #050507, 0 0 18px -6px ${accentColor}`
                  : "inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 0 0 #040407, 0 10px 18px -10px rgba(0,0,0,0.9)",
              }}
            >
              {item.glyph}
            </button>
          );
        })}
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-[#9c978f]">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        <span>{activeSpec ? `${activeSpec.glyph} · ${activeSpec.action}` : "Click any key"}</span>
      </div>
    </div>
  );
}
