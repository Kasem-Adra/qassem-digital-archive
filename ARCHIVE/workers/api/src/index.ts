import { Hono } from "hono";
import { jwtVerify, SignJWT } from "jose";

type Env = {
  CORS_ALLOW_ORIGINS: string;
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
  JWT_SECRET?: string; // set via: wrangler secret put JWT_SECRET
};

const app = new Hono<{ Bindings: Env }>();

function isAllowedOrigin(env: Env, origin: string | null) {
  if (!origin) return false;
  const allow = (env.CORS_ALLOW_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return allow.includes(origin);
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

app.options("*", (c) => {
  const origin = c.req.header("Origin") || "";
  if (isAllowedOrigin(c.env, origin)) {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  return new Response(null, { status: 204 });
});

app.use("*", async (c, next) => {
  const origin = c.req.header("Origin") || "";
  await next();
  if (origin && isAllowedOrigin(c.env, origin)) {
    Object.entries(corsHeaders(origin)).forEach(([k, v]) => c.header(k, v));
  }
});

app.get("/health", (c) => c.json({ ok: true }));

app.post("/auth/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const username = String(body.username || "");
  const password = String(body.password || "");

  if (!username || !password) return c.json({ error: "Missing credentials" }, 400);
  if (!c.env.JWT_SECRET) return c.json({ error: "JWT_SECRET not set" }, 500);

  // demo-only auth; replace with real user store later
  const secret = new TextEncoder().encode(c.env.JWT_SECRET);
  const token = await new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(c.env.JWT_ISSUER)
    .setAudience(c.env.JWT_AUDIENCE)
    .setExpirationTime("2h")
    .sign(secret);

  return c.json({ token });
});

async function requireAuth(c: any) {
  const auth = c.req.header("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !c.env.JWT_SECRET) return null;

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);
    const res = await jwtVerify(token, secret, {
      issuer: c.env.JWT_ISSUER,
      audience: c.env.JWT_AUDIENCE
    });
    return res.payload;
  } catch {
    return null;
  }
}

app.get("/me", async (c) => {
  const payload = await requireAuth(c);
  if (!payload) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ user: payload });
});

// placeholders
app.get("/evidence", async (c) => {
  const payload = await requireAuth(c);
  if (!payload) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ items: [], note: "placeholder" });
});

app.post("/evidence", async (c) => {
  const payload = await requireAuth(c);
  if (!payload) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json().catch(() => ({}));
  return c.json({ created: true, body });
});

app.get("/articles", async (c) => {
  const payload = await requireAuth(c);
  if (!payload) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ items: [], note: "placeholder" });
});

app.post("/articles", async (c) => {
  const payload = await requireAuth(c);
  if (!payload) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json().catch(() => ({}));
  return c.json({ created: true, body });
});

export default app;
