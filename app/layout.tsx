import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { StructuredData } from "./components/StructuredData";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "./lib/site-metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE,
    template: "%s · OAKit",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Office document toolkit",
    "AI agent workflows",
    "Office documents for AI",
    "document to JSON",
    "PowerPoint parser",
    "PPTX to JSON",
    "document intelligence",
    "OOXML parser",
    "OAKit",
  ],
  authors: [{ name: "EvoElsewhere", url: "https://github.com/evoelsewhere" }],
  creator: "EvoElsewhere",
  publisher: "EvoElsewhere",
  category: "developer tools",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/oakit-logo.png",
    shortcut: "/oakit-logo.png",
    apple: "/oakit-logo.png",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "OAKit — Office documents become agent-ready knowledge.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
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
};

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "EvoElsewhere",
      url: "https://github.com/evoelsewhere",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/oakit-logo.png`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: "Office Agent Kit",
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": `${SITE_URL}/#software`,
      name: SITE_NAME,
      alternateName: "Office Agent Kit",
      description: SITE_DESCRIPTION,
      codeRepository: "https://github.com/evoelsewhere/oakit",
      license: "https://opensource.org/license/mit",
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: ["Node.js", "Web browser"],
      creator: { "@id": `${SITE_URL}/#organization` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData data={siteStructuredData} />
        {children}
      </body>
    </html>
  );
}
