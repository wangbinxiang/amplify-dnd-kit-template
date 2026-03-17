import { NextResponse } from "next/server";

import { savePageSchema } from "@/lib/page-content";
import { parsePageSchema } from "@/lib/page-schema";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const json = await request.json();
    // Validate before touching the filesystem so malformed drafts never hit the repo.
    const parsedSchema = parsePageSchema(json);
    const savedPage = await savePageSchema(slug, parsedSchema);

    return NextResponse.json({
      page: savedPage,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save schema.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
