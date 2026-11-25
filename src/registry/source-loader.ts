import fs from "node:fs";
import path from "node:path";
import { RASTER_COMPONENTS, getComponentSpecBySlug, type RasterComponentSpec } from "./catalog";

const COMPONENTS_DIR = path.join(process.cwd(), "src", "registry", "components");

export interface ShadcnRegistryItem {
  $schema: string;
  name: string;
  type: "registry:ui";
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{
    path: string;
    type: "registry:ui";
    target: string;
    content: string;
  }>;
}

export function readComponentSource(spec: RasterComponentSpec): string {
  const fullPath = path.join(COMPONENTS_DIR, spec.fileName);
  return fs.readFileSync(fullPath, "utf8");
}

export function getComponentByteSize(spec: RasterComponentSpec): number {
  return Buffer.byteLength(readComponentSource(spec), "utf8");
}

export function buildShadcnRegistryItem(slug: string): ShadcnRegistryItem | null {
  const cleanSlug = slug.replace(/\.json$/i, "");
  const spec = getComponentSpecBySlug(cleanSlug);
  if (!spec) return null;

  const content = readComponentSource(spec);

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: spec.slug,
    type: "registry:ui",
    title: spec.name,
    description: spec.description,
    dependencies: spec.dependencies,
    registryDependencies: [],
    files: [
      {
        path: `components/raster/${spec.fileName}`,
        type: "registry:ui",
        target: `components/raster/${spec.fileName}`,
        content,
      },
    ],
  };
}

export function buildRegistryIndex(baseUrl: string) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "raster-ui",
    homepage: baseUrl,
    items: RASTER_COMPONENTS.map((c) => ({
      name: c.slug,
      type: "registry:ui",
      title: c.name,
      category: c.category,
      description: c.tagline,
      dependencies: c.dependencies,
      sizeBytes: getComponentByteSize(c),
      registryUrl: `${baseUrl}/r/${c.slug}.json`,
    })),
  };
}
