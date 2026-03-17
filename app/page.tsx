import Link from "next/link";

import { listPageSchemas } from "@/lib/page-content";

export default async function HomePage() {
  const pages = await listPageSchemas();

  return (
    <main className="shell">
      <section className="surface intro">
        <p className="eyebrow">Schema-driven editor</p>
        <h1>Amplify MVP</h1>
        <p>
          Pages are stored as JSON in the repository, rendered at runtime with a
          shared renderer, and edited in-app with section-level drag-and-drop.
        </p>
      </section>

      <section className="surface">
        <h2>Available pages</h2>
        <div className="page-list">
          {pages.map((page) => (
            <article className="page-card" key={page.slug}>
              <h3>{page.title}</h3>
              <p>Schema file: `src/content/pages/{page.slug}.json`</p>
              <div className="page-card-actions">
                <Link className="button" href={`/${page.slug}`}>
                  View page
                </Link>
                <Link className="secondary-button" href={`/editor/${page.slug}`}>
                  Open editor
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
