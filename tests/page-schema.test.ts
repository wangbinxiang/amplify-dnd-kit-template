import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { createPageRepository } from "@/lib/page-content";
import { parsePageSchema, type PageSchema } from "@/lib/page-schema";

const validPage: PageSchema = {
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
    {
      id: "footer-1",
      type: "footer",
      copyright: "2026 Amplify",
      links: [{ label: "Docs", href: "/docs" }],
    },
  ],
};

describe("parsePageSchema", () => {
  it("accepts a valid schema with supported section types", () => {
    expect(parsePageSchema(validPage)).toEqual(validPage);
  });

  it("rejects unknown section types", () => {
    const invalidPage = {
      ...validPage,
      sections: [{ id: "x", type: "unknown", title: "Nope" }],
    };

    expect(() => parsePageSchema(invalidPage)).toThrow(/Invalid input/);
  });
});

describe("createPageRepository", () => {
  it("lists, loads, and saves schemas as formatted json files", async () => {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), "amplify-pages-"));
    const repository = createPageRepository(path.join(tempRoot, "src/content/pages"));

    try {
      await repository.savePageSchema("home", validPage);

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
