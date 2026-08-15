import Link from "next/link";

import { DocPage } from "../../components/DocPage";
import { ReferenceTable } from "../../components/ReferenceTable";
import { createPageMetadata } from "../../lib/site-metadata";

const description =
  "Complete OAKit public API map, import paths, runtime exports, type exports, and integration choices.";

export const metadata = createPageMetadata({
  title: "API reference",
  description,
  path: "/docs/api",
});

const exportsTable = [
  [
    "parsePptx",
    "function",
    "oakit, oakit/pptx",
    "Parse a PPTX package and return PptxDocument.",
  ],
  [
    "parsePptxWithDiagnostics",
    "function",
    "oakit, oakit/pptx",
    "Parse a PPTX package and return document plus recoverable diagnostics.",
  ],
  [
    "PptxParseError",
    "class",
    "oakit, oakit/pptx",
    "Typed rejection carrying the structured diagnostic that caused it.",
  ],
] as const;

const keyTypes = [
  ["PptxInput", "ArrayBuffer | Uint8Array | Blob", "Parser input."],
  ["PptxParseOptions", "Options", "Media, error-mode, and resource-limit options."],
  ["PptxParseResult", "interface", "Document plus diagnostics."],
  ["PptxDocument", "interface", "Normalized presentation model."],
  ["PptxSlide", "Slide", "One normalized slide."],
  ["PptxElement", "Element", "Discriminated union of supported elements."],
  ["PptxDiagnostic", "interface", "Structured warning or error."],
  ["PptxDiagnosticCode", "string union", "All public diagnostic codes."],
  ["PptxErrorMode", "strict | tolerant", "Recovery policy."],
  ["PptxResourceLimits", "interface", "ZIP, XML, media, and slide limits."],
] as const;

const paths = [
  [
    "Parsing PPTX",
    "Signatures, accepted binary inputs, every option, defaults, and examples.",
    "/docs/api/parse-pptx",
  ],
  [
    "Document model",
    "Every exported document, slide, element, fill, chart, table, and media type.",
    "/docs/api/document-model",
  ],
  [
    "Diagnostics & limits",
    "Strict versus tolerant behavior, error handling, diagnostic codes, and defaults.",
    "/docs/api/diagnostics",
  ],
] as const;

export default function ApiOverview() {
  return (
    <DocPage
      eyebrow="API reference"
      path="/docs/api"
      title="The complete public surface."
      description={description}
    >
      <section className="doc-section">
        <h2>Import paths</h2>
        <p>
          The root entry point exposes the stable cross-format boundary. The
          PowerPoint subpath exposes the same runtime API plus every public PPTX
          model type.
        </p>
        <div className="api-signature">{`import { parsePptx, parsePptxWithDiagnostics } from 'oakit';
import type { Element, Fill } from 'oakit/pptx';`}</div>
        <ReferenceTable
          headings={["Entry point", "Use it when", "Exports"]}
          codeColumns={[0]}
          rows={[
            [
              "oakit",
              "The application wants the stable top-level reader boundary.",
              "3 runtime exports and 10 key PPTX types.",
            ],
            [
              "oakit/pptx",
              "The application is PowerPoint-specific or needs detailed element types.",
              "The same runtime exports and every type from the PPTX public model.",
            ],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>Runtime exports</h2>
        <ReferenceTable
          headings={["Export", "Kind", "Available from", "Purpose"]}
          codeColumns={[0, 1, 2]}
          rows={exportsTable}
        />
        <p className="field-note">
          <strong>No parser internals are public.</strong> ZIP readers, XML
          helpers, relationship maps, format contexts, and resource-limit error
          implementations are intentionally outside package exports.
        </p>
      </section>

      <section className="doc-section">
        <h2>Key root types</h2>
        <ReferenceTable
          headings={["Type", "Shape", "Purpose"]}
          codeColumns={[0, 1]}
          rows={keyTypes}
        />
      </section>

      <section className="doc-section">
        <h2>Choose a reference</h2>
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

      <section className="doc-callout compact">
        <div>
          <span>Release status</span>
          <h2>The npm package is not published yet.</h2>
        </div>
        <p>
          These pages document the current repository contract for the first
          release. Install commands become active when version 0.0.0 is
          replaced by the initial published version.
        </p>
      </section>
    </DocPage>
  );
}
