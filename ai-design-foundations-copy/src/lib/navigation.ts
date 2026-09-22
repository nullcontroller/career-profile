import type { CollectionEntry } from "astro:content";
import { label } from "./site";
export type Entry = CollectionEntry<"pages">;
export const navigation = [
  [
    { path: "", title: "ホーム", summary: "立林 裕太朗の公開サイト" },
    { path: "profile", title: "プロフィール", summary: "人物紹介と技術背景" },
    { path: "about", title: "このサイトについて", summary: "サイトの目的と設計" },
    { path: "career", title: "キャリア", summary: "職務経験・希望する役割" },
  ],
  [
    {
      path: "ai-design",
      title: "AI設計",
      summary: "業務システムへの組込み",
    },
    {
      path: "ai-mathematics",
      title: "AI数学論",
      summary: "AIの性質を理解する",
    },
    { path: "practices", title: "実践", summary: "業務・組織への適用" },
    { path: "cases", title: "事例", summary: "実務事例のBook 2冊" },
  ],
  [
    {
      path: "articles",
      title: "記事",
      summary: "単発記事・Book・連載・Essay",
    },
  ],
  [
    { path: "overview", title: "全体目次", summary: "全コンテンツを見渡す" },
    { path: "reference", title: "参考資料", summary: "用語・数式・参照資料" },
        { path: "search", title: "検索", summary: "サイト内を検索" },
  ],
];
export const designTopics = [
  ["applicability", "AI適用判断", "適用可否と委任レベル"],
  [
    "responsibility-control",
    "責任境界・制御",
    "生成・受理・実行の分離とGuardrail",
  ],
  [
    "architecture",
    "Architecture",
    "全体構成・Tool / Workflow・Security / Governance",
  ],
  [
    "knowledge-context",
    "Knowledge / Context",
    "指示・知識・根拠の責務と情報設計",
  ],
  ["evaluation-hitl", "Evaluation / HITL", "評価・回帰検証・採否判断"],
  [
    "software-engineering",
    "Software Engineering",
    "コード生成・保守・複数AIの設計",
  ],
  [
    "lifecycle-operations",
    "Lifecycle / Operations",
    "変更・再評価・監視・継続運用",
  ],
] as const;
export const topicLabel = (key?: string) =>
  designTopics.find((x) => x[0] === key)?.[1];
export const contentCategory = (e: Entry) =>
  e.data.layer === "ai-design"
    ? topicLabel(e.data.design_topic)!
    : e.data.layer === "ai-mathematics"
      ? "モデル・確率・振る舞い"
      : e.data.layer === "reference"
        ? "用語・参照資料"
        : e.data.layer === "practice"
          ? "業務・開発プロセス"
          : label(e.data.section);
export const layerPath = (layer: string) =>
  ({
    "ai-design": "ai-design",
    "ai-mathematics": "ai-mathematics",
    practice: "practices",
    case: "cases",
    publication: "articles",
    career: "career",
    reference: "reference",
  })[layer] || "start-here";
export const publicationType = (e: Entry) =>
  ({ article: "記事", book: "書籍", series: "連載", essay: "論考" })[
    e.data.publication_format || "article"
  ];
export const isPublication = (e: Entry) =>
  !!e.data.publication_format ||
  (e.data.layer === "publication" && (!e.data.series || e.data.order === 0));
export const publicationDate = (e: Entry) =>
  e.data.published_at
    ? e.data.published_at.slice(0, 10)
    : e.data.source?.publication_month
      ? e.data.source.publication_month + "（公開月・日付未確認）"
      : "公開日未確認";
export const topicPublications: Record<string, string[]> = {
  applicability: [
    "foundations/ai-business-design",
    "foundations/generation-and-acceptance",
  ],
  "responsibility-control": [
    "foundations/generation-and-acceptance",
    "evaluation-hitl/human-review-capability",
    "essays/trust-in-ai-generated-content",
    "foundations/ai-business-design",
  ],
  architecture: [
    "architecture/agents-tools-and-workflows",
    "foundations/ai-business-design",
    "cases/three-ai-maintenance",
  ],
  "knowledge-context": [
    "knowledge-context/context-before-model-performance",
    "cases/system-understanding",
  ],
  "evaluation-hitl": [
    "evaluation-hitl/human-review-capability",
    "essays/trust-in-ai-generated-content",
    "cases/system-understanding",
  ],
  "software-engineering": [
    "software-engineering/ai-driven-development",
    "software-engineering/ai-design-assistance",
    "software-engineering/code-generation-and-work-design",
    "cases/three-ai-maintenance",
  ],
  "lifecycle-operations": [
    "cases/system-understanding",
    "cases/three-ai-maintenance",
  ],
};
export const relatedPublications = (all: Entry[], topic?: string) =>
  (topicPublications[topic || ""] || [])
    .map((id) => all.find((e) => e.id === id))
    .filter((e): e is Entry => !!e && isPublication(e));
export const caseStudies = [
  {
    book: "cases/system-understanding",
    topics: ["QA / RAG", "Knowledge再構築"],
    chapters: [
      "cases/system-understanding/recovering-code-structure",
      "cases/system-understanding/human-and-ai-knowledge",
      "cases/system-understanding/rag-implementation",
      "cases/system-understanding/qa-evaluation",
    ],
    design: [
      "knowledge-context/human-and-ai-documentation",
      "evaluation-hitl/qa-evaluation",
    ],
  },
  {
    book: "cases/three-ai-maintenance",
    topics: ["AIオーケストレーション", "既存ソフトウェア開発・改善"],
    chapters: [
      "cases/three-ai-maintenance/cryptography-and-failure-modes",
      "cases/three-ai-maintenance/structuring-failure-handling",
      "cases/three-ai-maintenance/sharing-current-specifications",
      "cases/three-ai-maintenance/results-and-reflections",
    ],
    design: [
      "software-engineering/multi-ai-orchestration",
      "evaluation-hitl/responsibility-and-hitl",
    ],
  },
];

export const publicationTopic = (e: Entry) =>
  e.data.layer === "ai-mathematics" ? "AI数学論" : label(e.data.section);

export const publicationTopics = (entry: Entry) => [
  ...new Set([
    publicationTopic(entry),
    ...designTopics
      .filter(([key]) => topicPublications[key]?.includes(entry.id))
      .map(([, title]) => title),
    ...(entry.data.tags.some((tag) => ["aiエージェント", "mcp"].includes(tag))
      ? ["AI Agent"]
      : []),
    ...(entry.data.tags.includes("キャリア") ? ["Career"] : []),
  ]),
];
