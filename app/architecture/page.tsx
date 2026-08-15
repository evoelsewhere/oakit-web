import { DocPage } from "../components/DocPage";
import { ReferenceTable } from "../components/ReferenceTable";
import { createPageMetadata } from "../lib/site-metadata";

const description =
  "A visual, implementation-backed map of OAKit's public boundary, OOXML pipeline, relationship ownership, inheritance, caches, failures, and extension model.";

export const metadata = createPageMetadata({
  title: "Architecture",
  description,
  path: "/architecture",
});

const pipeline = [
  ["01", "Guard input", "Validate compressed bytes before opening the package.", "PptxInput + resolved limits"],
  ["02", "Open OPC", "Load ZIP metadata, then bound entries and declared expansion.", "JSZip package"],
  ["03", "Read manifest", "Resolve content types, authored slide order, size, fonts, and theme.", "Presentation graph"],
  ["04", "Process slides", "Walk slides sequentially to preserve deterministic order.", "Slide XML"],
  ["05", "Own relationships", "Resolve each rId relative to the part that declared it.", "Part-local maps"],
  ["06", "Resolve inheritance", "Apply slide → layout → master → theme/default precedence.", "Parser context"],
  ["07", "Dispatch domains", "Route shapes, text, media, charts, tables, diagrams, and math.", "Domain values"],
  ["08", "Normalize output", "Emit typed elements, points, colors, HTML, paths, and diagnostics.", "PptxDocument"],
] as const;

const layers = [
  ["Consumers", "Application · agent tool · renderer", "Binary input / typed output", "Cannot see raw package state"],
  ["Public boundary", "oakit · oakit/pptx · CLI", "Inputs, options, model, diagnostics", "No internal helper exports"],
  ["Format orchestrator", "formats/pptx/parser.ts", "Traversal, slide order, context, dispatch", "No raw XML in output"],
  ["Format domains", "formats/pptx/internal/*", "Text, shapes, fills, charts, tables, media", "No cross-format assumptions"],
  ["Shared OOXML core", "common/*", "Bounded ZIP/XML, OPC paths, units, text", "No PowerPoint node paths"],
  ["Runtime dependencies", "jszip · saxes · txml · tinycolor2", "Archive, validation, parsing, color", "Hidden behind OAKit contracts"],
] as const;

const nodeDispatch = [
  ["p:sp", "shape/text", "Shape | Text"],
  ["p:cxnSp", "connector", "Shape | Text"],
  ["p:pic", "picture/media", "Image | Video | Audio"],
  ["p:graphicFrame", "graphic frame", "Table | Chart | Diagram"],
  ["p:grpSp", "recursive group", "Group"],
  ["mc:AlternateContent", "fallback/math", "Group | Math"],
] as const;

const caches = [
  ["XML result cache", "Normalized package filename", "Shared layouts, masters, themes, styles, and relationships are parsed once per document."],
  ["Media cache", "Normalized package path + representation", "The same image, video, or audio payload is not encoded repeatedly."],
  ["Placeholder indexes", "Layout/master node identity", "Avoid repeated scans when resolving inherited geometry and styles."],
  ["Diagram cache", "Supporting diagram part", "Reuse SmartArt data and drawing parts inside the current parse."],
] as const;

const testGates = [
  ["Fast Vitest", "Units, integration fixtures, seeded ZIP/XML/path/number properties", "Every change"],
  ["Browser Vitest", "Blob input, object URLs, bundling, Chromium runtime", "Browser workflow"],
  ["Producer corpus", "PowerPoint, LibreOffice, Google Slides compatibility", "Reliability workflow"],
  ["Mutation testing", "Whether assertions reject changed security/correctness logic", "Reliability workflow"],
] as const;

