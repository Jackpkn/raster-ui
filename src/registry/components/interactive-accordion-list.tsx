"use client";

import { useState } from "react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface InteractiveAccordionListProps {
  /** Expandable FAQ or feature items. */
  items?: AccordionItem[];
  /** Active border hairline and plus/close indicator accent color. */
  accentColor?: string;
  className?: string;
}

const DEFAULT_ITEMS: AccordionItem[] = [
  {
    id: "deps",
    question: "Zero external runtime dependencies?",
    answer: "Yes. Every component imports only React and uses pure Canvas2D, SVG, or CSS.",
  },
  {
    id: "shadcn",
    question: "Does it work with shadcn CLI?",
    answer: "Paste any /r/[slug].json endpoint into npx shadcn@latest add to install locally.",
  },
  {
    id: "motion",
    question: "Is reduced motion supported?",
    answer: "All animations check prefers-reduced-motion and pause cleanly when off-screen.",
  },
];

/**
 * Silky Pure-CSS Grid Accordion Disclosure List.
 * Smoothly animates expand/collapse height via CSS grid-template-rows with zero layout jitter.
 */
export function InteractiveAccordionList({
  items = DEFAULT_ITEMS,
  accentColor = "#f27c63",
  className = "",
}: InteractiveAccordionListProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div
      className={`w-full max-w-md divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/14 bg-[#09090e] ${className}`}
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-[2px] transition-opacity duration-200"
              style={{ backgroundColor: accentColor, opacity: isOpen ? 1 : 0 }}
            />
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs font-medium text-[#f8f5f0] hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="font-mono text-sm leading-none transition-transform duration-200"
                style={{
                  color: isOpen ? accentColor : "#8d8880",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-250 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-3 text-[11px] leading-relaxed text-[#9c978f]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
