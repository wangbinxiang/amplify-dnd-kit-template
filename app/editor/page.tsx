import Link from "next/link";

import { listPageSchemas } from "@/lib/page-content";

export default async function EditorIndexPage() {
  const pages = await listPageSchemas();

  return (
    <main className="shell">
      <section className="surface intro">
        <p className="eyebrow">Editor index</p>
        <h1>Select a page to edit</h1>
      </section>

      <section className="surface">
        <div className="page-list">
          {pages.map((page) => (
            <article className="page-card" key={page.slug}>
              <h2>{page.title}</h2>
              <div className="page-card-actions">
                <Link className="secondary-button" href={`/${page.slug}`}>
                  Preview
                </Link>
                <Link className="button" href={`/editor/${page.slug}`}>
                  Edit schema
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
