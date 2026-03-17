import { beforeEach, describe, expect, it, vi } from "vitest";

const { loadPageSchemaMock, notFoundError, notFoundMock } = vi.hoisted(() => {
  const sentinel = new Error("NEXT_NOT_FOUND");

  return {
    loadPageSchemaMock: vi.fn(),
    notFoundError: sentinel,
    notFoundMock: vi.fn(() => {
      throw sentinel;
    }),
  };
});

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("@/lib/page-content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/page-content")>();

  return {
    ...actual,
    loadPageSchema: loadPageSchemaMock,
  };
});

vi.mock("@/components/page-renderer", () => ({
  PageRenderer: () => <div>Page renderer</div>,
}));

vi.mock("@/components/editor/editor-shell", () => ({
  EditorShell: () => <div>Editor shell</div>,
}));

import EditorPage from "../app/editor/[slug]/page";
import RuntimePage from "../app/[slug]/page";

function createInvalidSlugError() {
  const error = new Error("Invalid slug.");

  return Object.assign(error, { code: "EINVAL" });
}

describe("dynamic page routes", () => {
  beforeEach(() => {
    loadPageSchemaMock.mockReset();
    notFoundMock.mockClear();
  });

  it("treats invalid runtime slugs as not found", async () => {
    loadPageSchemaMock.mockRejectedValueOnce(createInvalidSlugError());

    await expect(
      RuntimePage({ params: Promise.resolve({ slug: "favicon.ico" }) }),
    ).rejects.toBe(notFoundError);

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("treats invalid editor slugs as not found", async () => {
    loadPageSchemaMock.mockRejectedValueOnce(createInvalidSlugError());

    await expect(
      EditorPage({ params: Promise.resolve({ slug: "favicon.ico" }) }),
    ).rejects.toBe(notFoundError);

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });
});
