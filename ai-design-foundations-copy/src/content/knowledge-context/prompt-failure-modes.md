---
summary: "プロンプトの失敗を、Context不足・情報の混在・指示の競合・検証基準の欠如などに分解する。文章の長短だけで判断せず、失敗原因と変更の影響を追跡する方法を整理する。"
layer: ai-design
design_topic: knowledge-context
title: プロンプト設計の失敗モード
kind: guide
section: knowledge-context
status: evolving
tags:
  - knowledge-context
published_at: null
source:
  type: wiki
  url: https://github.com/nullcontroller/ai-design-foundations/wiki/%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%E8%A8%AD%E8%A8%88%E3%81%AE%E5%A4%B1%E6%95%97%E3%83%A2%E3%83%BC%E3%83%89
  original_type: wiki
  slug: プロンプト設計の失敗モード
  topics: []
---
## プロンプト設計の失敗モード

> 種別：設計原則 / 診断手順 / 評価方法  
> 適用対象：生成AI、RAG、QAチャット、AIエージェント、コード生成  
> 対象工程：Prompt設計 / Context構築 / 検証 / 運用改善  
> 関連ページ：[プロンプト設計の基本構造](/knowledge-context/prompt-structure/)、[ガードレールの数学的説明](/foundations/guardrail-models/)、[AI間インターフェースとしてのプロンプト](/architecture/prompts-as-interfaces/)

### 結論

プロンプトの失敗は、単純に「短すぎる」「長すぎる」「制約が多すぎる」では診断できない。

同じ症状でも、原因は異なる。

- 必要なContextがない
- 無関係なContextが多い
- Instruction同士が競合する
- 固定条件と実行時条件が混ざる
- 自然言語へ決定論的な統制を任せる
- 出力を判定する基準がない

したがって、改善は文章の追加・削除から始めない。

> 失敗事象を定義し、どの入力ブロック、制約、検索結果、履歴、検証工程が原因かを切り分ける。

---

### 1. 失敗を観測可能な事象へ分解する

「AIが壊れた」「プロンプトが弱い」という表現だけでは改善できない。

| 失敗事象 | 観測例 |
|---|---|
| Task未達 | 求めた成果物が完成しない |
| 制約違反 | 禁止事項、必須項目、Schemaを守らない |
| 過剰拒否 | 回答可能な入力にも回答しない |
| 内容空洞化 | 形式は正しいが具体的内容がない |
| 根拠不一致 | 引用したEvidenceが主張を支持しない |
| 状態混同 | 古い条件や別Taskの情報を適用する |
| 不安定 | 同義の入力で結果が大きく変わる |
| 検証不能 | 「適切に」など、合否を判定できない |
| 運用悪化 | Token、Latency、Review費用が過大になる |

評価対象を先に定義すると、Prompt変更の効果を比較できる。

---

### 2. 失敗モードの分類

#### 2.1 必要なContextがない

モデルが一般知識を持っていても、組織固有の仕様、現在の状態、対象範囲、例外を自動的には知れない。

典型例：

- 対象Versionがない
- 完了条件がない
- 判断に必要なEvidenceが検索されていない
- 利用可能なToolや権限が書かれていない
- 「前と同じ」の参照先がない

対策は文章を長くすることではなく、欠けた変数を特定してContextへ組み込むことである。

#### 2.2 無関係なContextが多い

Context Windowへ入ることと、Taskで安定して利用できることは同じではない。

入力Token数を $L_{in}$、Taskに必要なToken数を $L_{rel}$ とし、診断指標として関連情報密度を置く。

$$
\rho
=
\frac{L_{rel}}{L_{in}}
$$

$\rho$だけで性能は予測できない。情報の位置、構造、依存関係、Task複雑性も影響する。

ただし、次の棚卸しには使える。

- 古い会話履歴
- 対象外の検索結果
- 同じ規則の言い換え
- 未検証の過去出力
- 現在のTaskと異なるFew-shot Example

#### 2.3 InstructionとDataの境界が曖昧

外部文書、Webページ、Tool結果、利用者入力には、命令のような文字列が含まれ得る。

それを上位Instructionと同じ扱いで連結すると、Data内の命令が処理方針へ干渉する。

必要なのは「無視するよう依頼する」だけではない。

