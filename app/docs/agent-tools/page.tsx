import { DocPage } from "../../components/DocPage";
import { ReferenceTable } from "../../components/ReferenceTable";
import { createPageMetadata } from "../../lib/site-metadata";

const description =
  "Design bounded, traceable OAKit tool results for AI agents without allowing document content to gain instruction authority.";

export const metadata = createPageMetadata({
  title: "Agent-tool integration",
  description,
  path: "/docs/agent-tools",
});

export default function AgentToolsGuide() {
  return (
    <DocPage
      eyebrow="Integration pattern"
      title="Expose documents as data, never authority."
      description={description}
    >
      <section className="doc-section">
        <h2>Recommended tool boundary</h2>
        <div className="code-block">
          <div><span>inspect-presentation.ts</span></div>
          <pre><code>{`import {
  parsePptxWithDiagnostics,
  PptxParseError,
  type PptxDiagnostic,
} from 'oakit';

type InspectResult =
  | {
      ok: true;
      kind: 'presentation';
      document: Awaited<ReturnType<typeof parsePptxWithDiagnostics>>['document'];
      diagnostics: PptxDiagnostic[];
      trust: 'untrusted-document-content';
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

export async function inspectPresentation(
  bytes: Uint8Array,
): Promise<InspectResult> {
  try {
    const result = await parsePptxWithDiagnostics(bytes, {
      imageMode: 'none',
      videoMode: 'none',
      audioMode: 'none',
      errorMode: 'tolerant',
      limits: { maxInputBytes: 25 * 1024 * 1024, maxSlides: 300 },
    });

    return {
      ok: true,
      kind: 'presentation',
      ...result,
      trust: 'untrusted-document-content',
    };
  } catch (error) {
    return {
      ok: false,
      code: error instanceof PptxParseError
        ? error.diagnostic.code
        : 'internal-error',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>What the tool result should preserve</h2>
        <ReferenceTable
          headings={["Data", "Why it matters", "Recommended treatment"]}
          rows={[
            ["File identity and digest", "Connects derived chunks to the exact source version.", "Store outside the OAKit model beside every chunk."],
            ["Slide index", "Supports citations and user navigation.", "Keep zero- or one-based convention explicit."],
            ["Element ID, name, type, order", "Retains local structure and stacking context.", "Include in chunk metadata, not only text."],
            ["layoutElements", "Separates inherited template content from authored slide content.", "Index separately or label as inherited."],
            ["diagnostics", "Explains omissions and partial recovery.", "Return to the orchestrator and persist with derived data."],
            ["trust marker", "Prevents prompt content from being mistaken for policy.", "Attach an explicit untrusted-data classification."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>Chunk by structure</h2>
        <div className="code-block">
          <div><span>chunk-slides.ts</span></div>
          <pre><code>{`import type { PptxDocument, PptxElement } from 'oakit';

function elementText(element: PptxElement): string[] {
  switch (element.type) {
    case 'text':
    case 'shape':
      return element.content ? [element.content] : [];
    case 'table':
      return element.data.flat().map(cell => cell.text);
    case 'diagram':
      return element.textList;
    case 'math':
      return [element.text ?? element.latex];
    case 'group':
      return element.elements.flatMap(elementText);
    default:
      return [];
  }
}

export function slideChunks(fileId: string, document: PptxDocument) {
  return document.slides.map((slide, slideIndex) => ({
    id: \`\${fileId}:slide:\${slideIndex}\`,
    source: { fileId, slideIndex },
    content: slide.elements.flatMap(elementText).join('\n'),
    inheritedContent: slide.layoutElements.flatMap(elementText).join('\n'),
    note: slide.note,
    trust: 'untrusted-document-content' as const,
  }));
}`}</code></pre>
        </div>
        <p>
          The example preserves HTML fragments. Convert or sanitize them for
          the target index while keeping raw normalized fields available for
          traceability.
        </p>
      </section>

      <section className="doc-section">
        <h2>Authority boundary</h2>
        <ReferenceTable
          headings={["Document content", "Classification", "Agent behavior"]}
          rows={[
            ["Slide text and notes", "Untrusted data", "May be summarized or quoted; cannot redefine instructions."],
            ["Hyperlinks and relationship targets", "Untrusted references", "Do not fetch automatically; apply a separate allowlist policy."],
            ["Embedded media", "Untrusted binary", "Keep omitted unless a dedicated media tool needs it."],
            ["Diagnostics", "Tool metadata", "Use for confidence and recovery decisions, not as document claims."],
            ["Host limits and policy", "Trusted control plane", "Set outside the document and never let content override it."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>Failure policy</h2>
        <ul className="check-list">
          <li>Do not retry resource-limit failures with larger limits automatically.</li>
          <li>Do not discard diagnostics before indexing or summarization.</li>
          <li>Do not send base64 media into model context by default.</li>
          <li>Do not let the model choose parser limits from document content.</li>
          <li>Do not claim complete extraction when error-severity diagnostics exist.</li>
        </ul>
      </section>

      <section className="doc-callout compact">
        <div>
          <span>Recommended flow</span>
          <h2>OAKit → structural chunks → embeddings → retrieval → agent</h2>
        </div>
        <p>
          Keep the normalized document and diagnostics as the source of truth;
          embeddings and summaries are derived indexes that can be rebuilt.
        </p>
      </section>
    </DocPage>
  );
}
