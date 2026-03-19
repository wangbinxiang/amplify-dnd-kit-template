import { arrayMove } from "@dnd-kit/sortable";

import type { PageElement, PageSection } from "@/lib/page-schema";

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

    return {
      ...section,
      elements: arrayMove(section.elements, activeIndex, overIndex),
    };
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

    return {
      ...section,
      elements: section.elements.map((element) =>
        element.id === nextElement.id ? nextElement : element,
      ),
    };
  });
}
