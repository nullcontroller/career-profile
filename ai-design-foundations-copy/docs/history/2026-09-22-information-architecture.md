---
title: "AI Design / AI数学論 / Publicationsへ情報構造を再設計"
summary: "数学・設計知識・実務適用・公開物の役割を整理し、layer・source・design_topicを分離した。各テーマの設計文書を主導線とし、Publicationを関連資料として参照できる構造にした。"
layer: project
project: ai-design-foundations
journal_kind: milestone
date: "2026-09-22"
status: stable
---

## 目的

数学・設計原則・実務適用・Zenn記事が混在していた情報構造を整理する。前日までの再編を踏まえ、その構造と今回整えた学習・参照導線を記録する。

## 課題

- Foundationsの意味が広すぎた。
- 数学・理論と設計知識が同列だった。
- Zenn由来Publicationと現在の設計知識が混在していた。
- Knowledge / Context等でSourceとTopicが同じ一覧に見えていた。

## 設計判断

AI Design、AI数学論、Practices、Case Studies、記事一覧へ役割を分離する。

layerは知識の役割、sourceは出典、design_topicはAI Design内のテーマとして別概念にする。Wiki由来の設計知識もAI Designへ配置できる一方、ZennのPublicationは個別Topicの関連資料から参照する。

## 実装

AI Designを7つのTopicに分け、Topicごとに設計文書とRelated Publicationsを表示する。AI Designトップの固定されたAI適用判断のRelated Publicationsを外し、設計体系の入口に役割を絞った。

AI数学論には「概念理解 → 数学 → 出力制御 → エラー特性 → 応用モデル」の読書順を追加した。Referenceでは用語・数式索引、Authoring Guide、Searchを主導線にし、Wiki概要をArchiveへ下げた。

既存の記事一覧ではArticle / Book / Essayを横断して探せる構造とFilterを維持した。Project JournalはMarkdownの専用Content Collectionとして追加し、日付順で判断と結果を追跡できるようにした。

## 成果

「何を知っているか」「なぜそうなるか」「どう適用するか」「何を公開したか」を分離できる構造になった。既存URLと本文を保ったまま、学習・設計・公開物の各入口を整理できた。

## 次にやること

Tools等の実装を検討し、Project Journalを継続する。実務・学習・検証で得た知見と、その反映理由を残していく。
