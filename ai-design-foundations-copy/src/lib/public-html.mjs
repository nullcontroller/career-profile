import { load } from "cheerio";

export const normalizeSourceUrl = (value) => {
  try {
    const u = new URL(value);
    return decodeURIComponent(u.origin + u.pathname).replace(/\/$/, "");
  } catch {
    return value;
  }
};
export const hiddenRoutes = [
  "/project",
  "/tools",
  "/authoring",
  "/foundations/wiki-overview",
  "/foundations/design-system-overview",
];
export function publicHtml(html, sourceLinks = new Map()) {
  const $ = load(html, null, false);
  $("a[href]").each((_, element) => {
    const a = $(element),
      href = a.attr("href");
    const normalized = normalizeSourceUrl(href);
    let target;
    try {
      target = new URL(href, "https://nullcontroller.github.io");
    } catch {
      return;
    }
    const isCareer =
      target.hostname === "nullcontroller.github.io" &&
      /^\/career-profile(?:\/|$)/.test(target.pathname);
    const externalSource =
      /(^|\.)github\.com$/.test(target.hostname) ||
      /(^|\.)zenn\.dev$/.test(target.hostname);
    const internalPath = target.pathname
      .replace(/^\/ai-design-foundations/, "")
      .replace(/\/$/, "");
    const hidden =
      target.hostname === "nullcontroller.github.io" &&
      hiddenRoutes.some(
        (path) => internalPath === path || internalPath.startsWith(path + "/"),
      );
    if (hidden) {
      a.replaceWith(a.contents());
      return;
    }
    if (isCareer) {
      a.attr(
        "href",
        target.pathname.includes("/profile")
          ? "/ai-design-foundations/career/profile/"
          : "/ai-design-foundations/career/",
      );
    } else if (externalSource) {
      const replacement = sourceLinks.get(normalized);
      if (replacement) a.attr("href", replacement);
      else a.replaceWith(a.contents());
    }
  });
  return $.html();
}
