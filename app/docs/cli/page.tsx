import { DocPage } from "../../components/DocPage";
import { ReferenceTable } from "../../components/ReferenceTable";
import { createPageMetadata } from "../../lib/site-metadata";

const description =
  "Complete OAKit command-line reference: installation, syntax, options, output envelopes, stderr errors, and exit codes.";

export const metadata = createPageMetadata({
  title: "Command-line reference",
  description,
  path: "/docs/cli",
});

export default function CliReference() {
  return (
    <DocPage
      eyebrow="CLI reference"
      title="Deterministic Office-to-JSON from the shell."
      description={description}
    >
      <section className="doc-section">
        <h2>Install and run</h2>
        <div className="code-block">
          <div><span>Terminal</span></div>
          <pre><code>{`npm install --global oakit
oakit --version

# Or run without a global install
npx oakit deck.pptx --pretty`}</code></pre>
        </div>
        <p className="doc-note">
          The npm package and Homebrew formula have not been published yet.
          These commands become active with the first release.
        </p>
        <h3>Homebrew</h3>
        <div className="code-block">
          <div><span>macOS or Linux</span></div>
          <pre><code>{`brew install evoelsewhere/tap/oakit
oakit --version`}</code></pre>
        </div>
        <p>
          Homebrew installs the executable for shell use. Use npm or pnpm when
          an application also imports the programmatic JavaScript API.
        </p>
      </section>

      <section className="doc-section">
        <h2>Syntax</h2>
        <div className="api-signature">oakit [convert] &lt;input.pptx|-&gt; [options]</div>
        <p>
          The explicit <code>convert</code> action and the short form are
          equivalent. One invocation accepts exactly one document.
        </p>
        <div className="code-block">
          <div><span>Equivalent commands</span></div>
          <pre><code>{`oakit deck.pptx
oakit convert deck.pptx`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Options</h2>
        <ReferenceTable
          headings={["Option", "Value", "Default", "Behavior"]}
          codeColumns={[0, 1, 2]}
          rows={[
            ["-o, --output", "file | -", "stdout", "Write JSON to a file; - explicitly selects stdout."],
            ["--format", "pptx", "inferred", "Required for stdin because - has no extension."],
            ["--strict", "flag", "off", "Reject malformed optional OOXML instead of recovering."],
            ["--pretty", "flag", "off", "Indent JSON with two spaces."],
            ["--document-only", "flag", "off", "Emit only PptxDocument, without format or diagnostics."],
            ["--image-mode", "none | base64", "none", "Omit image payloads or include data URLs."],
            ["-h, --help", "flag", "—", "Print usage and exit successfully."],
            ["-v, --version", "flag", "—", "Print oakit plus the installed version."],
          ]}
        />
        <p>
          The CLI always sets video and audio modes to none. It does not emit
          embedded audio or video bytes.
        </p>
      </section>

      <section className="doc-section">
        <h2>File, stdin, and output recipes</h2>
        <div className="code-block">
          <div><span>Terminal</span></div>
          <pre><code>{`# JSON envelope to stdout
oakit deck.pptx > deck.json

# Pretty JSON written by OAKit
oakit convert deck.pptx --output deck.json --pretty

# Read bytes from stdin; format is mandatory
cat deck.pptx | oakit - --format pptx > deck.json

# Emit the document model only
oakit deck.pptx --document-only --image-mode none

# Reject recoverable malformed content
oakit deck.pptx --strict`}</code></pre>
        </div>
        <p>
          OAKit refuses an output path that resolves to the same path as the
          input document, preventing JSON from overwriting the PPTX.
        </p>
      </section>

      <section className="doc-section">
        <h2>Default stdout envelope</h2>
        <div className="api-signature">{`{
  "format": "pptx",
  "document": { "slides": [], "themeColors": [], "usedFonts": [], "size": {} },
  "diagnostics": []
}`}</div>
        <p>
          <code>--document-only</code> removes the format and diagnostics
          envelope. Prefer the default envelope when automation must decide
          whether a partial parse is acceptable.
        </p>
      </section>

      <section className="doc-section">
        <h2>Errors and exit codes</h2>
        <p>
          Errors are single-line JSON on stderr. Stack traces are not written
          to the command output.
        </p>
        <div className="api-signature">{`{
  "error": {
    "code": "unsupported-format",
    "message": "Unsupported Office format: docx"
  }
}`}</div>
        <ReferenceTable
          headings={["Exit", "Meaning", "Examples"]}
          codeColumns={[0]}
          rows={[
            ["0", "Completed normally.", "Conversion, help, or version."],
            ["1", "Runtime read, conversion, or write failure.", "input-read-failed, diagnostic code, conversion-failed, output-write-failed."],
            ["2", "Invalid command usage.", "input-required, too-many-inputs, unknown-option, missing-option-value, format-required, unsupported-format, invalid-image-mode, output-overwrites-input."],
          ]}
        />
      </section>

      <section className="doc-callout compact">
        <div>
          <span>Agent sandbox</span>
          <h2>Use stdout for data and stderr for structured failures.</h2>
        </div>
        <p>
          Keep <code>--image-mode none</code> for bounded context, preserve the
          default diagnostic envelope, check the exit code, and parse stderr as
          JSON on failure.
        </p>
      </section>
    </DocPage>
  );
}
