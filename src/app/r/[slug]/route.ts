import { NextResponse } from "next/server";
import { buildShadcnRegistryItem } from "@/registry/source-loader";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const item = buildShadcnRegistryItem(slug);

  if (!item) {
    return NextResponse.json(
      { error: `Component "${slug}" not found in Raster UI registry.` },
      { status: 404 }
    );
  }

  return NextResponse.json(item, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
