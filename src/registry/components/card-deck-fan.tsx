"use client";

import { useState } from "react";

export interface DeckCardItem {
  id: string;
  tag: string;
  title: string;
  note: string;
}

export interface CardDeckFanProps {
  /** Cards fanned in a clickable 3D obsidian stack. */
  cards?: DeckCardItem[];
  /** Active top card accent color. */
  accentColor?: string;
  className?: string;
}

const DEFAULT_CARDS: DeckCardItem[] = [
  { id: "c1", tag: "01 / CRAFT", title: "Zero-dependency motion", note: "Pure Canvas2D, SVG, and CSS." },
  { id: "c2", tag: "02 / SPEED", title: "60 FPS on obsidian", note: "Auto-pauses off-screen via IO." },
  { id: "c3", tag: "03 / CLI", title: "One-command install", note: "Compatible with shadcn registry." },
];

/**
 * Interactive 3D Fanned Obsidian Card Deck.
 * Click the top card to smoothly deal it to the back of the stack with layered rotation and depth.
 */
export function CardDeckFan({
  cards = DEFAULT_CARDS,
  accentColor = "#f27c63",
  className = "",
}: CardDeckFanProps) {
  const safeCards = cards.length >= 3 ? cards : DEFAULT_CARDS;
  const [topIdx, setTopIdx] = useState(0);

  function cycleNext() {
    setTopIdx((prev) => (prev + 1) % safeCards.length);
  }

  return (
    <div className={`relative flex h-36 w-64 items-center justify-center ${className}`}>
      {safeCards.map((card, idx) => {
        const order = (idx - topIdx + safeCards.length) % safeCards.length;
        const isFront = order === 0;
        const rot = order === 0 ? 0 : order === 1 ? 5.5 : -5.5;
        const tx = order === 0 ? 0 : order === 1 ? 14 : -14;
        const ty = order * 6;
        const scale = 1 - order * 0.055;

        return (
          <button
            key={card.id}
            type="button"
            onClick={cycleNext}
            aria-label={`Cycle card: ${card.title}`}
            className="absolute inset-x-2 top-2 rounded-2xl border p-4 text-left cursor-pointer transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              zIndex: safeCards.length - order,
              backgroundColor: isFront ? "#101018" : "#09090e",
              borderColor: isFront ? `${accentColor}77` : "rgba(248, 245, 240, 0.12)",
              transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${scale})`,
              opacity: isFront ? 1 : order === 1 ? 0.76 : 0.52,
              boxShadow: isFront
                ? "inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 34px -16px rgba(0,0,0,0.92)"
                : "none",
            }}
          >
            <div className="flex items-center justify-between font-mono text-[9.5px]">
              <span style={{ color: isFront ? accentColor : "#8d8880" }}>{card.tag}</span>
              <span className="text-[#6e6a64]">Click to deal</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-[#f8f5f0]">{card.title}</div>
            <p className="mt-1 text-[11px] text-[#9c978f]">{card.note}</p>
          </button>
        );
      })}
    </div>
  );
}
