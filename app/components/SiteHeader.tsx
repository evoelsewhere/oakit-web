import Image from "next/image";
import Link from "next/link";

import { GitHubLink } from "./GitHubLink";
import { SiteSearch } from "./SiteSearch";

export function SiteHeader() {
  return (
    <nav className="nav shell" aria-label="Primary navigation">
      <Link className="brand" href="/" aria-label="OAKit home">
        <Image
          src="/oakit-logo.png"
          alt="OAKit Office Agent Kit logo"
          width={42}
          height={42}
          priority
        />
        <span>OAKit</span>
      </Link>
      <div className="nav-links">
        <Link href="/docs">Docs</Link>
        <Link href="/docs/cli">CLI</Link>
        <Link href="/guides">Guides</Link>
        <Link href="/demo">Demo</Link>
        <Link href="/architecture">Architecture</Link>
        <Link href="/changelog">Changelog</Link>
      </div>
      <SiteSearch />
      <GitHubLink />
    </nav>
  );
}
