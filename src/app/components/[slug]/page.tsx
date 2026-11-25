import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaygroundClient } from "@/components/showcase/playground-client";
import { RASTER_COMPONENTS, getComponentSpecBySlug } from "@/registry/catalog";
import { getComponentByteSize, readComponentSource } from "@/registry/source-loader";

export function generateStaticParams() {
  return RASTER_COMPONENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = getComponentSpecBySlug(slug);
  if (!spec) return { title: "Component Not Found" };
  return {
    title: `${spec.name} | Interactive Playground & TSX Source`,
    description: spec.description,
  };
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = getComponentSpecBySlug(slug);
  if (!spec) notFound();

  const sourceCode = readComponentSource(spec);
  const sizeKb = (getComponentByteSize(spec) / 1024).toFixed(1);

  return (
    <PlaygroundClient
      spec={spec}
      sourceCode={sourceCode}
      sizeKb={sizeKb}
      allSpecs={RASTER_COMPONENTS}
    />
  );
}
