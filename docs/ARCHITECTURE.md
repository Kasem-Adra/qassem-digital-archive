# ARCHITECTURE

## Boundaries

- `apps/site` → public frontend.
- `apps/admin` → admin panel.
- `workers/api` → backend API on Cloudflare Workers.
- `content` → markdown/JSON source content stored in git.
- `scripts` → build and validation tools for content/indexes.

## Notes

- Keep public and admin concerns separated.
- Keep API secrets only in Worker environment bindings.
- Keep content as files, then generate lightweight JSON indexes for fast reads.
