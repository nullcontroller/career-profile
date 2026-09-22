---
summary: "Temperatureがlogitと次トークンの確率分布へ与える影響を説明する。低い値でも正確性や安全性は保証されないことを踏まえ、用途別の評価と反復実験で設定を選ぶ。"
layer: ai-mathematics
title: Temperature設計指針
kind: principle
section: foundations
status: evolving
tags:
  - foundations
published_at: null
source:
  type: wiki
  url: https://github.com/nullcontroller/ai-design-foundations/wiki/Temperature%E8%A8%AD%E8%A8%88%E6%8C%87%E9%87%9D
  original_type: wiki
  slug: Temperature設計指針
  topics: []
---
## Temperature設計指針

> 種別：生成条件 / 実験設計 / 評価方法
> 適用対象：文章生成、QAチャット、コード生成、AIエージェント
> 対象工程：Decoding設定 / 評価 / 運用
> 関連ページ：[生成AIの条件付き確率モデル基礎](/foundations/conditional-probability/)、[なぜ回答範囲を制限した方がよいのか](/foundations/answer-scope/)、[ハルシネーションの発生原理](/foundations/hallucination-mechanisms/)

前ページでは、AIが回答してよい領域と、回答を止める条件を定義しました。

では、回答可能と判断した後、AIはどのように一つの文章を生成するのでしょうか。

そこで関係するのがTemperatureです。

Temperatureは、しばしば「創造性」や「ランダム性」の設定として説明されます。

しかし、その説明だけでは実務設計に使えません。

> Temperatureは、モデルが計算した次トークンの相対的な選ばれやすさを変形するパラメータである。

低くすれば安全になるわけでも、高くすれば賢くなるわけでもありません。

用途、評価指標、他のサンプリング設定と合わせて設計する必要があります。

---

### AIは次のトークンへスコアを与える

言語モデルは、直前までの入力と出力から、次に続く各トークンのスコアを計算します。

この正規化前のスコアをlogitと呼びます。

トークン $i$ のlogitを $z_i$ とすると、Temperature $T$ を適用した確率は、一般に次のsoftmaxで表せます。

$$
p_i(T)
=
\frac{\exp(z_i/T)}
{\sum_j \exp(z_j/T)}
\qquad (T>0)
$$

Temperatureは、モデルが持つ知識を書き換えるものではありません。

同じlogitに対して、確率分布の形を変えます。

- $0<T<1$：上位候補の差を拡大する
- $T=1$：元のsoftmax分布を使う
- $T>1$：候補間の差を縮める

式に $T=0$ を代入することはできません。

製品上の「Temperature 0」が、greedy decodingや極めて低い値としてどう処理されるかは実装依存です。

---

### Temperatureは候補の順位ではなく、確率差を変える

二つのトークン $i,j$ の確率比を取ると、Temperatureの働きが分かります。

$$
\frac{p_i(T)}{p_j(T)}
=
\exp\left(\frac{z_i-z_j}{T}\right)
$$

$z_i>z_j$ なら、Temperatureを低くするほど、上位候補 $i$ が相対的に強くなります。

一方、Temperatureを高くすると、この差が小さくなります。

例えば、logitが次の三候補だったとします。

$$
z=(2,1,0)
$$

softmax後の確率は、およそ次のようになります。

| Temperature | 候補A | 候補B | 候補C |
| ---: | ---: | ---: | ---: |
| 0.5 | 86.7% | 11.7% | 1.6% |
| 1.0 | 66.5% | 24.5% | 9.0% |
| 2.0 | 50.6% | 30.7% | 18.6% |

候補の順位は変わっていません。

変わったのは、下位候補が実際に選ばれる余地です。

---

### エントロピーで分布の広がりを見る

確率分布の不確実性は、エントロピーで表せます。

$$
H(T)
=
-\sum_i p_i(T)\log p_i(T)
$$

logitを固定した場合、Temperatureに対する変化は次のように書けます。

$$
\frac{dH(T)}{dT}
=
\frac{\operatorname{Var}_{p(T)}(z)}{T^3}
\ge 0
$$

