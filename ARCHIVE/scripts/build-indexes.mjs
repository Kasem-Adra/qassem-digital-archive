import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content");
const indexesDir = path.join(contentDir, "indexes");

fs.mkdirSync(indexesDir, { recursive: true });

function parseFrontmatter(md) {
  if (!md.startsWith("---")) return { data: {}, body: md };
  const end = md.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: md };
  const raw = md.slice(3, end).trim();
  const body = md.slice(end + 4).trim();
  const data = {};
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
    data[k] = v;
  }
  return { data, body };
}

function buildIndex(folder) {
  const dir = path.join(contentDir, folder);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
  return files
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const full = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, body } = parseFrontmatter(full);
      return { slug, title: data.title || slug, date: data.date || "", excerpt: body.slice(0, 140) };
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

fs.writeFileSync(path.join(indexesDir, "evidence.json"), JSON.stringify(buildIndex("evidence"), null, 2));
fs.writeFileSync(path.join(indexesDir, "articles.json"), JSON.stringify(buildIndex("articles"), null, 2));

console.log("OK: indexes built");
