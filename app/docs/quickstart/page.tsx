import Link from "next/link";

import { DocPage } from "../../components/DocPage";
import { createPageMetadata } from "../../lib/site-metadata";

const description =
  "Install OAKit and parse a PowerPoint file into structured JSON from Node.js, a browser, or the command line with bounded, safe defaults.";

export const metadata = createPageMetadata({
  title: "Quickstart: parse PowerPoint files",
  description,
  path: "/docs/quickstart",
});

export default function Quickstart() {
  return (
    <DocPage
      eyebrow="Getting started"
      path="/docs/quickstart"
      title="Parse your first document."
      description={description}
    >
      <section className="doc-section">
        <h2>Install</h2>
        <div className="code-block">
          <div><span>npm</span></div>
          <pre><code>npm install oakit</code></pre>
        </div>
        <p className="doc-note">
          The first public package is not published yet. These commands become
          active with the initial npm release.
        </p>
      </section>

      <section className="doc-section">
        <h2>Node.js API</h2>
        <div className="code-block">
          <div><span>TypeScript</span></div>
          <pre><code>{`import { readFile } from 'node:fs/promises';
import { parsePptxWithDiagnostics } from 'oakit';

const input = await readFile('./deck.pptx');
const { document, diagnostics } =
  await parsePptxWithDiagnostics(input, {
    imageMode: 'none',
    errorMode: 'tolerant',
  });

console.log(document.slides.length, diagnostics);`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Command line</h2>
        <div className="code-block">
          <div><span>Terminal</span></div>
          <pre><code>{`npx oakit deck.pptx --pretty
oakit convert deck.pptx --output deck.json
cat deck.pptx | oakit - --format pptx > deck.json`}</code></pre>
        </div>
        <p>
          The CLI writes JSON to stdout by default and structured errors to
          stderr. Exit code 1 indicates a read or conversion error; exit code 2
          indicates invalid command usage.
        </p>
      </section>

      <section className="doc-section">
        <h2>Safe defaults</h2>
        <ul className="check-list">
          <li>Images are omitted by the CLI unless explicitly enabled.</li>
          <li>Audio and video payloads are never emitted by the CLI.</li>
          <li>External relationships are preserved but never fetched.</li>
          <li>Resource-limit failures remain fatal in tolerant mode.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Continue with the full reference</h2>
        <div className="doc-card-grid">
          <Link className="doc-card" href="/docs/api/parse-pptx">
            <span aria-hidden="true">↗</span>
            <h3>Parsing API</h3>
            <p>Every input, option, default, and execution guarantee.</p>
          </Link>
          <Link className="doc-card" href="/docs/api/document-model">
            <span aria-hidden="true">↗</span>
            <h3>Document model</h3>
            <p>Field-level reference for slides and every element type.</p>
          </Link>
          <Link className="doc-card" href="/docs/api/diagnostics">
            <span aria-hidden="true">↗</span>
            <h3>Diagnostics</h3>
            <p>Error codes, strict mode, recovery, and resource limits.</p>
          </Link>
        </div>
      </section>
    </DocPage>
  );
}
