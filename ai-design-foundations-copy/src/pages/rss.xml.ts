import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { isPublication } from "../lib/navigation";
import { publicEntry } from "../lib/site";

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[
      character
    ]!,
  );

export const GET: APIRoute = async ({ site }) => {
  const entries = (await getCollection("pages", publicEntry))
    .filter(isPublication)
    .sort((a, b) =>
      String(b.data.published_at ?? b.data.source?.publication_month ?? "").localeCompare(
        String(a.data.published_at ?? a.data.source?.publication_month ?? ""),
      ),
    );
  const channelUrl = new URL("ai-design-foundations/articles/", site).toString();
  const items = entries
    .map((entry) => {
      const link = new URL(`ai-design-foundations/${entry.id}/`, site).toString();
      const date = entry.data.published_at
        ? new Date(entry.data.published_at).toUTCString()
        : undefined;
      return [
        "    <item>",
        `      <title>${escapeXml(entry.data.title)}</title>`,
        `      <description>${escapeXml(entry.data.summary)}</description>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid>${escapeXml(link)}</guid>`,
        date && date !== "Invalid Date" ? `      <pubDate>${date}</pubDate>` : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n    <title>立林 裕太朗 | Articles</title>\n    <description>Applied AI、システム設計、実務事例と論考</description>\n    <link>${escapeXml(channelUrl)}</link>\n${items}\n  </channel></rss>\n`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};

