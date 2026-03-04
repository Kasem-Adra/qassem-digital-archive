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
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      const items = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
      data[key] = items;
      continue;
    }

    data[key] = value.replace(/^"|"$/g, "");
  }

  return { data, ok: true };
}

function collectMarkdownFiles(dirName) {
  const dir = path.join(contentDir, dirName);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      dirName,
      file,
      slug: file.replace(/\.md$/, ""),
      fullPath: path.join(dir, file)
    }));
}

const markdownFiles = [...collectMarkdownFiles("evidence"), ...collectMarkdownFiles("articles")];
const slugSet = new Set();
const errors = [];

for (const entry of markdownFiles) {
  if (slugSet.has(entry.slug)) {
    errors.push(`duplicate slug across content: ${entry.slug}`);
  }
  slugSet.add(entry.slug);

  const md = fs.readFileSync(entry.fullPath, "utf8");
  const { data, ok } = parseFrontmatter(md);

  if (!ok) {
    errors.push(`${entry.dirName}/${entry.file}: missing frontmatter`);
    continue;
  }

  if (!data.title) errors.push(`${entry.dirName}/${entry.file}: missing title`);
  if (!data.date) errors.push(`${entry.dirName}/${entry.file}: missing date`);
  if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push(`${entry.dirName}/${entry.file}: missing tags`);
  }

  if (data.date && Number.isNaN(Date.parse(data.date))) {
    errors.push(`${entry.dirName}/${entry.file}: invalid date`);
  }
}

if (errors.length) {
  console.error("Validation failed:");
  for (const err of errors) console.error(" -", err);
  process.exit(1);
}

console.log("OK: content valid");