- InstructionとDataを別Field・別Channelで扱う
- 外部Contentへ由来と信頼区分を付ける
- Tool権限を最小化する
- 外部から得た指示を実行前に検証する
- 機密Dataへのアクセスと外部送信を分離する

#### 2.4 制約が競合する

可能な出力全体を $\mathcal{Y}$、制約 $c_i$ を満たす集合を $A_i$ とする。

$$
A_i
=
\{y\in\mathcal{Y}:c_i(y)=1\}
$$

すべてのHard Constraintを満たす実行可能集合は次である。

$$
\mathcal{F}
=
\bigcap_{i=1}^{n}A_i
$$

$\mathcal{F}=\varnothing$なら、モデル性能に関係なく仕様を満たす出力は存在しない。

例：本文を500文字以上かつ300文字以下にする。

自然言語上の緊張関係と、数学的な矛盾は分ける。例えば「詳細かつ簡潔」は、評価尺度と優先順位があれば両立する場合がある。

#### 2.5 Soft ConstraintがTaskを圧迫する

文体、例数、語彙、長さなどをすべて必須として扱うと、主要Taskより形式遵守が優先される場合がある。

| 優先度 | 扱い |
|---|---|
| P0 | 違反時に停止する。法令、権限、機密、不可逆操作 |
| P1 | 出力受理に必須。Schema、根拠、適用範囲 |
| P2 | Task品質に重要。必須論点、計算条件 |
| P3 | 可能なら満たす。文体、例数、表現上の好み |

Soft Constraintの違反量を $v_i(y)$、重みを $\lambda_i$ とすると、設計者の評価を次のように表せる。

$$
Score(y)
=
Utility(y)
-
\sum_i\lambda_i v_i(y)
$$

これはモデルが内部でこの式を厳密に最適化しているという意味ではない。Task達成と形式上の希望を分ける説明モデルである。

#### 2.6 固定条件と実行時条件が混ざる

Policy、Role、出力契約のような比較的固定された条件と、現在の入力、検索結果、Tool状態を同じ長大なTemplateへ固定すると、古い状態を再利用しやすい。

一回の処理 $k$ のContextを、次のように分ける。

$$
C_k
=
S\oplus X_k\oplus R_k\oplus T_k\oplus H_k
$$

- $S$：固定方針・出力契約
- $X_k$：今回の入力
- $R_k$：今回の検索結果
- $T_k$：Tool・実行状態
- $H_k$：必要な履歴・要約

会話履歴は正本ではない。実行時に必要な条件を、正本と現在状態から再構成する。

#### 2.7 自然言語へHard Constraintを任せる

自然言語の禁止命令は、生成分布を変える誘導であって、禁止出力の確率を必ず0にする機構ではない。

次の条件は可能な限りモデル外へ移す。

- Schemaと型
- 金額・件数・文字数の上限
- IDの存在確認
- 権限と認可
- 許可されたTool一覧
- 外部送信先
- 破壊的操作の承認

Promptは意図を伝え、ValidatorとExecution Boundaryは受理・実行を強制する。

#### 2.8 形式検証を意味検証と誤認する

JSON Schemaに適合しても、内容が正しいとは限らない。

検証を分ける。

1. Syntax：構文として読める
2. Schema：型と必須Fieldが正しい
3. Semantic：内容が根拠と整合する
4. Policy：許可範囲にある
5. Business：業務上採用できる

#### 2.9 停止条件がない

Agent Loopで「良くなるまで続ける」「問題がなくなるまで修正する」とだけ指示すると、終了判定ができない。

最低限、次を定義する。

- 成功条件
- 最大Step数・時間・費用
- 再試行可能な失敗
- 人へ移管する失敗
- 即時停止する状態
- 部分成果物の保存方法

#### 2.10 評価基準が抽象的である

「高品質に」「分かりやすく」「安全に」だけでは、変更前後を比較できない。

抽象的な要望は、観測可能な基準へ変換する。

| 抽象条件 | 評価可能な形 |
|---|---|
| 正確に | 原子的主張ごとの根拠一致率 |
| 簡潔に | 必須論点を維持し、上限文字数以内 |
| 安全に | 禁止操作0件、権限外Tool呼出0件 |
| 分かりやすく | 対象読者によるTask完了率 |

---

### 3. 症状から原因を断定しない

