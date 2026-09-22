import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
    );
const removed = [
  "project",
  "tools",
  "authoring",
  "foundations/wiki-overview",
  "foundations/design-system-overview",
];
for (const id of removed)
  assert(
    !fs.existsSync("dist/" + id + "/index.html"),
    "Unwanted public route " + id,
  );
let htmlCount = 0;
let repositoryLinks = 0;
for (const file of walk("dist").filter((p) => p.endsWith(".html"))) {
  const $ = load(fs.readFileSync(file, "utf8"));
  htmlCount++;
  for (const element of $("[href]").toArray()) {
    const href = $(element).attr("href");
    const allowedRepository =
      file.endsWith(path.join("about", "index.html")) &&
      href === "https://github.com/nullcontroller/ai-design-foundations";
    if (allowedRepository) repositoryLinks++;
    assert(
      allowedRepository ||
        !/github\.com|zenn\.dev|nullcontroller\.github\.io\/career-profile/i.test(href),
      file + " " + href,
    );
    for (const id of removed)
      assert(
        !href.startsWith("/ai-design-foundations/" + id + "/"),
        file + " removed link " + href,
      );
  }
  assert.equal($("[data-pagefind-meta=source]").length, 0, file);
  assert.equal($("[data-source]").length, 0, file);
  assert(
    !$(".meta,.document-footer,.site-footer,.sidebar")
      .text()
      .match(/GitHub Wiki|Originally published|Repository-native|移行元/),
    file,
  );
  assert($(".brand").text().includes("立林 裕太朗"), file);
  const canonical = $('link[rel="canonical"]').attr("href");
  assert(canonical?.startsWith("https://nullcontroller.github.io/ai-design-foundations/"), file);
  assert.equal($('meta[property="og:url"]').attr("content"), canonical, file);
  for (const selector of [
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:type"]',
    'meta[property="og:image"]',
    'meta[name="twitter:card"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="twitter:image"]',
  ]) assert($(selector).attr("content"), file + " " + selector);
  assert.equal($('meta[name="twitter:card"]').attr("content"), "summary_large_image", file);
}
assert.equal(repositoryLinks, 1, "About must contain one Repository link");
const homepage = load(fs.readFileSync("dist/index.html", "utf8"));
assert.equal(homepage("h1").text(), "立林 裕太朗");
const profile = load(fs.readFileSync("dist/career/profile/index.html", "utf8"));
for (const text of [
  "2016–2021",
  "2022–2024",
  "2024–2026",
  "2026–現在",
  "DPAPI / CNG",
  "約7割",
  "希望条件",
  "資格",
])
  assert(profile("main").text().includes(text), text);
const baseline = JSON.parse(
  fs.readFileSync("migration/personal-site-baseline.json", "utf8"),
);
console.log(
  "Public HTML audit: " +
    htmlCount +
    " pages; GitHub Repository=1 (About only), external Career=0, Zenn=0; removed routes absent.",
);
console.log("Before integration: " + JSON.stringify(baseline));
