import YAML from "yaml";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import assert from "node:assert/strict";
const root = path.resolve("dist"),
  base = "/ai-design-foundations";
const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
    );
for (const name of ["zenn", "wiki"]) {
  const manifest = YAML.parse(
    fs.readFileSync("migration/" + name + "-migration-manifest.yaml", "utf8"),
  );
  for (const e of manifest.entries) {
    const original = fs.readFileSync(e.destination_file, "utf8");
    const metadata = YAML.parse(original.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
    if (metadata.status === "draft" || metadata.public === false) continue;
    assert(
      fs.existsSync(
        path.join(root, e.category, e.destination_slug, "index.html"),
      ),
      "Missing migrated page " + e.destination_file,
    );
  }
}
const files = walk(root).filter((f) => f.endsWith(".html"));
const errors = [],
  cache = new Map();
let links = 0;
const html = (f) => {
  if (!cache.has(f)) cache.set(f, load(fs.readFileSync(f, "utf8")));
  return cache.get(f);
};
for (const file of files) {
  const $ = html(file);
  assert.equal($("main").length, 1);
  assert.equal($("h1").length, 1, `One page heading: ${file}`);
  assert.equal($("adf-directive").length, 0, "Unrendered directive");
  if ($("[data-pagefind-body]").length)
    assert($(".prose").text().trim().length > 50, `Empty article: ${file}`);
  const current =
    "https://nullcontroller.github.io" +
    base +
    "/" +
    path
      .relative(root, file)
      .replaceAll("\\", "/")
      .replace(/index.html$/, "");
  for (const el of $("[href], [src]").toArray()) {
    const raw = $(el).attr("href") || $(el).attr("src");
    if (!raw || /^(data:|mailto:|tel:|javascript:)/.test(raw)) continue;
    const u = new URL(raw, current);
    if (u.origin !== "https://nullcontroller.github.io") continue;
    if (!u.pathname.startsWith(base + "/")) {
      errors.push(`${file}: outside base ${raw}`);
      continue;
    }
    links++;
    let local = path.join(
      root,
      decodeURIComponent(u.pathname.slice(base.length)),
    );
    if (u.pathname.endsWith("/")) local = path.join(local, "index.html");
    if (!fs.existsSync(local)) {
      errors.push(`${file}: missing ${raw}`);
      continue;
    }
    if (u.hash && local.endsWith(".html")) {
      const id = decodeURIComponent(u.hash.slice(1));
      if (
        !html(local)("[id]")
          .toArray()
          .some((n) => html(local)(n).attr("id") === id)
      )
        errors.push(`${file}: missing anchor ${raw}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Verified ${files.length} HTML pages and ${links} local links/assets, including anchors and base path.`,
);
