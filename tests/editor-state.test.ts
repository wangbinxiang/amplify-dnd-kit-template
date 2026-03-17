import { describe, expect, it } from "vitest";

import { reorderSections } from "@/lib/editor-state";
import type { PageSection } from "@/lib/page-schema";

const sections: PageSection[] = [
  {
    id: "hero-1",
    type: "hero",
    headline: "Hero",
  },
  {
    id: "rich-1",
    type: "richText",
    body: "Body",
  },
  {
    id: "footer-1",
    type: "footer",
    copyright: "2026",
    links: [],
  },
];

describe("reorderSections", () => {
  it("moves the dragged section to the dropped position", () => {
    const nextSections = reorderSections(sections, "hero-1", "footer-1");

    expect(nextSections.map((section) => section.id)).toEqual([
      "rich-1",
      "footer-1",
      "hero-1",
    ]);
  });
});
