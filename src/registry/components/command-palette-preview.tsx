"use client";

import { useState } from "react";

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  shortcut: string;
}

export interface CommandPalettePreviewProps {
  /** Searchable command list. */
  items?: CommandItem[];
  /** Active highlight accent color. */
  accentColor?: string;
  onSelect?: (item: CommandItem) => void;
  className?: string;
}

const DEFAULT_ITEMS: CommandItem[] = [
  { id: "deploy", label: "Deploy production build", group: "Actions", shortcut: "⌘D" },
  { id: "copy", label: "Copy single-file TSX", group: "Registry", shortcut: "⌘C" },
  { id: "theme", label: "Toggle obsidian mode", group: "Theme", shortcut: "⌘T" },
  { id: "logs", label: "Inspect live edge streams", group: "Monitor", shortcut: "⌘L" },
];

/**
 * Interactive Zero-Dependency Command Palette (⌘K) Widget.
 * Live substring filtering, pointer hover selection, keyboard shortcut chips, and crisp obsidian chrome.
 */
export function CommandPalettePreview({
  items = DEFAULT_ITEMS,
  accentColor = "#f27c63",
  onSelect,
  className = "",
}: CommandPalettePreviewProps) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(items[0]?.id ?? "deploy");

  const filtered = items.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${item.label} ${item.group}`.toLowerCase().includes(q);
  });

  return (
    <div
      className={`w-full max-w-md overflow-hidden rounded-2xl border border-white/14 bg-[#09090e] text-left ${className}`}
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 48px -20px rgba(0,0,0,0.9)",
      }}
    >
      {/* Search bar */}
      <div className="flex items-center gap-2.5 border-b border-white/10 px-3.5 py-2.5">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or search..."
          aria-label="Search commands"
          className="w-full bg-transparent text-xs text-[#f8f5f0] placeholder:text-[#78746c] focus:outline-none"
        />
        <kbd className="rounded border border-white/12 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9.5px] text-[#9c978f]">
          ⌘K
        </kbd>
      </div>

      {/* Results list */}
      <div className="p-1.5 space-y-0.5">
        {filtered.length === 0 ? (
          <div className="px-3 py-4 text-center font-mono text-[11px] text-[#78746c]">
            No matching commands
          </div>
        ) : (
          filtered.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveId(item.id)}
                onClick={() => {
                  setActiveId(item.id);
                  onSelect?.(item);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer"
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.06)" : "transparent",
                  color: active ? "#f8f5f0" : "#9c978f",
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-1.5 w-1.5 rounded-full transition-opacity"
                    style={{ backgroundColor: accentColor, opacity: active ? 1 : 0 }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[9.5px] text-[#6d6962]">{item.group}</span>
                  <kbd className="rounded border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[9.5px] text-[#b8b3aa]">
                    {item.shortcut}
                  </kbd>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
