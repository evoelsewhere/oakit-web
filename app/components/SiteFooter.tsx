import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="footer shell">
      <div className="brand footer-brand">
        <Image src="/oakit-logo.png" alt="" width={34} height={34} />
        <span>OAKit</span>
      </div>
      <p>Office Agent Kit · MIT licensed · Built by EvoElsewhere</p>
    </footer>
  );
}
