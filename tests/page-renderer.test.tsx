import { render, screen } from "@testing-library/react";

import { PageRenderer } from "@/components/page-renderer";
import type { PageSchema } from "@/lib/page-schema";

const page: PageSchema = {
  slug: "home",
  title: "Home",
  sections: [
    {
      id: "hero-1",
      type: "hero",
      elements: [
        {
          id: "hero-button-1",
          type: "button",
          props: { label: "Edit page", href: "/editor/home" },
        },
        {
          id: "hero-heading-1",
          type: "heading",
          props: { text: "Ship schema-driven pages" },
        },
        {
          id: "hero-copy-1",
          type: "copy",
          props: { text: "Runtime and editor share one renderer." },
        },
      ],
    },
    {
      id: "cta-1",
      type: "cta",
      elements: [
        {
          id: "cta-heading-1",
          type: "heading",
          props: { text: "Ready to iterate?" },
        },
        {
          id: "cta-copy-1",
          type: "copy",
          props: { text: "Change the schema and save it back to the repo." },
        },
        {
          id: "cta-button-1",
          type: "button",
          props: { label: "Open editor", href: "/editor/home" },
        },
      ],
    },
  ],
};

describe("PageRenderer", () => {
  it("renders supported sections and keeps element order from the schema", () => {
    render(<PageRenderer page={page} />);

    const heroElements = screen
      .getAllByTestId("hero-element")
      .map((element) => element.textContent);

    expect(heroElements).toEqual([
      "Edit page",
      "Ship schema-driven pages",
      "Runtime and editor share one renderer.",
    ]);
    expect(screen.getByText("Ship schema-driven pages")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open editor" })).toHaveAttribute(
      "href",
      "/editor/home",
    );
  });
});
