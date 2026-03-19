import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { createPageRepository } from "@/lib/page-content";
import { parsePageSchema, type PageSchema } from "@/lib/page-schema";

const validPage = {
  slug: "home",
  title: "Home",
  sections: [
    {
      id: "hero-1",
      type: "hero",
      elements: [
        {
          id: "hero-heading-1",
          type: "heading",
          props: { text: "Build pages from schema" },
        },
        {
          id: "hero-copy-1",
          type: "copy",
          props: { text: "Edit content without storing JSX." },
        },
        {
          id: "hero-button-1",
          type: "button",
          props: { label: "Start editing", href: "/editor/home" },
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
          props: { text: "2026 Amplify" },
        },
        {
          id: "footer-link-1",
          type: "link",
          props: { label: "Docs", href: "/docs" },
        },
      ],
    },
  ],
} as const;

describe("parsePageSchema", () => {
  it("accepts a valid schema with nested section elements", () => {
    expect(parsePageSchema(validPage)).toEqual(validPage);
  });

  it("rejects elements that do not belong to the section type", () => {
    const invalidPage = {
      ...validPage,
      sections: [
        {
          id: "hero-1",
          type: "hero",
          elements: [
            {
              id: "hero-link-1",
              type: "link",
              props: { label: "Docs", href: "/docs" },
            },
          ],
        },
      ],
    };

    expect(() => parsePageSchema(invalidPage)).toThrow(/Invalid input/);
  });

  it("rejects the old fixed-field section format", () => {
    const legacyPage = {
      slug: "home",
      title: "Home",
      sections: [
        {
          id: "hero-1",
          type: "hero",
          headline: "Build pages from schema",
          subheadline: "Edit content without storing JSX.",
          primaryCtaLabel: "Start editing",
          primaryCtaHref: "/editor/home",
        },
      ],
    };

    expect(() => parsePageSchema(legacyPage)).toThrow(/Invalid input/);
  });

  it("rejects section and element ids with reserved characters", () => {
    const invalidPage = {
      ...validPage,
      sections: [
        {
          id: "hero:1",
          type: "hero",
          elements: [
            {
              id: "hero-heading:1",
              type: "heading",
              props: { text: "Build pages from schema" },
            },
          ],
        },
      ],
    };

    expect(() => parsePageSchema(invalidPage)).toThrow(/Ids may only contain/);
  });
});

describe("createPageRepository", () => {
  it("lists, loads, and saves schemas as formatted json files", async () => {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), "amplify-pages-"));
    const repository = createPageRepository(path.join(tempRoot, "src/content/pages"));

    try {
      await repository.savePageSchema("home", validPage as PageSchema);

      const summaries = await repository.listPageSchemas();
      const loaded = await repository.loadPageSchema("home");

      expect(summaries).toEqual([{ slug: "home", title: "Home" }]);
      expect(loaded).toEqual(validPage);
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  it("rejects path traversal outside the pages directory", async () => {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), "amplify-pages-"));
    const repository = createPageRepository(path.join(tempRoot, "src/content/pages"));

    try {
      await expect(repository.loadPageSchema("../secrets")).rejects.toThrow(
        /Invalid slug/,
      );
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });
});
