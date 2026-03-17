import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditorShell } from "@/components/editor/editor-shell";
import type { PageSchema } from "@/lib/page-schema";

const page: PageSchema = {
  slug: "home",
  title: "Home",
  sections: [
    {
      id: "hero-1",
      type: "hero",
      headline: "Initial headline",
      subheadline: "Initial subheadline",
      primaryCtaLabel: "Start",
      primaryCtaHref: "/start",
    },
    {
      id: "footer-1",
      type: "footer",
      copyright: "2026 Amplify",
      links: [],
    },
  ],
};

describe("EditorShell", () => {
  it("updates the preview when inspector fields change", async () => {
    const user = userEvent.setup();

    render(<EditorShell initialPage={page} />);

    const headlineInput = screen.getByLabelText("Headline");

    await user.clear(headlineInput);
    await user.type(headlineInput, "Updated headline");

    expect(screen.getByText("Updated headline")).toBeInTheDocument();
  });
});
