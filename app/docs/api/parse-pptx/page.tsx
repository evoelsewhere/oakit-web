import { DocPage } from "../../../components/DocPage";
import { ReferenceTable } from "../../../components/ReferenceTable";
import { createPageMetadata } from "../../../lib/site-metadata";

const description =
  "Detailed reference for parsePptx and parsePptxWithDiagnostics, including inputs, options, defaults, and execution behavior.";

export const metadata = createPageMetadata({
  title: "Parsing PPTX",
  description,
  path: "/docs/api/parse-pptx",
});

const options = [
  [
    "imageMode",
    "base64 | blob | both | none",
    "base64",
    "Select image data URLs, object URLs, both representations, or no image payload.",
  ],
  [
    "videoMode",
    "blob | none",
    "none",
    "Create object URLs for embedded video, or preserve only the package ref.",
  ],
  [
    "audioMode",
    "blob | none",
    "none",
    "Create object URLs for embedded audio, or preserve only the package ref.",
  ],
  [
    "errorMode",
    "tolerant | strict",
    "tolerant",
    "Recover optional failures with diagnostics, or reject on the first reported failure.",
  ],
  [
    "limits",
    "PptxResourceLimits",
    "safe defaults",
    "Override positive integer limits for input, ZIP, XML, media, and slides.",
  ],
] as const;

export default function ParsePptxReference() {
  return (
    <DocPage
      eyebrow="API · PowerPoint"
      title="Parse PowerPoint packages."
      description={description}
    >
      <section className="doc-section">
        <h2>parsePptx</h2>
        <div className="api-signature">{`function parsePptx(
  input: PptxInput,
  options?: PptxParseOptions,
): Promise<PptxDocument>`}</div>
        <p>
          Parses one PowerPoint Open XML package and resolves to the normalized
          document. In tolerant mode, recoverable diagnostics are not included
          in this return value; use <code>parsePptxWithDiagnostics</code> when
          the caller must evaluate fidelity.
        </p>
        <div className="api-badges">
          <span>async</span><span>deterministic</span><span>input is not mutated</span>
        </div>
      </section>

      <section className="doc-section">
        <h2>parsePptxWithDiagnostics</h2>
        <div className="api-signature">{`function parsePptxWithDiagnostics(
  input: PptxInput,
  options?: PptxParseOptions,
): Promise<{
  document: PptxDocument;
  diagnostics: PptxDiagnostic[];
}>`}</div>
        <p>
          Uses the same parser and model, but returns every deduplicated warning
          or error collected during tolerant recovery. This is the recommended
          function for uploads, agent tools, indexing, and batch pipelines.
        </p>
      </section>

      <section className="doc-section">
        <h2>Accepted input</h2>
        <ReferenceTable
          headings={["Input", "Runtime", "Typical source"]}
          codeColumns={[0, 1]}
          rows={[
            ["Uint8Array", "Node.js + browser", "fs.readFile, fetch, or an existing byte buffer."],
            ["ArrayBuffer", "Node.js + browser", "Response.arrayBuffer or an ArrayBuffer slice."],
            ["Blob", "Browser", "File picker, drag-and-drop, or a fetched Blob."],
          ]}
        />
        <p className="field-note">
          A Node.js <code>Buffer</code> is accepted because Buffer extends
          <code>Uint8Array</code>. Inputs are read but never mutated.
        </p>
      </section>

      <section className="doc-section">
        <h2>Options and defaults</h2>
        <ReferenceTable
          headings={["Option", "Type", "Default", "Behavior"]}
          codeColumns={[0, 1, 2]}
          rows={options}
        />
        <p>
          For agent and server workloads, set <code>imageMode: &apos;none&apos;</code>
          unless image bytes are explicitly required. The programmatic default
          is base64 for compatibility; the CLI uses none to keep JSON bounded.
        </p>
      </section>

      <section className="doc-section">
        <h2>Node.js example</h2>
        <div className="code-block">
          <div><span>Node.js</span></div>
          <pre><code>{`import { readFile } from 'node:fs/promises';
import { parsePptxWithDiagnostics } from 'oakit';

const bytes = await readFile('./quarterly-review.pptx');
const result = await parsePptxWithDiagnostics(bytes, {
  imageMode: 'none',
  videoMode: 'none',
  audioMode: 'none',
  errorMode: 'tolerant',
});

if (result.diagnostics.some(({ severity }) => severity === 'error')) {
  console.warn('The document was only partially recovered');
}

console.log(result.document.size, result.document.slides.length);`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Browser example</h2>
        <div className="code-block">
          <div><span>Browser</span></div>
          <pre><code>{`import { parsePptx } from 'oakit/pptx';

const input = document.querySelector<HTMLInputElement>('#presentation');
const file = input?.files?.[0];

if (file) {
  const presentation = await parsePptx(file, {
    imageMode: 'blob',
    errorMode: 'strict',
  });

  console.log(presentation.slides);
}`}</code></pre>
        </div>
        <p>
          Blob modes call <code>URL.createObjectURL</code>. The application owns
          every returned object URL and must revoke it when the document view is
          discarded.
        </p>
      </section>

      <section className="doc-section">
        <h2>Execution guarantees</h2>
        <ul className="check-list">
          <li>The same input and options produce the same public document.</li>
          <li>Concurrent parse calls do not share mutable document state.</li>
          <li>External relationships are preserved where modeled but never fetched.</li>
          <li>Unsafe relationship paths are skipped in tolerant mode and rejected in strict mode.</li>
          <li>Resource-limit violations always reject, even in tolerant mode.</li>
        </ul>
      </section>
    </DocPage>
  );
}
