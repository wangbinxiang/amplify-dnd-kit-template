# Element DnD Design

**Date:** 2026-03-19
**Topic:** Element-level drag-and-drop inside schema-driven sections

## Goal
- Keep top-level section sorting.
- Add drag-and-drop for every editable element inside each supported section.
- Preserve repository-backed JSON storage without adding a database.

## Chosen Direction
- Keep `PageSchema.sections[]` as the top-level page structure.
- Refactor every section from fixed fields into an `elements[]` list.
- Give each element a stable `id`, a constrained `type`, and typed `props`.
- Make the editor select and edit elements, not whole-section field groups.
- Save the new schema shape directly to `src/content/pages/*.json` with no legacy compatibility layer.

## Why This Direction
- The current editor only reorders `page.sections[]`; inner content is still hard-coded by field name.
- A uniform `elements[]` model makes drag, selection, rendering, and saving all operate on the same shape.
- Keeping section boundaries avoids turning the MVP into a freeform canvas or nested builder.
- Avoiding dual old/new formats keeps the renderer and API simpler.

## Data Model
- `PageSchema` keeps `slug`, `title`, and `sections`.
- Every section keeps `id` and `type`, but replaces fixed content fields with `elements`.
- Each section type owns its own element union so invalid combinations are rejected by schema validation.

Example shape:

```json
{
  "id": "hero-home",
  "type": "hero",
  "elements": [
    {
      "id": "hero-heading-1",
      "type": "heading",
      "props": { "text": "Ship repository-backed landing pages" }
    },
    {
      "id": "hero-copy-1",
      "type": "copy",
      "props": { "text": "This page is rendered from JSON." }
    },
    {
      "id": "hero-button-1",
      "type": "button",
      "props": { "label": "Edit this page", "href": "/editor/home" }
    }
  ]
}
```

## Section-to-Element Mapping
- `hero`: `heading`, `copy`, `button`
- `richText`: `heading`, `paragraph`
- `features`: `heading`, `featureItem`
- `imageText`: `eyebrow`, `heading`, `copy`, `image`
- `cta`: `heading`, `copy`, `button`
- `footer`: `copyright`, `link`

## Editor Interaction
- The canvas still renders a list of sortable section cards.
- Each section card renders its own sortable list of elements.
- Dragging is limited to reordering within the current section for elements.
- Selection becomes two-part state: active section plus active element.
- The inspector renders fields for the selected element type and writes changes back to that element only.

## Renderer Changes
- Runtime rendering remains schema-driven.
- Section view components iterate `elements[]` in stored order.
- Rendering stays constrained by section type; the editor does not unlock arbitrary component placement.

## Save Behavior
- The editor still sends the entire page draft to `PUT /api/page-schemas/[slug]`.
- The API still validates the whole payload with `parsePageSchema` before writing to disk.
- The saved JSON becomes the new source of truth for both runtime pages and the editor.

## Migration
- Existing page JSON files under `src/content/pages/` are rewritten to the new structure.
- No compatibility layer is added for the old fixed-field format.
- Migration mapping is deterministic:
  - `hero.headline -> heading`
  - `hero.subheadline -> copy`
  - `hero.primaryCta* -> button`
  - `richText.title -> heading`
  - `richText.body lines -> paragraph[]`
  - `features.title -> heading`
  - `features.items[] -> featureItem[]`
  - `imageText.* -> eyebrow/heading/copy/image`
  - `cta.* -> heading/copy/button`
  - `footer.copyright -> copyright`
  - `footer.links[] -> link[]`

## Non-goals
- No cross-section element dragging
- No nested element trees
- No arbitrary new section types
- No freeform canvas positioning
- No database-backed persistence

## Acceptance Criteria
- Sections still reorder correctly.
- All six section types support element-level reordering inside the section.
- Clicking an element opens element-specific fields in the inspector.
- Saving writes the new schema format to repository JSON files.
- Refreshing runtime and editor pages shows the saved element order and content.
