import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import YAML from "yaml";

const root = "src/content";
const report = fs.readFileSync("docs/content-modernization-report.md", "utf8");
const files = [];
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (name.endsWith(".md")) files.push(full.replaceAll("\\", "/"));
  }
};
walk(root);

const parse = (file) => {
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, `Missing front matter: ${file}`);
  return { data: YAML.parse(match[1]), body: text.slice(match[0].length) };
};

const titles = new Map();
const publicEntries = [];
for (const file of files) {
  const { data, body } = parse(file);
  assert.ok(data.title?.trim(), `Missing title: ${file}`);
  assert.ok(data.summary?.trim(), `Missing summary: ${file}`);
  if (data.updated_at != null)
    assert.match(String(data.updated_at), /^\d{4}-\d{2}-\d{2}/, `Invalid updated_at: ${file}`);

  const duplicate = titles.get(data.title);
  assert.ok(!duplicate, `Duplicate title: ${data.title} (${duplicate}, ${file})`);
  titles.set(data.title, file);
  assert.ok(report.includes(`\`${file}\``), `Audit decision missing: ${file}`);

  if (data.public !== false) {
    publicEntries.push({ file, data, body });
    const legacy = body.match(/このWiki|Wiki全体|公開Wiki|100[〜～-]600章|本アカウント|Zenn/);
    assert.ok(!legacy, `Legacy publication wording '${legacy?.[0]}' remains in ${file}`);
  }
}

const canonicalReferences = publicEntries.filter(
  ({ file, data }) => data.layer === "reference" && file.startsWith("src/content/reference/"),
);
const canonicalPractices = publicEntries.filter(({ data }) => data.layer === "practice");
assert.ok(canonicalReferences.length >= 4, "Reference needs glossary, mathematics, metrics and responsibility state");
assert.ok(canonicalPractices.length >= 4, "Practices needs adoption, education, transfer and development workflow");
assert.equal(files.length, 81, "All audited content must remain traceable");

console.log(
  `Verified content health: ${files.length} audited Markdown pages, ${publicEntries.length} public pages, ${canonicalReferences.length} canonical references, ${canonicalPractices.length} canonical practices.`,
);
