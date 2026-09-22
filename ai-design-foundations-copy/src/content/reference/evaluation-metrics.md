---
title: 評価指標リファレンス
summary: "Retrieval、回答品質、安全性、運用品質、人間レビュー負荷の指標を定義する。指標を単独の点数として扱わず、対象集合・閾値・費用と合わせて読むための参照資料。"
layer: reference
kind: principle
section: evaluation-hitl
status: stable
order: 30
tags: [Evaluation, RAG]
updated_at: "2026-09-22"
---

## 評価指標リファレンス

評価指標は、どの入力集合を、どの判定基準で、いつ測ったかと合わせて記録する。平均値だけでDomain別・Risk別の差を隠さない。

### Retrieval

| 指標 | 定義 | 読むときの注意 |
|---|---|---|
| Recall@k | 正解根拠のうち上位$k$件へ取得できた割合 | 正解根拠集合の作り方に依存する |
| Precision@k | 上位$k$件のうち関連根拠であった割合 | 高くても必要な根拠を欠く場合がある |
| Coverage | 評価対象のうち回答・処理した割合 | 低ければ安全とは限らず、移管費用も生じる |

### 回答・根拠

| 指標 | 定義 | 読むときの注意 |
|---|---|---|
| Groundedness | 出力中の主張が提示根拠で支持される度合い | 根拠自体の正しさは別途確認する |
| Correctness | 定義した正解または専門家判断との一致 | 正解が一意でないTaskでは判定規則が必要 |
| Completeness | 必要な論点を満たした度合い | 長い回答を優遇しない基準が必要 |
| Consistency | 同条件または同義入力での判断の整合性 | 多様性が必要なTaskとは分けて扱う |

### 受理・拒否

$$
Coverage=\frac{N_{answer}}{N}
$$

$$
Selective\ Risk=\frac{N_{error\ within\ answer}}{N_{answer}}
$$

| 指標 | 定義 |
|---|---|
| FAR | $P(accept\mid unsafe)$。受理してはいけない出力を受理する割合 |
| FRR | $P(reject\mid safe)$。利用可能な出力を拒否する割合 |
| Selective Risk | 回答・受理した集合の中での誤り率 |

閾値を厳しくするとFARが下がりFRRが上がる場合がある。安全性、業務価値、人間への移管量を同時に評価する。

### 運用と人間負荷

| 指標 | 確認する内容 |
|---|---|
| Latency | end-to-end時間と工程別時間 |
| Cost | モデル、検索、Tool、再試行、運用を含む費用 |
| Human Review負荷 | 件数だけでなく、確認時間・難度・差戻し率 |
| Override率 | 人間がAI候補を修正・却下した割合と理由 |
| Incident / Near miss | 誤受理、誤実行、検出された未遂と影響 |

### 関連ページ

- [AI評価データセットと回帰評価設計](/evaluation-hitl/datasets-and-regression/)
- [QAチャット評価設計思想](/evaluation-hitl/qa-evaluation/)
- [AIシステムのオブザーバビリティとSLO設計](/architecture/observability-and-slo/)
