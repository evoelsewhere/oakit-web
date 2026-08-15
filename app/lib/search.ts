export interface SearchEntry {
  category: string;
  description: string;
  href: string;
  keywords: readonly string[];
  title: string;
}

export const searchEntries: readonly SearchEntry[] = [
  {
    category: "Overview",
    title: "OAKit overview",
    href: "/",
    description:
      "Office documents become deterministic, bounded, and traceable knowledge for AI-agent workflows.",
    keywords: ["home", "office", "pptx", "powerpoint", "agent", "json"],
  },
  {
    category: "Documentation",
    title: "Documentation",
    href: "/docs",
    description:
      "Choose a path through the OAKit API, CLI, browser integration, and agent-tool guidance.",
    keywords: ["docs", "start", "formats", "support"],
  },
  {
    category: "Getting started",
    title: "Quickstart",
    href: "/docs/quickstart",
    description:
      "Install OAKit and parse your first PowerPoint file from Node.js, a browser, or the CLI.",
    keywords: ["install", "parse", "first", "node", "pptx"],
  },
  {
    category: "API reference",
    title: "API reference",
    href: "/docs/api",
    description:
      "Explore public exports, input types, parsing options, output models, and diagnostics.",
    keywords: ["function", "types", "options", "exports", "parsepptx"],
  },
  {
    category: "API reference",
    title: "Parsing PPTX",
    href: "/docs/api/parse-pptx",
    description:
      "Parse PowerPoint packages with bounded inputs, explicit options, and structured results.",
    keywords: ["parsepptx", "powerpoint", "input", "arraybuffer", "uint8array"],
  },
  {
    category: "API reference",
    title: "PPTX document model",
    href: "/docs/api/document-model",
    description:
      "Understand slides, elements, text, shapes, tables, charts, media, and speaker notes.",
    keywords: ["model", "slide", "element", "shape", "chart", "table", "media"],
  },
  {
    category: "API reference",
    title: "Diagnostics and resource limits",
    href: "/docs/api/diagnostics",
    description:
      "Handle fidelity diagnostics and enforce ZIP, XML, media, and document limits.",
    keywords: ["errors", "security", "strict", "tolerant", "bounded", "zip"],
  },
  {
    category: "Using OAKit",
    title: "Command-line reference",
    href: "/docs/cli",
    description:
      "Convert PPTX files to deterministic JSON from files, stdin, scripts, and CI jobs.",
    keywords: ["cli", "terminal", "command", "stdout", "convert", "oakit"],
  },
  {
    category: "Using OAKit",
    title: "Browser integration",
    href: "/docs/browser",
    description:
      "Parse File and Blob inputs locally in the browser and manage object-URL media safely.",
    keywords: ["web", "blob", "file", "local", "object url", "chromium"],
  },
  {
    category: "Using OAKit",
    title: "Agent-tool integration",
    href: "/docs/agent-tools",
    description:
      "Expose bounded document results while keeping all source content untrusted.",
    keywords: ["agent", "tools", "prompt injection", "untrusted", "retrieval"],
  },
  {
    category: "Guides",
    title: "AI-agent integration guides",
    href: "/guides",
    description:
      "Preserve structure and provenance, separate content from authority, and index incrementally.",
    keywords: ["chunks", "embeddings", "retrieval", "provenance", "indexing"],
  },
  {
    category: "Tools",
    title: "Browser demo",
    href: "/demo",
    description:
      "Inspect Office input and structured JSON side by side in a local-first browser workspace.",
    keywords: ["demo", "local", "json", "preview", "file"],
  },
  {
    category: "Project",
    title: "Architecture",
    href: "/architecture",
    description:
      "Map OAKit's public boundary, OOXML pipeline, relationships, inheritance, caches, and failures.",
    keywords: ["system", "design", "ooxml", "opc", "pipeline", "internals"],
  },
  {
    category: "Project",
    title: "Changelog",
    href: "/changelog",
    description:
      "Follow release notes, compatibility changes, security updates, and package milestones.",
    keywords: ["release", "updates", "version", "history", "milestones"],
  },
] as const;

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

export function searchSite(query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return searchEntries
    .map((entry) => {
      const title = normalize(entry.title);
      const keywords = normalize(entry.keywords.join(" "));
      const haystack = normalize(
        `${entry.title} ${entry.category} ${entry.description} ${entry.keywords.join(" ")}`,
      );

      if (!tokens.every((token) => haystack.includes(token))) {
        return null;
      }

      let score = 0;
      if (title === normalizedQuery) score += 20;
      if (title.startsWith(normalizedQuery)) score += 12;
      if (title.includes(normalizedQuery)) score += 8;
      if (keywords.includes(normalizedQuery)) score += 4;
      score += tokens.filter((token) => title.includes(token)).length * 2;

      return { entry, score };
    })
    .filter((result): result is { entry: SearchEntry; score: number } =>
      Boolean(result),
    )
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map(({ entry }) => entry);
}
