import { DocPage } from "../components/DocPage";
import { createPageMetadata } from "../lib/site-metadata";
import { DemoWorkspace } from "./DemoWorkspace";

const description =
  "Explore OAKit's local-first workspace prepared for PPTX, XLSX, and DOCX conversion, JSON inspection, format previews, and downloads before npm integration.";

export const metadata = createPageMetadata({
  title: "Browser demo",
  description,
  path: "/demo",
});

export default function Demo() {
  return (
    <DocPage
      eyebrow="Local-first document studio"
      path="/demo"
      schemaType="WebPage"
      title="Office and JSON, side by side."
      wide
      description={description}
    >
      <DemoWorkspace />
      <section className="doc-section">
        <h2>Ready for the package integration</h2>
        <p>
          The workspace keeps file handling, normalized JSON, visual preview,
          diagnostics, and export as separate adapters. Publishing the npm
          package will connect behavior without redesigning the interface.
        </p>
        <div className="doc-card-grid">
          <article className="doc-card"><h3>Parser and writer adapters</h3><p>One isolated adapter per verified package export and Office format.</p></article>
          <article className="doc-card"><h3>Format preview adapters</h3><p>Slides, worksheets, and document pages render from the normalized model.</p></article>
          <article className="doc-card"><h3>Local export boundary</h3><p>Generated JSON and Office files download without leaving the browser.</p></article>
        </div>
      </section>
    </DocPage>
  );
}
