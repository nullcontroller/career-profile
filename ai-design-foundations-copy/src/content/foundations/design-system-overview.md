---
summary: "移行前READMEにまとめられていた設計体系の全体像。確率的な生成、Knowledge、評価、責任境界、開発工程、Lifecycleの関係と、各テーマへの入口を示す。"
layer: reference
public: false
title: AI Design Foundations — 設計体系の原点
kind: guide
section: foundations
status: evolving
tags:
  - Applied AI
  - Architecture
source:
  type: repository
  url: https://github.com/nullcontroller/ai-design-foundations/blob/7f248937121b84937e402997dde4d386a0886188/README.md
  topics: []
---
## AI Design Foundations

生成AIを単なる「コード生成ツール」や「プロンプト操作の対象」としてではなく、

> **確率的に出力を生成するコンポーネントとして、実務システムの中でどう設計・制御・検証・運用するか**

という観点から整理した設計体系です。

LLM / RAG / QA / AIオーケストレーション / HITL / AIガバナンス / AI Architecture / Lifecycleを中心に、  
生成AIを実務へ継続的に組み込むための設計思想・設計原則をまとめています。

---

### What this repository covers

主なテーマは以下です。

- LLMを確率的な出力生成モデルとして捉えた設計
- RAG / QAにおける知識境界・回答範囲・回答制御
- プロンプトによる役割・制約・Input / Output設計
- 生成AIをソフトウェア開発工程へ組み込む方法
- 複数AIの役割分担とオーケストレーション
- HITLによる判断・確認・責任境界
- AI出力の評価・検証可能性・ガバナンス
- AI業務システムの責務分離と参照アーキテクチャ
- Model / Prompt / Knowledge / Retrieval / Tool / Validator / Workflowを含む変更管理
- 再評価、Release、監視、Rollback、Incidentまで含むLifecycle設計
- 既存システム・レガシーシステムへのAI適用

---

### Core Concept

このリポジトリで重視しているのは、

> **AIに何を任せるかだけでなく、何を任せないか、どこで検証し、どこで人間が確認し、誰が最終判断を持つかまで設計すること**

です。

生成AIの出力は確率的であり、そのまま正解として扱うことはできません。

そのため、

> **生成できること、受理できること、実行してよいことを分離し、後工程で検証可能な境界を設ける**

ことを基本原則としています。

AI単体の性能ではなく、

> **AI・人間・Knowledge・Validator・Workflow・既存システム・監視を一つの業務システムとして設計する**

ことを重視しています。

---

### Documentation

設計思想・設計原則の詳細は GitHub Wiki に整理しています。

