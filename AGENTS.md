# OAKit website development rules

## Product truth

- Never present planned capabilities as released.
- Verify package names, commands, exports, limits, and compatibility against the OAKit source before publishing them.
- Keep PPTX, XLSX, and DOCX support statuses explicit and independently editable.
- Treat all Office document content as untrusted data in copy, examples, and demo behavior.

## Implementation

- Prefer server components. Add a client component only for browser state, events, or browser-only APIs.
- Do not add network calls, analytics, cookies, authentication, storage, or document uploads without an explicit requirement and privacy review.
- Keep the demo local-first. Never transmit selected files or extracted content.
- Reuse shared layout and navigation components; do not duplicate site chrome in routes.
- Preserve semantic HTML, keyboard access, visible focus, sufficient contrast, and reduced-motion behavior.
- Avoid placeholder actions. Every interactive control must work or be clearly marked unavailable.

## Required checks

- Run `npm run lint` after source or content changes.
- Run `npm test` before handoff; rendered-route tests must cover new critical pages or claims.
- Run `npm audit --omit=dev` before dependency or deployment changes.
- Update `public/llms.txt`, `public/llms-full.txt`, sitemap, README, and changelog when their public facts change.
- Do not weaken tests or security language merely to make a check pass.

## Deployment

- Production deploys only from the protected `main` branch through GitHub Actions.
- Keep Cloudflare credentials in GitHub secrets; never commit tokens, account IDs, or generated environment files.
- Review the generated `dist/server/wrangler.json` whenever Vinext, Vite, or Wrangler changes.
- Verify the canonical host, metadata, robots rules, sitemap, and representative routes after deployment.
