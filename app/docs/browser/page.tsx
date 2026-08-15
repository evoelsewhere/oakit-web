import { DocPage } from "../../components/DocPage";
import { ReferenceTable } from "../../components/ReferenceTable";
import { createPageMetadata } from "../../lib/site-metadata";

const description =
  "Use OAKit in modern browsers with File and Blob inputs, local-only parsing, media object URLs, cleanup, and worker isolation.";

export const metadata = createPageMetadata({
  title: "Browser integration",
  description,
  path: "/docs/browser",
});

export default function BrowserGuide() {
  return (
    <DocPage
      eyebrow="Runtime guide"
      path="/docs/browser"
      title="Parse locally in the browser."
      description={description}
    >
      <section className="doc-section">
        <h2>Minimal file picker</h2>
        <div className="code-block">
          <div><span>browser.ts</span></div>
          <pre><code>{`import { parsePptxWithDiagnostics } from 'oakit/pptx';

const picker = document.querySelector<HTMLInputElement>('#presentation');

picker?.addEventListener('change', async () => {
  const file = picker.files?.[0];
  if (!file) return;

  const { document, diagnostics } =
    await parsePptxWithDiagnostics(file, {
      imageMode: 'none',
      videoMode: 'none',
      audioMode: 'none',
      errorMode: 'tolerant',
    });

  console.log({ slideCount: document.slides.length, diagnostics });
});`}</code></pre>
        </div>
        <div className="api-signature">{`<input
  id="presentation"
  type="file"
  accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
/>`}</div>
      </section>

      <section className="doc-section">
        <h2>Browser input sources</h2>
        <ReferenceTable
          headings={["Source", "Pass to parser", "Notes"]}
          codeColumns={[1]}
          rows={[
            ["File input or drag-and-drop", "File (Blob)", "Pass the File directly; no FileReader is required."],
            ["fetch", "await response.arrayBuffer()", "Check response.ok and an outer download-size limit first."],
            ["IndexedDB or cache", "Blob | ArrayBuffer", "Read the stored binary and pass it without conversion when possible."],
            ["WebSocket or custom stream", "Uint8Array", "Assemble a bounded complete package before parsing."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>Choose media modes deliberately</h2>
        <ReferenceTable
          headings={["Mode", "Output", "Use case", "Cleanup"]}
          codeColumns={[0, 1]}
          rows={[
            ["imageMode: 'none'", "ref only", "Search, text extraction, agents, large batches.", "None."],
            ["imageMode: 'base64'", "data URL", "Serializable JSON or small previews.", "Garbage collected with the model."],
            ["imageMode: 'blob'", "object URL", "Efficient in-page rendering.", "URL.revokeObjectURL required."],
            ["imageMode: 'both'", "data + object URL", "Only when both consumers are required.", "Revoke the object URL."],
            ["video/audio: 'blob'", "object URL", "Local media playback.", "URL.revokeObjectURL required."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>Release every object URL</h2>
        <p>
          Object URLs can appear on images, media, equation fallback pictures,
          image fills, nested groups, layout elements, and slide fills. Revoke
          them when replacing or unmounting the document.
        </p>
        <div className="code-block">
          <div><span>media-cleanup.ts</span></div>
          <pre><code>{`import type { Element, Fill, PptxDocument } from 'oakit/pptx';

function releaseFill(fill: Fill | null) {
  if (fill?.type === 'image' && fill.value.blob) {
    URL.revokeObjectURL(fill.value.blob);
  }
}

function releaseElement(element: Element): void {
  if (element.type === 'shape' || element.type === 'text') {
    releaseFill(element.fill);
  }

  if (
    (element.type === 'image' ||
      element.type === 'video' ||
      element.type === 'audio') &&
    element.blob
  ) {
    URL.revokeObjectURL(element.blob);
  }

  if (element.type === 'math' && element.picBlob) {
    URL.revokeObjectURL(element.picBlob);
  }

  if (element.type === 'group' || element.type === 'diagram') {
    element.elements.forEach(releaseElement);
  }
}

export function releaseDocument(document: PptxDocument) {
  for (const slide of document.slides) {
    releaseFill(slide.fill);
    slide.elements.forEach(releaseElement);
    slide.layoutElements.forEach(releaseElement);
  }
}`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Move large parses off the UI thread</h2>
        <p>
          A Web Worker prevents parsing from blocking input and rendering. Send
          an <code>ArrayBuffer</code> as a transferable and keep object-URL
          creation in the browsing context that consumes the result.
        </p>
        <div className="code-block">
          <div><span>pptx.worker.ts</span></div>
          <pre><code>{`import { parsePptxWithDiagnostics } from 'oakit/pptx';

self.onmessage = async ({ data }: MessageEvent<ArrayBuffer>) => {
  try {
    const result = await parsePptxWithDiagnostics(data, {
      imageMode: 'base64',
      videoMode: 'none',
      audioMode: 'none',
      errorMode: 'tolerant',
    });
    self.postMessage({ ok: true, result });
  } catch (error) {
    self.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Browser safety checklist</h2>
        <ul className="check-list">
          <li>Validate extension, MIME hint, and file size before parsing.</li>
          <li>Keep OAKit resource limits enabled even for local-only files.</li>
          <li>Do not fetch URLs found in document relationships.</li>
          <li>Sanitize rich-text HTML again before injecting it into the DOM.</li>
          <li>Revoke object URLs and terminate workers when the view closes.</li>
        </ul>
      </section>
    </DocPage>
  );
}
