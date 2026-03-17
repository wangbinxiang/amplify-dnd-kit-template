import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  pageSummarySchema,
  parsePageSchema,
  type PageSchema,
  type PageSummary,
} from "@/lib/page-schema";

const DEFAULT_PAGES_DIR = path.join(process.cwd(), "src/content/pages");

function assertSlug(slug: string) {
  // Slugs map directly to filenames, so keep them filesystem-safe and predictable.
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    throw new Error("Invalid slug.");
  }
}

function isInsideDirectory(targetPath: string, directory: string) {
  const normalizedDirectory = path.resolve(directory);
  const normalizedTarget = path.resolve(targetPath);

  return (
    normalizedTarget === normalizedDirectory ||
    normalizedTarget.startsWith(`${normalizedDirectory}${path.sep}`)
  );
}

export function createPageRepository(pagesDirectory = DEFAULT_PAGES_DIR) {
  const resolvedPagesDirectory = path.resolve(pagesDirectory);

  async function ensurePagesDirectory() {
    await mkdir(resolvedPagesDirectory, { recursive: true });
  }

  function resolvePagePath(slug: string) {
    assertSlug(slug);

    // The extra containment check keeps save/load limited to schema files only.
    const candidatePath = path.resolve(resolvedPagesDirectory, `${slug}.json`);

    if (!isInsideDirectory(candidatePath, resolvedPagesDirectory)) {
      throw new Error("Invalid slug.");
    }

    return candidatePath;
  }

  return {
    async listPageSchemas(): Promise<PageSummary[]> {
      await ensurePagesDirectory();

      const entries = await readdir(resolvedPagesDirectory, {
        withFileTypes: true,
      });

      const summaries: PageSummary[] = [];

      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith(".json")) {
          continue;
        }

        // Reuse the same loader so summaries only come from valid page schemas.
        const slug = entry.name.replace(/\.json$/, "");
        const schema = await this.loadPageSchema(slug);

        summaries.push(pageSummarySchema.parse({ slug: schema.slug, title: schema.title }));
      }

      return summaries.sort((left, right) => left.slug.localeCompare(right.slug));
    },

    async loadPageSchema(slug: string): Promise<PageSchema> {
      const filePath = resolvePagePath(slug);
      const fileContents = await readFile(filePath, "utf8");

      // Runtime and editor both trust the validated shape returned here.
      return parsePageSchema(JSON.parse(fileContents));
    },

    async savePageSchema(slug: string, schema: PageSchema): Promise<PageSchema> {
      const parsedSchema = parsePageSchema(schema);

      if (parsedSchema.slug !== slug) {
        throw new Error("Schema slug must match the route slug.");
      }

      const filePath = resolvePagePath(slug);

      await ensurePagesDirectory();
      // Pretty JSON keeps diffs readable when content changes are committed.
      await writeFile(filePath, `${JSON.stringify(parsedSchema, null, 2)}\n`, "utf8");

      return parsedSchema;
    },
  };
}

const repository = createPageRepository();

export async function listPageSchemas() {
  return repository.listPageSchemas();
}

export async function loadPageSchema(slug: string) {
  return repository.loadPageSchema(slug);
}

export async function savePageSchema(slug: string, schema: PageSchema) {
  return repository.savePageSchema(slug, schema);
}
