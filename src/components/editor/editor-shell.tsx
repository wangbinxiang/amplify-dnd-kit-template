"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useState, useTransition } from "react";

import { PageRenderer } from "@/components/page-renderer";
import { SectionInspector } from "@/components/editor/section-inspector";
import { SortableSectionCard } from "@/components/editor/sortable-section-card";
import { reorderSections, replaceSection } from "@/lib/editor-state";
import type { PageSchema } from "@/lib/page-schema";

type EditorShellProps = {
  initialPage: PageSchema;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function EditorShell({ initialPage }: EditorShellProps) {
  const [draft, setDraft] = useState(initialPage);
  const [selectedSectionId, setSelectedSectionId] = useState(
    initialPage.sections[0]?.id,
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("Changes are local until you save.");
  const [isPending, startTransition] = useTransition();

  const selectedSection = useMemo(
    () => draft.sections.find((section) => section.id === selectedSectionId),
    [draft.sections, selectedSectionId],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) {
      return;
    }

    const overId = String(event.over.id);

    setDraft((currentDraft) => ({
      ...currentDraft,
      // Only section order changes here; inspector edits go through replaceSection below.
      sections: reorderSections(
        currentDraft.sections,
        String(event.active.id),
        overId,
      ),
    }));
    setSaveState("idle");
    setSaveMessage("Section order changed. Save to persist.");
  }

  async function handleSave() {
    setSaveState("saving");
    setSaveMessage("Saving schema to src/content/pages...");

    // The editor always sends the full draft so the server can validate the whole page shape.
    const response = await fetch(`/api/page-schemas/${draft.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      setSaveState("error");
      setSaveMessage(payload?.error ?? "Save failed.");
      return;
    }

    const payload = (await response.json()) as {
      page: PageSchema;
      savedAt: string;
    };

    startTransition(() => {
      setDraft(payload.page);
      setSaveState("saved");
      setSaveMessage(`Saved at ${new Date(payload.savedAt).toLocaleTimeString()}.`);
    });
  }

  return (
    <div className="editor-shell">
      <header className="editor-header">
        <div>
          <p className="eyebrow">Editor</p>
          <h1>{draft.title}</h1>
          <p>{saveMessage}</p>
        </div>
        <button
          className="button"
          disabled={saveState === "saving" || isPending}
          onClick={handleSave}
          type="button"
        >
          {saveState === "saving" || isPending ? "Saving..." : "Save schema"}
        </button>
      </header>

      <div className="editor-grid">
        <section className="panel canvas-panel">
          <div className="panel-heading">
            <h2>Canvas</h2>
            <p>Drag sections to reorder. Click a section to inspect it.</p>
          </div>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={draft.sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <PageRenderer
                page={draft}
                renderSectionChrome={(section, content) => (
                  <SortableSectionCard
                    isActive={section.id === selectedSectionId}
                    onSelect={setSelectedSectionId}
                    section={section}
                  >
                    {content}
                  </SortableSectionCard>
                )}
              />
            </SortableContext>
          </DndContext>
        </section>

        <SectionInspector
          onChange={(nextSection) => {
            setDraft((currentDraft) => ({
              ...currentDraft,
              // Inspector edits replace exactly one section while preserving current order.
              sections: replaceSection(currentDraft.sections, nextSection),
            }));
            setSaveState("idle");
            setSaveMessage("Content changed. Save to persist.");
          }}
          section={selectedSection}
        />
      </div>
    </div>
  );
}