👉 [AI Design Foundations Wiki](https://github.com/nullcontroller/ai-design-foundations/wiki)

| Section | Theme |
| --- | --- |
| 100 | 数学から見たAI |
| 200 | QAチャット設計思想 |
| 300 | プロンプト構造 |
| 400 | コード生成・開発工程 |
| 500 | AIオーケストレーション |
| 600 | AIガバナンスとHITL |
| 700 | AI Architecture・Lifecycle |

Architecture全体を把握する入口として、次の設計ノートを推奨します。

- [AI適用可否と委任レベルの設計](/foundations/applicability-and-delegation/)
- [AI出力の責任境界とHITL](/evaluation-hitl/responsibility-and-hitl/)
- [AI業務システムの参照アーキテクチャ](/architecture/reference-architecture/)
- [AIシステムの変更・再評価設計](/architecture/change-and-reevaluation/)

設計ノートは個別のTipsではなく、次の流れを持つ一つの設計体系として整理しています。

```text
LLMの性質
↓
制約・回答範囲の設計
↓
RAG / QA
↓
プロンプト・Context設計
↓
開発工程への組み込み
↓
複数AIの役割分担
↓
HITL / Governance
↓
AI業務システムのArchitecture
↓
変更・再評価・Release・監視
```

#### 700. AI Architecture・Lifecycle

100〜600章で扱った設計原則を、一つの業務システムとして接続する章です。

- [AI業務システムの参照アーキテクチャ](/architecture/reference-architecture/)
- [AIシステムの変更・再評価設計](/architecture/change-and-reevaluation/)
- [AIシステムのオブザーバビリティとSLO設計](/architecture/observability-and-slo/)
- [AI評価データセットと回帰評価設計](/evaluation-hitl/datasets-and-regression/)

参照アーキテクチャでは、入力、Context構築、生成、検証、承認、実行、監視を責務として分離します。  
変更・再評価設計では、Modelだけではなく、Prompt、Knowledge、Retrieval、Tool、Validator、Workflow、GovernanceまでをVersion Bundleとして扱い、変更時の再評価範囲、Release条件、Rollback単位を設計します。

---

### Design Principles

#### 1. AIは確率的コンポーネントとして扱う

AIは、常に正解を返す決定的なシステムではありません。

そのため、生成結果だけではなく、

- 入力
- 制約
- Knowledge / Evidence
- 検証
- 承認
- 実行境界
- 監視

まで含めて設計します。

---

#### 2. AIの適用範囲を設計する

AIを「使える場所」だけでなく、

- AIへ任せる範囲
- 人間が確認する範囲
- AIへ任せない範囲

を明確にします。

---

#### 3. 生成・受理・実行を分離する

AIが出力を生成できることと、その出力を業務で採用できること、外部システムへ実行してよいことは別です。

そのため、Model Runtimeだけで完結させず、Validator、Decision Gate、Approval Boundary、Execution Boundaryを分離して設計します。

---

#### 4. 検証可能性を重視する

AI出力は、後工程で検証できる形にします。

例：

- コード → Build・Test・Review
- 仕様案 → 既存仕様との照合
- 影響範囲 → 実コードで確認
- RAG回答 → Evidenceを確認
- Tool Call → 権限・対象・上限を検証

---

#### 5. AIを開発工程全体へ組み込む

コード生成だけを最適化しません。

```text
要求整理
↓
既存コード調査
↓
影響分析
↓
設計
↓
仕様化
↓
実装
↓
レビュー
↓
テスト
↓
Release
```

各工程でAIと人間の役割を分けて設計します。

---

#### 6. 複数AIは競争ではなく役割分担させる

AIごとの特性を活かし、

- 調査
- コード探索
- 要件整理
- 文書化
- 実装
- レビュー

などを工程単位で分担させます。

---

#### 7. AIシステムは変更を前提に設計する

Model、Prompt、Knowledge、Retrieval、Tool、Validator、Workflowのいずれかが変われば、同じService名でも挙動は変わり得ます。

そのため、変更された構成要素だけを見るのではなく、

- 影響を受ける経路
- 再評価範囲
- Release条件
- 監視項目
- Rollback単位

まで含めてLifecycleを設計します。

---

### Case Studies

実務での生成AI活用・ソフトウェア設計事例は Zenn で公開しています。

👉 [Zenn - nullcontroller](https://zenn.dev/nullcontroller)

- [生成AIを業務へ組み込む設計原則](/foundations/ai-business-design/)：AI・人間・既存システムの責任分界、HITL、評価を業務設計として整理
- [3つのAIをオーケストレーションしたレガシー保守](/cases/three-ai-maintenance/)：要件整理、既存Code調査、仕様化、実装、Reviewを役割分担した事例
- [レガシーシステムを「理解可能な状態」にする設計手法](/cases/system-understanding/)：Reverse EngineeringからKnowledge化、RAG / QAへ接続する設計事例

---

### Positioning

このリポジトリは、

**AIモデルそのものを開発するための研究リポジトリではありません。**

対象としているのは、

> **生成AIを既存の業務・ソフトウェア・システムへ安全かつ継続的に組み込むための設計**

です。

特定Cloud、Framework、Model製品の構成例ではなく、Modelが変わっても再利用できる責務分離・検証・変更管理の原則を中心に扱います。

特に以下の領域を対象としています。

- Enterprise AI
- Applied AI
- AI Architecture
- RAG / QA
- AI-Assisted Software Engineering
- Legacy System / Modernization
- HITL
- AI Evaluation
- AI Governance
- AI System Lifecycle

---

### Keywords

`LLM` `RAG` `Generative AI` `Applied AI`  
`AI Architecture` `AI Orchestration` `AI Governance`  
`HITL` `AI Evaluation` `AI System Lifecycle`  
`GitHub Copilot` `Microsoft 365 Copilot`  
`Software Architecture` `AI-Assisted Software Engineering`  
`Legacy System` `Modernization`
