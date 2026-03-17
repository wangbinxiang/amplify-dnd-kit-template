# Amplify Project Memory

## What this app is
- A minimal Next.js App Router project for schema-driven marketing pages.
- Page data lives in repository JSON files under `src/content/pages/`.
- The same renderer powers both runtime pages and the editor canvas.

## Core flow
1. `src/lib/page-content.ts` lists, loads, validates, and saves page JSON files.
2. `src/lib/page-schema.ts` defines the allowed page and section shapes with `zod`.
3. `src/components/page-renderer.tsx` maps section `type` values to presentational components.
4. `app/[slug]/page.tsx` loads a schema file and renders it with the shared renderer.
5. `app/editor/[slug]/page.tsx` loads the same schema and mounts the client editor.
6. `app/api/page-schemas/[slug]/route.ts` validates a full draft and writes it back to disk.

## Supported section types
- `hero`
- `richText`
- `features`
- `imageText`
- `cta`
- `footer`

## Editor boundaries
- Drag-and-drop only reorders top-level sections.
- Inspector edits only mutate the selected section’s content.
- Save sends the full `PageSchema` back to the API.
- No section creation or deletion yet.
- No nested drag-and-drop.
- No database or component-tree persistence.

## Important extension points
- Add new section types in `src/lib/page-schema.ts`.
- Add matching presentational components in `src/components/sections/index.tsx`.
- Extend inspector handling in `src/components/editor/section-inspector.tsx`.
- The renderer does not need to change unless a new section type is added.

## Runtime assumptions
- File writes require a Node runtime and a writable working tree.
- This is suitable for local development or a controlled server, not generic serverless persistence.

## Current verification baseline
- `pnpm test`
- `pnpm build`
