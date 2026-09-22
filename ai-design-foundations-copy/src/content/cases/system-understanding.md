---
summary: "コードから仕様を復元し、PlantUMLによる可視化と知識の構造化を経てRAG / QAへ展開するシリーズ。仕様書が不足するシステムを、人間が理解・判断し、継続的に保守できる状態へ整える。"
publication_format: book
layer: publication
title: レガシーシステムを「理解可能な状態」にする設計手法
kind: case
section: cases
status: evolving
tags: &a1
  - ai
  - 設計
  - リファクタリング
  - レガシー
  - rag
published_at: null
updated_at: "2026-09-22"
canonical: https://zenn.dev/nullcontroller/books/db491398459cbc
source:
  type: zenn
  original_type: book
  slug: db491398459cbc
  book_slug: db491398459cbc
  chapter_slug: null
  url: https://zenn.dev/nullcontroller/books/db491398459cbc
  published_at: null
  publication_month: 2026-03
  topics: *a1
  zenn_type: null
  metadata:
    title: レガシーシステムを「理解可能な状態」にする設計手法
    summary: |-
      レガシーシステムのモダナイゼーションでは、新しい技術へ置き換える前に、まず現在のシステムを理解できる状態にすることが重要です。

      しかし、長期間運用されてきたシステムでは、仕様書が残っていない、当時の担当者がいない、設計意図が分からない、実装されたソースコードだけが残っている、といった状況も珍しくありません。

      このようなシステムを変更するには、まずソースコードから現在の仕様や構造を読み解き、人間が理解・確認できる形へ再構築する必要があります。

      本書では、そのための一連の手法を、

      レガシーコード
      → 仕様復元
      → 構造化・可視化
      → 知識として再利用
      → RAG / QAシステムへ展開

      という流れで整理します。

      単にAIへコードを読ませて説明させるのではありません。

      ソースコードから何を抽出するのか、どのような形式で構造を表現するのか、どこを人間が確認するのか、そして復元した知識をその後の調査や保守へどう再利用するのか。

      「コードしか残っていないシステム」を「人間とAIが利用できる知識」に変換する設計手法を、実務で利用できる形でまとめています。

      対象読者

      ・レガシーシステムの調査・保守を担当するエンジニア
      ・モダナイゼーションを進める設計者・アーキテクト
      ・仕様書が不足したシステムの構造を復元したい人
      ・生成AIやRAGをソフトウェア保守へ活用したい技術者

      本書の目的は、AIにレガシーシステムを理解させることではありません。

      人間がシステムを理解し、判断できる状態を再構築すること。

      そのためにAIをどこで使い、どこを人間が確認するべきかを含めて整理します。
    topics: *a1
    published: true
    price: 0
    toc_depth: 1
    chapters:
      - "175772"
      - 4f03c8
      - 147cdb
      - a02dc3
      - cf471a
      - 720ca8
      - 7da717
      - cd6a40
      - 1d444f
      - 28501b
      - 6dcbe1
      - a490bc
series: system-understanding
series_title: レガシーシステムを「理解可能な状態」にする設計手法
order: 0
cover: /assets/imported/zenn/db491398459cbc-cover.jpg
---
## Context

長期間運用されたシステムでは、仕様書が不足し、当時の担当者や設計判断の記録が残っていないことがある。一方で、稼働中のソースコードには現在の処理、分岐、依存関係が残っている。

この事例では、既存システムを安全に変更できる状態へ近づけるため、コードから仕様を復元し、人間が確認できるKnowledgeとして再構成した。

## Problem

- 仕様と実装の対応を確認できない
- 処理の流れと依存関係を俯瞰しにくい
- 個別調査の結果が再利用可能な知識として残らない
- AIへコードを渡すだけでは、説明の根拠と確認範囲が曖昧になる

技術を置き換える前に、現在のシステムが何をしているかを追跡できる状態が必要だった。

## Decision

AIの説明を完成した仕様として扱わず、コードから抽出した情報を構造化し、人間が確認する工程を置いた。

全体の流れは次のとおりである。

```text
既存コード
  ↓
仕様の抽出・復元
  ↓
処理と依存関係の可視化
  ↓
人間による確認
  ↓
再利用可能なKnowledge
  ↓
RAG / QAによる参照支援
```

## Implementation

- ソースコードから処理、分岐、入出力、依存関係を抽出
- PlantUMLで動的構造と関係を可視化
- 復元した仕様を、人間が読める説明とAIが検索できる構造へ整理
- 確認済みのKnowledgeをRAG / QAへ接続
- AIが生成した説明と、人間が確認した事実を区別

各章では、何を抽出し、どこを人間が確認し、後続の調査や保守へどう再利用するかを扱う。

## Result

コードだけが残る状態から、処理と依存関係を確認できる状態へ情報を整理した。復元した仕様を一回限りの調査資料にせず、継続的な保守とQAで参照できるKnowledgeへ展開した。

この事例が示すのは、AIにシステム理解を任せる方法ではない。人間が理解し判断できる材料を再構築し、その工程の一部をAIで支援する方法である。

## What I Would Change Now

現在なら、復元開始時点で次を明示する。

- コード位置、版、抽出日時を含むProvenance
- AI生成、機械検証、人間確認の状態区分
- 仕様変更を検知する更新フロー
- QAの回答品質を測る代表質問と回帰評価

これにより、仕様復元を初回調査で終わらせず、実装変更に追従するKnowledge運用として設計できる。

## Related Design Principles

- [Instruction・Knowledge・Evidenceの責務分離](/ai-design-foundations/knowledge-context/instruction-knowledge-evidence/)
- [人間向け文書とAI向けKnowledgeを分けて設計する](/ai-design-foundations/knowledge-context/human-and-ai-documentation/)
- [AI評価指標](/ai-design-foundations/reference/evaluation-metrics/)
- [全章を読む](/ai-design-foundations/cases/system-understanding/system-understanding-problems/)
