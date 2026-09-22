---
title: "AI活用を別の業務へ横展開する"
summary: "成功事例をそのまま複製せず、目的、情報、判断、リスク、評価へ分解し、別の業務へ移せる要素を見極める。"
layer: "practice"
kind: "guide"
section: "practices"
status: "evolving"
order: 30
tags:
  - AI活用
  - 業務設計
updated_at: "2026-09-22"
---

AI活用の横展開では、成功したプロンプトやツール構成をそのまま複製しても、同じ結果になるとは限らない。成功条件を分解し、再利用できる設計と業務固有の条件を分ける。

## 成功条件を分解する

事例を次の観点で記録する。

- **目的**：何を改善したか
- **情報**：どのKnowledgeとContextを使ったか
- **判断**：AIと人間が何を判断したか
- **リスク**：誤りが何へ影響したか
- **評価**：品質と運用結果をどう測ったか

## 再利用するもの

別の業務でも利用できるのは、責任境界、状態遷移、評価手順、例外処理などの設計原則である。業務固有の用語、データ、承認者、許容誤差は移植せず、対象業務に合わせて定義し直す。

## 小さく再検証する

横展開先では、元の事例を実績として参照しつつ、新しい評価データと失敗条件を用意する。業務目的、利用者、情報源、影響範囲が変われば、委任レベルも再評価する。

## 展開後に比較する

元の業務と横展開先で、品質、時間、コスト、レビュー負荷、例外率を比較する。差が生じた理由をKnowledge、Context、Workflow、権限の違いから確認し、再利用可能な原則を更新する。

## 関連する設計知識

- [AI活用事例をそのまま横展開できるのか](/ai-design-foundations/practices/transferring-ai-practices/)
- [AI導入を業務へ定着させる](/ai-design-foundations/practices/adoption-governance/)
- [AI業務システムの参照アーキテクチャ](/ai-design-foundations/architecture/reference-architecture/)
