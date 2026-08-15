import Link from "next/link";

import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

const pipeline = [
  ["01", "Office files", "PPTX today, XLSX and DOCX next"],
  ["02", "Structured model", "Content, layout, media, and diagnostics"],
  ["03", "Agent knowledge", "Traceable data ready for tools and retrieval"],
] as const;

const capabilities = [
  [
    "Deterministic",
    "The same document and options produce the same public model.",
  ],
  [
    "Bounded",
    "ZIP, XML, media, and document limits protect agent workloads.",
  ],
  [
    "Traceable",
    "Diagnostics preserve the source part and failure context.",
  ],
] as const;

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> Office Agent Kit · Pre-stable
          </div>
          <h1>
            Office documents become <em>agent-ready knowledge.</em>
          </h1>
          <p className="hero-lead">
            OAKit is an Office document toolkit, starting with PowerPoint, that
            turns complex files into deterministic, bounded, and traceable
            structures AI agents can safely inspect and use in automated
            workflows.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/docs">
              Get started <span>→</span>
            </Link>
            <Link className="button secondary" href="/demo">
              Try the browser demo
            </Link>
          </div>
          <div className="support-line">
            <span>
              <b>PPTX</b> available
            </span>
            <span>
              <b>XLSX</b> planned
            </span>
            <span>
              <b>DOCX</b> planned
            </span>
          </div>
        </div>

        <div className="terminal" aria-label="OAKit command-line example">
          <div className="terminal-bar">
            <div className="terminal-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <span>agent-workspace</span>
            <span className="terminal-status">local only</span>
          </div>
          <div className="terminal-body">
            <p>
              <span className="prompt">$</span> npx oakit deck.pptx --pretty
            </p>
            <pre>{`{
  "format": "pptx",
  "document": {
    "slides": [
      { "elements": 12, "note": "..." }
    ]
  },
  "diagnostics": []
}`}</pre>
            <div className="terminal-foot">
              <span>✓ no upload</span>
              <span>✓ structured JSON</span>
            </div>
          </div>
        </div>
      </section>

      <section className="proof shell" aria-label="Core guarantees">
        {capabilities.map(([title, copy]) => (
          <article key={title}>
            <span className="proof-mark" aria-hidden="true">
              ◆
            </span>
            <div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="cli-showcase shell">
        <div className="cli-showcase-copy">
          <p className="kicker">Command line</p>
          <h2>One command to agent-ready JSON.</h2>
          <p>
            Use OAKit in terminals, scripts, CI jobs, and agent sandboxes.
            Structured output stays on stdout; machine-readable failures stay
            on stderr.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/docs/cli">
              Explore the CLI <span>→</span>
            </Link>
            <a
              className="button secondary"
              href="https://github.com/evoelsewhere/oakit"
            >
              View source
            </a>
          </div>
        </div>

        <div className="cli-command-stack" aria-label="OAKit CLI examples">
          <div>
            <span>file → stdout</span>
            <code><span className="prompt">$</span> oakit deck.pptx --pretty</code>
          </div>
          <div>
            <span>file → JSON file</span>
            <code><span className="prompt">$</span> oakit convert deck.pptx -o deck.json</code>
          </div>
          <div>
            <span>stdin → document model</span>
            <code><span className="prompt">$</span> cat deck.pptx | oakit - --format pptx</code>
          </div>
          <footer>
            <span>exit 0 · success</span>
            <span>exit 1 · runtime</span>
            <span>exit 2 · usage</span>
          </footer>
        </div>
      </section>

      <section className="pipeline-section shell">
        <div className="section-intro">
          <p className="kicker">From files to knowledge</p>
          <h2>A document layer designed for agent workflows.</h2>
          <p>
            Office documents become agent-ready knowledge when OAKit preserves
            text, slide order, visual structure, tables, charts, media
            references, speaker notes, and diagnostics as one deterministic
            document model.
          </p>
          <p>
            That model gives developers a safer starting point for retrieval,
            summarization, citation, and tool calls. Agents can trace an answer
            back to its slide and source element, while applications can
            enforce limits before untrusted document content reaches a prompt.
            The same boundary works in Node.js, browser workflows, command-line
            scripts, and automated pipelines.
          </p>
        </div>
        <div className="pipeline">
          {pipeline.map(([step, title, copy]) => (
            <article key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
