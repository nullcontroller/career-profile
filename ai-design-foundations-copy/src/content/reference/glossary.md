---
title: 基本用語集
summary: "AI Design Foundationsで使う基本用語を、モデル・情報・工程・責任の観点から定義する。用語を製品名や流行語ではなく、設計上の役割として確認するための参照資料。"
layer: reference
kind: principle
section: foundations
status: stable
order: 10
tags: [用語, AI Design]
updated_at: "2026-09-22"
---

## 基本用語集

このページは、サイト全体で使う語の意味を揃えるための参照資料である。製品ごとの呼称ではなく、設計時に区別すべき責務を中心に定義する。

### モデルと実行構造

| 用語 | このサイトでの意味 |
|---|---|
| AI | 入力から分類・予測・生成・推薦などを行うモデルまたは機能の総称 |
| LLM | 文脈を条件としてToken系列の確率分布を扱う大規模言語モデル |
| AIシステム | モデルに加え、入力、Knowledge、検索、Tool、検証、承認、実行、監視を含む系 |
| Agent | モデル、Tool、状態、停止条件をWorkflowで接続した実行Loop |
| Workflow | Task、状態遷移、担当、入力、出力、停止、例外処理を定義した工程 |
| Orchestrator | Taskの割当て、受渡し、再試行、停止、統合を制御する構成要素 |
| Tool | 検索、計算、更新など、モデル外部の能力へ接続する明示的なインターフェース |
| Artifact | AI、人間、既存システムが工程間で受け渡す成果物 |
| Provenance | 成果物の由来。入力、根拠、作成者、版、時刻、処理履歴を含む |

### 情報と根拠

| 用語 | 意味 |
|---|---|
| Input | 今回の処理要求または観測値 |
| Instruction | 役割、Task、制約、出力契約 |
| Context | 一回の処理でモデルが実際に参照できる情報 |
| Knowledge | 組織やDomainで再利用する知識資産 |
| Evidence | 判断や主張を検証するために関連付けた根拠 |
| Canonical Knowledge | 事実、版、責任主体を管理する正本 |
| Retrieval | 入力に関連する根拠候補を検索し、Contextへ組み込む処理 |

Knowledgeが存在しても、今回のContextへ正しく組み込まれなければ生成条件にはならない。検索された情報も、取得された時点で正しいと確定したわけではない。

### 検証と制御

| 用語 | 意味 |
|---|---|
| Validation | Schema、型、範囲、権限など、定義済み条件への適合確認 |
| Verification | 内容が根拠、仕様、期待結果と整合するかの確認 |
| Approval | 権限者が業務上の採用または実行を確定する行為 |
| Guardrail | 生成前の誘導、生成時制約、出力検証、実行制御を含む多層統制 |
| Human in the Loop（HITL） | 条件に応じてAIから人間へ判断・承認・例外処理を戻す設計 |
| Rollback | 実行後の変更を、安全が確認された状態へ戻す処理 |

### 関連Reference

- [数式・記号リファレンス](/reference/mathematical-reference/)
- [評価指標リファレンス](/reference/evaluation-metrics/)
- [責任境界・状態モデル](/reference/responsibility-state-model/)
