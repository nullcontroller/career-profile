---
summary: "暗号処理と異常系の見直しを、GPT・GitHub Copilot・Microsoft 365 Copilotの役割分担で進めた実務事例。要件整理から仕様化・実装・単体テストまでの工程と、人間が保持した判断責任を示す。"
publication_format: book
layer: publication
title: 3つのAIをオーケストレーションしたレガシー保守
kind: case
section: cases
status: evolving
tags: &a1
  - ソフトウェア設計
  - 生成ai
  - オーケストレーション
  - hitl
  - 保守開発
published_at: null
updated_at: "2026-09-22"
canonical: https://zenn.dev/nullcontroller/books/b9a9feaefb4001
source:
  type: zenn
  original_type: book
  slug: b9a9feaefb4001
  book_slug: b9a9feaefb4001
  chapter_slug: null
  url: https://zenn.dev/nullcontroller/books/b9a9feaefb4001
  published_at: null
  publication_month: 2026-08
  topics: *a1
  zenn_type: null
  metadata:
    title: 3つのAIをオーケストレーションしたレガシー保守
    summary: |-
      本書では、CRA対応に伴うセキュリティ要件の強化を契機として、レガシーシステムの暗号処理と異常系を見直した事例を扱う。

      既存システムでは、暗号化したパスワードをレジストリへ保存し、利用時に復号していた。暗号方式をCNG APIおよびDPAPIへ変更したことで、暗号APIのエラー処理が生じた。また、レジストリ値の破損、読出し失敗といった異常系も整理する必要があり、完全化保守を行う事になった。

      そこで、GitHub Copilot、GPT、Microsoft 365 Copilotを役割分担させた。

      GPT：制約条件と要件案の整理、PlantUML作成
      GitHub Copilot：コード調査、実現方法の具体化、コード修正
      Microsoft 365 Copilot：検討結果のExcel仕様書化

      時には、PlantUMLで動的構造を補完するなど、AIの特性を生かした補完を用いた。
      サブ審議で承認を得た後、関数単位で実装と単体テストを進めた。

      その結果、開発工数の兼ね合いから従来委託していた外部委託を不要とし、
      想定開発期間も7割短縮できた。

      本書で扱うのは、AIへの丸投げではない。人間が前提と判断基準を定め、AIの出力をリスクに応じて利用しながら、要件検討から仕様化、実装、承認までをつなぐ方法である。
    topics: *a1
    published: true
    price: 0
    toc_depth: 2
    chapters:
      - c90225
      - e68b04
      - "49e444"
      - 40f445
      - b2b1c6
      - 147fb6
      - c8af5c
series: three-ai-maintenance
series_title: 3つのAIをオーケストレーションしたレガシー保守
order: 0
cover: /assets/imported/zenn/b9a9feaefb4001-cover.jpg
---
## Context

CRA対応に伴うセキュリティ要件の強化を契機として、既存システムの暗号処理と異常系を見直した。

対象システムでは、暗号化したパスワードをレジストリへ保存し、利用時に復号していた。暗号方式をCNG APIおよびDPAPIへ変更する中で、暗号APIのエラー、レジストリ値の破損、読出し失敗などを整理する必要が生じた。

## Problem

- セキュリティ要件を既存実装へ適用する必要がある
- 正常系だけでなく、暗号処理とレジストリの異常系を定義する必要がある
- コード調査、要件整理、仕様化、実装を短い期間で接続する必要がある
- AIが作った案を、そのまま業務上の確定事項にはできない

## Decision

一つのAIへ全工程を任せず、工程ごとに役割を分けた。人間は前提、判断基準、採否、承認を保持した。

| 担当 | 役割 |
|---|---|
| GPT | 制約条件と要件案の整理、PlantUML作成 |
| GitHub Copilot | コード調査、実現方法の具体化、コード修正 |
| Microsoft 365 Copilot | 検討結果のExcel仕様書化 |
| 人間 | 要件とリスクの判断、成果物の確認、審議、承認 |

## Implementation

1. 既存コードとセキュリティ要件から制約条件を整理
2. 正常系・異常系と、暗号APIの失敗条件を仕様案へ展開
3. PlantUMLで処理の動的構造を補完
4. 検討結果を仕様書へ反映
5. サブ審議で承認を取得
6. 関数単位で実装と単体テストを実施

AI間で会話を自動連結したのではなく、人間が成果物を確認し、次工程へ渡す内容を決めた。この境界が、AIの利用と業務上の確定を分けている。

## Result

従来は開発工数の関係から外部委託していた作業を内製で進め、外部委託を不要にした。想定していた開発期間は約7割短縮した。

成果はAIツールの数ではなく、調査、要件、仕様、承認、実装、テストを役割分担し、人間が判断責任を維持したことにある。

## What I Would Change Now

現在なら、作業開始前に次を定義する。

- 各工程の入力、出力、完了条件
- 成果物のProvenanceと状態
- 異常系を含む評価データと受入条件
- 再試行、差し戻し、停止の条件
- AIごとの役割ではなく、工程が必要とするCapability

これにより、利用製品が変わっても同じWorkflowを再評価しやすくなる。

## Related Design Principles

- [生成・受理・実行を分離する](/ai-design-foundations/foundations/generation-and-acceptance/)
- [AI出力の責任境界とHITL](/ai-design-foundations/evaluation-hitl/responsibility-and-hitl/)
- [責任境界と状態遷移](/ai-design-foundations/reference/responsibility-state-model/)
- [全章を読む](/ai-design-foundations/cases/three-ai-maintenance/cryptography-and-failure-modes/)
