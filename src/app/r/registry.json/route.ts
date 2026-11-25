import { NextResponse } from "next/server";
import { buildRegistryIndex } from "@/registry/source-loader";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  return NextResponse.json(buildRegistryIndex(baseUrl), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
