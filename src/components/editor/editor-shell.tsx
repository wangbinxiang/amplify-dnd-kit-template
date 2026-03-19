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
import { useState, useTransition } from "react";

import { PageRenderer } from "@/components/page-renderer";
import { SectionInspector } from "@/components/editor/section-inspector";
import { SortableSectionCard } from "@/components/editor/sortable-section-card";
import {
  getSectionDragId,
  reorderByDragIds,
  replaceElement,
} from "@/lib/editor-state";
import type { PageElement, PageSchema, PageSection } from "@/lib/page-schema";

type EditorShellProps = {
  initialPage: PageSchema;
};

type SaveState = "idle" | "saving" | "saved" | "error";

function getFirstElementId(section: PageSection | undefined) {
  return section?.elements[0]?.id;
}

export function EditorShell({ initialPage }: EditorShellProps) {
  const [draft, setDraft] = useState(initialPage);
  const [selectedSectionId, setSelectedSectionId] = useState(
    initialPage.sections[0]?.id,
  );
  const [selectedElementId, setSelectedElementId] = useState(
    getFirstElementId(initialPage.sections[0]),
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("Changes are local until you save.");
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const selectedSection = draft.sections.find(
    (section) => section.id === selectedSectionId,
  );
  const selectedElement = selectedSection?.elements.find(
    (element) => element.id === selectedElementId,
  );

  function handleSelectSection(sectionId: string) {
    const nextSection = draft.sections.find((section) => section.id === sectionId);

    setSelectedSectionId(sectionId);
    setSelectedElementId(getFirstElementId(nextSection));
  }

  function handleSelectElement(sectionId: string, elementId: string) {
    setSelectedSectionId(sectionId);
    setSelectedElementId(elementId);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) {
      return;
    }

    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    const isElementDrag =
      activeId.startsWith("element:") && overId.startsWith("element:");
    let changed = false;

    setDraft((currentDraft) => {
      const nextSections = reorderByDragIds(currentDraft.sections, activeId, overId);

      changed = nextSections !== currentDraft.sections;

      if (!changed) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        sections: nextSections,
      };
    });

    if (!changed) {
      return;
    }

    setSaveState("idle");
    setSaveMessage(
      isElementDrag
        ? "Element order changed. Save to persist."
        : "Section order changed. Save to persist.",
    );
  }

  async function handleSave() {
    setSaveState("saving");
    setSaveMessage("Saving schema to src/content/pages...");

    // Send the full draft so the server validates the whole page shape.
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

  function handleElementChange(nextElement: PageElement) {
    if (!selectedSectionId) {
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      sections: replaceElement(currentDraft.sections, selectedSectionId, nextElement),
    }));
    setSaveState("idle");
    setSaveMessage("Content changed. Save to persist.");
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
            <p>Drag sections to reorder. Select sections and elements to inspect them.</p>
          </div>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={draft.sections.map((section) => getSectionDragId(section.id))}
              strategy={verticalListSortingStrategy}
            >
              <PageRenderer
                page={draft}
                renderSectionChrome={(section, content) => (
                  <SortableSectionCard
                    elements={section.elements}
                    isActive={section.id === selectedSectionId}
                    onSelectElement={handleSelectElement}
                    onSelectSection={handleSelectSection}
                    section={section}
                    selectedElementId={selectedElementId}
                  >
                    {content}
                  </SortableSectionCard>
                )}
              />
            </SortableContext>
          </DndContext>
        </section>

        <SectionInspector
          element={selectedElement}
          onChange={handleElementChange}
          section={selectedSection}
        />
      </div>
    </div>
  );
}
