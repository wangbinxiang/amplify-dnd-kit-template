import { describe, expect, it } from "vitest";

import {
  getElementDragId,
  getSectionDragId,
  reorderByDragIds,
  reorderElements,
  reorderSections,
  replaceElement,
} from "@/lib/editor-state";
import type { PageSection } from "@/lib/page-schema";

const sections: PageSection[] = [
  {
    id: "hero-1",
    type: "hero",
    elements: [
      {
        id: "hero-heading-1",
        type: "heading",
        props: { text: "Hero" },
      },
      {
        id: "hero-copy-1",
        type: "copy",
        props: { text: "Body" },
      },
      {
        id: "hero-button-1",
        type: "button",
        props: { label: "Start", href: "/start" },
      },
    ],
  },
  {
    id: "rich-1",
    type: "richText",
    elements: [
      {
        id: "rich-paragraph-1",
        type: "paragraph",
        props: { text: "Body" },
      },
    ],
  },
  {
    id: "footer-1",
    type: "footer",
    elements: [
      {
        id: "footer-copy-1",
        type: "copyright",
        props: { text: "2026" },
      },
    ],
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

describe("reorderElements", () => {
  it("moves the dragged element inside the target section", () => {
    const nextSections = reorderElements(
      sections,
      "hero-1",
      "hero-copy-1",
      "hero-heading-1",
    );

    expect(nextSections[0]?.elements.map((element) => element.id)).toEqual([
      "hero-copy-1",
      "hero-heading-1",
      "hero-button-1",
    ]);
  });
});

describe("reorderByDragIds", () => {
  it("reorders sections from prefixed drag ids", () => {
    const nextSections = reorderByDragIds(
      sections,
      getSectionDragId("hero-1"),
      getSectionDragId("footer-1"),
    );

    expect(nextSections.map((section) => section.id)).toEqual([
      "rich-1",
      "footer-1",
      "hero-1",
    ]);
  });

  it("reorders elements within one section from prefixed drag ids", () => {
    const nextSections = reorderByDragIds(
      sections,
      getElementDragId("hero-1", "hero-copy-1"),
      getElementDragId("hero-1", "hero-heading-1"),
    );

    expect(nextSections[0]?.elements.map((element) => element.id)).toEqual([
      "hero-copy-1",
      "hero-heading-1",
      "hero-button-1",
    ]);
  });

  it("ignores element drops across different sections", () => {
    const nextSections = reorderByDragIds(
      sections,
      getElementDragId("hero-1", "hero-copy-1"),
      getElementDragId("rich-1", "rich-paragraph-1"),
    );

    expect(nextSections).toEqual(sections);
  });
});

describe("replaceElement", () => {
  it("replaces one element without changing sibling order", () => {
    const nextSections = replaceElement(sections, "hero-1", {
      id: "hero-button-1",
      type: "button",
      props: { label: "Save", href: "/save" },
    });

    expect(nextSections[0]?.elements[2]).toEqual({
      id: "hero-button-1",
      type: "button",
      props: { label: "Save", href: "/save" },
    });
    expect(nextSections[0]?.elements.map((element) => element.id)).toEqual([
      "hero-heading-1",
      "hero-copy-1",
      "hero-button-1",
    ]);
  });
});