したがって、固定されたlogitに対しては、Temperatureを上げるほど分布のエントロピーは減少しません。

直感的には、選択肢の広がりが大きくなります。

ただし、これは**各生成ステップでlogitが固定されている場合の数学的性質**です。

文章生成では、一つのトークンが変わると、次のステップの入力もlogitも変わります。

そのため、Temperatureと最終文章の品質を、この式だけから直接決めることはできません。

---

### 文章全体では、小さな差が連鎖する

出力列を $Y=(y_1,y_2,\ldots,y_n)$ とします。

自己回帰型の言語モデルでは、文章全体の確率は各ステップの条件付き確率の積です。

$$
P_T(Y\mid X,C)
=
\prod_{t=1}^{n}
P_T(y_t\mid X,C,y_{<t})
$$

途中で別のトークンが選ばれると、その後の条件 $y_{<t}$ が変わります。

結果として、初期の小さな差が、文章後半で大きな差になる場合があります。

```text
同じ入力
  ↓
序盤で異なるトークンを選択
  ↓
以後のContextが変わる
  ↓
次の確率分布も変わる
  ↓
異なる文章へ分岐する
```

Temperatureが高いほど、こうした分岐が起きる機会は増えやすくなります。

ただし、同じ出力になる場合もあり、必ず大きく変化するわけではありません。

---

### 低Temperatureは正しさを保証しない

ここは最も誤解されやすい点です。

低Temperatureは、上位候補を選びやすくします。

しかし、最上位候補が正しいとは限りません。

誤った候補 $w$ のlogitが、正しい候補 $c$ より高い場合を考えます。

$$
z_w > z_c
$$

このときTemperatureを下げると、

$$
\frac{p_w(T)}{p_c(T)}
=
\exp\left(\frac{z_w-z_c}{T}\right)
$$

は大きくなります。

つまり、**誤った最上位候補を、さらに確信的に選ぶ可能性があります。**

低Temperatureで期待できるのは、主に出力の揺れを抑えることです。

次のものは別に設計しなければなりません。

- 正しい根拠を取得する
- 根拠外の主張を検出する
- 必要な情報がなければ回答を拒否する
- 出力をSchema・型・ルール・テストで検証する
- 高影響な処理を人間へ戻す

Temperatureはハルシネーション対策の一要素にはなり得ますが、最後の安全弁ではありません。

---

### 低Temperatureと再現性も同じではない

Temperatureを低くすると、同じ入力から同じ候補が選ばれやすくなります。

しかし、再現性を保証するには条件が足りません。

出力は、少なくとも次の要素でも変わります。

- モデルとバージョン
- System Prompt
- 会話履歴
- RAGの検索結果と順位
- Toolの実行結果
- top-k、top-pなどの生成設定
- 乱数seed
- 提供サービス側の実装変更

したがって、再現性を評価する場合は、Temperatureだけでなく入力条件と実行環境を記録します。

```text
モデルID
プロンプト版
Knowledge版
検索結果
生成パラメータ
Tool結果
出力
```

また、greedy decodingを使っても、提供環境まで含めた完全な再現性が保証されるとは限りません。

---

### top-k、top-pとは役割が異なる

Temperature以外にも、サンプリング候補を制御する設定があります。

#### top-k

確率上位 $k$ 個だけを候補として残します。

$$
S_k
=
\operatorname{TopK}\{p_i\}
$$

#### top-p

確率の累積値が $p$ 以上になる最小の上位集合を残します。

$$
S_p
=
\min\left\{
S:\sum_{i\in S}p_i\ge p
\right\}
$$

#### Temperature

候補を直接削除するのではなく、候補間の相対確率を変えます。

| 設定 | 主な作用 |
| --- | --- |
| Temperature | 確率差を拡大・縮小する |
| top-k | 候補数を上位 $k$ 個へ制限する |
| top-p | 一定の累積確率に入る候補だけ残す |

これらを併用したときの処理順序や指定可能範囲は、製品・API・モデルによって異なります。

固定の数値を他製品へそのまま移植しない方がよいでしょう。

---

