import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { publicEntry } from "../lib/site";

const manualRoutes = [
  "",
  "about",
  "profile",
  "ai-design",
  "ai-mathematics",
  "articles",
  "books",
  "career",
  "career/profile",
  "cases",
  "overview",
  "practices",
  "reference",
  "search",
  "series",
  "start-here",
];

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[
      character
    ]!,
  );

export const GET: APIRoute = async ({ site }) => {
  const entries = await getCollection("pages", publicEntry);
  const routes = new Map<string, string | undefined>();
  for (const route of manualRoutes) routes.set(route, undefined);
  for (const entry of entries)
    routes.set(entry.id, entry.data.updated_at ?? entry.data.published_at ?? undefined);

  const body = [...routes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([route, lastmod]) => {
      const loc = new URL(`ai-design-foundations/${route ? `${route}/` : ""}`, site).toString();
      return `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${escapeXml(String(lastmod).slice(0, 10))}</lastmod>` : ""}</url>`;
    })
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

