import type { ReactNode } from "react";
import Link from "next/link";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

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
  title: string;
}

export function DocPage({
  children,
  description,
  eyebrow = "Documentation",
  title,
}: DocPageProps) {
  return (
    <main>
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
