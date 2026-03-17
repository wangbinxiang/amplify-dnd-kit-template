"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

import type { PageSection } from "@/lib/page-schema";

type SortableSectionCardProps = {
  section: PageSection;
  children: ReactNode;
  isActive: boolean;
  onSelect: (sectionId: string) => void;
};

export function SortableSectionCard({
  section,
  children,
  isActive,
  onSelect,
}: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

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
          onClick={() => onSelect(section.id)}
          type="button"
        >
          {section.type}
        </button>
      </div>
      <div className="sortable-preview" onClick={() => onSelect(section.id)} role="presentation">
        {children}
      </div>
    </div>
  );
}
