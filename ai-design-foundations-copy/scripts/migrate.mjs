import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import YAML from "yaml";
const zenn = process.argv[2],
  wiki = process.argv[3];
if (!zenn || !wiki)
  throw Error("Usage: node scripts/migrate.mjs ZENN_ROOT WIKI_ROOT");
const read = (p) =>
  fs
    .readFileSync(p, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n");
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const parse = (s) => {
  const m = s.match(/^---\n([\s\S]*?)\n---\n/);
  return m
    ? { data: YAML.parse(m[1]), body: s.slice(m[0].length) }
    : { data: {}, body: s };
};
const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.name.startsWith(".")
        ? []
        : e.isDirectory()
          ? walk(path.join(d, e.name))
          : [path.join(d, e.name)],
    );
if (!read("README.md").includes("## What this repository covers"))
  throw Error(
    "Initial migration only: original README snapshot required. Do not rerun over edited content.",
  );
const articleMap = {
  "00d48d3802ff49": ["practices", "ai-education-principles"],
  "15bcff341ff67b": ["practices", "ai-adoption-and-effective-use"],
  "1c9ec1d7e01206": ["knowledge-context", "context-before-model-performance"],
  "3a18f3f15b840a": ["practices", "transferring-ai-practices"],
  "4f6be09295656b": ["essays", "ai-career-market"],
  "5b8a6a1c413e10": ["essays", "model-competition-and-ecosystems"],
  "5bbc6c7f86194f": ["essays", "ai-roles-beyond-fde"],
  "6c399a260e0535": ["software-engineering", "ai-design-assistance"],
  "7e06dd0e4e67d2": ["foundations", "generation-and-acceptance"],
  "7f7cb55c4ebcaa": ["evaluation-hitl", "human-review-capability"],
  a1ac10c371e230: ["foundations", "llm-as-probabilistic-model"],
  c95d77150aa590: ["architecture", "agents-tools-and-workflows"],
  dfd99f00db85d7: ["essays", "trust-in-ai-generated-content"],
  ecf0bcfd611d7f: ["software-engineering", "code-generation-and-work-design"],
  f5c1a1276d2191: ["cases", "understanding-systems-as-capability"],
  fccbf170ead145: ["software-engineering", "ai-driven-development"],
};
const bookMap = {
  "76ed12dcc7e5d7": [
    "foundations",
    "ai-business-design",
    [
      "delegation-and-responsibility",
      "evaluating-business-efficiency",
      "asking-versus-delegating",
    ],
  ],
  b9a9feaefb4001: [
    "cases",
    "three-ai-maintenance",
    [
      "cryptography-and-failure-modes",
      "structuring-failure-handling",
      "implementation-design",
      "reviewable-specifications",
      "sharing-current-specifications",
      "code-generation-and-unit-tests",
      "results-and-reflections",
    ],
  ],
  db491398459cbc: [
    "cases",
    "system-understanding",
    [
      "system-understanding-problems",
      "qa-case-study",
      "project-structure",
      "recovering-code-structure",
      "visualizing-process-flows",
      "human-and-ai-knowledge",
      "connecting-ui-and-internals",
      "rag-implementation",
      "qa-evaluation",
      "rag-improvement",
      "qa-operations",
      "qa-case-study-revisited",
    ],
  ],
};
const entries = [],
  assets = [],
  wikiEntries = [];
