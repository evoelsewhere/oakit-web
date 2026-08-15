import type { ReactNode } from "react";
import Link from "next/link";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StructuredData } from "./StructuredData";
import { SITE_URL } from "../lib/site-metadata";

const sectionGroups = [
  [
    "Start",
    [
      ["Overview", "/docs"],
      ["Quickstart", "/docs/quickstart"],
    ],
  ],
  [
    "API reference",
    [
      ["API overview", "/docs/api"],
      ["Parsing PPTX", "/docs/api/parse-pptx"],
      ["Document model", "/docs/api/document-model"],
      ["Diagnostics & limits", "/docs/api/diagnostics"],
    ],
  ],
  [
    "Using OAKit",
    [
      ["Command line", "/docs/cli"],
      ["Browser", "/docs/browser"],
      ["Agent tools", "/docs/agent-tools"],
      ["Integration guides", "/guides"],
    ],
  ],
  [
    "Project",
    [
      ["Browser demo", "/demo"],
      ["Architecture", "/architecture"],
      ["Changelog", "/changelog"],
    ],
  ],
] as const;

interface DocPageProps {
  children: ReactNode;
  description: string;
  eyebrow?: string;
  path: string;
  schemaType?: "CollectionPage" | "TechArticle" | "WebPage";
  title: string;
}

const breadcrumbLabels: Record<string, string> = {
  "/docs": "Documentation",
  "/docs/quickstart": "Quickstart",
  "/docs/api": "API reference",
  "/docs/api/parse-pptx": "Parsing PPTX",
  "/docs/api/document-model": "Document model",
  "/docs/api/diagnostics": "Diagnostics and limits",
  "/docs/cli": "Command line",
  "/docs/browser": "Browser integration",
  "/docs/agent-tools": "Agent tools",
  "/guides": "Guides",
  "/demo": "Browser demo",
  "/architecture": "Architecture",
  "/changelog": "Changelog",
};

function createBreadcrumbs(path: string) {
  const crumbs = [{ name: "Home", path: "/" }];
  const segments = path.split("/").filter(Boolean);

  segments.forEach((_, index) => {
    const currentPath = `/${segments.slice(0, index + 1).join("/")}`;
    crumbs.push({
      name: breadcrumbLabels[currentPath] ?? segments[index],
      path: currentPath,
    });
  });

  return crumbs;
}

export function DocPage({
  children,
  description,
  eyebrow = "Documentation",
  path,
  schemaType = "TechArticle",
  title,
}: DocPageProps) {
  const breadcrumbs = createBreadcrumbs(path);
  const canonical = `${SITE_URL}${path}`;
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${SITE_URL}${crumb.path === "/" ? "" : crumb.path}`,
        })),
      },
      {
        "@type": schemaType,
        "@id": `${canonical}#content`,
        url: canonical,
        name: title,
        headline: title,
        description,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#software` },
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <main>
      <StructuredData data={pageStructuredData} />
      <SiteHeader />
      <div className="docs-layout shell">
        <aside className="docs-sidebar" aria-label="Documentation sections">
          <nav>
            {sectionGroups.map(([group, sections]) => (
              <div className="docs-nav-group" key={group}>
                <p>{group}</p>
                {sections.map(([label, href]) => (
                  <Link href={href} key={href}>
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidebar-note">
            <span>Current release</span>
            <strong>Pre-stable · 0.0.0</strong>
          </div>
        </aside>

        <article className="doc-content">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path}>
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.path}>{crumb.name}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <header className="doc-header">
            <p className="kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          {children}
        </article>
      </div>
      <SiteFooter />
    </main>
  );
}
