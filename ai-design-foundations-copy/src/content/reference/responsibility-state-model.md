---
title: 責任境界・状態モデル
summary: "AIの能力・権限・説明責任を分離し、生成から実行・監視までの成果物状態を定義する。候補生成を承認や確定処理と混同しないための安定した参照モデル。"
layer: reference
kind: principle
section: evaluation-hitl
status: stable
order: 40
tags: [責任境界, HITL]
updated_at: "2026-09-22"
---

## 責任境界・状態モデル

AIが技術的に処理できることと、業務上実行してよいこと、結果へ責任を持つことは別である。

### Capability・Authority・Accountability

$$
Capability \neq Authority \neq Accountability
$$

| 概念 | 意味 |
|---|---|
| Capability | 技術的に処理できる能力 |
| Authority | 処理を実行・確定してよい権限 |
| Accountability | 結果を説明し、是正する責任 |

AIへCapabilityを与えても、AuthorityとAccountabilityが自動的に移るわけではない。Authorityは対象操作、条件、期間、上限、取消方法まで含めて定義する。

### 成果物の状態

| 状態 | 意味 | 主な確認 |
|---|---|---|
| Generated | AIが候補を生成した | 入力・モデル・時刻を記録できるか |
| Evidence Linked | 根拠と由来が関連付いた | 根拠を再確認できるか |
| Validated | 定義済みの機械検証を通過した | Schema、型、範囲、権限に適合するか |
| Reviewed | 人間または独立した検証工程が確認した | 内容・影響・例外を確認したか |
| Approved | 権限者が業務利用を確定した | 誰が何を承認したか |
| Executed | 外部または業務システムへ反映した | 実行結果と対象を追跡できるか |
| Monitored | 実行後の結果を観測している | 逸脱の検知・停止・復旧が可能か |

`Generated`、`Validated`、`Approved`は同じ状態ではない。低Riskの処理では一部を自動化できるが、省略条件と責任主体を明示する。

### Human in the Loopを置く条件

人間レビューは常に置けばよいわけではない。次の条件を組み合わせて配置する。

- 影響が大きい、または不可逆である
- 根拠不足や分布外入力を検知した
- 権限・金額・法務・安全性の境界を越える
- 自動検証では意味や業務妥当性を確認できない
- 例外処理や責任主体の判断が必要である

人間へ戻す場合は、元入力、AI候補、根拠、検証結果、未解決点を一緒に渡す。

### 関連ページ

- [AI出力の責任境界とHITL](/evaluation-hitl/responsibility-and-hitl/)
- [AI適用可否と委任レベルの設計](/foundations/applicability-and-delegation/)
- [AI業務システムの参照アーキテクチャ](/architecture/reference-architecture/)
