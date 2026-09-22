---
summary: "個人利用と業務システムでは求められる責任と制御が異なる。AIの利用可否を一律に論じず、情報、検証、権限、影響に応じた運用設計を考える。"
publication_format: article
layer: publication
title: AIは使われている。でも使いこなされていない
kind: guide
section: practices
status: evolving
tags: &a1
  - ai
  - キャリア
  - ソフトウェア設計
  - プロダクト開発
  - 生成ai
published_at: 2026-03-28 14:37
updated_at: "2026-09-22"
canonical: https://zenn.dev/nullcontroller/articles/15bcff341ff67b
source:
  type: zenn
  original_type: article
  slug: 15bcff341ff67b
  book_slug: null
  chapter_slug: null
  url: https://zenn.dev/nullcontroller/articles/15bcff341ff67b
  published_at: 2026-03-28 14:37
  publication_month: null
  topics: *a1
  zenn_type: idea
  metadata:
    title: AIは使われている。でも使いこなされていない
    emoji: 💼
    type: idea
    topics: *a1
    published: true
    published_at: 2026-03-28 14:37
---

AIを日常的に使う人が増えても、それだけで業務へ安全に組み込めるとは限らない。個人の作業支援と、組織が責任を持つ業務システムでは、扱う情報、誤りの影響、必要な検証、実行権限が異なるからである。

## 「使っている」が指す範囲

AI利用には、異なる責任を持つ場面が含まれる。

- 下書き、要約、発想支援として個人が使う
- 人間が確認する前提で業務成果物の候補を作る
- AI出力を顧客や利用者へ提示する
- AIが既存システムを更新し、処理を実行する

同じモデルを使っていても、後段へ進むほど出力の影響と説明責任は大きくなる。「AIを使えるか」という一つの質問では、この違いを扱えない。

## 組織が確認すること

組織が利用を制限する理由は、技術への賛否だけではない。少なくとも次を確認する必要がある。

- 入力してよい情報か
- 出力の根拠と品質を確認できるか
- 誤りを誰が検出し、採否を判断するか
- 外部システムへ実行する権限を誰が持つか
- 問題が起きたときに停止・復旧できるか

制限が厳しすぎれば学習と改善を妨げる。一方、利用を自由化するだけでは、情報漏洩、誤情報の採用、責任の不明確化を防げない。必要なのは、影響に応じた利用条件である。

## 利用と制御を分ける

AIを業務で扱う能力は、プロンプトを書けることだけではない。

- 対象業務と非対象業務を判断する
- 必要なKnowledgeとContextを特定する
- 出力を検証する条件を定義する
- 不明な状態を無理に確定しない
- 人間のレビューと承認をWorkflowへ組み込む
- 実行後の結果を観測し、改善へ戻す

生成、受理、承認、実行を分けることで、AIを利用しながら組織としての責任を維持できる。

## ツール利用から業務設計へ

個人の効率化では、短い時間で有用な下書きを得るだけでも価値がある。業務システムでは、その出力が正しい条件、誤った場合の影響、採用までの手続きを定義する必要がある。

AI活用を定着させるには、利用率だけでなく、品質、レビュー負荷、差し戻し、例外、運用コストを確認する。そこで得た結果を、Knowledge、評価基準、委任範囲、Workflowへ戻す。

## 結論

AIを使うことと、AIを業務で扱えることは同じではない。違いは利用者の属性ではなく、対象業務に必要な情報、検証、権限、責任を設計できるかにある。

AIの価値は、生成能力だけで決まらない。出力をどの状態として受け取り、誰が何を確認し、どこまで実行させるかまで設計して初めて、継続的な業務改善へつながる。

## 関連ページ

- [AI導入を業務へ定着させる](/ai-design-foundations/practices/adoption-governance/)
- [AI適用可否と委任レベルの設計](/ai-design-foundations/foundations/applicability-and-delegation/)
- [責任境界と状態遷移](/ai-design-foundations/reference/responsibility-state-model/)
