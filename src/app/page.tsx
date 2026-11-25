import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GalleryClient, type GalleryCardItem } from "@/components/showcase/gallery-client";
import { RASTER_COMPONENTS } from "@/registry/catalog";
import { BayerDitherWave } from "@/registry/components/bayer-dither-wave";
import { CrtScanlineText } from "@/registry/components/crt-scanline-text";
import { DitherLatencyMeter } from "@/registry/components/dither-latency-meter";
import { IsolatedLanesGrid } from "@/registry/components/isolated-lanes-grid";
import { IsometricFloatingCube } from "@/registry/components/isometric-floating-cube";
import { getComponentByteSize, readComponentSource } from "@/registry/source-loader";

export default function HomePage() {
  const galleryItems: GalleryCardItem[] = RASTER_COMPONENTS.map((spec) => {
    const sourceCode = readComponentSource(spec);
    const sizeKb = (getComponentByteSize(spec) / 1024).toFixed(1);
    return { spec, sourceCode, sizeKb };
  });

  return (
    <div>
      {/* Clean Hero with Subtle Bayer Dither Wave */}
      <section className="relative overflow-hidden border-b border-hairline px-5 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-75">
          <BayerDitherWave
            baseRgb={[238, 234, 228]}
            accentRgb={[242, 124, 99]}
            pixelSize={3}
            intensity={0.58}
            fadeLeft
            className="h-full w-full"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card/80 px-3 py-1 font-mono text-xs text-ink-muted backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <span>{RASTER_COMPONENTS.length} copy-paste procedural visuals · 0 external dependencies</span>
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-ink sm:text-6xl leading-[1.03]">
            Hardware-grade animations for super-clean interfaces.
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Ordered 1-bit Bayer dithering, ASCII wave shaders, isometric micro-scenes, phosphor
            waveforms, marching-squares contours, orbital beams, and CRT typography built with pure
            React, Canvas2D, and CSS.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#catalog"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-ink px-5 text-xs font-semibold text-canvas hover:opacity-90 transition-opacity"
            >
              <span>Browse {RASTER_COMPONENTS.length} Components</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <Link
              href="/components/bayer-dither-wave"
              className="inline-flex h-10 items-center rounded-xl border border-hairline-strong bg-card/80 px-4 text-xs font-medium text-ink backdrop-blur-sm hover:bg-subtle transition-colors"
            >
              Open Live Playground
            </Link>
          </div>
        </div>
      </section>

      {/* Hairline 1-Bit Isometric Triptych Showcase */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-4 sm:px-8">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-hairline divide-y md:grid-cols-3 md:divide-x md:divide-y-0 divide-hairline bg-[#060608]">
          <Link href="/components/dither-latency-meter" className="group block p-5 space-y-4">
            <DitherLatencyMeter className="h-40 w-full rounded-xl" />
            <div className="space-y-1 border-t border-white/10 pt-3">
              <div className="text-sm font-semibold text-[#f8f5f0] group-hover:text-accent transition-colors">
                Dither Latency Meter
              </div>
              <p className="text-xs text-[#9c978f]">
                1-bit precision slider bar with Bayer shading and hardware ticks.
              </p>
            </div>
          </Link>

          <Link href="/components/isometric-floating-cube" className="group block p-5 space-y-4">
            <IsometricFloatingCube className="h-40 w-full rounded-xl" />
            <div className="space-y-1 border-t border-white/10 pt-3">
              <div className="text-sm font-semibold text-[#f8f5f0] group-hover:text-accent transition-colors">
                Isometric Floating Cube
              </div>
              <p className="text-xs text-[#9c978f]">
                Hovering 1-bit isometric voxel over a platform slab &amp; crescent moon.
              </p>
            </div>
          </Link>

          <Link href="/components/isolated-lanes-grid" className="group block p-5 space-y-4">
            <IsolatedLanesGrid className="h-40 w-full rounded-xl" />
            <div className="space-y-1 border-t border-white/10 pt-3">
              <div className="text-sm font-semibold text-[#f8f5f0] group-hover:text-accent transition-colors">
                Isolated Lanes Grid
              </div>
              <p className="text-xs text-[#9c978f]">
                Three isometric workloads splitting into isolated vertical sandboxes.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Interactive Filterable 10-Component Gallery */}
      <GalleryClient items={galleryItems} />

      {/* Full-Width Scanline Statement Strip */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="rounded-2xl border border-hairline bg-[#060609] px-6 py-12 text-center">
          <CrtScanlineText
            text="Copy one file. Zero bundle bloat."
            className="text-3xl sm:text-5xl md:text-6xl"
          />
        </div>
      </section>
    </div>
  );
}
