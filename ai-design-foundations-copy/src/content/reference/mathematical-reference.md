---
title: 数式・記号リファレンス
summary: "条件付き確率、自己回帰分解、Temperature、RAG、工程成功、期待損失を参照できる形で整理する。数学上の定義と、設計判断に使う簡略モデルを明確に分ける。"
layer: reference
kind: principle
section: foundations
status: stable
order: 20
tags: [数学, 確率]
updated_at: "2026-09-22"
---

## 数式・記号リファレンス

このページでは、数学上の定義と設計上の説明モデルを区別する。数式は実システムの品質保証ではなく、前提や制御対象を明示するために使う。

### 数学上の定義

#### 条件付き出力分布

$$
P(Y\mid X,C,I,M,D)
$$

| 記号 | 意味 |
|---|---|
| $X$ | 利用者入力・処理対象 |
| $C$ | Context |
| $I$ | Instruction・制約 |
| $M$ | モデル |
| $D$ | Temperature、top-pなどの生成条件 |
| $Y$ | 生成出力 |

#### 自己回帰分解

$$
P(Y\mid C)=\prod_{t=1}^{T}P(y_t\mid y_{<t},C)
$$

系列全体の確率を、各Tokenの条件付き確率の積として表す。完成済みの回答候補から一つを選ぶという意味ではない。

#### Temperature付きSoftmax

$$
P(y_t=i)=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}
$$

$z_i$はlogit、$T>0$はTemperatureである。TemperatureはToken分布の形を変えるが、事実性や安全性を直接保証しない。

### 設計上の説明モデル

#### RAGの二段階モデル

$$
P(Y\mid X)=\sum_Z P(Z\mid X)P(Y\mid X,Z)
$$

$Z$は検索された根拠候補である。検索失敗と、根拠取得後の生成失敗を分けるための簡略モデルとして使う。

#### 工程成功の連鎖

$$
P\left(\bigcap_{i=1}^{n}S_i\right)=\prod_{i=1}^{n}P\left(S_i\mid\bigcap_{j=1}^{i-1}S_j\right)
$$

各工程が独立で成功確率が同じ場合に限り、$P(\text{all correct})=p^n$と簡略化できる。実システムの品質予測へそのまま使わない。

#### Riskと期待損失

$$
Risk=P(error)\times Impact
$$

$$
\mathbb{E}[L]=\sum_k P(F_k)I_k
$$

実務では検出可能性、可逆性、露出量、復旧費用、拒否、Latency、Human Review負荷なども考慮する。何を損失として数えるかは設計判断であり、式だけでは決まらない。

### 読み方の注意

1. 条件を省略した式は、利用するページで前提を補う。
2. モデル内部の確率と、運用で観測した頻度を混同しない。
3. 独立性を仮定した簡略式を、実測値へ直結させない。
4. 数式の精密さを、主張の正しさの代わりにしない。

### 関連ページ

- [生成AIの条件付き確率モデル基礎](/foundations/conditional-probability/)
- [Temperature設計指針](/foundations/temperature-design/)
- [ハルシネーションの発生原理](/foundations/hallucination-mechanisms/)
