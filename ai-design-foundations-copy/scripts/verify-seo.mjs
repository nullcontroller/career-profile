import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });

let htmlCount = 0;
for (const file of walk("dist").filter((name) => name.endsWith(".html"))) {
  const $ = load(fs.readFileSync(file, "utf8"));
  htmlCount++;
  assert.ok($("title").text().trim(), `Missing title: ${file}`);
  assert.ok($('meta[name="description"]').attr("content"), `Missing description: ${file}`);
  const canonical = $('link[rel="canonical"]').attr("href");
  assert.ok(canonical?.startsWith("https://nullcontroller.github.io/ai-design-foundations/"), `Invalid canonical: ${file}`);
  assert.equal($('meta[property="og:url"]').attr("content"), canonical, `OG URL mismatch: ${file}`);
  const scripts = $('script[type="application/ld+json"]');
  assert.equal(scripts.length, 1, `Expected one JSON-LD graph: ${file}`);
  const graph = JSON.parse(scripts.text());
  assert.equal(graph["@context"], "https://schema.org", `Invalid JSON-LD context: ${file}`);
  assert.ok(graph["@graph"].some((item) => item["@type"] === "WebSite"), `WebSite JSON-LD missing: ${file}`);
  assert.ok(graph["@graph"].some((item) => item.url === canonical), `Page JSON-LD missing: ${file}`);
}

const sitemap = fs.readFileSync("dist/sitemap.xml", "utf8");
for (const route of [
  "ai-design/",
  "ai-mathematics/",
  "practices/",
  "reference/",
  "reference/glossary/",
  "reference/mathematical-reference/",
  "reference/evaluation-metrics/",
  "reference/responsibility-state-model/",
])
  assert.ok(sitemap.includes(`https://nullcontroller.github.io/ai-design-foundations/${route}`), `Sitemap missing ${route}`);
assert.ok(sitemap.startsWith('<?xml version="1.0"'), "Invalid sitemap XML");

const rss = fs.readFileSync("dist/rss.xml", "utf8");
assert.ok(rss.includes("<rss version=\"2.0\">"), "Invalid RSS");
assert.ok((rss.match(/<item>/g) ?? []).length >= 10, "RSS publication count is unexpectedly low");

console.log(`SEO audit: ${htmlCount} HTML pages, JSON-LD, Sitemap and RSS verified.`);
