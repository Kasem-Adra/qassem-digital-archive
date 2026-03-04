{
  "name": "@archive/api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "build": "wrangler deploy --dry-run"
  },
  "dependencies": {
    "hono": "^4.5.10",
    "jose": "^5.6.3"
  },
  "devDependencies": {
    "wrangler": "^3.100.0"
  }
}
