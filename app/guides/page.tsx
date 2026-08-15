import { DocPage } from "../components/DocPage";
import { createPageMetadata } from "../lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Guides",
  description: "Patterns for using OAKit in reliable AI-agent workflows.",
  path: "/guides",
});

export default function Guides() {
  return (
    <DocPage
      eyebrow="Agent guides"
      title="From documents to trustworthy context."
      description="Use structure and provenance before embeddings. OAKit is the document boundary, not the vector database or agent runtime."
    >
      <section className="doc-section numbered-guides">
        <article>
          <span>01</span>
          <div>
            <h2>Preserve document structure</h2>
            <p>
              Chunk by slide, paragraph, table, chart, and future worksheet or
              section boundaries. Avoid flattening every file into one string.
            </p>
          </div>
        </article>
        <article>
          <span>02</span>
          <div>
            <h2>Carry provenance forward</h2>
            <p>
              Keep file identity, slide position, source part, and diagnostics
              alongside indexed text so an agent can cite and explain results.
            </p>
          </div>
        </article>
        <article>
          <span>03</span>
          <div>
            <h2>Separate content from authority</h2>
            <p>
              Notes and text can contain prompt injection. Mark them as
              untrusted source data and never let them redefine tool policy.
            </p>
          </div>
        </article>
        <article>
          <span>04</span>
          <div>
            <h2>Index incrementally</h2>
            <p>
              Derive stable IDs and content hashes from normalized structures
              so unchanged document regions do not need to be re-embedded.
            </p>
          </div>
        </article>
      </section>

      <section className="doc-callout compact">
        <div>
          <span>Recommended boundary</span>
          <h2>OAKit → chunks → embeddings → retrieval → agent</h2>
        </div>
      </section>
    </DocPage>
  );
}
