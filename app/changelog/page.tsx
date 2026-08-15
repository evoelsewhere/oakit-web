import { DocPage } from "../components/DocPage";
import { createPageMetadata } from "../lib/site-metadata";

const description =
  "Follow OAKit release notes, PowerPoint parser capabilities, compatibility changes, security updates, and public package milestones.";

export const metadata = createPageMetadata({
  title: "Changelog",
  description,
  path: "/changelog",
});

export default function Changelog() {
  return (
    <DocPage
      eyebrow="Release notes"
      path="/changelog"
      schemaType="CollectionPage"
      title="Changelog"
      description={description}
    >
      <section className="release">
        <div className="release-meta">
          <span>Unreleased</span>
          <time>In development</time>
        </div>
        <div className="release-body">
          <h2>First public release</h2>
          <h3>Added</h3>
          <ul>
            <li>PowerPoint reader with normalized slide and element models.</li>
            <li>Node.js, browser, ESM, CommonJS, and command-line boundaries.</li>
            <li>Structured diagnostics with strict and tolerant modes.</li>
            <li>Resource limits for ZIP, XML, media, and slides.</li>
          </ul>
          <h3>Release gates</h3>
          <ul>
            <li>Node.js 20, 22, and 24 CI matrix plus Chromium.</li>
            <li>Producer corpus covering PowerPoint, LibreOffice, and Google Slides.</li>
            <li>Seeded property tests and mutation testing for safety logic.</li>
          </ul>
        </div>
      </section>
    </DocPage>
  );
}
