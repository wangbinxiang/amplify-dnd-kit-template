import { arrayMove } from "@dnd-kit/sortable";

import type { PageSection } from "@/lib/page-schema";

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
