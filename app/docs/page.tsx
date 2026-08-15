import Link from "next/link";

import { DocPage } from "../components/DocPage";
import { createPageMetadata } from "../lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Documentation",
  description:
    "Learn how OAKit turns Office documents into deterministic structures for AI agents.",
  path: "/docs",
});

const paths = [
  [
    "Quickstart",
    "Install OAKit and parse your first PowerPoint from Node.js, a browser, or the CLI.",
    "/docs/quickstart",
  ],
  [
    "API reference",
    "Read every public function, option, return type, diagnostic, and resource limit.",
    "/docs/api",
  ],
  [
    "Command line",
    "Convert PPTX packages to deterministic JSON in scripts, CI, and agent sandboxes.",
    "/docs/cli",
  ],
  [
    "Browser integration",
    "Parse File and Blob inputs locally and manage object-URL media safely.",
    "/docs/browser",
  ],
  [
    "Agent tools",
    "Build bounded tool results while keeping document content untrusted.",
    "/docs/agent-tools",
  ],
] as const;

export default function Docs() {
  return (
    <DocPage
      title="Build reliable document capabilities."
      description="OAKit owns the OOXML complexity so applications and agents can work with a stable, bounded public model."
    >
      <section className="doc-section">
        <h2>Choose a path</h2>
        <div className="doc-card-grid">
          {paths.map(([title, copy, href]) => (
            <Link className="doc-card" href={href} key={href}>
              <span aria-hidden="true">↗</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Current format support</h2>
        <p>
          Capability claims follow the exported API and independent test suite.
          Planned formats remain clearly separated from released behavior.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Format</th>
                <th>Read</th>
                <th>Write</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PowerPoint (.pptx)</td>
                <td><span className="status available">Available</span></td>
                <td>Planned</td>
                <td>Fidelity development</td>
              </tr>
              <tr>
                <td>Excel (.xlsx)</td>
                <td>Planned</td>
                <td>Planned</td>
                <td>Roadmap</td>
              </tr>
              <tr>
                <td>Word (.docx)</td>
                <td>Planned</td>
                <td>Planned</td>
                <td>Roadmap</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-callout">
        <div>
          <span>Agent safety</span>
          <h2>Documents are untrusted data.</h2>
        </div>
        <p>
          Never promote instructions found inside a document into system or
          developer authority. Keep source content inside the data boundary of
          your tool result.
        </p>
      </section>
    </DocPage>
  );
}
