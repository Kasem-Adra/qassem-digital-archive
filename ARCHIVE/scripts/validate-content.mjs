import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content");

function parseFrontmatter(md) {
  if (!md.startsWith("---")) return { data: {}, ok: false };
  const end = md.indexOf("\n---", 3);
  if (end === -1) return { data: {}, ok: false };
  const raw = md.slice(3, end).trim();
  const data = {};
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
    data[k] = v;
  }
  return { data, ok: true };
}

function validateDir(name) {
  const dir = path.join(contentDir, name);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
  const slugs = new Set();
  const errors = [];

  for (const f of files) {
    const slug = f.replace(/\.md$/, "");
    if (slugs.has(slug)) errors.push(`${name}: duplicate slug ${slug}`);
    slugs.add(slug);

    const md = fs.readFileSync(path.join(dir, f), "utf8");
    const { data, ok } = parseFrontmatter(md);
    if (!ok) errors.push(`${name}/${f}: missing frontmatter`);
    if (!data.title) errors.push(`${name}/${f}: missing title`);
    if (data.date && isNaN(Date.parse(data.date))) errors.push(`${name}/${f}: invalid date`);
  }
  return errors;
}

const errs = [...validateDir("evidence"), ...validateDir("articles")];
if (errs.length) {
  console.error("Validation failed:");
  for (const e of errs) console.error(" -", e);
  process.exit(1);
}
console.log("OK: content valid");