| 症状 | 可能性のある原因 | 確認するEvidence | 主な対策 |
|---|---|---|---|
| 一般論しか返らない | 根拠不足、Task曖昧、出力長不足 | 検索結果、必須論点、Token | Evidence追加、Task分解 |
| 条件を忘れる | Context位置、競合、履歴切捨て | 実際に送ったContext | 条件再構成、構造化 |
| 拒否が多い | 範囲判定過多、Soft Constraint過剰 | FAR・FRR、拒否理由 | 閾値調整、適用範囲限定 |
| JSONは正しいが内容が誤る | Schema検証のみ | Claim–Evidence対応 | 意味検証を追加 |
| 同じ誤りを繰り返す | 誤った履歴、中間出力の再利用 | Provenance、会話履歴 | 未検証出力を隔離 |
| Agentが止まらない | 完了条件・上限がない | Step履歴、停止理由 | Budgetと終了状態を追加 |
| Toolを誤用する | 権限過多、引数検証不足 | Tool Call、認可Log | Allowlist、承認、Sandbox |

---

### 4. Prompt Blockの限界価値を測る

基準Contextを $C$、追加Blockを $b_j$、評価損失を $J$ とする。

$$
\Delta J_j
=
J(C\oplus b_j)-J(C)
$$

- $\Delta J_j<0$：追加によって総合損失が下がる
- $\Delta J_j>0$：追加が有害または費用超過

評価損失には、少なくとも次を含める。

$$
J
=
L_{error}
+L_{omission}
+L_{refusal}
+L_{latency}
+L_{token}
+L_{review}
+L_{maintenance}
$$

Block同士には相互作用があるため、個別の効果を単純加算しない。

重要なInstructionの反復も一律に削除しない。長い履歴の後、Tool実行前、複数AIの引継ぎ、高影響操作の直前では再提示が有効な場合がある。

---

### 5. 改善はAblationで確認する

一度に複数箇所を変えると、改善理由が分からない。

1. 失敗事象と評価集合を固定する
2. 現行PromptをBaselineとして保存する
3. Blockを一つ追加・削除・置換する
4. 正常、境界、対象外、攻撃的入力で比較する
5. 品質だけでなく拒否、Latency、費用も測る
6. 改善した変更だけを採用する
7. 変更理由と対象Versionを記録する

Promptは文章ではなく、評価対象となるVersioned Componentとして扱う。

---

### 6. 設計チェックリスト

- [ ] Task、入力、出力、完了条件が分離されている
- [ ] Contextの由来、版、適用範囲が分かる
- [ ] Instructionと外部Dataが分離されている
- [ ] Hard ConstraintとSoft Constraintが分かれている
- [ ] 競合時の優先順位と停止条件がある
- [ ] 決定論的に検査できる条件をモデル外へ移した
- [ ] 形式検証と意味検証を分けた
- [ ] 履歴を正本として扱っていない
- [ ] Prompt変更をAblationで評価できる
- [ ] Prompt、Knowledge、Model、ValidatorのVersionを記録する

---

### 事実・説明モデル・設計仮説

#### 公開研究で確認できること

- 長いContextでは、関連情報の位置やTask複雑性によって性能が変化し得る。
- 自然言語モデルの出力はPrompt表現に対して感度を持ち得る。
- 外部Content内のInstructionがTool利用や機密性へ影響するPrompt Injectionは、System境界として扱う必要がある。

#### このページの説明モデル

- 関連情報密度 $\rho$
- 実行可能集合 $\mathcal{F}$
- Prompt Blockの限界価値 $\Delta J_j$
- 総合損失 $J$

#### 設計仮説

Promptを短くすること自体ではなく、固定条件、実行時Context、Evidence、Hard Constraint、検証を分離すると、変更原因と失敗原因を追跡しやすくなる。

---

### 参考資料

- Liu et al., [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172), 2023
- Sclar et al., [Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design](https://arxiv.org/abs/2310.11324), 2023
- Greshake et al., [More than you've asked for: A Comprehensive Analysis of Novel Prompt Injection Threats to Application-Integrated Large Language Models](https://arxiv.org/abs/2302.12173), 2023
- Scholak et al., [PICARD: Parsing Incrementally for Constrained Auto-Regressive Decoding from Language Models](https://arxiv.org/abs/2109.05093), 2021
- NIST, [Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://doi.org/10.6028/NIST.AI.600-1), 2024
