import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://oakit.evoelsewhere.asia"),
  title: {
    default: "OAKit — Office Agent Kit",
    template: "%s · OAKit",
  },
  description:
    "Turn Office documents into deterministic, bounded, and traceable knowledge for AI agents.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/oakit-logo.png",
    shortcut: "/oakit-logo.png",
    apple: "/oakit-logo.png",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "OAKit",
    title: "OAKit — Office Agent Kit",
    description:
      "Turn Office documents into deterministic, bounded, and traceable knowledge for AI agents.",
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
    title: "OAKit — Office Agent Kit",
    description:
      "Turn Office documents into deterministic, bounded, and traceable knowledge for AI agents.",
    images: ["/og.png"],
  },
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
        {children}
      </body>
    </html>
  );
}
