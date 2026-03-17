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
      headline: "Ship schema-driven pages",
      subheadline: "Runtime and editor share one renderer.",
      primaryCtaLabel: "Edit page",
      primaryCtaHref: "/editor/home",
    },
    {
      id: "cta-1",
      type: "cta",
      title: "Ready to iterate?",
      body: "Change the schema and save it back to the repo.",
      buttonLabel: "Open editor",
      buttonHref: "/editor/home",
    },
  ],
};

describe("PageRenderer", () => {
  it("renders supported sections from the schema", () => {
    render(<PageRenderer page={page} />);

    expect(screen.getByText("Ship schema-driven pages")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open editor" })).toHaveAttribute(
      "href",
      "/editor/home",
    );
  });
});
