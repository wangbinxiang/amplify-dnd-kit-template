import { arrayMove } from "@dnd-kit/sortable";

import type { PageElement, PageSection } from "@/lib/page-schema";

const SECTION_DRAG_PREFIX = "section:";
const ELEMENT_DRAG_PREFIX = "element:";

type SectionDragTarget = {
  kind: "section";
  sectionId: string;
};

type ElementDragTarget = {
  kind: "element";
  sectionId: string;
  elementId: string;
};

type DragTarget = SectionDragTarget | ElementDragTarget;

function updateSectionElements(
  section: PageSection,
  elements: PageElement[],
): PageSection {
  return {
    ...section,
    elements,
  } as PageSection;
}

export function reorderSections(
  sections: PageSection[],
  activeId: string,
  overId: string,
) {
  const activeIndex = sections.findIndex((section) => section.id === activeId);
  const overIndex = sections.findIndex((section) => section.id === overId);

  if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
    return sections;
  }

  // DnD only changes order; section payload stays untouched.
  return arrayMove(sections, activeIndex, overIndex);
}

export function replaceSection(
  sections: PageSection[],
  nextSection: PageSection,
): PageSection[] {
  return sections.map((section) =>
    section.id === nextSection.id ? nextSection : section,
  );
}

export function reorderElements(
  sections: PageSection[],
  sectionId: string,
  activeElementId: string,
  overElementId: string,
): PageSection[] {
  return sections.map((section) => {
    if (section.id !== sectionId) {
      return section;
    }

    const activeIndex = section.elements.findIndex(
      (element) => element.id === activeElementId,
    );
    const overIndex = section.elements.findIndex(
      (element) => element.id === overElementId,
    );

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
      return section;
    }

    return updateSectionElements(
      section,
      arrayMove<PageElement>(
        section.elements as PageElement[],
        activeIndex,
        overIndex,
      ),
    );
  });
}

export function replaceElement(
  sections: PageSection[],
  sectionId: string,
  nextElement: PageElement,
): PageSection[] {
  return sections.map((section) => {
    if (section.id !== sectionId) {
      return section;
    }

    return updateSectionElements(
      section,
      section.elements.map((element) =>
        element.id === nextElement.id ? nextElement : element,
      ),
    );
  });
}

export function getSectionDragId(sectionId: string) {
  // Shared DnD contexts need prefixed ids so section and element drops never collide.
  return `${SECTION_DRAG_PREFIX}${sectionId}`;
}

export function getElementDragId(sectionId: string, elementId: string) {
  return `${ELEMENT_DRAG_PREFIX}${sectionId}:${elementId}`;
}

function parseDragId(id: string): DragTarget | null {
  if (id.startsWith(SECTION_DRAG_PREFIX)) {
    const sectionId = id.slice(SECTION_DRAG_PREFIX.length);

    return sectionId ? { kind: "section", sectionId } : null;
  }

  if (id.startsWith(ELEMENT_DRAG_PREFIX)) {
    const [sectionId, elementId] = id
      .slice(ELEMENT_DRAG_PREFIX.length)
      .split(":");

    if (!sectionId || !elementId) {
      return null;
    }

    return {
      kind: "element",
      sectionId,
      elementId,
    };
  }

  return null;
}

export function reorderByDragIds(
  sections: PageSection[],
  activeId: string,
  overId: string,
): PageSection[] {
  // Decode DnD ids once so the editor shell can stay focused on UI state changes.
  const activeTarget = parseDragId(activeId);
  const overTarget = parseDragId(overId);

  if (!activeTarget || !overTarget) {
    return sections;
  }

  if (activeTarget.kind !== overTarget.kind) {
    return sections;
  }

  if (activeTarget.kind === "section" && overTarget.kind === "section") {
    return reorderSections(sections, activeTarget.sectionId, overTarget.sectionId);
  }

  if (activeTarget.kind !== "element" || overTarget.kind !== "element") {
    return sections;
  }

  if (activeTarget.sectionId !== overTarget.sectionId) {
    return sections;
  }

  return reorderElements(
    sections,
    activeTarget.sectionId,
    activeTarget.elementId,
    overTarget.elementId,
  );
}
