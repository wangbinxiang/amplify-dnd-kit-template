import type { ReactNode } from "react";

import {
  CtaSectionView,
  FeaturesSectionView,
  FooterSectionView,
  HeroSectionView,
  ImageTextSectionView,
  RichTextSectionView,
} from "@/components/sections";
import type { PageSchema, PageSection } from "@/lib/page-schema";

type PageRendererProps = {
  page: PageSchema;
  renderSectionChrome?: (section: PageSection, content: ReactNode) => ReactNode;
};

function renderSection(section: PageSection) {
  // The renderer is intentionally schema-driven so runtime pages never persist component trees.
  switch (section.type) {
    case "hero":
      return <HeroSectionView section={section} />;
    case "richText":
      return <RichTextSectionView section={section} />;
    case "features":
      return <FeaturesSectionView section={section} />;
    case "imageText":
      return <ImageTextSectionView section={section} />;
    case "cta":
      return <CtaSectionView section={section} />;
    case "footer":
      return <FooterSectionView section={section} />;
    default:
      return null;
  }
}

export function PageRenderer({
  page,
  renderSectionChrome,
}: PageRendererProps) {
  return (
    <div className="page-stack">
      {page.sections.map((section) => {
        const content = renderSection(section);

        if (!content) {
          return null;
        }

        // The optional wrapper lets the editor add drag handles without forking rendering.
        return (
          <div key={section.id}>
            {renderSectionChrome ? renderSectionChrome(section, content) : content}
          </div>
        );
      })}
    </div>
  );
}
