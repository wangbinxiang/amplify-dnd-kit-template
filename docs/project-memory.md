# Amplify Project Memory

## What this app is
- A minimal Next.js App Router project for schema-driven marketing pages.
- Page data lives in repository JSON files under `src/content/pages/`.
- The same renderer powers both runtime pages and the editor canvas.
- Sections now persist ordered `elements[]` arrays instead of fixed field payloads.

## Core flow
1. `src/lib/page-content.ts` lists, loads, validates, and saves page JSON files.
2. `src/lib/page-schema.ts` defines the allowed page, section, and section-scoped element shapes with `zod`.
3. `src/components/page-renderer.tsx` maps section `type` values to presentational components and renders section elements in stored order.
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
- Drag-and-drop reorders both top-level sections and section-internal elements.
- Element dragging is constrained to the current section; cross-section element moves are ignored.
- Inspector edits only mutate the selected element’s content.
- Save sends the full `PageSchema` back to the API.
- No section creation or deletion yet.
- No arbitrary nested element trees or freeform cross-section composition.
- No database or component-tree persistence.

## Important extension points
- Add new section types in `src/lib/page-schema.ts`.
- Add matching presentational components in `src/components/sections/index.tsx`.
- Extend element editing in `src/components/editor/section-inspector.tsx`.
- Extend section and element drag plumbing in `src/lib/editor-state.ts` and `src/components/editor/editor-shell.tsx`.
- The renderer does not need to change unless a new section type or element rendering rule is added.

## Runtime assumptions
- File writes require a Node runtime and a writable working tree.
- This is suitable for local development or a controlled server, not generic serverless persistence.
- Dynamic page routes only accept filesystem-safe slugs; invalid slugs and missing schema files must resolve as 404s instead of surfacing repository errors.
- Browser tab icon is served from `public/favicon.ico`, so favicon requests should never fall through to the dynamic `[slug]` route.

## Current verification baseline
- `pnpm test`
- `pnpm build`
