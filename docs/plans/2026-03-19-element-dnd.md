# Element DnD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the editor and runtime schema so every supported section renders and reorders internal elements through a typed `elements[]` model.

**Architecture:** Replace fixed-field section payloads with section-scoped element unions in `src/lib/page-schema.ts`, then update renderer, editor state, and inspector to operate on nested sortable element lists. Keep file-backed JSON persistence and the existing save API, but migrate the repository page files to the new schema shape.

**Tech Stack:** TypeScript, Next.js App Router, React 19, @dnd-kit, zod, Vitest, Testing Library

---

### Task 1: Redefine the page schema around section elements

**Files:**
- Modify: `src/lib/page-schema.ts`
- Modify: `tests/page-schema.test.ts`

**Step 1: Write the failing schema tests**

Add tests that prove the new nested shape is required:

```ts
const validPage: PageSchema = {
  slug: "home",
  title: "Home",
  sections: [
    {
      id: "hero-1",
      type: "hero",
      elements: [
        { id: "hero-heading-1", type: "heading", props: { text: "Build pages" } },
        { id: "hero-copy-1", type: "copy", props: { text: "Edit content safely." } },
        {
          id: "hero-button-1",
          type: "button",
          props: { label: "Open editor", href: "/editor/home" },
        },
      ],
    },
  ],
};

it("accepts a valid page with nested section elements", () => {
  expect(parsePageSchema(validPage)).toEqual(validPage);
});

it("rejects elements that do not belong to the section type", () => {
  const invalidPage = {
    ...validPage,
    sections: [
      {
        id: "footer-1",
        type: "footer",
        elements: [{ id: "x", type: "button", props: { label: "Bad", href: "/" } }],
      },
    ],
  };

  expect(() => parsePageSchema(invalidPage)).toThrow(/Invalid input/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/page-schema.test.ts`
Expected: FAIL because the current section types still require fixed fields like `headline` and `links`

**Step 3: Write the minimal implementation**

- Create section-scoped element schemas such as `heroElementSchema`, `footerElementSchema`, and matching inferred types.
- Refactor each section schema to require `elements: z.array(...)`.
- Export reusable element types for renderer and editor code.

Representative implementation shape:

```ts
const headingElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("heading"),
  props: z.object({
    text: z.string().min(1),
  }),
});

const heroElementSchema = z.discriminatedUnion("type", [
  headingElementSchema,
  copyElementSchema,
  buttonElementSchema,
]);

const heroSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hero"),
  elements: z.array(heroElementSchema).min(1),
});
```

**Step 4: Run test to verify it passes**

Run: `pnpm test -- tests/page-schema.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/page-schema.ts tests/page-schema.test.ts
git commit -m "refactor: remodel page schema around section elements"
```

### Task 2: Add nested editor-state helpers for element operations

**Files:**
- Modify: `src/lib/editor-state.ts`
- Modify: `tests/editor-state.test.ts`

**Step 1: Write the failing state tests**

Add tests for element-level reorder and replacement:

```ts
it("moves the dragged element inside a section", () => {
  const nextSections = reorderElements(sections, "hero-1", "hero-copy-1", "hero-heading-1");

  expect(nextSections[0].elements.map((element) => element.id)).toEqual([
    "hero-copy-1",
    "hero-heading-1",
    "hero-button-1",
  ]);
});

it("replaces one element without changing sibling order", () => {
  const nextSections = replaceElement(sections, "hero-1", {
    id: "hero-button-1",
    type: "button",
    props: { label: "Save", href: "/save" },
  });

  expect(nextSections[0].elements[2]).toEqual({
    id: "hero-button-1",
    type: "button",
    props: { label: "Save", href: "/save" },
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/editor-state.test.ts`
Expected: FAIL because `reorderElements` and `replaceElement` do not exist

**Step 3: Write the minimal implementation**

- Keep `reorderSections`
- Add `reorderElements(sections, sectionId, activeElementId, overElementId)`
- Add `replaceElement(sections, sectionId, nextElement)`
- Return original arrays when ids are missing or positions are unchanged

**Step 4: Run test to verify it passes**

Run: `pnpm test -- tests/editor-state.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/editor-state.ts tests/editor-state.test.ts
git commit -m "feat: add nested element editor state helpers"
```

### Task 3: Render sections from ordered elements at runtime

**Files:**
- Modify: `src/components/sections/index.tsx`
- Modify: `src/components/page-renderer.tsx`
- Modify: `tests/page-renderer.test.tsx`

**Step 1: Write the failing renderer tests**

Add a test that proves rendering follows element order:

```ts
it("renders hero elements in stored order", () => {
  render(<PageRenderer page={page} />);

  const texts = screen.getAllByTestId("hero-element").map((node) => node.textContent);

  expect(texts).toEqual([
    "Edit page",
    "Ship schema-driven pages",
    "Runtime and editor share one renderer.",
  ]);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/page-renderer.test.tsx`
