import { DocPage } from "../components/DocPage";
import { createPageMetadata } from "../lib/site-metadata";
import { DemoDropzone } from "./DemoDropzone";

const description =
  "Try OAKit's local-first PowerPoint browser demo and validate PPTX package boundaries without uploading document content to a server.";

export const metadata = createPageMetadata({
  title: "Browser demo",
  description,
  path: "/demo",
});

export default function Demo() {
  return (
    <DocPage
      eyebrow="Local-first playground"
      path="/demo"
      schemaType="WebPage"
      title="Your document never leaves the browser."
      description={description}
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
