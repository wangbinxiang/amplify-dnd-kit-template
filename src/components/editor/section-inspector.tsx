"use client";

import type { ReactNode } from "react";

import type {
  FeaturesSection,
  FooterSection,
  ImageTextSection,
  PageSection,
} from "@/lib/page-schema";

type SectionInspectorProps = {
  section: PageSection | undefined;
  onChange: (section: PageSection) => void;
};

type ArrayEditorProps<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    onItemChange: (nextItem: T) => void,
  ) => ReactNode;
  createItem: () => T;
  addLabel: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ArrayEditor<T>({
  items,
  onChange,
  renderItem,
  createItem,
  addLabel,
}: ArrayEditorProps<T>) {
  return (
    <div className="array-editor">
      {items.map((item, index) =>
        renderItem(item, index, (nextItem) => {
          const nextItems = [...items];
          nextItems[index] = nextItem;
          onChange(nextItems);
        }),
      )}
      <button
        className="secondary-button"
        onClick={() => onChange([...items, createItem()])}
        type="button"
      >
        {addLabel}
      </button>
    </div>
  );
}

function updateFeaturesSection(
  section: FeaturesSection,
  key: keyof FeaturesSection,
  value: FeaturesSection[keyof FeaturesSection],
) {
  return { ...section, [key]: value };
}

function updateImageTextSection(
  section: ImageTextSection,
  key: keyof ImageTextSection,
  value: ImageTextSection[keyof ImageTextSection],
) {
  return { ...section, [key]: value };
}

function updateFooterSection(
  section: FooterSection,
  key: keyof FooterSection,
  value: FooterSection[keyof FooterSection],
) {
  return { ...section, [key]: value };
}

