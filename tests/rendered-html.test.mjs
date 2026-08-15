import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function render(pathname = "/") {
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function htmlFor(pathname) {
  const response = await render(pathname);
  assert.equal(response.status, 200, `${pathname} should render`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("renders the OAKit landing page without starter artifacts", async () => {
  const html = await htmlFor("/");

  assert.match(html, /<title>OAKit — Office Agent Kit<\/title>/i);
  assert.match(html, /Office documents become/);
  assert.match(html, /agent-ready knowledge/);
  assert.match(html, /npx oakit deck\.pptx --pretty/);
  assert.match(html, /One command to agent-ready JSON/);
  assert.match(html, /href="\/docs\/cli"/);
  assert.match(html, /PPTX/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /\/og\.png/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders documentation and its safety boundary", async () => {
  const html = await htmlFor("/docs");

  assert.match(html, /Build reliable document capabilities/);
  assert.match(html, /Documents are untrusted data/);
  assert.match(html, /PowerPoint \(\.pptx\)/);
});

test("renders the quickstart with package and CLI examples", async () => {
  const html = await htmlFor("/docs/quickstart");

  assert.match(html, /npm install oakit/);
  assert.match(html, /parsePptxWithDiagnostics/);
  assert.match(html, /External relationships are preserved but never fetched/);
});

test("renders the complete parser and document-model references", async () => {
  const [api, parser, model] = await Promise.all([
    htmlFor("/docs/api"),
    htmlFor("/docs/api/parse-pptx"),
    htmlFor("/docs/api/document-model"),
  ]);

  assert.match(api, /The complete public surface/);
  assert.match(api, /parsePptxWithDiagnostics/);
  assert.match(parser, /Accepted input/);
  assert.match(parser, /imageMode/);
  assert.match(parser, /Concurrent parse calls do not share mutable document state/);
  assert.match(model, /PptxElement union/);
  assert.match(model, /shapType/);
  assert.match(model, /ScatterChartData/);
});

test("renders operational references for diagnostics, CLI, browser, and agents", async () => {
  const [diagnostics, cli, browser, agents] = await Promise.all([
    htmlFor("/docs/api/diagnostics"),
    htmlFor("/docs/cli"),
    htmlFor("/docs/browser"),
    htmlFor("/docs/agent-tools"),
  ]);

  assert.match(diagnostics, /resource-limit-exceeded/);
  assert.match(diagnostics, /maxTotalXmlNodes/);
  assert.match(cli, /output-overwrites-input/);
  assert.match(cli, /brew install evoelsewhere\/tap\/oakit/);
  assert.match(cli, /Exit/);
  assert.match(browser, /URL\.revokeObjectURL/);
  assert.match(browser, /Web Worker/);
  assert.match(agents, /untrusted-document-content/);
  assert.match(agents, /Do not retry resource-limit failures/);
});

test("uses route-specific social metadata without the landing card", async () => {
  const [html, cli] = await Promise.all([
    htmlFor("/docs/api/parse-pptx"),
    htmlFor("/docs/cli"),
  ]);

  assert.match(html, /<title>Parsing PPTX · OAKit<\/title>/i);
  assert.match(html, /property="og:title" content="Parsing PPTX"/);
  assert.match(html, /name="twitter:title" content="Parsing PPTX"/);
  assert.match(html, /name="twitter:card" content="summary"/);
  assert.doesNotMatch(html, /\/og\.png/);
  assert.match(cli, /property="og:title" content="Command-line reference"/);
  assert.match(cli, /name="twitter:title" content="Command-line reference"/);
  assert.doesNotMatch(cli, /\/og\.png/);
});

test("renders the local-first demo and release status", async () => {
  const [demo, changelog] = await Promise.all([
    htmlFor("/demo"),
    htmlFor("/changelog"),
  ]);

  assert.match(demo, /Your document never leaves the browser/);
  assert.match(demo, /Choose \.pptx file/);
  assert.match(changelog, /First public release/);
  assert.match(changelog, /Unreleased/);
});

test("renders the detailed visual architecture map", async () => {
  const html = await htmlFor("/architecture");

  assert.match(html, /End-to-end parsing pipeline/);
  assert.match(html, /OOXML relationship graph/);
  assert.match(html, /Inheritance is a deterministic cascade/);
  assert.match(html, /XML safety pipeline/);
  assert.match(html, /Failure and recovery flow/);
  assert.match(html, /State, caches, and concurrency/);
  assert.match(html, /Multi-format evolution/);
  assert.match(html, /src\/formats\/pptx\/parser\.ts/);
  assert.match(html, /property="og:title" content="Architecture"/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("publishes crawler metadata for the canonical domain", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);

  const [robots, sitemap] = await Promise.all([
    robotsResponse.text(),
    sitemapResponse.text(),
  ]);
  assert.match(robots, /Allow: \//);
  assert.match(
    robots,
    /Sitemap: https:\/\/oakit\.evoelsewhere\.asia\/sitemap\.xml/,
  );
  assert.match(sitemap, /https:\/\/oakit\.evoelsewhere\.asia\/docs\/quickstart/);
  assert.match(sitemap, /https:\/\/oakit\.evoelsewhere\.asia\/docs\/api\/document-model/);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
});
