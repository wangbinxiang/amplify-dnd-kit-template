import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@dnd-kit/core", () => ({
  closestCenter: vi.fn(),
  DndContext: ({
    children,
    onDragEnd,
  }: {
    children: ReactNode;
    onDragEnd?: (event: {
      active: { id: string };
      over: { id: string } | null;
    }) => void;
  }) => (
    <div>
      {children}
      <button
        onClick={() =>
          onDragEnd?.({
            active: { id: "element:hero-1:hero-button-1" },
            over: { id: "element:hero-1:hero-heading-1" },
          })
        }
        type="button"
      >
        Trigger element reorder
      </button>
    </div>
  ),
  PointerSensor: class {},
  useSensor: vi.fn(() => ({})),
  useSensors: vi.fn((...sensors: unknown[]) => sensors),
}));

vi.mock("@dnd-kit/sortable", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@dnd-kit/sortable")>();

  return {
    ...actual,
    SortableContext: ({ children }: { children: ReactNode }) => <>{children}</>,
    useSortable: vi.fn(() => ({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: undefined,
      isDragging: false,
    })),
  };
});

import { EditorShell } from "@/components/editor/editor-shell";
import type { PageSchema } from "@/lib/page-schema";

const page: PageSchema = {
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
          props: { text: "Initial headline" },
        },
        {
          id: "hero-copy-1",
          type: "copy",
          props: { text: "Initial subheadline" },
        },
        {
          id: "hero-button-1",
          type: "button",
          props: { label: "Start", href: "/start" },
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
      ],
    },
  ],
};

describe("EditorShell", () => {
  it("updates the preview when the selected element fields change", async () => {
    const user = userEvent.setup();

    render(<EditorShell initialPage={page} />);

    await user.click(screen.getByRole("button", { name: "hero-heading-1" }));

    const textInput = screen.getByLabelText("Text");

    await user.clear(textInput);
    await user.type(textInput, "Updated headline");

    expect(screen.getByText("Updated headline")).toBeInTheDocument();
  });

  it("reorders element chips when the dnd context reports an element drop", async () => {
    const user = userEvent.setup();

    render(<EditorShell initialPage={page} />);

    const getHeroElementOrder = () =>
      within(screen.getByLabelText("hero elements"))
        .getAllByRole("button")
        .map((button) => button.textContent);

    expect(getHeroElementOrder()).toEqual([
      "hero-heading-1",
      "hero-copy-1",
      "hero-button-1",
    ]);

    await user.click(screen.getByRole("button", { name: "Trigger element reorder" }));

    expect(getHeroElementOrder()).toEqual([
      "hero-button-1",
      "hero-heading-1",
      "hero-copy-1",
    ]);
  });
});
