import { describe, expect, it } from "vitest";
import { RASTER_CATEGORIES, RASTER_COMPONENTS } from "../src/registry/catalog";
import {
  buildRegistryIndex,
  buildShadcnRegistryItem,
  getComponentByteSize,
  readComponentSource,
} from "../src/registry/source-loader";

describe("Raster UI Component Registry", () => {
  it("exposes 100 unique components spanning all 16 visual families", () => {
    expect(RASTER_COMPONENTS).toHaveLength(100);
    const slugs = new Set(RASTER_COMPONENTS.map((c) => c.slug));
    expect(slugs.size).toBe(100);

    const visualFamilies = RASTER_CATEGORIES.filter((c) => c.id !== "all");
    expect(visualFamilies).toHaveLength(16);

    const categoriesUsed = new Set<string>(RASTER_COMPONENTS.map((c) => c.category));
    for (const cat of visualFamilies) {
      expect(categoriesUsed.has(cat.id)).toBe(true);
    }
  });

  it("reads every standalone TSX source file cleanly with zero external runtime dependencies", () => {
    for (const spec of RASTER_COMPONENTS) {
      const source = readComponentSource(spec);
      const bytes = getComponentByteSize(spec);

      expect(source).toContain(`export function ${spec.exportName}`);
      expect(bytes).toBeGreaterThan(500);
      expect(bytes).toBeLessThan(12000);
      expect(spec.dependencies).toEqual([]);
      // Ensure zero third-party animation/WebGL imports inside copy-pasteable components
      expect(source).not.toMatch(/from\s+["'](three|motion|framer-motion|gsap|@paper-design)/);
      // Ensure zero em-dashes in published component files
      expect(source).not.toContain("—");
    }
  });

  it("generates valid shadcn registry JSON items for both slug and slug.json", () => {
    const itemA = buildShadcnRegistryItem("bayer-dither-wave");
    const itemB = buildShadcnRegistryItem("bayer-dither-wave.json");

    expect(itemA).not.toBeNull();
    expect(itemA?.name).toBe("bayer-dither-wave");
    expect(itemA?.type).toBe("registry:ui");
    expect(itemA?.files).toHaveLength(1);
    expect(itemA?.files[0]?.path).toBe("components/raster/bayer-dither-wave.tsx");
    expect(itemA?.files[0]?.content).toContain("export function BayerDitherWave");
    expect(itemB?.name).toBe(itemA?.name);

    expect(buildShadcnRegistryItem("does-not-exist")).toBeNull();
  });

  it("builds a complete registry index JSON payload", () => {
    const index = buildRegistryIndex("https://raster.example");
    expect(index.name).toBe("raster-ui");
    expect(index.items).toHaveLength(100);
    expect(index.items[0]?.registryUrl).toBe("https://raster.example/r/bayer-dither-wave.json");
  });
});