Expected: FAIL because the renderer still reads hard-coded fields like `headline`

**Step 3: Write the minimal implementation**

- Update all section components to iterate `section.elements`
- Render each element by element `type`
- Keep section wrappers and existing visual layout classes where possible
- Use deterministic keys based on `element.id`

Representative implementation shape:

```tsx
function HeroSectionView({ section }: { section: HeroSection }) {
  return (
    <section className="section surface hero">
      {section.elements.map((element) => {
        switch (element.type) {
          case "heading":
            return <h2 data-testid="hero-element" key={element.id}>{element.props.text}</h2>;
          case "copy":
            return <p data-testid="hero-element" key={element.id} className="lede">{element.props.text}</p>;
          case "button":
            return (
              <a data-testid="hero-element" key={element.id} className="button" href={element.props.href}>
                {element.props.label}
              </a>
            );
        }
      })}
    </section>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test -- tests/page-renderer.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/sections/index.tsx src/components/page-renderer.tsx tests/page-renderer.test.tsx
git commit -m "refactor: render sections from ordered elements"
```

### Task 4: Refactor the editor canvas and inspector around selected elements

**Files:**
- Modify: `src/components/editor/editor-shell.tsx`
- Modify: `src/components/editor/sortable-section-card.tsx`
- Modify: `src/components/editor/section-inspector.tsx`
- Modify: `tests/editor-shell.test.tsx`

**Step 1: Write the failing editor tests**

Add a test for element-focused editing:

```ts
it("updates the preview when selected element fields change", async () => {
  const user = userEvent.setup();

  render(<EditorShell initialPage={page} />);

  await user.click(screen.getByRole("button", { name: "hero-heading-1" }));
  const input = screen.getByLabelText("Text");
  await user.clear(input);
  await user.type(input, "Updated headline");

  expect(screen.getByText("Updated headline")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/editor-shell.test.tsx`
Expected: FAIL because the editor still selects sections and renders section-wide forms

**Step 3: Write the minimal implementation**

- Track `selectedSectionId` and `selectedElementId`
- Render nested sortable element controls inside each section card
- Use separate drag ids for sections and elements to avoid collisions
- Limit element dragging to the active section container
- Replace the current section-wide inspector with element-type-specific fields

Representative state shape:

```ts
const [selectedSectionId, setSelectedSectionId] = useState(initialPage.sections[0]?.id);
const [selectedElementId, setSelectedElementId] = useState(
  initialPage.sections[0]?.elements[0]?.id,
);
```

**Step 4: Run test to verify it passes**

Run: `pnpm test -- tests/editor-shell.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/editor/editor-shell.tsx src/components/editor/sortable-section-card.tsx src/components/editor/section-inspector.tsx tests/editor-shell.test.tsx
git commit -m "feat: edit and reorder section elements in the editor"
```

### Task 5: Migrate page content files and verify persistence

**Files:**
- Modify: `src/content/pages/home.json`
- Modify: `src/content/pages/about.json`
- Verify: `app/api/page-schemas/[slug]/route.ts`
- Verify: `src/lib/page-content.ts`

**Step 1: Rewrite repository page files**

- Convert every section to the new `elements[]` format
- Preserve current copy and links
- Assign stable ids for migrated elements

Representative migrated fragment:

```json
{
  "id": "footer-home",
  "type": "footer",
  "elements": [
    {
      "id": "footer-copy-1",
      "type": "copyright",
      "props": { "text": "© 2026 Amplify MVP" }
    },
    {
      "id": "footer-link-1",
      "type": "link",
      "props": { "label": "Home", "href": "/home" }
    }
  ]
}
```

**Step 2: Run the full test suite**

Run: `pnpm test`
Expected: PASS

**Step 3: Run the production build**

Run: `pnpm build`
Expected: PASS

**Step 4: Smoke-check save behavior**

Run: `pnpm dev`
Expected: the editor opens, element reordering updates the canvas, saving writes valid JSON, and refresh shows the saved order

**Step 5: Commit**

```bash
git add src/content/pages/home.json src/content/pages/about.json
git commit -m "chore: migrate page content to element-based schema"
```

### Task 6: Refresh project memory after implementation

**Files:**
- Modify: `docs/project-memory.md`

**Step 1: Update core flow and boundaries**

- Replace notes about section-only drag-and-drop with the new nested element model
- Document that persisted page JSON now stores section-scoped `elements[]`
- Capture the new editor selection and rendering assumptions

**Step 2: Verify memory matches shipped behavior**

Run: `pnpm test`
Expected: PASS

**Step 3: Commit**

```bash
git add docs/project-memory.md
git commit -m "docs: refresh project memory for element-based editor"
```