function add(file, sourceType, category, slug, extra = {}) {
  const raw = read(path.join(zenn, file)),
    parsed =
      sourceType === "book"
        ? { data: YAML.parse(raw), body: YAML.parse(raw).summary + "\n" }
        : parse(raw),
    d = parsed.data;
  const originalSlug =
    sourceType === "book" ? file.split("/")[1] : path.basename(file, ".md");
  const book =
    sourceType === "chapter"
      ? file.split("/")[1]
      : sourceType === "book"
        ? originalSlug
        : null;
  const url =
    sourceType === "article"
      ? `https://zenn.dev/nullcontroller/articles/${originalSlug}`
      : sourceType === "book"
        ? `https://zenn.dev/nullcontroller/books/${book}`
        : `https://zenn.dev/nullcontroller/books/${book}/view/${originalSlug}`;
  const parent = book
    ? YAML.parse(read(path.join(zenn, "books", book, "config.yaml")))
    : null;
  const month = book
    ? read(path.join(zenn, "catalog", "books", book + ".md")).match(
        /公開月: (\d+)年(\d+)月/,
      )
    : null;
  const record = {
    source_file: file,
    source_type: sourceType,
    original_slug: originalSlug,
    original_url: url,
    destination_file: `src/content/${category}/${slug}.md`,
    destination_slug: slug,
    category,
    migrated: false,
    image_count: (parsed.body.match(/!\[/g) || []).length,
    notes: [],
    source_sha256: hash(raw),
    original_frontmatter: d,
    original_published_at: d.published_at ?? null,
    original_publication_month: month
      ? `${month[1]}-${month[2].padStart(2, "0")}`
      : null,
  };
  if (!d.published_at)
    record.notes.push(
      "Exact publication date absent in source; not inferred from Git dates.",
    );
  if (sourceType === "chapter" && d.free === false)
    record.notes.push(
      "Original free:false preserved. Parent book price:0 and published:true; migrated per owner request.",
    );
  entries.push({
    ...record,
    body: parsed.body,
    metadata: {
      title: d.title,
      summary: sourceType === "book" ? "" : undefined,
      kind:
        category === "essays"
          ? "essay"
          : category === "cases"
            ? "case"
            : category === "foundations"
              ? "principle"
              : category === "architecture"
                ? "architecture"
                : "guide",
      section: category,
      status:
        (sourceType === "chapter" ? parent.published : d.published) === false
          ? "draft"
          : "evolving",
      tags: d.topics ?? parent?.topics ?? [],
      published_at: d.published_at ?? null,
      canonical: url,
      source: {
        type: "zenn",
        original_type: sourceType,
        slug: originalSlug,
        book_slug: book,
        chapter_slug: sourceType === "chapter" ? originalSlug : null,
        url,
        published_at: d.published_at ?? null,
        publication_month: record.original_publication_month,
        topics: d.topics ?? parent?.topics ?? [],
        zenn_type: d.type ?? null,
        metadata: d,
      },
      ...extra,
    },
  });
}
for (const [slug, [section, dest]] of Object.entries(articleMap))
  add(`articles/${slug}.md`, "article", section, dest);
for (const [book, [section, slug, chapters]] of Object.entries(bookMap)) {
  const config = YAML.parse(
    read(path.join(zenn, "books", book, "config.yaml")),
  );
  if (config.chapters.length !== chapters.length)
    throw Error("Unexpected chapter count");
  add(`books/${book}/config.yaml`, "book", section, slug, {
    series: slug,
    series_title: config.title,
    order: 0,
    cover: `/assets/imported/zenn/${book}-cover.jpg`,
  });
  for (const [i, c] of config.chapters.entries())
    add(`books/${book}/${c}.md`, "chapter", section, `${slug}/${chapters[i]}`, {
      series: slug,
      series_title: config.title,
      order: i + 1,
    });
  fs.mkdirSync("public/assets/imported/zenn", { recursive: true });
  fs.copyFileSync(
    path.join(zenn, "books", book, "cover.jpg"),
    `public/assets/imported/zenn/${book}-cover.jpg`,
  );
  assets.push({
    source_file: `books/${book}/cover.jpg`,
    destination: `/assets/imported/zenn/${book}-cover.jpg`,
    downloaded: true,
    sha256: hash(fs.readFileSync(path.join(zenn, "books", book, "cover.jpg"))),
  });
}
// Classify each Wiki note without merging related or duplicated prose.
const wikiNames = {
  生成AIの条件付き確率モデル基礎: ["foundations", "conditional-probability"],
  ハルシネーションの発生原理: ["foundations", "hallucination-mechanisms"],
  ハルシネーションの多層制御設計: [
    "foundations",
    "layered-hallucination-controls",
  ],
  なぜ回答範囲を制限した方がよいのか: ["foundations", "answer-scope"],
  Temperature設計指針: ["foundations", "temperature-design"],
  "Instruction・Knowledge・Evidenceの責務分離": [
    "knowledge-context",
    "instruction-knowledge-evidence",
  ],
  QAチャット運用思想: ["knowledge-context", "qa-operations"],
  QAチャット評価設計思想: ["evaluation-hitl", "qa-evaluation"],
  人向け資料とAI向け資料の分離設計: [
    "knowledge-context",
    "human-and-ai-documentation",
  ],
  QA行動制約Knowledge: ["knowledge-context", "qa-behavior-constraints"],
  プロンプト設計の基本構造: ["knowledge-context", "prompt-structure"],
  プロンプト設計の失敗モード: ["knowledge-context", "prompt-failure-modes"],
  ガードレールの数学的説明: ["foundations", "guardrail-models"],
  AI間インターフェースとしてのプロンプト: [
    "architecture",
    "prompts-as-interfaces",
  ],
  コード生成AIの正体: ["software-engineering", "code-generation-models"],
  なぜAIは新規コードよりコード保守に強いのか: [
    "software-engineering",
    "code-maintenance-context",
  ],
  コード生成を使うべき場所: [
    "software-engineering",
    "code-generation-boundaries",
  ],
  コード生成AIの評価と採用設計: [
    "evaluation-hitl",
    "code-evaluation-acceptance",
  ],
  AIを開発工程に組み込む: ["software-engineering", "development-workflow"],
  複数AIの役割分担と工程設計: [
    "software-engineering",
    "multi-ai-orchestration",
  ],
  "AIコスト・Latency・モデルルーティング設計": [
    "architecture",
    "cost-latency-routing",
  ],
  生成AIセキュリティと脅威モデリング: [
    "architecture",
    "security-threat-modeling",
  ],
  AI適用可否と委任レベルの設計: ["foundations", "applicability-and-delegation"],
  AI出力の責任境界とHITL: ["evaluation-hitl", "responsibility-and-hitl"],
  AI業務システムの参照アーキテクチャ: [
    "architecture",
    "reference-architecture",
  ],
  "AIシステムの変更・再評価設計": ["architecture", "change-and-reevaluation"],
  AIシステムのオブザーバビリティとSLO設計: [
    "architecture",
    "observability-and-slo",
  ],
  AI評価データセットと回帰評価設計: [
    "evaluation-hitl",
    "datasets-and-regression",
  ],
  "用語・数式索引": ["foundations", "glossary"],
  Home: ["foundations", "wiki-overview"],
};
const wikiFiles = walk(wiki).filter(
  (p) => p.endsWith(".md") && !path.basename(p).startsWith("_"),
);
for (const f of wikiFiles) {
  const name = path.basename(f, ".md"),
    mapping = wikiNames[name];
  if (!mapping) throw Error("Unclassified Wiki " + name);
  const [section, slug] = mapping,
    body = read(f);
  wikiEntries.push({
    source_file: path.relative(wiki, f).replaceAll("\\", "/"),
    source_type: "wiki",
    original_url: `https://github.com/nullcontroller/ai-design-foundations/wiki/${encodeURIComponent(name)}`,
    destination_file: `src/content/${section}/${slug}.md`,
    destination_slug: slug,
    category: section,
    migrated: true,
    source_sha256: hash(body),
    body,
    metadata: {
      title: name === "Home" ? "AI Design Foundations — Wiki概要" : name,
      kind:
        section === "foundations"
          ? "principle"
          : section === "architecture"
            ? "architecture"
            : "guide",
      section,
      status: "evolving",
      tags: [section],
      published_at: null,
      source: {
        type: "wiki",
        url: `https://github.com/nullcontroller/ai-design-foundations/wiki/${encodeURIComponent(name)}`,
        original_type: "wiki",
        slug: name,
        topics: [],
      },
    },
  });
}
const route = (e) => `/${e.category}/${e.destination_slug}/`;
const urls = new Map(entries.map((e) => [e.original_url, route(e)]));
const names = new Map(
  wikiEntries.map((e) => [path.basename(e.source_file, ".md"), route(e)]),
);
for (const e of wikiEntries) urls.set(e.original_url, route(e));
const imageUrls = [
  ...new Set(
    entries.flatMap((e) =>
      [
        ...e.body.matchAll(
          /https:\/\/(?:static\.zenn\.studio|storage\.googleapis\.com\/zenn-user-upload)\/[^\s)"<>]+/g,
        ),
      ].map((m) => m[0]),
    ),
  ),
];
for (const url of imageUrls) {
  const dest = `/assets/imported/zenn/${hash(url).slice(0, 16)}${path.extname(new URL(url).pathname)}`;
  try {
    let bytes;
    if (fs.existsSync("public" + dest))
      bytes = fs.readFileSync("public" + dest);
    else {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw Error(`HTTP ${res.status}`);
      if (!res.headers.get("content-type")?.startsWith("image/"))
        throw Error("Not image");
      bytes = Buffer.from(await res.arrayBuffer());
      write("public" + dest, bytes);
    }
    assets.push({
      original_url: url,
      destination: dest,
      downloaded: true,
      sha256: hash(bytes),
    });
  } catch (err) {
    assets.push({
      original_url: url,
      destination: null,
      downloaded: false,
      notes: String(err),
    });
  }
}
// Conversions are mechanical and applied outside fenced code only.
function transform(body) {
  let fence = false;
  return body
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fence = !fence;
        return line;
      }
      if (fence) return line;
      line = line.replace(/\[\[([^\]]+)\]\]/g, (_, v) => {
        const [label, target] = v.includes("|") ? v.split("|") : [v, v];
        return `[${label}](${names.get(target) ?? `https://github.com/nullcontroller/ai-design-foundations/wiki/${encodeURIComponent(target)}`})`;
      });
      line = line.replace(
        /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g,
        (all, label, url) => {
          let key;
          try {
            key = decodeURI(url);
          } catch {
            key = url;
          }
          let mapped = urls.get(url) || urls.get(key);
          if (!mapped && !/^(https?:|#|mailto:)/.test(url)) {
            mapped = names.get(decodeURIComponent(path.basename(url, ".md")));
          }
          return mapped ? `[${label}](${mapped})` : all;
        },
      );
      for (const a of assets)
        if (a.original_url && a.downloaded)
          line = line.replaceAll(a.original_url, a.destination);
      return line.replace(/^(#{1,5}) /, "#$1 ");
    })
    .join("\n");
}
for (const e of [...entries, ...wikiEntries]) {
  const body = transform(e.body);
  e.migrated = true;
  e.destination_body_sha256 = hash(body);
  e.notes ??= [];
  e.notes.push(
    "Body: only heading levels, Wiki/internal links and image paths mechanically converted.",
  );
  write(
    e.destination_file,
    "---\n" + YAML.stringify(e.metadata) + "---\n" + body,
  );
}
const strip = ({ body, metadata, ...e }) => e;
write(
  "migration/zenn-migration-manifest.yaml",
  YAML.stringify({
    version: 1,
    source_commit: execFileSync("git", ["-C", zenn, "rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    expected: { article: 16, book: 3, chapter: 22 },
    entries: entries.map(strip),
    assets,
  }),
);
write(
  "migration/wiki-migration-manifest.yaml",
  YAML.stringify({
    source_commit: execFileSync("git", ["-C", wiki, "rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    entries: wikiEntries.map(strip),
    excluded: [
      "_Sidebar.md: replaced by site navigation",
      "_Footer.md: replaced by site footer",
    ],
    notes: [
      "Local historical nested copies are not authoritative; public Wiki HEAD was migrated. No prose merged.",
    ],
  }),
);
write(
  "migration/zenn-migration-map.md",
  "# Zenn migration map\n\n| Source | Original URL | Destination | New slug | Category |\n|---|---|---|---|---|\n" +
    entries
      .map(
        (e) =>
          `| ${e.source_file} | ${e.original_url} | ${e.destination_file} | ${e.destination_slug} | ${e.category} |`,
      )
      .join("\n") +
    "\n",
);
// Preserve the old README as a source document, not as a second homepage.
const old = read("README.md");
const meta = {
  title: "AI Design Foundations — 設計体系の原点",
  kind: "guide",
  section: "foundations",
  status: "evolving",
  tags: ["Applied AI", "Architecture"],
  source: {
    type: "repository",
    url:
      "https://github.com/nullcontroller/ai-design-foundations/blob/" +
      execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim() +
      "/README.md",
    topics: [],
  },
};
write(
  "src/content/foundations/design-system-overview.md",
  "---\n" + YAML.stringify(meta) + "---\n" + transform(old),
);
console.log(
  JSON.stringify({
    zenn: entries.length,
    wiki: wikiEntries.length,
    assets: assets.length,
    failedImages: assets.filter((a) => !a.downloaded).length,
  }),
);
