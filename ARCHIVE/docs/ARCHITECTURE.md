# ARCHITECTURE

## Boundaries

### apps/site
Public read-only site. Consumes static `content/indexes/*.json` and renders pages.
No admin logic here.

### apps/admin
WordPress-like admin UI (sidebar + list/new stubs).
Will talk to the API for auth and CRUD.

### workers/api
Cloudflare Worker API.
- Login + JWT
- CORS allowlist
- Placeholder CRUD endpoints
No secrets hardcoded; secrets come from Wrangler secret bindings.

### content/
Markdown/JSON content stored in git.

### scripts/
- build-indexes: generates JSON indexes
- validate-content: enforces minimal schema

## Principle
Simple UX. Clear boundaries. No secrets in frontend.