export default function Architecture() {
  return (
    <DocPage
      eyebrow="System design"
      path="/architecture"
      title="Complex internals, narrow public boundary."
      description={description}
    >
      <section className="doc-section arch-section-first">
        <div className="arch-legend" aria-label="Architecture legend">
          <span><i className="arch-dot public" /> Public contract</span>
          <span><i className="arch-dot internal" /> Internal implementation</span>
          <span><i className="arch-dot boundary" /> Security boundary</span>
        </div>

        <figure className="arch-context" aria-labelledby="system-context-title">
          <figcaption id="system-context-title">System context</figcaption>
          <div className="arch-context-lane">
            <div className="arch-node soft">
              <small>Callers</small>
              <strong>Node.js · Browser</strong>
              <span>ArrayBuffer · Uint8Array · Blob</span>
            </div>
            <span className="arch-edge" aria-hidden="true">→</span>
            <div className="arch-node public">
              <small>Public boundary</small>
              <strong>parsePptx</strong>
              <span>Options · limits · diagnostics</span>
            </div>
            <span className="arch-edge" aria-hidden="true">→</span>
            <div className="arch-node internal wide">
              <small>Private engine</small>
              <strong>OPC → OOXML → domains</strong>
              <span>Relationships · inheritance · normalization</span>
            </div>
            <span className="arch-edge" aria-hidden="true">→</span>
            <div className="arch-node public">
              <small>Stable output</small>
              <strong>PptxDocument</strong>
              <span>Typed elements + diagnostics</span>
            </div>
          </div>
          <div className="arch-context-secondary">
            <span>CLI: file/stdin → same public API</span>
            <span>Consumers: renderer · indexer · agent tool</span>
          </div>
        </figure>

        <div className="arch-principle">
          <span>Architecture rule</span>
          <p>
            Callers provide binary input and receive a semantic model. ZIP
            entries, raw XML, relationship IDs, caches, and parser contexts
            never cross the package boundary.
          </p>
        </div>
      </section>

      <section className="doc-section">
        <h2>End-to-end parsing pipeline</h2>
        <p>
          A parse call owns one isolated state graph. Security checks happen
          before expensive work, then each slide moves through relationship,
          inheritance, domain, and normalization phases.
        </p>
        <ol className="arch-pipeline">
          {pipeline.map(([step, title, copy, artifact]) => (
            <li key={step}>
              <span className="arch-step">{step}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <code>{artifact}</code>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="doc-section">
        <h2>Dependency direction and ownership</h2>
        <p>
          Dependencies point downward. A lower layer may never import
          format-specific assumptions from a higher layer.
        </p>
        <div className="arch-layer-stack">
          {layers.map(([name, source, owns, forbids], index) => (
            <div className="arch-layer" key={name}>
              <span className="arch-layer-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="arch-layer-name"><strong>{name}</strong><code>{source}</code></div>
              <div><small>Owns</small><p>{owns}</p></div>
              <div><small>Must not</small><p>{forbids}</p></div>
            </div>
          ))}
        </div>
        <div className="arch-direction" aria-label="Dependency direction">
          <span>public</span><b>dependency direction ↓</b><span>infrastructure</span>
        </div>
        <h3>Where a change belongs</h3>
        <ReferenceTable
          headings={["Concern", "Owning source", "Decision boundary"]}
          codeColumns={[1]}
          rows={[
            ["Root package exports", "src/index.ts", "Re-export only supported public format contracts."],
            ["CLI command behavior", "src/cli/run.ts", "Arguments, JSON envelope, errors, and injected I/O contract."],
            ["Node filesystem/stdin", "src/cli/node-io.ts", "Keep Node-only APIs outside browser-facing library chunks."],
            ["Public PPTX model", "src/formats/pptx/types.ts", "Types consumed outside the package; changes require migration intent."],
            ["Package traversal", "src/formats/pptx/parser.ts", "Slide order, relationship graph, context, inheritance, and dispatch."],
            ["Public parse errors", "src/formats/pptx/errors.ts", "Typed failure boundary and diagnostic payload."],
            ["One fidelity domain", "src/formats/pptx/internal/<domain>.ts", "OOXML knowledge local to PowerPoint."],
            ["Format-neutral primitive", "src/common/*", "Only behavior proven independent of PPTX ownership rules."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>OOXML relationship graph</h2>
        <p>
          A slide is not self-contained. Every relationship target is resolved
          relative to its owning part, and identical <code>rId</code> values in
          different maps remain independent.
        </p>
        <figure className="arch-rel-graph" aria-labelledby="relationship-graph-title">
          <figcaption id="relationship-graph-title">Typical PowerPoint ownership chain</figcaption>
          <div className="arch-rel-main">
            <div><small>manifest</small><strong>presentation.xml</strong></div>
            <span>→</span>
            <div><small>authored</small><strong>slideN.xml</strong></div>
            <span>→</span>
            <div><small>inherits</small><strong>layoutN.xml</strong></div>
            <span>→</span>
            <div><small>inherits</small><strong>masterN.xml</strong></div>
            <span>→</span>
            <div><small>resolves</small><strong>themeN.xml</strong></div>
          </div>
          <div className="arch-rel-owners">
            <div><code>presentation.xml.rels</code><span>owns slide order targets</span></div>
            <div><code>slideN.xml.rels</code><span>owns layout, notes, links, and slide assets</span></div>
            <div><code>layoutN.xml.rels</code><span>owns master and layout assets</span></div>
            <div><code>masterN.xml.rels</code><span>owns theme and master assets</span></div>
          </div>
          <div className="arch-rel-assets">
            <span>notes</span><span>media</span><span>charts</span><span>diagrams</span><span>hyperlinks</span>
          </div>
        </figure>
      </section>

      <section className="doc-section">
        <h2>Inheritance is a deterministic cascade</h2>
        <p>
          Each domain resolves the most specific valid value first. Inherited
          decoration stays in <code>layoutElements</code> instead of being
          merged into authored slide content.
        </p>
        <div className="arch-cascade" aria-label="PowerPoint inheritance cascade">
          <div><span>1</span><strong>Slide value</strong><p>Direct geometry, fill, text, transition</p></div>
          <b aria-hidden="true">↓</b>
          <div><span>2</span><strong>Layout placeholder</strong><p>Matched by ID, idx, or placeholder type</p></div>
          <b aria-hidden="true">↓</b>
          <div><span>3</span><strong>Master placeholder</strong><p>Master geometry, style, color map</p></div>
          <b aria-hidden="true">↓</b>
          <div><span>4</span><strong>Theme / defaults</strong><p>Scheme color, fonts, background styles</p></div>
          <b aria-hidden="true">↓</b>
          <div className="fallback"><span>5</span><strong>Explicit fallback</strong><p>White, zero, empty, or omitted by contract</p></div>
        </div>
        <div className="arch-domain-grid">
          <article><strong>Geometry</strong><span>slide → layout → master</span></article>
          <article><strong>Background</strong><span>slide → layout → master → theme → white</span></article>
          <article><strong>Text</strong><span>run → paragraph → placeholder → master → defaults</span></article>
          <article><strong>Transition</strong><span>slide → layout → master</span></article>
        </div>
      </section>

      <section className="doc-section">
        <h2>Domain dispatch</h2>
        <p>
          The orchestrator owns traversal; focused domain modules own semantic
          conversion. Unknown slide-tree nodes are skipped instead of leaking
          raw XML into the public model.
        </p>
        <ReferenceTable
          headings={["OOXML node", "Owning parser", "Public result"]}
          codeColumns={[0, 1, 2]}
          rows={nodeDispatch}
        />
        <div className="arch-domain-modules">
          {[
            "text + font-style",
            "shape + shape-path",
            "fill + color + media",
            "table",
            "chart",
            "diagram",
            "math",
            "animation",
          ].map((domain) => <span key={domain}>{domain}</span>)}
        </div>
      </section>

      <section className="doc-section">
        <h2>XML safety pipeline</h2>
        <div className="arch-linear-flow" aria-label="XML processing stages">
          <span>bounded ZIP expansion</span><b>→</b>
          <span>fatal UTF decoding</span><b>→</b>
          <span>saxes structure + limits</span><b>→</b>
          <span>txml parse</span><b>→</b>
          <span>namespace normalization</span><b>→</b>
          <span>cached result</span>
        </div>
        <ul className="check-list">
          <li>DOCTYPE declarations and malformed XML structure are rejected.</li>
          <li>Byte, depth, per-part node, and cumulative node limits apply before domain parsing.</li>
          <li>Repeated siblings become arrays; single siblings collapse to one internal value.</li>
          <li>Traversal order is recorded per read without global mutable state.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Failure and recovery flow</h2>
        <div className="arch-failure-flow">
          <div className="arch-failure-source">
            <small>Parser event</small>
            <strong>Package, XML, relationship, value, or limit failure</strong>
          </div>
          <span className="arch-edge down" aria-hidden="true">↓</span>
          <div className="arch-failure-branches">
            <article className="fatal">
              <span>Security / package boundary</span>
              <h3>Always reject</h3>
              <p>Invalid ZIP and every resource-limit violation become PptxParseError.</p>
            </article>
            <article>
              <span>Tolerant mode</span>
              <h3>Recover + diagnose</h3>
              <p>Skip the affected optional feature and return a structured diagnostic.</p>
            </article>
            <article>
              <span>Strict mode</span>
              <h3>Reject first failure</h3>
              <p>Malformed XML, unsafe targets, missing parts, or invalid values stop parsing.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="doc-section">
        <h2>State, caches, and concurrency</h2>
        <div className="arch-isolation" aria-label="Concurrent parse isolation">
          <div>
            <span>Parse call A</span>
            <strong>Document A context</strong>
            <small>XML · media · indexes · diagnostics</small>
          </div>
          <b>≠</b>
          <div>
            <span>Parse call B</span>
            <strong>Document B context</strong>
            <small>XML · media · indexes · diagnostics</small>
          </div>
        </div>
        <ReferenceTable
          headings={["Per-parse state", "Cache key", "Why it exists"]}
          codeColumns={[0, 1]}
          rows={caches}
        />
        <p className="field-note">
          <strong>Slides are currently sequential.</strong> Parallel slide
          parsing is not safe to assume until cache and document-order
          semantics are redesigned explicitly.
        </p>
      </section>

      <section className="doc-section">
        <h2>Trust and execution boundary</h2>
        <div className="arch-trust-boundary">
          <div className="untrusted">
            <small>Untrusted</small>
            <strong>Office package</strong>
            <span>ZIP · XML · text · links · media</span>
          </div>
          <div className="guard">
            <span>limits</span><span>path rules</span><span>XML validation</span><span>sanitization</span>
          </div>
          <div className="trusted-output">
            <small>Structured, still untrusted as content</small>
            <strong>PptxDocument</strong>
            <span>No macro execution · no network fetch · no model calls</span>
          </div>
        </div>
        <p>
          Normalization makes the data safer to process; it does not grant
          document text instruction authority. Consumers should sanitize HTML
          again for their rendering context and isolate public uploads behind
          timeout, memory, request-size, and concurrency controls.
        </p>
      </section>

      <section className="doc-section">
        <h2>Performance and ownership</h2>
        <div className="arch-performance-grid">
          <article><span>Archive</span><strong>Opened in memory</strong><p>Parts expand through bounded readers.</p></article>
          <article><span>Slides</span><strong>Sequential</strong><p>Simple deterministic traversal.</p></article>
          <article><span>Media</span><strong>Mode-dependent</strong><p>both retains data URLs and object URLs.</p></article>
          <article><span>Output</span><strong>Retained to completion</strong><p>The full public model resolves at once.</p></article>
        </div>
        <p>
          Object URLs belong to the caller after return. A streaming or lazy
          media design would need a new public ownership contract rather than a
          hidden change to <code>parsePptx</code>.
        </p>
      </section>

      <section className="doc-section">
        <h2>Testing architecture</h2>
        <ReferenceTable
          headings={["Gate", "What it detects", "Cadence"]}
          codeColumns={[0]}
          rows={testGates}
        />
        <div className="arch-linear-flow compact" aria-label="Fixture test flow">
          <span>minimal OOXML</span><b>→</b>
          <span>in-memory ZIP</span><b>→</b>
          <span>public parse API</span><b>→</b>
          <span>public-model assertion</span>
        </div>
      </section>

      <section className="doc-section">
        <h2>Multi-format evolution</h2>
        <div className="arch-format-tree">
          <div className="root"><strong>src/formats</strong><span>Sibling ownership, shared infrastructure below</span></div>
          <div className="branches">
            <article className="active"><span>active</span><strong>pptx/</strong><small>reader · model · domains</small></article>
            <article><span>future</span><strong>xlsx/</strong><small>own reader · model · domains</small></article>
            <article><span>future</span><strong>docx/</strong><small>own reader · model · domains</small></article>
          </div>
          <div className="shared"><strong>common/</strong><span>Only proven format-neutral OPC, XML, units, binary, and text primitives</span></div>
        </div>
        <div className="arch-reader-writer">
          <article><span>Reader</span><strong>Tolerant + normalizing</strong><p>Consumes imperfect packages and emits semantic data.</p></article>
          <b>public semantic model</b>
          <article><span>Future writer</span><strong>Strict + package-valid</strong><p>Owns IDs, relationships, serialization, media, and validation.</p></article>
        </div>
      </section>

      <section className="doc-section">
        <h2>Non-negotiable boundaries</h2>
        <ol className="arch-rules">
          <li><span>01</span><p>Resolve relationships relative to the part that owns them.</p></li>
          <li><span>02</span><p>Keep raw XML, package paths, caches, and parser contexts private.</p></li>
          <li><span>03</span><p>Put code in common only after a real second format proves the abstraction.</p></li>
          <li><span>04</span><p>Keep reader and future writer orchestration separate.</p></li>
          <li><span>05</span><p>Never perform model calls, external fetches, macro execution, or media execution in core parsing.</p></li>
          <li><span>06</span><p>Never share mutable state across documents or concurrent parse calls.</p></li>
          <li><span>07</span><p>Change the public model only with documentation, migration intent, declarations, and fixtures.</p></li>
        </ol>
      </section>
    </DocPage>
  );
}
