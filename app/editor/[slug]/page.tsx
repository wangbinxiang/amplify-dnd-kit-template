import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorShell } from "@/components/editor/editor-shell";
import { isPageSchemaNotFoundError, loadPageSchema } from "@/lib/page-content";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const page = await loadPageSchema(slug);

    return (
      <main className="shell editor-shell-page">
        <div className="page-actions">
          <Link className="secondary-button" href="/">
            Back to index
          </Link>
          <Link className="secondary-button" href={`/${page.slug}`}>
            Preview page
          </Link>
        </div>
        <EditorShell initialPage={page} />
      </main>
    );
  } catch (error) {
    if (isPageSchemaNotFoundError(error)) {
      notFound();
    }

    throw error;
  }
}
