# 2026-09-22 Content Modernization

## Why

初期構築では、既存のZenn記事とGitHub上の設計資料を欠落なく移し、URL、出典、Book構造を維持することを優先した。その結果、公開本文の一部に移行元の媒体名、旧章構造、執筆時点の説明が残り、現在の設計知識と履歴情報の境界が曖昧になっていた。

## Principle

公開サイトは「どこから移したか」ではなく、「現在どのように理解し、設計へ使うか」を中心にする。出典と変更履歴は失わず、front matter、migration manifest、Git履歴、History文書で追跡する。

## Scope

- 全Markdownの分類、Summary、本文、出典、公開状態を監査
- Referenceを用語、数式、評価指標、責任状態へ分割
- PracticesにAI導入、教育、横展開の正本を追加
- 確率モデルの説明を、数学的定義、説明モデル、設計上の含意へ再構成
- Case Studyの入口をContext、Problem、Decision、Implementation、Result、現在の改善点で再構成
- 公開本文に残る旧媒体・旧章構造への依存を除去
- Content health、SEO、Sitemap、RSS、JSON-LDの検証を追加

## Content Decisions

全件の判断は [`docs/content-modernization-report.md`](../content-modernization-report.md) に記録した。本文を変更しないページも、現行の分類とSummaryが内容に一致することを確認したうえでKEEPとしている。

## Result

AI Design、AI数学論、Practices、Referenceを現在の知識として読める構造にし、Case StudyとPublicationを証拠・事例として接続した。出典は保持しつつ、公開本文から移行作業の都合を外した。

## Next

実務、学習、検証、発信から得た知見を、Content Maintenance Policyに沿って継続的に反映する。個別ページの更新では、設計原則と評価可能な指標の対応を優先する。

