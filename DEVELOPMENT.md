# Development

## Scope and prerequisites

Distinguish supplied datasets from current verified information. Preserve source attribution. Do not silently resolve the outstanding party-focused versus neutral positioning decision.

Commands below run from the repository root unless a `cd` is shown. Install the runtime required by the package manifest. For Node projects, preserve package-lock.json with `npm ci`; Quiet Orbit uses its pnpm lockfile; the voice service uses uv.lock. Installation may require network access.

## Commands

```text
npm ci
npm run dev
# Verification
npm run lint
npm run build
```

These commands come from the current manifests; they are not a claim that all checks passed during documentation setup. Check LOG.md for dated results. Builds may require configuration, downloads or external services.

## Configuration

Configuration shape: `.env.example`. See the comments about which process loads these variables.

Use dummy examples for configuration shape only; supply real credentials outside version control. Client-prefixed variables are public. Export environment variables explicitly when the app has no dotenv loader.

## Source map

app/: Next.js routes; lib/ and data/: supporting logic and datasets; PLAN.md, DATA-SOURCES.md and HOW-IT-WORKS.md: product/data specifications.

## Next verification

Resolve the documented positioning question, then verify a single sourced civic-data workflow and its update date.

## Repository check

`python scripts/check_repository.py` checks the documentation contract and tracked local-secret filenames. GitHub Actions runs this baseline check; it does not certify runtime or deployment readiness.
