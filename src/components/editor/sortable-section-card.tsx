"use client";

import {
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

import { getElementDragId, getSectionDragId } from "@/lib/editor-state";
import type { PageElement, PageSection } from "@/lib/page-schema";

type SortableSectionCardProps = {
  elements: PageElement[];
  section: PageSection;
  children: ReactNode;
  isActive: boolean;
  onSelectElement: (sectionId: string, elementId: string) => void;
  onSelectSection: (sectionId: string) => void;
  selectedElementId: string | undefined;
};

type SortableElementChipProps = {
  element: PageElement;
  sectionId: string;
  isActive: boolean;
  onSelect: (sectionId: string, elementId: string) => void;
};

function SortableElementChip({
  element,
  sectionId,
  isActive,
  onSelect,
}: SortableElementChipProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: getElementDragId(sectionId, element.id),
  });

  return (
    <button
      className={`section-chip ${isActive ? "active" : ""} ${isDragging ? "dragging" : ""}`}
      onClick={() => onSelect(sectionId, element.id)}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      type="button"
      {...attributes}
      {...listeners}
    >
      {element.id}
    </button>
  );
}

export function SortableSectionCard({
  elements,
  section,
  children,
  isActive,
  onSelectElement,
  onSelectSection,
  selectedElementId,
}: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getSectionDragId(section.id) });

  return (
    <div
      className={`sortable-card ${isActive ? "active" : ""} ${isDragging ? "dragging" : ""}`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="sortable-toolbar">
        <button
          className="drag-handle"
          type="button"
          {...attributes}
          {...listeners}
        >
          Drag
        </button>
        <button
          className="section-chip"
          onClick={() => onSelectSection(section.id)}
          type="button"
        >
          {section.type}
        </button>
      </div>
      <SortableContext
        items={elements.map((element) => getElementDragId(section.id, element.id))}
        strategy={rectSortingStrategy}
      >
        <div className="sortable-toolbar" aria-label={`${section.type} elements`}>
          {elements.map((element) => (
            <SortableElementChip
              element={element}
              isActive={element.id === selectedElementId}
              key={element.id}
              onSelect={onSelectElement}
              sectionId={section.id}
            />
          ))}
        </div>
      </SortableContext>
      <div className="sortable-preview" role="presentation">
        {children}
      </div>
    </div>
  );
}
