import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/site-metadata";

const lastModified = new Date("2026-08-15T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ["", 1],
    ["/docs", 0.9],
    ["/docs/quickstart", 0.9],
    ["/docs/api", 0.9],
    ["/docs/api/parse-pptx", 0.9],
    ["/docs/api/document-model", 0.9],
    ["/docs/api/diagnostics", 0.9],
    ["/docs/cli", 0.85],
    ["/docs/browser", 0.85],
    ["/docs/agent-tools", 0.85],
    ["/guides", 0.8],
    ["/demo", 0.8],
    ["/architecture", 0.7],
    ["/changelog", 0.6],
  ].map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/changelog" ? "weekly" : "monthly",
    priority: Number(priority),
  }));
}
