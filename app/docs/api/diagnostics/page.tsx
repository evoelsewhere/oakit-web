import { DocPage } from "../../../components/DocPage";
import { ReferenceTable } from "../../../components/ReferenceTable";
import { createPageMetadata } from "../../../lib/site-metadata";

const description =
  "OAKit diagnostic codes, strict and tolerant error behavior, PptxParseError handling, and every resource-limit default.";

export const metadata = createPageMetadata({
  title: "Diagnostics and resource limits",
  description,
  path: "/docs/api/diagnostics",
});

const diagnosticCodes = [
  ["invalid-document-structure", "Required OOXML root or structural node is missing or invalid.", "error"],
  ["invalid-document-value", "A required numeric/document value is invalid; non-finite output is normalized where recovery is possible.", "error"],
  ["invalid-package", "Input cannot be opened as an OPC/ZIP package.", "error · fatal"],
  ["invalid-relationship-target", "A relationship target is unsafe, invalid, or escapes its package boundary.", "warning"],
  ["missing-required-part", "A required package part is absent or has an empty name.", "error"],
  ["resource-limit-exceeded", "An input, archive, XML, media, or slide limit was crossed.", "error · fatal"],
  ["xml-parse-failed", "An OOXML part was read but could not be parsed as valid XML.", "warning or error"],
  ["xml-read-failed", "An OOXML part could not be expanded or read.", "warning or error"],
] as const;

const limits = [
  ["maxInputBytes", "104,857,600", "100 MiB", "Compressed input bytes."],
  ["maxEntries", "10,000", "entries", "Non-directory ZIP entries."],
  ["maxTotalUncompressedBytes", "268,435,456", "256 MiB", "Declared and consumed package expansion."],
  ["maxPartBytes", "67,108,864", "64 MiB", "Any single expanded package part."],
  ["maxXmlBytes", "16,777,216", "16 MiB", "One expanded XML part."],
  ["maxXmlDepth", "128", "levels", "XML element nesting depth."],
  ["maxXmlNodes", "250,000", "nodes", "XML elements in one part."],
  ["maxTotalXmlNodes", "1,000,000", "nodes", "XML elements across the package."],
  ["maxMediaBytes", "67,108,864", "64 MiB", "One expanded media part."],
  ["maxSlides", "1,000", "slides", "Slides selected by the presentation manifest."],
] as const;

export default function DiagnosticsReference() {
  return (
    <DocPage
      eyebrow="API · Reliability"
      path="/docs/api/diagnostics"
      title="Recover fidelity failures, stop security failures."
      description={description}
    >
      <section className="doc-section">
        <h2>Recommended control flow</h2>
        <div className="code-block">
          <div><span>TypeScript</span></div>
          <pre><code>{`import {
  parsePptxWithDiagnostics,
  PptxParseError,
} from 'oakit';

try {
  const { document, diagnostics } =
    await parsePptxWithDiagnostics(bytes, {
      errorMode: 'tolerant',
      imageMode: 'none',
    });

  const incomplete = diagnostics.some(
    diagnostic => diagnostic.severity === 'error',
  );

  return { document, diagnostics, incomplete };
} catch (error) {
  if (error instanceof PptxParseError) {
    console.error(error.diagnostic.code, error.diagnostic.part);
  }
  throw error;
}`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>PptxParseError</h2>
        <div className="api-signature">{`class PptxParseError extends Error {
  readonly diagnostic: PptxDiagnostic;
}`}</div>
        <p>
          Catch this class instead of parsing error-message text. Its
          <code>diagnostic</code> contains the stable code, human-readable
          message, optional package part, and severity.
        </p>
        <ReferenceTable
          headings={["Diagnostic field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={[
            ["code", "PptxDiagnosticCode", "Machine-readable failure category."],
            ["message", "string", "Human-readable context; do not branch on this value."],
            ["part", "string?", "Owning or failing OPC part when known."],
            ["severity", "error | warning", "Impact assigned by the parser."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>Strict versus tolerant</h2>
        <ReferenceTable
          headings={["Condition", "tolerant", "strict"]}
          rows={[
            ["Malformed optional XML", "Continue, omit affected optional content, record diagnostic.", "Reject with PptxParseError."],
            ["Unsafe relationship target", "Skip target and record warning.", "Reject with PptxParseError."],
            ["Missing required part", "Return the recoverable partial model and error diagnostic where possible.", "Reject with PptxParseError."],
            ["Invalid ZIP/OPC package", "Reject.", "Reject."],
            ["Any resource limit", "Reject.", "Reject."],
          ]}
        />
        <p className="field-note">
          <strong>Tolerant does not mean unrestricted.</strong> Security and
          resource boundaries remain fatal. Use tolerant mode to recover
          optional fidelity, not to bypass validation.
        </p>
      </section>

      <section className="doc-section">
        <h2>Diagnostic codes</h2>
        <ReferenceTable
          headings={["Code", "When it appears", "Typical severity"]}
          codeColumns={[0, 2]}
          rows={diagnosticCodes}
        />
        <p>
          Required XML failures use error severity; optional XML failures use
          warning severity. Strict mode can reject a warning because it rejects
          the first reported parser failure, not only error-severity records.
        </p>
      </section>

      <section className="doc-section">
        <h2>Default resource limits</h2>
        <ReferenceTable
          headings={["Option", "Raw default", "Readable", "Boundary"]}
          codeColumns={[0, 1]}
          rows={limits}
        />
        <h3>Override limits</h3>
        <div className="code-block">
          <div><span>TypeScript</span></div>
          <pre><code>{`const result = await parsePptxWithDiagnostics(bytes, {
  limits: {
    maxInputBytes: 25 * 1024 * 1024,
    maxTotalUncompressedBytes: 96 * 1024 * 1024,
    maxPartBytes: 24 * 1024 * 1024,
    maxXmlBytes: 8 * 1024 * 1024,
    maxMediaBytes: 24 * 1024 * 1024,
    maxSlides: 250,
  },
});`}</code></pre>
        </div>
        <ul className="check-list">
          <li>Every supplied limit must be a positive safe integer.</li>
          <li>maxXmlBytes cannot exceed maxPartBytes.</li>
          <li>maxMediaBytes cannot exceed maxPartBytes.</li>
          <li>A value exactly equal to its configured limit is accepted.</li>
        </ul>
      </section>

      <section className="doc-callout">
        <div>
          <span>Public uploads</span>
          <h2>Parser limits are one layer, not the whole sandbox.</h2>
        </div>
        <p>
          Run untrusted documents in a worker or isolated process and enforce
          an outer timeout, memory ceiling, request-size limit, and concurrency
          budget around the parser call.
        </p>
      </section>
    </DocPage>
  );
}
