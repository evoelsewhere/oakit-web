import Image from "next/image";
import Link from "next/link";

import { GitHubLink } from "./GitHubLink";
import { SiteSearch } from "./SiteSearch";
import { ThemeSwitch } from "./ThemeSwitch";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="nav shell" aria-label="Primary navigation">
        <div className="brand-cluster">
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
          <span className="brand-badge">Developer preview</span>
        </div>
        <div className="nav-links">
          <Link href="/docs">Docs</Link>
          <Link href="/docs/cli">CLI</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/demo">Demo</Link>
          <Link href="/architecture">Architecture</Link>
          <Link href="/changelog">Changelog</Link>
        </div>
        <div className="nav-actions">
          <SiteSearch />
          <ThemeSwitch />
          <GitHubLink />
        </div>
      </nav>
    </header>
  );
}
