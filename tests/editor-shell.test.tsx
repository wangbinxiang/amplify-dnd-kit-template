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
      elements: [
        {
          id: "hero-heading-1",
          type: "heading",
          props: { text: "Initial headline" },
        },
        {
          id: "hero-copy-1",
          type: "copy",
          props: { text: "Initial subheadline" },
        },
        {
          id: "hero-button-1",
          type: "button",
          props: { label: "Start", href: "/start" },
        },
      ],
    },
    {
      id: "footer-1",
      type: "footer",
      elements: [
        {
          id: "footer-copy-1",
          type: "copyright",
          props: { text: "2026 Amplify" },
        },
      ],
    },
  ],
};

describe("EditorShell", () => {
  it("updates the preview when the selected element fields change", async () => {
    const user = userEvent.setup();

    render(<EditorShell initialPage={page} />);

    await user.click(screen.getByRole("button", { name: "hero-heading-1" }));

    const textInput = screen.getByLabelText("Text");

    await user.clear(textInput);
    await user.type(textInput, "Updated headline");

    expect(screen.getByText("Updated headline")).toBeInTheDocument();
  });
});
