---
summary: "LLMを次トークンの確率モデルとして捉え、出力の揺らぎと制約を整理する。プロンプトやRAGを小技ではなく、不確実性を前提とした出力分布の設計として考える。"
publication_format: article
layer: ai-mathematics
title: LLMを確率モデルとして設計するという立場
kind: principle
section: foundations
status: evolving
tags: &a1
  - ai
  - 機械学習
  - 数学
  - 設計
  - llm
published_at: 2026-02-28 18:58
updated_at: "2026-09-22"
canonical: https://zenn.dev/nullcontroller/articles/a1ac10c371e230
source:
  type: zenn
  original_type: article
  slug: a1ac10c371e230
  book_slug: null
  chapter_slug: null
  url: https://zenn.dev/nullcontroller/articles/a1ac10c371e230
  published_at: 2026-02-28 18:58
  publication_month: null
  topics: *a1
  zenn_type: idea
  metadata:
    title: LLMを確率モデルとして設計するという立場
    emoji: 📐
    type: idea
    topics: *a1
    published: true
    published_at: 2026-02-28 18:58
---


LLMを業務システムへ組み込むときは、知識データベースや決定論的な関数としてではなく、与えられた条件から出力系列の確率分布を形成するモデルとして扱う。

![](/assets/imported/zenn/30150315b05f79f0.png)

---

## 数学的に言えること

自己回帰型の言語モデルは、出力系列 $Y=(y_1,\ldots,y_T)$ の条件付き確率を、各Tokenの条件付き確率へ分解する。

$$
P(Y\mid C)=\prod_{t=1}^{T}P(y_t\mid y_{<t},C)
$$

$C$ は、Instruction、利用者入力、会話履歴、検索結果など、その推論でモデルへ与えられたContextを表す。

この式が示すのは、各Tokenの分布が、それ以前のTokenとContextに条件付けられることだ。モデルが完成済みの回答候補を一覧から選ぶ、あるいは出力内容の真偽を保証する、という意味ではない。

## 説明モデルとしての出力分布

実際の出力は、モデルだけで決まらない。業務上は次のような説明モデルで考えると、制御点を整理しやすい。

$$
P(Y\mid X,C,I,M,D)
$$

- $X$：今回の入力・処理対象
- $C$：参照可能なContext
- $I$：Instructionと制約
- $M$：利用するモデル
- $D$：Temperatureやtop-pなどの生成条件

これは内部実装を完全に表す式ではなく、出力条件を分離して考えるための説明モデルである。プロンプトは条件の一部であり、Knowledgeの正しさ、検索結果、モデル特性、後段の検証を置き換えない。

## Temperatureが変えるもの

logit $z_i$ にTemperature $T>0$ を適用する代表的な形は次のとおりである。

$$
P(y_t=i)=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}
$$

Temperatureは候補Token間の確率差を変える。低くすれば常に正しくなるわけではなく、高くすれば必ず有用な多様性が得られるわけでもない。事実性、安全性、業務適合性は別に評価する。

## 数学から直接は言えないこと

次の主張は、自己回帰分解だけからは導けない。

- モデルが意味を理解しているか
- ある出力が事実として正しいか
- 特定製品の内部でどの推論手順が実行されたか
- プロンプトだけで制約を常に守らせられるか

確率モデルとしての理解は重要だが、それだけで製品品質や業務上の安全性を証明できない。

## 設計上の含意

確率的な生成を業務で扱うため、このサイトでは次を設計原則とする。

1. **生成物を候補として扱う**
   生成された状態と、検証・承認された状態を分ける。
2. **ContextとKnowledgeを管理する**
   何を参照させたか、どの版を使ったか、根拠を追跡できるようにする。
3. **受理条件を後段へ置く**
   Schema、根拠、業務ルール、権限を、生成とは独立して確認する。
4. **変動を評価へ含める**
   一回の成功例ではなく、代表入力、境界条件、失敗例で回帰評価する。
5. **影響に応じて委任範囲を変える**
   可逆性が低く影響が大きい処理では、人間の承認や実行制御を強くする。

LLMを確率モデルとして捉える目的は、生成を完全に予測することではない。不確実性の存在を前提に、入力、Context、検証、承認、実行を分離して設計することにある。

## 関連ページ

- [生成AIの条件付き確率モデル基礎](/ai-design-foundations/foundations/conditional-probability/)
- [Temperature設計指針](/ai-design-foundations/foundations/temperature-design/)
- [ハルシネーションの発生原理](/ai-design-foundations/foundations/hallucination-mechanisms/)
- [数式リファレンス](/ai-design-foundations/reference/mathematical-reference/)
