import type { Metadata } from "next";

export const SITE_NAME = "OAKit";
export const SITE_URL = "https://oakit.evoelsewhere.asia";
export const SITE_TITLE =
  "OAKit — Office Document Toolkit for AI Agent Workflows";
export const SITE_DESCRIPTION =
  "OAKit turns Office documents into deterministic, bounded, traceable knowledge for AI agents—starting with PowerPoint in Node.js, browsers, and the CLI.";

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
  const canonical = new URL(path, SITE_URL);

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
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
