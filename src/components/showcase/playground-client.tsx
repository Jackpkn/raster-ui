"use client";

import { ArrowLeft, Check, Copy, Pause, Play, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { RasterComponentSpec } from "@/registry/catalog";
import {
  ComponentStage,
  PALETTE_PRESETS,
  type PalettePresetId,
} from "./component-stage";

export function PlaygroundClient({
  spec,
  sourceCode,
  sizeKb,
  allSpecs,
}: {
  spec: RasterComponentSpec;
  sourceCode: string;
  sizeKb: string;
  allSpecs: RasterComponentSpec[];
}) {
  const [palette, setPalette] = useState<PalettePresetId>("terracotta");
  const [speed, setSpeed] = useState(1);
  const [pixelSize, setPixelSize] = useState(3);
  const [paused, setPaused] = useState(false);
  const [customText, setCustomText] = useState(
    spec.slug === "magnetic-wave-wordmark"
      ? "raster"
      : spec.slug === "terminal-scramble-text"
        ? "ZERO-DEPENDENCY MOTION"
        : spec.slug === "shimmer-command-pill"
          ? "Open Command Palette"
          : spec.slug === "split-flap-counter"
            ? "LIVE VERIFIED ROLES INDEXED"
            : spec.slug === "microchip-pinout-core"
              ? "R-01"
              : spec.slug === "magnetic-shutter-button"
                ? "Deploy Circuit"
                : spec.slug === "data-beam-hub"
                  ? "CORE"
                  : spec.slug === "agent-reasoning-orbit"
                    ? "AGENT"
                    : spec.slug === "token-stream-composer"
                      ? "raster-reason-v2"
                      : "Ship your craft. We run it."
  );
  const [meshVariant, setMeshVariant] = useState<"obsidian" | "alabaster">("obsidian");
  const [codeTab, setCodeTab] = useState<"usage" | "source" | "cli">("usage");
  const [copied, setCopied] = useState<string | null>(null);

  const cliCommand = `npx shadcn@latest add http://localhost:3001/r/${spec.slug}.json`;

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied((cur) => (cur === id ? null : cur)), 1800);
    } catch {
      // Ignore clipboard failures
    }
  }

  const isTypography =
    spec.category === "typography" ||
    spec.slug === "shimmer-command-pill" ||
    spec.slug === "microchip-pinout-core" ||
    spec.slug === "magnetic-shutter-button" ||
    spec.slug === "data-beam-hub" ||
    spec.slug === "agent-reasoning-orbit" ||
    spec.slug === "token-stream-composer";
  const isMesh = spec.slug === "editorial-mesh-gradient";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
        <div className="space-y-1.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to all components</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-serif text-4xl font-normal tracking-tight text-ink sm:text-5xl">
              {spec.name}
            </h1>
            <span className="rounded-full border border-hairline bg-card px-2.5 py-0.5 font-mono text-xs text-ink-muted">
              {sizeKb} KB · 0 deps
            </span>
          </div>
          <p className="max-w-2xl text-sm text-ink-muted">{spec.description}</p>
        </div>

        <button
          type="button"
          onClick={() => copyText("top-source", sourceCode)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-ink px-4 text-xs font-semibold text-canvas hover:opacity-90 cursor-pointer transition-opacity"
        >
          {copied === "top-source" ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copied {spec.fileName}</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copy single-file TSX</span>
            </>
          )}
        </button>
      </div>

      {/* Live Preview Stage + Prop Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="raster-card rounded-2xl p-4 lg:col-span-8">
          <ComponentStage
            slug={spec.slug}
            palette={palette}
            speed={speed}
            pixelSize={pixelSize}
            paused={paused}
            customText={customText}
            meshVariant={meshVariant}
          />
        </div>

        <aside className="raster-card rounded-2xl p-5 lg:col-span-4 space-y-5">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Live Controls
            </span>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex h-7 items-center gap-1.5 rounded-full border border-hairline bg-subtle px-3 text-[11px] font-medium text-ink cursor-pointer"
            >
              {paused ? (
                <>
                  <Play className="h-3 w-3" aria-hidden="true" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3" aria-hidden="true" />
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>

          {!isMesh && (
            <div className="space-y-2">
              <span className="block text-xs font-medium text-ink">Color Palette</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(PALETTE_PRESETS) as PalettePresetId[]).map((pid) => {
                  const active = palette === pid;
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => setPalette(pid)}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs cursor-pointer transition-colors ${
                        active
                          ? "border-ink bg-subtle text-ink font-semibold"
                          : "border-hairline text-ink-muted hover:text-ink"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PALETTE_PRESETS[pid].accentHex }}
                        aria-hidden="true"
                      />
                      <span className="capitalize">{pid}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isMesh && (
            <div className="space-y-2">
              <span className="block text-xs font-medium text-ink">Surface Mode</span>
              <div className="grid grid-cols-2 gap-2">
                {(["obsidian", "alabaster"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setMeshVariant(v)}
                    className={`rounded-lg border px-3 py-2 text-xs capitalize cursor-pointer ${
                      meshVariant === v
                        ? "border-ink bg-subtle text-ink font-semibold"
                        : "border-hairline text-ink-muted"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTypography && (
            <div className="space-y-2">
              <label htmlFor="custom-text-input" className="block text-xs font-medium text-ink">
                Display Text
              </label>
              <input
                id="custom-text-input"
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="h-9 w-full rounded-lg border border-hairline bg-canvas px-3 text-xs text-ink focus:border-hairline-strong focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label htmlFor="speed-slider" className="font-medium text-ink">
                Animation Speed
              </label>
              <span className="font-mono text-ink-muted">{speed.toFixed(1)}x</span>
            </div>
            <input
              id="speed-slider"
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>

          {(spec.slug === "bayer-dither-wave" ||
            spec.slug === "bayer-dither-aurora" ||
            spec.slug === "halftone-spotlight" ||
            spec.slug === "crt-scanline-text" ||
            spec.slug === "ascii-wave-field" ||
            spec.slug === "pixel-matrix-stream" ||
            spec.slug === "pixel-sunburst-dither" ||
            spec.slug === "pixel-dissolve-loader" ||
            spec.slug === "motherboard-bus-matrix" ||
            spec.slug === "fiber-optic-stream" ||
            spec.slug === "hexagon-signal-hive" ||
            spec.slug === "gravity-ripple-grid" ||
            spec.slug === "magnetic-field-lines" ||
            spec.slug === "voronoi-pulse-grid") && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label htmlFor="pixel-slider" className="font-medium text-ink">
                  Raster Pixel Scale
                </label>
                <span className="font-mono text-ink-muted">{pixelSize}px</span>
              </div>
              <input
                id="pixel-slider"
                type="range"
                min="2"
                max="6"
                step="1"
                value={pixelSize}
                onChange={(e) => setPixelSize(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          )}

          <div className="border-t border-hairline pt-4 space-y-2 text-xs text-ink-muted">
            <div className="flex justify-between">
              <span>Technique</span>
              <span className="font-mono text-ink">{spec.technique}</span>
            </div>
            <div className="flex justify-between">
              <span>External deps</span>
              <span className="font-mono text-emerald-400">None (0 packages)</span>
            </div>
            <div className="flex justify-between">
              <span>Registry JSON</span>
              <Link
                href={`/r/${spec.slug}.json`}
                target="_blank"
                className="font-mono text-ink underline underline-offset-2"
              >
                /r/{spec.slug}.json
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Code, Usage & CLI Install Tabs */}
      <section className="raster-card rounded-2xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-subtle/40 px-4 py-2.5">
          <div className="inline-flex gap-1 text-xs">
            {(
              [
                ["usage", "Usage"],
                ["source", `Full Source (${spec.fileName})`],
                ["cli", "CLI Install (shadcn)"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setCodeTab(id)}
                className={`rounded-lg px-3 py-1.5 font-medium cursor-pointer transition-colors ${
                  codeTab === id ? "bg-ink text-canvas" : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              copyText(
                codeTab,
                codeTab === "usage"
                  ? spec.usageSnippet
                  : codeTab === "source"
                    ? sourceCode
                    : cliCommand
              )
            }
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-hairline bg-card px-3 text-xs font-medium text-ink hover:border-hairline-strong cursor-pointer"
          >
            {copied === codeTab ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="p-5 overflow-x-auto bg-[#07070a] text-[#e8e3dc]">
          {codeTab === "cli" ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-2 font-mono text-sm">
                <Terminal className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                <code>{cliCommand}</code>
              </div>
              <p className="text-[#9c978f] leading-relaxed">
                Replace <code className="font-mono text-[#f8f5f0]">http://localhost:3001</code> with
                your deployed Vercel domain once published so any developer can install{" "}
                <code className="font-mono text-[#f8f5f0]">{spec.exportName}</code> in one command
                with zero third-party dependencies.
              </p>
            </div>
          ) : (
            <pre className="font-mono text-xs leading-relaxed">
              <code>{codeTab === "usage" ? spec.usageSnippet : sourceCode}</code>
            </pre>
          )}
        </div>
      </section>

      {/* Quick Jump Strip Across All 10 Components */}
      <nav aria-label="Browse all Raster UI components" className="space-y-3 pt-2">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
          Explore all {allSpecs.length} components
        </span>
        <div className="flex flex-wrap gap-2">
          {allSpecs.map((item) => (
            <Link
              key={item.slug}
              href={`/components/${item.slug}`}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                item.slug === spec.slug
                  ? "border-ink bg-ink text-canvas font-semibold"
                  : "border-hairline bg-card text-ink-muted hover:border-hairline-strong hover:text-ink"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
