"use client";

import type { ReactNode } from "react";

import type {
  ButtonElement,
  CopyElement,
  CopyrightElement,
  EyebrowElement,
  FeatureItemElement,
  ImageElement,
  HeadingElement,
  LinkElement,
  PageElement,
  PageSection,
  ParagraphElement,
} from "@/lib/page-schema";

type SectionInspectorProps = {
  section: PageSection | undefined;
  element: PageElement | undefined;
  onChange: (element: PageElement) => void;
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

function updateTextElement(
  element:
    | HeadingElement
    | CopyElement
    | ParagraphElement
    | EyebrowElement
    | CopyrightElement,
  text: string,
) {
  return { ...element, props: { text } };
}

function updateActionElement(
  element: ButtonElement | LinkElement,
  key: "label" | "href",
  value: string,
) {
  return { ...element, props: { ...element.props, [key]: value } };
}

function updateFeatureItemElement(
  element: FeatureItemElement,
  key: "title" | "description",
  value: string,
) {
  return { ...element, props: { ...element.props, [key]: value } };
}

function updateImageElement(element: ImageElement, key: keyof ImageElement["props"], value: string) {
  return { ...element, props: { ...element.props, [key]: value } };
}

export function SectionInspector({
  section,
  element,
  onChange,
}: SectionInspectorProps) {
  if (!section || !element) {
    return (
      <aside className="panel inspector">
        <h2>Inspector</h2>
        <p>Select an element to edit its content.</p>
      </aside>
    );
  }

  return (
    <aside className="panel inspector">
      <h2>Inspector</h2>
      <p className="inspector-type">
        {section.type} / {element.type}
      </p>

      {element.type === "heading" || element.type === "copy" || element.type === "paragraph" || element.type === "eyebrow" || element.type === "copyright" ? (
        <Field label="Text">
          <input
            aria-label="Text"
            onChange={(event) => onChange(updateTextElement(element, event.target.value))}
            type="text"
            value={element.props.text}
          />
        </Field>
      ) : null}

      {element.type === "button" || element.type === "link" ? (
        <>
          <Field label="Label">
            <input
              aria-label="Label"
              onChange={(event) =>
                onChange(updateActionElement(element, "label", event.target.value))
              }
              type="text"
              value={element.props.label}
            />
          </Field>
          <Field label="Href">
            <input
              aria-label="Href"
              onChange={(event) =>
                onChange(updateActionElement(element, "href", event.target.value))
              }
              type="text"
              value={element.props.href}
            />
          </Field>
        </>
      ) : null}

      {element.type === "featureItem" ? (
        <>
          <Field label="Title">
            <input
              aria-label="Title"
              onChange={(event) =>
                onChange(updateFeatureItemElement(element, "title", event.target.value))
              }
              type="text"
              value={element.props.title}
            />
          </Field>
          <Field label="Description">
            <textarea
              aria-label="Description"
              onChange={(event) =>
                onChange(
                  updateFeatureItemElement(element, "description", event.target.value),
                )
              }
              rows={4}
              value={element.props.description}
            />
          </Field>
        </>
      ) : null}

      {element.type === "image" ? (
        <>
          <Field label="Src">
            <input
              aria-label="Src"
              onChange={(event) =>
                onChange(updateImageElement(element, "src", event.target.value))
              }
              type="text"
              value={element.props.src}
            />
          </Field>
          <Field label="Alt">
            <input
              aria-label="Alt"
              onChange={(event) =>
                onChange(updateImageElement(element, "alt", event.target.value))
              }
              type="text"
              value={element.props.alt}
            />
          </Field>
          <Field label="Side">
            <select
              aria-label="Side"
              onChange={(event) =>
                onChange(updateImageElement(element, "side", event.target.value as "left" | "right"))
              }
              value={element.props.side}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </Field>
        </>
      ) : null}
    </aside>
  );
}
