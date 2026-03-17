import Link from "next/link";
import { notFound } from "next/navigation";

import { PageRenderer } from "@/components/page-renderer";
import { loadPageSchema } from "@/lib/page-content";

function isMissingFileError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export default async function RuntimePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const page = await loadPageSchema(slug);

    return (
      <main className="shell">
        <div className="page-actions">
          <Link className="secondary-button" href="/">
            Back to index
          </Link>
          <Link className="button" href={`/editor/${page.slug}`}>
            Edit page
          </Link>
        </div>
        <PageRenderer page={page} />
      </main>
    );
  } catch (error) {
    if (isMissingFileError(error)) {
      notFound();
    }

    throw error;
  }
}