### 用途別の数値は、推奨値ではなく初期仮説とする

「QAなら0.1、解説なら0.5、創作なら0.8」のような表は分かりやすい反面、誤解も生みます。

同じTemperatureでも、モデル、API、top-p、プロンプト、タスクによって出力は変わります。

そのため、絶対的な推奨値より、次の設計方針を使います。

| 用途 | まず試す方向 | 主に評価するもの |
| --- | --- | --- |
| 根拠限定QA | 低い側 | 正確性、根拠支持率、回答拒否 |
| 情報抽出・分類 | 低い側 | 一致率、Schema適合率、再試行率 |
| コード差分案 | 低〜中 | テスト成功率、静的解析、差分妥当性 |
| 設計案の比較 | 中程度 | 有効案の数、重複率、検証可能性 |
| 発想・創作 | 中〜高 | 多様性、新規性、一貫性 |

数値は、評価セットで比較して決めます。

例えば候補となるTemperature集合を $\mathcal{T}$、品質指標を $Q(T)$、多様性を $D(T)$、損失を $R(T)$ とすると、目的に応じて次のように選択できます。

$$
T^*
=
\arg\max_{T\in\mathcal{T}}
\left[
\alpha Q(T)
+
\beta D(T)
-
\gamma R(T)
\right]
$$

$\alpha,\beta,\gamma$ は業務上の重みです。

QAでは正確性とリスクの重みを大きくし、発想では多様性の重みを大きくします。

これはTemperatureの万能な最適値ではなく、**用途ごとの評価関数に対する最適値**です。

---

### Temperatureは単独で評価しない

Temperatureを比較するときは、他の条件を固定します。

```text
同じモデル
同じプロンプト
同じKnowledge
同じ検索結果
同じtop-k / top-p
同じ評価データ
```

その上で、各設定を複数回実行します。

一回だけの出力では、確率的な差と偶然を区別できません。

最低限、次の指標を用途に合わせて測ります。

- 正答率・タスク成功率
- 根拠支持率
- 出力形式の適合率
- 回答拒否の妥当性
- 同一入力に対する一致率
- 有効な候補の多様性
- 人間の修正時間

業務QAであれば、Temperatureを下げた結果、文章が似るようになっただけなのか、誤答や確認工数まで減ったのかを分けて確認します。

---

### 実務での設計順序

Temperatureは、AIシステム設計の最後に近い調整項目です。

先に決めるべきものがあります。

```text
1. 業務目的と許容損失を決める
2. 回答範囲と停止条件を決める
3. 必要なContextと根拠を与える
4. 出力検証と実行制御を作る
5. 評価データと指標を作る
6. Temperatureなどの生成設定を比較する
```

根拠が不足したRAGや、評価基準のないQAチャットを、Temperature調整だけで安全にすることはできません。

逆に、業務上の境界と検証方法が定義されていれば、Temperatureが品質へ与える影響を実験できます。

---

### 結論

Temperatureは、AIの賢さ、安全性、創造性を直接指定する値ではありません。

数理的には、logitを割ることで次トークンの確率差を変えます。

低くすれば上位候補が支配的になり、高くすれば下位候補も選ばれやすくなります。

ただし、最上位候補が誤っていれば、低Temperatureは誤りを固定化する可能性があります。

また、低Temperatureだけで根拠遵守、正確性、再現性を保証することもできません。

> Temperatureは安全装置ではなく、評価可能なAIシステムに対して行う生成分布の調整である。

用途ごとに評価指標を決め、他の条件を固定し、複数回の実験で選ぶ。

それがTemperatureの設計です。

---

### 参考資料

- Geoffrey Hinton, Oriol Vinyals, Jeff Dean, [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531), 2015
- Ari Holtzman et al., [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751), ICLR 2020
- Hugging Face, [Generation](https://huggingface.co/docs/transformers/v4.57.0/main_classes/text_generation)
- Luca Massarelli et al., [How Decoding Strategies Affect the Verifiability of Generated Text](https://aclanthology.org/2020.findings-emnlp.22/), Findings of EMNLP 2020
