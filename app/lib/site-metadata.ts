import type { Metadata } from "next";

interface PageMetadataInput {
  description: string;
  path: string;
  title: string;
}

export function createPageMetadata({
  description,
  path,
  title,
}: PageMetadataInput): Metadata {
  const canonical = new URL(path, "https://oakit.evoelsewhere.asia");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [],
    },
  };
}
