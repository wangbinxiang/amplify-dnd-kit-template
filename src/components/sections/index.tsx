import type {
  CtaSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  ImageTextSection,
  RichTextSection,
} from "@/lib/page-schema";

export function HeroSectionView({ section }: { section: HeroSection }) {
  return (
    <section className="section surface hero">
      <p className="eyebrow">Hero</p>
      <h2>{section.headline}</h2>
      {section.subheadline ? <p className="lede">{section.subheadline}</p> : null}
      {section.primaryCtaLabel && section.primaryCtaHref ? (
        <a className="button" href={section.primaryCtaHref}>
          {section.primaryCtaLabel}
        </a>
      ) : null}
    </section>
  );
}

export function RichTextSectionView({ section }: { section: RichTextSection }) {
  return (
    <section className="section surface">
      {section.title ? <h2>{section.title}</h2> : null}
      <div className="prose">
        {section.body.split("\n").map((paragraph) => (
          <p key={`${section.id}-${paragraph}`}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function FeaturesSectionView({ section }: { section: FeaturesSection }) {
  return (
    <section className="section surface">
      {section.title ? <h2>{section.title}</h2> : null}
      <div className="feature-grid">
        {section.items.map((item) => (
          <article key={`${section.id}-${item.title}`} className="feature-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ImageTextSectionView({ section }: { section: ImageTextSection }) {
  return (
    <section
      className={`section surface image-text ${
        section.imageSide === "right" ? "reverse" : ""
      }`}
    >
      <div>
        {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
        <h2>{section.title}</h2>
        <p>{section.body}</p>
      </div>
      <div className="image-frame">
        <img alt={section.imageAlt} src={section.imageSrc} />
      </div>
    </section>
  );
}

export function CtaSectionView({ section }: { section: CtaSection }) {
  return (
    <section className="section surface cta">
      <h2>{section.title}</h2>
      {section.body ? <p>{section.body}</p> : null}
      <a className="button" href={section.buttonHref}>
        {section.buttonLabel}
      </a>
    </section>
  );
}

export function FooterSectionView({ section }: { section: FooterSection }) {
  return (
    <footer className="section footer">
      <p>{section.copyright}</p>
      <nav aria-label="Footer links" className="footer-links">
        {section.links.map((link) => (
          <a key={`${section.id}-${link.label}`} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
