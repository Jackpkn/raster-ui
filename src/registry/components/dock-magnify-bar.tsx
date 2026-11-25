"use client";

import { useCallback, useRef, useState } from "react";

export interface DockItem {
  id: string;
  label: string;
  glyph: string;
}

export interface DockMagnifyBarProps {
  /** Dock action items. */
  items?: DockItem[];
  /** Highlight accent color for active/hovered pill dot. */
  accentColor?: string;
  /** Maximum scale factor at pointer center (1.2-1.7). */
  maxScale?: number;
  /** Callback when a dock item is clicked. */
  onSelect?: (id: string) => void;
  className?: string;
}

const DEFAULT_ITEMS: DockItem[] = [
  { id: "home", label: "Overview", glyph: "01" },
  { id: "search", label: "Search", glyph: "02" },
  { id: "globe", label: "Global", glyph: "03" },
  { id: "agent", label: "Agent", glyph: "04" },
  { id: "studio", label: "Studio", glyph: "05" },
  { id: "terminal", label: "CLI", glyph: "06" },
];

/**
 * Zero-Dependency Gaussian Magnetic Dock Bar.
 * Smoothly magnifies and lifts nearby dock pills as the pointer glides horizontally across the bar.
 */
export function DockMagnifyBar({
  items = DEFAULT_ITEMS,
  accentColor = "#f27c63",
  maxScale = 1.42,
  onSelect,
  className = "",
}: DockMagnifyBarProps) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [scales, setScales] = useState<number[]>(() => items.map(() => 1));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "home");

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      const x = e.clientX;
      setScales(
        items.map((_, idx) => {
          const el = itemRefs.current[idx];
          if (!el) return 1;
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const dist = Math.abs(x - cx);
          const sigma = 62;
          const bump = Math.exp(-(dist * dist) / (2 * sigma * sigma));
          return 1 + bump * (maxScale - 1);
        })
      );
    },
    [items, maxScale]
  );

  const reset = () => {
    setHoveredIdx(null);
    setScales(items.map(() => 1));
  };

  return (
    <div
      ref={barRef}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={`inline-flex items-end gap-2.5 rounded-2xl border border-white/14 bg-[#0b0b10]/90 px-4 py-3 backdrop-blur-md ${className}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 18px 40px -16px rgba(0,0,0,0.8)" }}
    >
      {items.map((item, idx) => {
        const s = scales[idx] ?? 1;
        const lift = (s - 1) * 24;
        const isActive = activeId === item.id;
        return (
          <div key={item.id} className="relative flex flex-col items-center">
            {hoveredIdx === idx && (
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-white/14 bg-[#14141c] px-2 py-0.5 font-mono text-[10px] text-[#f8f5f0]">
                {item.label}
              </span>
            )}
            <button
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              type="button"
              onPointerEnter={() => setHoveredIdx(idx)}
              onClick={() => {
                setActiveId(item.id);
                onSelect?.(item.id);
              }}
              aria-label={item.label}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-[#14141c] font-mono text-xs font-semibold text-[#f8f5f0] cursor-pointer will-change-transform"
              style={{
                transform: `translate3d(0, ${(-lift).toFixed(1)}px, 0) scale(${s.toFixed(3)})`,
                borderColor: isActive ? accentColor : "rgba(255,250,245,0.14)",
                transition: "transform 160ms cubic-bezier(0.22, 1, 0.36, 1), border-color 180ms ease",
              }}
            >
              {item.glyph}
            </button>
            <span
              className="mt-1.5 h-1 w-1 rounded-full transition-opacity"
              style={{
                backgroundColor: accentColor,
                opacity: isActive ? 1 : 0,
              }}
              aria-hidden="true"
            />
          </div>
        );
      })}
    </div>
  );
}
