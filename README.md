# OAKit website

The public website, documentation hub, browser-demo shell, and changelog for [OAKit](https://github.com/evoelsewhere/oakit) — the Office document layer for AI-agent workflows.

Production URL: [oakit.evoelsewhere.asia](https://oakit.evoelsewhere.asia)

## What is included

- Product landing page
- Documentation, quickstart, and field-level API reference
- Dedicated parser, document-model, diagnostics, CLI, browser, and agent-tool guides
- Agent integration guides
- Architecture overview
- Local-only PPTX demo boundary
- Changelog and release gates
- `llms.txt`, sitemap, robots rules, and social metadata
- CI on Node.js 22 and 24
- GitHub Actions deployment to Cloudflare Workers

## Local development

Requirements: Node.js `>=22.13.0` and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality gates

```bash
npm run lint
npm test
npm audit --omit=dev
```

`npm test` creates the production Vinext build and checks representative server-rendered routes for their critical content and safety claims.

## Deploy from GitHub Actions

The workflow in `.github/workflows/deploy.yml` deploys the `main` branch as the `oakit-web` Cloudflare Worker.

1. Create a Cloudflare API token with permission to edit Workers Scripts.
2. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub repository secrets.
3. Push to `main`, or run **Deploy website** from the Actions tab.
4. In Cloudflare, open **Workers & Pages → oakit-web → Settings → Domains & Routes**.
5. Add the custom domain `oakit.evoelsewhere.asia`. Cloudflare will create or validate the DNS record.

For a local authenticated deployment:

```bash
npx wrangler login
npm run deploy
```

The build generates `dist/server/wrangler.json`; it is intentionally not committed.

## Project map

```text
app/                     Pages, layouts, and shared UI
public/                  Logo and machine-readable documentation
tests/                   Rendered route tests
.github/workflows/       CI and production deployment
.openai/hosting.json     Optional platform binding declaration
worker/                  Cloudflare Worker entry point
```

## Content policy

- Describe shipped behavior separately from planned behavior.
- Treat Office document content as untrusted data.
- Keep examples deterministic and local-first.
- Update the docs and changelog in the same change as a public behavior change.

## License

Website content and source follow the OAKit project license unless a file states otherwise.
