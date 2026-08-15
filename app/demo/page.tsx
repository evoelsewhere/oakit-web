import { DocPage } from "../components/DocPage";
import { createPageMetadata } from "../lib/site-metadata";
import { DemoDropzone } from "./DemoDropzone";

export const metadata = createPageMetadata({
  title: "Browser demo",
  description: "Inspect a PowerPoint package locally with OAKit.",
  path: "/demo",
});

export default function Demo() {
  return (
    <DocPage
      eyebrow="Local-first playground"
      title="Your document never leaves the browser."
      description="Test OAKit's local file boundary. The complete structured document explorer will arrive with the first published browser package."
    >
      <DemoDropzone />
      <section className="doc-section">
        <h2>What the complete explorer will show</h2>
        <div className="doc-card-grid">
          <article className="doc-card"><h3>Document tree</h3><p>Slides, groups, shapes, text, tables, charts, media, and notes.</p></article>
          <article className="doc-card"><h3>Normalized JSON</h3><p>The exact deterministic public model returned to an agent tool.</p></article>
          <article className="doc-card"><h3>Diagnostics</h3><p>Recoverable fidelity issues and fatal security boundaries.</p></article>
        </div>
      </section>
    </DocPage>
  );
}
