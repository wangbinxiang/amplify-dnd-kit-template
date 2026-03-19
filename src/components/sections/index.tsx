import type {
  ButtonElement,
  CopyElement,
  CtaSection,
  EyebrowElement,
  FeatureItemElement,
  FeaturesSection,
  FooterSection,
  HeadingElement,
  HeroSection,
  ImageElement,
  ImageTextSection,
  LinkElement,
  ParagraphElement,
  RichTextSection,
  CopyrightElement,
} from "@/lib/page-schema";

function renderHeadingElement(
  element: HeadingElement,
  dataTestId?: string,
) {
  return (
    <h2 data-testid={dataTestId} key={element.id}>
      {element.props.text}
    </h2>
  );
}

function renderCopyElement(
  element: CopyElement,
  className?: string,
  dataTestId?: string,
) {
  return (
    <p className={className} data-testid={dataTestId} key={element.id}>
      {element.props.text}
    </p>
  );
}

function renderButtonElement(
  element: ButtonElement,
  dataTestId?: string,
) {
  return (
    <a
      className="button"
      data-testid={dataTestId}
      href={element.props.href}
      key={element.id}
    >
      {element.props.label}
    </a>
  );
}

function renderParagraphElement(element: ParagraphElement) {
  return <p key={element.id}>{element.props.text}</p>;
}

function renderEyebrowElement(element: EyebrowElement) {
  return (
    <p className="eyebrow" key={element.id}>
      {element.props.text}
    </p>
  );
}

function renderFeatureItemElement(element: FeatureItemElement) {
  return (
    <article className="feature-card" key={element.id}>
      <h3>{element.props.title}</h3>
      <p>{element.props.description}</p>
    </article>
  );
}

function renderImageElement(element: ImageElement) {
  return (
    <div className="image-frame" key={element.id}>
      <img alt={element.props.alt} src={element.props.src} />
    </div>
  );
}

function renderCopyrightElement(element: CopyrightElement) {
  return <p key={element.id}>{element.props.text}</p>;
}

function renderLinkElement(element: LinkElement) {
  return (
    <a href={element.props.href} key={element.id}>
      {element.props.label}
    </a>
  );
}

export function HeroSectionView({ section }: { section: HeroSection }) {
  return (
    <section className="section surface hero">
      {section.elements.map((element) => {
        switch (element.type) {
          case "heading":
            return renderHeadingElement(element, "hero-element");
          case "copy":
            return renderCopyElement(element, "lede", "hero-element");
          case "button":
            return renderButtonElement(element, "hero-element");
        }
      })}
    </section>
  );
}

export function RichTextSectionView({ section }: { section: RichTextSection }) {
  return (
    <section className="section surface">
      {section.elements.map((element) => {
        switch (element.type) {
          case "heading":
            return renderHeadingElement(element);
          case "paragraph":
            return (
              <div className="prose" key={element.id}>
                {renderParagraphElement(element)}
              </div>
            );
        }
      })}
    </section>
  );
}

export function FeaturesSectionView({ section }: { section: FeaturesSection }) {
  return (
    <section className="section surface">
      {section.elements.map((element) => {
        switch (element.type) {
          case "heading":
            return renderHeadingElement(element);
          case "featureItem":
            return (
              <div className="feature-grid" key={element.id}>
                {renderFeatureItemElement(element)}
              </div>
            );
        }
      })}
    </section>
  );
}

export function ImageTextSectionView({ section }: { section: ImageTextSection }) {
  const imageElement = section.elements.find((element) => element.type === "image");
  const imageSide = imageElement?.type === "image" ? imageElement.props.side : "left";

  return (
    <section
      className={`section surface image-text ${imageSide === "right" ? "reverse" : ""}`}
    >
      {section.elements.map((element) => {
        switch (element.type) {
          case "eyebrow":
            return renderEyebrowElement(element);
          case "heading":
            return renderHeadingElement(element);
          case "copy":
            return renderCopyElement(element);
          case "image":
            return renderImageElement(element);
        }
      })}
    </section>
  );
}

export function CtaSectionView({ section }: { section: CtaSection }) {
  return (
    <section className="section surface cta">
      {section.elements.map((element) => {
        switch (element.type) {
          case "heading":
            return renderHeadingElement(element);
          case "copy":
            return renderCopyElement(element);
          case "button":
            return renderButtonElement(element);
        }
      })}
    </section>
  );
}

export function FooterSectionView({ section }: { section: FooterSection }) {
  return (
    <footer className="section footer">
      {section.elements.map((element) => {
        switch (element.type) {
          case "copyright":
            return renderCopyrightElement(element);
          case "link":
            return (
              <nav aria-label="Footer links" className="footer-links" key={element.id}>
                {renderLinkElement(element)}
              </nav>
            );
        }
      })}
    </footer>
  );
}