export function SectionInspector({
  section,
  onChange,
}: SectionInspectorProps) {
  if (!section) {
    return (
      <aside className="panel inspector">
        <h2>Inspector</h2>
        <p>Select a section to edit its content.</p>
      </aside>
    );
  }

  return (
    <aside className="panel inspector">
      <h2>Inspector</h2>
      <p className="inspector-type">{section.type}</p>

      {section.type === "hero" ? (
        <>
          <Field label="Headline">
            <input
              aria-label="Headline"
              onChange={(event) =>
                onChange({ ...section, headline: event.target.value })
              }
              type="text"
              value={section.headline}
            />
          </Field>
          <Field label="Subheadline">
            <textarea
              aria-label="Subheadline"
              onChange={(event) =>
                onChange({ ...section, subheadline: event.target.value })
              }
              value={section.subheadline ?? ""}
            />
          </Field>
          <Field label="Primary CTA Label">
            <input
              aria-label="Primary CTA Label"
              onChange={(event) =>
                onChange({ ...section, primaryCtaLabel: event.target.value })
              }
              type="text"
              value={section.primaryCtaLabel ?? ""}
            />
          </Field>
          <Field label="Primary CTA Href">
            <input
              aria-label="Primary CTA Href"
              onChange={(event) =>
                onChange({ ...section, primaryCtaHref: event.target.value })
              }
              type="text"
              value={section.primaryCtaHref ?? ""}
            />
          </Field>
        </>
      ) : null}

      {section.type === "richText" ? (
        <>
          <Field label="Title">
            <input
              aria-label="Title"
              onChange={(event) => onChange({ ...section, title: event.target.value })}
              type="text"
              value={section.title ?? ""}
            />
          </Field>
          <Field label="Body">
            <textarea
              aria-label="Body"
              onChange={(event) => onChange({ ...section, body: event.target.value })}
              rows={8}
              value={section.body}
            />
          </Field>
        </>
      ) : null}

      {section.type === "features" ? (
        <>
          <Field label="Title">
            <input
              aria-label="Title"
              onChange={(event) =>
                onChange(updateFeaturesSection(section, "title", event.target.value))
              }
              type="text"
              value={section.title ?? ""}
            />
          </Field>
          <ArrayEditor
            addLabel="Add feature"
            createItem={() => ({ title: "New feature", description: "Describe it." })}
            items={section.items}
            onChange={(items) => onChange(updateFeaturesSection(section, "items", items))}
            renderItem={(item, index, onItemChange) => (
              <div className="array-card" key={`${section.id}-${index}`}>
                <Field label={`Feature ${index + 1} Title`}>
                  <input
                    aria-label={`Feature ${index + 1} Title`}
                    onChange={(event) =>
                      onItemChange({ ...item, title: event.target.value })
                    }
                    type="text"
                    value={item.title}
                  />
                </Field>
                <Field label={`Feature ${index + 1} Description`}>
                  <textarea
                    aria-label={`Feature ${index + 1} Description`}
                    onChange={(event) =>
                      onItemChange({ ...item, description: event.target.value })
                    }
                    rows={3}
                    value={item.description}
                  />
                </Field>
              </div>
            )}
          />
        </>
      ) : null}

      {section.type === "imageText" ? (
        <>
          <Field label="Eyebrow">
            <input
              aria-label="Eyebrow"
              onChange={(event) =>
                onChange(updateImageTextSection(section, "eyebrow", event.target.value))
              }
              type="text"
              value={section.eyebrow ?? ""}
            />
          </Field>
          <Field label="Title">
            <input
              aria-label="Title"
              onChange={(event) =>
                onChange(updateImageTextSection(section, "title", event.target.value))
              }
              type="text"
              value={section.title}
            />
          </Field>
          <Field label="Body">
            <textarea
              aria-label="Body"
              onChange={(event) =>
                onChange(updateImageTextSection(section, "body", event.target.value))
              }
              rows={6}
              value={section.body}
            />
          </Field>
          <Field label="Image Src">
            <input
              aria-label="Image Src"
              onChange={(event) =>
                onChange(updateImageTextSection(section, "imageSrc", event.target.value))
              }
              type="text"
              value={section.imageSrc}
            />
          </Field>
          <Field label="Image Alt">
            <input
              aria-label="Image Alt"
              onChange={(event) =>
                onChange(updateImageTextSection(section, "imageAlt", event.target.value))
              }
              type="text"
              value={section.imageAlt}
            />
          </Field>
          <Field label="Image Side">
            <select
              aria-label="Image Side"
              onChange={(event) =>
                onChange(
                  updateImageTextSection(
                    section,
                    "imageSide",
                    event.target.value as ImageTextSection["imageSide"],
                  ),
                )
              }
              value={section.imageSide}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </Field>
        </>
      ) : null}

      {section.type === "cta" ? (
        <>
          <Field label="Title">
            <input
              aria-label="Title"
              onChange={(event) => onChange({ ...section, title: event.target.value })}
              type="text"
              value={section.title}
            />
          </Field>
          <Field label="Body">
            <textarea
              aria-label="Body"
              onChange={(event) => onChange({ ...section, body: event.target.value })}
              rows={4}
              value={section.body ?? ""}
            />
          </Field>
          <Field label="Button Label">
            <input
              aria-label="Button Label"
              onChange={(event) =>
                onChange({ ...section, buttonLabel: event.target.value })
              }
              type="text"
              value={section.buttonLabel}
            />
          </Field>
          <Field label="Button Href">
            <input
              aria-label="Button Href"
              onChange={(event) =>
                onChange({ ...section, buttonHref: event.target.value })
              }
              type="text"
              value={section.buttonHref}
            />
          </Field>
        </>
      ) : null}

      {section.type === "footer" ? (
        <>
          <Field label="Copyright">
            <input
              aria-label="Copyright"
              onChange={(event) =>
                onChange(updateFooterSection(section, "copyright", event.target.value))
              }
              type="text"
              value={section.copyright}
            />
          </Field>
          <ArrayEditor
            addLabel="Add link"
            createItem={() => ({ label: "New link", href: "/" })}
            items={section.links}
            onChange={(links) => onChange(updateFooterSection(section, "links", links))}
            renderItem={(item, index, onItemChange) => (
              <div className="array-card" key={`${section.id}-${index}`}>
                <Field label={`Link ${index + 1} Label`}>
                  <input
                    aria-label={`Link ${index + 1} Label`}
                    onChange={(event) =>
                      onItemChange({ ...item, label: event.target.value })
                    }
                    type="text"
                    value={item.label}
                  />
                </Field>
                <Field label={`Link ${index + 1} Href`}>
                  <input
                    aria-label={`Link ${index + 1} Href`}
                    onChange={(event) =>
                      onItemChange({ ...item, href: event.target.value })
                    }
                    type="text"
                    value={item.href}
                  />
                </Field>
              </div>
            )}
          />
        </>
      ) : null}
    </aside>
  );
}
