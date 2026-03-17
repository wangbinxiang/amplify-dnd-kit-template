# AGENTS.md

## Goal

Build a page editor MVP this week.

The editor must:

1. render pages from a schema file in the repository
2. support section-level drag-and-drop reordering
3. support content editing in an inspector panel
4. save changes back to the repository source files
5. avoid using a database

## Architecture

- Use schema-driven rendering
- Persist page content in source files under `src/content/pages/`
- Do not persist JSX or TSX trees directly
- Do not use a database
- The runtime page reads schema files and renders them via a shared renderer

## Storage

- Save page schemas to repository files
- Preferred format: JSON
- Primary file path example: `src/content/pages/home.json`

## Scope

Only support a single-page editor MVP for now.
Only support section-level editing and sorting.
Only support these section types:

- hero
- richText
- features
- imageText
- cta
- footer

## Non-goals

- No database
- No nested drag-and-drop
- No freeform canvas
- No arbitrary custom components
- No AI site generation flow
- No collaboration
- No full CMS

## UI

Use a 3-panel layout:

- left: section library
- center: editor canvas
- right: inspector

## Save behavior

- The editor calls a server-side endpoint or server action
- The server writes schema JSON files into the repo using filesystem APIs
- Keep implementation simple and local-dev friendly

## Code quality

- TypeScript strict typing
- Small focused files
- Avoid unnecessary dependencies
- Keep types reusable between renderer and editor
- Prefer explicit types over implicit any

## Done criteria

- A schema file can be rendered as a page
- Sections can be reordered by drag-and-drop
- Section props can be edited visually
- Clicking save writes changes back to the schema file
- Refreshing the page shows the saved result
- Include a demo page and clear instructions to run it
