import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
const section = z.enum([
  "foundations",
  "architecture",
  "knowledge-context",
  "evaluation-hitl",
  "software-engineering",
  "practices",
  "cases",
  "essays",
]);
const pages = defineCollection({
  loader: glob({
    pattern: ["**/*.md", "!career/**/*.md"],
    base: "./src/content",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z
    .object({
      public: z.boolean().default(true),
      title: z.string().min(1),
      summary: z.string().trim().min(1),
      layer: z.enum([
        "ai-design",
        "ai-mathematics",
        "practice",
        "case",
        "publication",
        "reference",
      ]),
      design_topic: z
        .enum([
          "applicability",
          "responsibility-control",
          "architecture",
          "knowledge-context",
          "evaluation-hitl",
          "software-engineering",
          "lifecycle-operations",
        ])
        .optional(),
      publication_format: z
        .enum(["article", "book", "series", "essay"])
        .optional(),
      kind: z.enum(["principle", "architecture", "guide", "case", "essay"]),
      section,
      status: z.enum(["draft", "evolving", "stable", "archived"]),
      order: z.number().int().nonnegative().optional(),
      tags: z.array(z.string()).default([]),
      published_at: z.string().nullable().optional(),
      updated_at: z.string().nullable().optional(),
      canonical: z.url().optional(),
      series: z
        .string()
        .regex(/^[a-z0-9-]+$/)
        .optional(),
      series_title: z.string().optional(),
      cover: z.string().optional(),
      source: z
        .object({
          type: z.enum(["zenn", "wiki", "repository"]),
          url: z.url(),
          slug: z.string().optional(),
          original_type: z.string().optional(),
          book_slug: z.string().nullable().optional(),
          chapter_slug: z.string().nullable().optional(),
          published_at: z.string().nullable().optional(),
          publication_month: z.string().nullable().optional(),
          topics: z.array(z.string()).default([]),
          zenn_type: z.string().nullable().optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.layer === "ai-design" && !data.design_topic)
        ctx.addIssue({
          code: "custom",
          message: "AI Design requires design_topic",
          path: ["design_topic"],
        });
      if (data.layer === "ai-design" && data.source?.type === "zenn")
        ctx.addIssue({
          code: "custom",
          message:
            "Keep Zenn publications in related publications, not the AI Design canonical index",
          path: ["layer"],
        });
    }),
});
const career = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/career" }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    layer: z.literal("career"),
    status: z.enum(["draft", "stable", "evolving"]),
    source: z.object({
      type: z.literal("repository"),
      url: z.url(),
      commit: z.string(),
    }),
  }),
});
export const collections = { pages, career };
