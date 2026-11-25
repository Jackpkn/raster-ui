import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeSwitchButton } from "@/components/showcase/theme-switch";
import { MagneticWaveWordmark } from "@/registry/components/magnetic-wave-wordmark";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Raster UI | Zero-Dependency Animated Dither, Isometric & Procedural Components",
    template: "%s | Raster UI",
  },
  description:
    "Copy-pasteable, zero-dependency React + Tailwind procedural canvas and CSS animations: 1-bit Bayer dithering, isometric pixel scenes, CRT scanline typography, 3D Fibonacci globes, and shadcn CLI registry.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${jakarta.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/85 backdrop-blur-md">
          <div className="mx-auto flex h-15 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-sm font-bold tracking-tight text-ink"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-ink text-canvas font-mono text-xs font-bold">
                R
              </span>
              <span>Raster UI</span>
              <span className="hidden sm:inline rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] font-medium text-ink-muted">
                0 deps
              </span>
            </Link>

            <nav className="flex items-center gap-1.5 text-xs">
              <Link
                href="/#catalog"
                className="rounded-lg px-3 py-1.5 font-medium text-ink-muted hover:text-ink transition-colors"
              >
                Components
              </Link>
              <Link
                href="/r/registry.json"
                target="_blank"
                className="rounded-lg px-3 py-1.5 font-mono text-ink-muted hover:text-ink transition-colors"
              >
                /r/registry.json
              </Link>
              <ThemeSwitchButton />
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-20 border-t border-hairline bg-canvas px-5 pt-10 pb-6 sm:px-8">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
              <span>Raster UI · Pure HTML5 Canvas2D &amp; CSS procedural components for React &amp; Next.js</span>
              <span className="font-mono">MIT · Copy-paste or npx shadcn add</span>
            </div>
            <MagneticWaveWordmark text="raster" scanlines liftPx={16} />
          </div>
        </footer>
      </body>
    </html>
  );
}
