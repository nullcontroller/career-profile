# 立林 裕太朗 — Personal Site

立林 裕太朗のCareer・技術知識・設計思想・実務事例・記事を統合した個人サイトです。AI Design Foundationsはサイト内の技術知識・設計体系を表します。
MarkdownをGitで管理し、レビュー・検証を経てAstroから静的HTMLを生成します。

**[サイトを見る](https://nullcontroller.github.io/ai-design-foundations/)**

中心テーマ：Applied AI / System Architecture / Knowledge・Context / Evaluation・HITL / AI-Assisted Software Engineering / AI System Lifecycle。
既存システムの改善・モダナイゼーションは、設計原則を適用した実務事例として扱います。

## Authoring

Node.js 24を使用します。

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
```

[執筆ガイド](docs/authoring-guide.md)にfront matter、Markdown拡張、Series、公開手順をまとめています。
`master`へのpushでGitHub Actionsが検証・ビルド・Pagesデプロイを行います。

## Repository

- `src/content/` — Careerと技術領域のMarkdown原文
- `src/components/`, `src/layouts/`, `src/styles/` — 文書UIと意味ブロック
- `src/pages/` — トップ・カテゴリ・本文・検索
- `public/assets/` — ローカル配信する画像
- `migration/` — Zenn・Wikiの台帳、URL対応表、移行報告
- `scripts/` — 移行・完全性・リンク検証
- `.github/workflows/` — `master`用Pages CI/CD

## Provenance

出典と移行時の本文ハッシュはmigration台帳・source metadataで保持します。
公開HTMLのcanonicalは自サイトを指し、GitHub・Zenn・旧Careerサイトへのリンクは公開しません。

[Career](https://nullcontroller.github.io/ai-design-foundations/career/) /
[詳細職務経歴](https://nullcontroller.github.io/ai-design-foundations/career/profile/)

開発記録はdocs/historyへ保存し、Project・Tools・Journalは公開しません。
