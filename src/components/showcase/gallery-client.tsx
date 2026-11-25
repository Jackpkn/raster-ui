"use client";

import { ArrowRight, Check, Copy, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  RASTER_CATEGORIES,
  type RasterCategoryId,
  type RasterComponentSpec,
} from "@/registry/catalog";
import {
  ComponentStage,
  PALETTE_PRESETS,
  type PalettePresetId,
} from "./component-stage";

export interface GalleryCardItem {
  spec: RasterComponentSpec;
  sourceCode: string;
  sizeKb: string;
}

export function GalleryClient({ items }: { items: GalleryCardItem[] }) {
  const [category, setCategory] = useState<RasterCategoryId>("all");
  const [query, setQuery] = useState("");
  const [palette, setPalette] = useState<PalettePresetId>("terracotta");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(({ spec }) => {
      if (category !== "all" && spec.category !== category) return false;
      if (q) {
        const hay = `${spec.name} ${spec.tagline} ${spec.technique} ${spec.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, category, query]);

  async function handleCopySource(slug: string, source: string) {
    try {
      await navigator.clipboard.writeText(source);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((cur) => (cur === slug ? null : cur)), 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  }

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 space-y-8">
      {/* Filter + Palette Toolbar */}
      <div className="flex flex-col gap-4 border-b border-hairline pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {RASTER_CATEGORIES.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`h-8 rounded-full border px-3.5 text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? "border-ink bg-ink text-canvas"
                    : "border-hairline bg-card text-ink-muted hover:border-hairline-strong hover:text-ink"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter components..."
              aria-label="Filter Raster UI components"
              className="h-8 w-48 rounded-full border border-hairline bg-card pl-8 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-hairline-strong focus:outline-none"
            />
          </div>

          <div className="inline-flex items-center rounded-full border border-hairline bg-card p-0.5 text-[11px]">
            {(Object.keys(PALETTE_PRESETS) as PalettePresetId[]).map((pid) => {
              const active = palette === pid;
              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => setPalette(pid)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium cursor-pointer transition-colors ${
                    active ? "bg-subtle text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: PALETTE_PRESETS[pid].accentHex }}
                    aria-hidden="true"
                  />
                  <span className="capitalize">{pid}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Interactive Component Grid */}
      {filtered.length === 0 ? (
        <div className="raster-card rounded-2xl p-10 text-center text-sm text-ink-muted">
          No components matched that filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map(({ spec, sourceCode, sizeKb }) => {
            const isCopied = copiedSlug === spec.slug;
            return (
              <article
                key={spec.slug}
                className="raster-card group flex flex-col justify-between rounded-2xl p-4 transition-colors hover:border-hairline-strong"
              >
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-hairline">
                    <ComponentStage slug={spec.slug} palette={palette} compact />
                  </div>

                  <div className="space-y-1.5 px-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/components/${spec.slug}`}
                        className="text-base font-semibold tracking-tight text-ink hover:text-accent transition-colors"
                      >
                        {spec.name}
                      </Link>
                      <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-muted">
                        <span className="rounded-full border border-hairline px-2 py-0.5">
                          {sizeKb} KB
                        </span>
                        <span className="rounded-full border border-hairline px-2 py-0.5">
                          0 deps
                        </span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-ink-muted">{spec.tagline}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-hairline pt-3 px-1">
                  <span className="font-mono text-[11px] text-ink-muted">{spec.technique}</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopySource(spec.slug, sourceCode)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-hairline bg-subtle/60 px-3 text-xs font-medium text-ink hover:border-hairline-strong cursor-pointer transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                          <span>Copied TSX</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                          <span>Copy TSX</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/components/${spec.slug}`}
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-ink px-3 text-xs font-semibold text-canvas hover:opacity-90 transition-opacity"
                    >
                      <span>Playground</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
