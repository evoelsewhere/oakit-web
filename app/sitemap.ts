import type { MetadataRoute } from "next";

const origin = "https://oakit.evoelsewhere.asia";

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
    url: `${origin}${path}`,
    changeFrequency: path === "/changelog" ? "weekly" : "monthly",
    priority: Number(priority),
  }));
}
