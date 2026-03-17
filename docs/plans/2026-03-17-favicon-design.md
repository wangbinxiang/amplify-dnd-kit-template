# Favicon Design

**Date:** 2026-03-17
**Topic:** Editor favicon for Amplify

## Goal
- Add a real `favicon.ico` so browser requests stop hitting the dynamic `[slug]` route.
- Keep the icon visually aligned with the current warm editorial UI.

## Chosen Direction
- Concept: `editor cursor / panel`
- Structure: a rounded square app tile containing a three-panel editor layout
- Accent: a vertical orange insertion cursor over the center canvas

## Visual Rules
- Background uses the warm light palette already defined in `app/globals.css`
- Panel chrome uses the existing dark text color for contrast at small sizes
- The cursor uses the existing accent orange so the “editing” state survives at 16x16

## Why This Direction
- It maps directly to the MVP’s three-panel editor layout
- It is more legible at favicon sizes than a lettermark
- It reinforces the product’s “editing structured content” identity
