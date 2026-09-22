import test from "node:test";
import assert from "node:assert/strict";
import { load } from "cheerio";
import { publicHtml, normalizeSourceUrl } from "../src/lib/public-html.mjs";

test("publication links resolve locally while unavailable source links retain content", () => {
  const map = new Map([
    [
      normalizeSourceUrl("https://zenn.dev/nullcontroller/articles/abc"),
      "/ai-design-foundations/essays/example/",
    ],
  ]);
  const $ = load(
    publicHtml(
      '<a href="https://zenn.dev/nullcontroller/articles/abc#heading">記事</a><a href="https://github.com/example/repo"><em>参考資料</em></a><a href="https://zenn.dev/other/articles/xyz">別資料</a><a href="https://arxiv.org/abs/123">論文</a>',
      map,
    ),
  );
  assert.equal($("a").length, 2);
  assert.equal(
    $("a").first().attr("href"),
    "/ai-design-foundations/essays/example/",
  );
  assert.equal($("em").text(), "参考資料");
  assert($.text().includes("別資料"));
  assert.equal($("a").last().attr("href"), "https://arxiv.org/abs/123");
});
test("career links become local and removed routes cannot remain clickable", () => {
  const $ = load(
    publicHtml(
      '<a href="https://nullcontroller.github.io/career-profile/profile/">詳細</a><a href="/ai-design-foundations/project/journal/test/">記録</a><a href="/ai-design-foundations/foundations/wiki-overview/">概要</a>',
    ),
  );
  assert.equal($("a").length, 1);
  assert.equal($("a").attr("href"), "/ai-design-foundations/career/profile/");
  assert($.text().includes("記録"));
});
