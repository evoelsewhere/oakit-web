import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { searchSite } from "../lib/search";

const description =
  "Search OAKit documentation, API references, guides, examples, architecture notes, and release information.";

export const metadata: Metadata = {
  title: "Search",
  description,
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? "";
  const results = searchSite(query);

  return (
    <main>
      <SiteHeader />
      <section className="search-page shell">
        <header className="search-header">
          <p className="kicker">Site search</p>
          <h1>Search OAKit</h1>
          <p>{description}</p>
        </header>

        <form className="search-page-form" action="/search" role="search">
          <label htmlFor="search-page-query">What are you looking for?</label>
          <div>
            <input
              id="search-page-query"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Try “browser”, “diagnostics”, or “CLI”"
            />
            <button type="submit">Search</button>
          </div>
        </form>

        {query ? (
          <section className="search-results" aria-live="polite">
            <div className="search-results-meta">
              <h2>
                {results.length} {results.length === 1 ? "result" : "results"}
              </h2>
              <p>
                for <strong>“{query}”</strong>
              </p>
            </div>

            {results.length > 0 ? (
              <div className="search-results-list">
                {results.map((result) => (
                  <Link href={result.href} key={result.href}>
                    <span>{result.category}</span>
                    <h3>{result.title}</h3>
                    <p>{result.description}</p>
                    <small>{result.href}</small>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="search-empty">
                <h2>No matching pages</h2>
                <p>
                  Try a broader term such as “PPTX”, “API”, “browser”, or
                  “agent”.
                </p>
              </div>
            )}
          </section>
        ) : (
          <div className="search-empty search-empty-initial">
            <h2>Search all OAKit resources</h2>
            <p>
              Results cover documentation, API references, guides, the browser
              demo, architecture, and release notes.
            </p>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
