import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import directive from "remark-directive";
import math from "remark-math";
import katex from "rehype-katex";
import {
  semanticDirectives,
  localUrls,
  mermaidBlocks,
} from "./src/lib/markdown.mjs";
export default defineConfig({
  site: "https://nullcontroller.github.io",
  base: "/ai-design-foundations",
  trailingSlash: "always",
  markdown: {
    processor: unified({
      remarkPlugins: [directive, semanticDirectives, math],
      rehypePlugins: [mermaidBlocks, localUrls, katex],
      syntaxHighlight: "shiki",
      shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
    }),
  },
});
