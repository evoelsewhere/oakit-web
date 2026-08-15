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

const indexableRoutes = [
  "/",
  "/docs",
  "/docs/quickstart",
  "/docs/api",
  "/docs/api/parse-pptx",
  "/docs/api/document-model",
  "/docs/api/diagnostics",
  "/docs/cli",
  "/docs/browser",
  "/docs/agent-tools",
  "/guides",
  "/demo",
  "/architecture",
  "/changelog",
];

function metadataContent(html, attribute, value) {
  const expression = new RegExp(
    `<meta[^>]+${attribute}="${value}"[^>]+content="([^"]+)"[^>]*>`,
    "i",
  );
  return html.match(expression)?.[1] ?? "";
}

function structuredDataFrom(html) {
  return [...html.matchAll(
    /<script type="application\/ld\+json">([^<]+)<\/script>/gi,
  )].map((match) => JSON.parse(match[1]));
}

function plainText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:amp|quot|apos|#x27|#39);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordsIn(html) {
  return plainText(html).toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

test("renders the OAKit landing page without starter artifacts", async () => {
  const html = await htmlFor("/");

  assert.match(
    html,
    /<title>OAKit — Office Document Toolkit for AI Agent Workflows<\/title>/i,
  );
  assert.match(html, /Office documents become/);
  assert.match(html, /agent-ready knowledge/);
  assert.match(html, /npx oakit deck\.pptx --pretty/);
  assert.match(html, /One command to agent-ready JSON/);
  assert.match(html, /href="\/docs\/cli"/);
  assert.match(html, /PPTX/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /\/og\.png/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  const description = metadataContent(html, "name", "description");
  assert.equal(description.length, 151);
  assert.match(description, /^OAKit turns Office documents/);
  assert.match(html, new RegExp(`property="og:description" content="${description}"`));
  assert.match(html, new RegExp(`name="twitter:description" content="${description}"`));
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps landing-page content aligned with its H1 and image semantics", async () => {
  const html = await htmlFor("/");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  const h1 = main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "";
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
  const contentWithoutH1 = main.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, " ");
  const bodyWords = new Set(wordsIn(contentWithoutH1));
  const images = [...main.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);

  assert.ok(wordsIn(main).length >= 250, "landing page should contain at least 250 words");
  assert.ok(title.length >= 50 && title.length <= 60, "title should contain 50–60 characters");
  for (const headingWord of new Set(wordsIn(h1))) {
    assert.ok(bodyWords.has(headingWord), `H1 word should occur in content: ${headingWord}`);
  }
  for (const titleWord of new Set(wordsIn(title))) {
    assert.ok(bodyWords.has(titleWord), `title word should occur in content: ${titleWord}`);
  }
  assert.ok(images.length >= 2);
  for (const image of images) {
    assert.match(image, /\balt="[^"]+"/i, "every content image should have useful alt text");
  }
  assert.doesNotMatch(html, /<(?:b|strong)>\$<\/(?:b|strong)>/i);
});

test("publishes complete, unique SEO metadata on every indexable route", async () => {
  const pages = await Promise.all(
    indexableRoutes.map(async (route) => [route, await htmlFor(route)]),
  );
  const titles = new Set();
  const descriptions = new Set();

  for (const [route, html] of pages) {
    const expectedCanonical = `https://oakit.evoelsewhere.asia${route === "/" ? "" : route}`;
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
    const description = metadataContent(html, "name", "description");
    const robots = metadataContent(html, "name", "robots");

    assert.ok(title.length >= 15 && title.length <= 65, `${route} title length`);
    assert.ok(
      description.length >= 70 && description.length <= 170,
      `${route} description length`,
    );
    assert.ok(!titles.has(title), `${route} title should be unique`);
    assert.ok(
      !descriptions.has(description),
      `${route} description should be unique`,
    );
    titles.add(title);
    descriptions.add(description);

    assert.equal(
      (html.match(/rel="canonical"/gi) ?? []).length,
      1,
      `${route} canonical count`,
    );
    assert.match(
      html,
      new RegExp(`rel="canonical" href="${expectedCanonical}"`),
    );
    assert.match(robots, /index/i, `${route} should be indexable`);
    assert.match(robots, /follow/i, `${route} links should be followed`);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${route} h1 count`);
  }
});

test("describes the site, software, docs, and breadcrumbs with JSON-LD", async () => {
  const [home, reference] = await Promise.all([
    htmlFor("/"),
    htmlFor("/docs/api/parse-pptx"),
  ]);
  const homeTypes = structuredDataFrom(home)
    .flatMap((entry) => entry["@graph"] ?? [])
    .map((entry) => entry["@type"]);
  const referenceTypes = structuredDataFrom(reference)
    .flatMap((entry) => entry["@graph"] ?? [])
    .map((entry) => entry["@type"]);

  assert.deepEqual(
    new Set(homeTypes),
    new Set(["Organization", "WebSite", "SoftwareSourceCode"]),
  );
  assert.ok(referenceTypes.includes("BreadcrumbList"));
  assert.ok(referenceTypes.includes("TechArticle"));
  assert.match(reference, /aria-label="Breadcrumb"/);
  assert.match(reference, /href="\/docs\/api"/);
  assert.match(reference, /aria-current="page">Parsing PPTX/);
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
  const [robotsResponse, sitemapResponse, manifestResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
    render("/manifest.webmanifest"),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);
  assert.equal(manifestResponse.status, 200);

  const [robots, sitemap, manifest] = await Promise.all([
    robotsResponse.text(),
    sitemapResponse.text(),
    manifestResponse.json(),
  ]);
  assert.match(robots, /User-Agent: Googlebot/i);
  assert.match(robots, /Allow: \//);
  assert.match(
    robots,
    /Sitemap: https:\/\/oakit\.evoelsewhere\.asia\/sitemap\.xml/,
  );
  assert.match(robots, /Host: https:\/\/oakit\.evoelsewhere\.asia/);
  assert.match(sitemap, /https:\/\/oakit\.evoelsewhere\.asia\/docs\/quickstart/);
  assert.match(sitemap, /https:\/\/oakit\.evoelsewhere\.asia\/docs\/api\/document-model/);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, indexableRoutes.length);
  assert.equal((sitemap.match(/<lastmod>2026-08-15T00:00:00\.000Z<\/lastmod>/g) ?? []).length, indexableRoutes.length);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  assert.equal(manifest.name, "OAKit — Office Agent Kit");
  assert.match(manifest.description, /^OAKit turns Office documents/);
  assert.equal(manifest.start_url, "/");
  assert.match(
    manifestResponse.headers.get("content-type") ?? "",
    /application\/manifest\+json|application\/json/i,
  );
});

test("returns a noindex 404 for unknown URLs", async () => {
  const response = await render("/not-a-real-page");
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(html, /name="robots" content="noindex"/i);
});

test("redirects the production host to HTTPS and serves HSTS", async () => {
  const env = {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  };
  const context = {
    waitUntil() {},
    passThroughOnException() {},
  };
  const redirect = await worker.fetch(
    new Request("http://oakit.evoelsewhere.asia/docs?source=seo"),
    env,
    context,
  );
  const secure = await worker.fetch(
    new Request("https://oakit.evoelsewhere.asia/", {
      headers: { accept: "text/html" },
    }),
    env,
    context,
  );

  assert.equal(redirect.status, 308);
  assert.equal(
    redirect.headers.get("location"),
    "https://oakit.evoelsewhere.asia/docs?source=seo",
  );
  assert.equal(secure.status, 200);
  assert.equal(
    secure.headers.get("strict-transport-security"),
    "max-age=31536000; includeSubDomains",
  );
});
