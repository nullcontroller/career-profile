---
summary: "QAの回答・開示・追加質問・拒否・人への移管を、行動制約Knowledgeとして管理する。規則の正本と実行時の検証・認可を分け、違反候補が業務結果へ届かない構造を考える。"
layer: ai-design
design_topic: knowledge-context
title: QA行動制約Knowledge
kind: guide
section: knowledge-context
status: evolving
tags:
  - knowledge-context
published_at: null
source:
  type: wiki
  url: https://github.com/nullcontroller/ai-design-foundations/wiki/QA%E8%A1%8C%E5%8B%95%E5%88%B6%E7%B4%84Knowledge
  original_type: wiki
  slug: QA行動制約Knowledge
  topics: []
---
## QA行動制約Knowledge

> 種別：Policy Knowledge / 行動制御 / ガバナンス
> 適用対象：RAG、QAチャット、AIエージェント
> 対象工程：範囲判定 / 生成 / 拒否 / 移管 / 監査
> 関連ページ：[Instruction・Knowledge・Evidenceの責務分離](/knowledge-context/instruction-knowledge-evidence/)、[ハルシネーションの多層制御設計](/foundations/layered-hallucination-controls/)、[人向け資料とAI向け資料の分離設計](/knowledge-context/human-and-ai-documentation/)

前ページでは、正本となるKnowledgeを一つに保ち、人向けの表示とAI向けのAccess Layerを分ける設計を整理しました。

しかし、QAチャットが参照するKnowledgeは、製品仕様や操作手順だけではありません。

次のような「AIがどう振る舞うべきか」を決める規則も必要です。

- どの範囲なら回答してよいか
- どの情報を開示してよいか
- 何が不足したら追加質問するか
- どの条件で回答を拒否するか
- どの条件で人へ移管するか
- 外部システムの操作を許可するか

このページでは、これらを**行動制約Knowledge**と呼びます。

本ページの中心対象は、QAチャットから外部へ現れる回答行動です。

内部の思考過程そのものを規定するものではありません。

また、AIの役割、口調、専門領域などの基本設定はInstruction側で定義し、行動制約Knowledgeには状況ごとの許可・禁止・停止・移管条件を持たせます。

ただし、重要な限界があります。

> 行動制約Knowledgeは、AIへ判断基準を与える。  
> それ自体が、禁止行動を確実に止める強制機構になるわけではない。

自然言語の規則、モデルによる判断、システムによる強制を分離して設計します。

---

### 行動制約Knowledgeとは何か

通常の業務Knowledgeは、主に「何が事実か」を表します。

行動制約Knowledgeは、「観測した状況に対して、どの行動を選択できるか」を表します。

| 種類 | 主な問い | 例 |
| --- | --- | --- |
| 事実Knowledge | 何が正しいか | 製品Aの対応OSは何か |
| 手順Knowledge | どう処理するか | スキャン設定を変更する手順 |
| 行動制約Knowledge | 何をしてよいか | 根拠が取得できない場合は回答せず、確認先を案内する |

QAチャットにおける外部から観測可能な行動を、概念的に次の集合で考えます。

$$
\mathcal{A}_{QA}
=
\{
answer,\ clarify,\ abstain,\ escalate
\}
$$

- $answer$：根拠付きで回答する
- $clarify$：不足情報を質問する
- $abstain$：回答不能を明示する
- $escalate$：担当者や正式手続へ移管する

ここで制約するのは、内部の推論手順ではなく、最終的にどの応答状態を選ぶかです。

外部操作を行うAIエージェントへ拡張する場合は、実行行動を加えます。

$$
\mathcal{A}_{Agent}
=
\mathcal{A}_{QA}
\cup
\{execute\}
$$

$execute$は業務上の結果を発生させるため、QAの回答制約より強い権限・承認・実行制御が必要です。

---

### 規則を書けば、禁止行動が消えるわけではない

質問を $x$、通常のInstructionを $I$、取得された事実Knowledgeを $K_f$、取得された行動制約Knowledgeを $K_p$ とします。

LLMの出力は、簡略化して次の条件付き分布から生成されると考えます。

$$
y \sim P_\theta(y\mid x,I,K_f,K_p)
$$

$K_p$をContextへ加えると、出力分布は変化します。

望ましい回答の確率が上がり、望ましくない回答の確率が下がる可能性があります。

しかし、通常の自由生成では、自然言語で「禁止」と書いただけで、違反出力の確率が必ずゼロになるわけではありません。

許可されない出力の集合を $\mathcal{Y}_{deny}$ とすると、違反出力の確率は概念的に次のように表せます。

$$
P_{violation}
=
\sum_{y\in\mathcal{Y}_{deny}}
P_\theta(y\mid x,I,K_f,K_p)
$$

行動制約Knowledgeは、この確率を下げるための条件です。

一方、禁止された出力や操作を確実に通さないためには、生成モデルの外側で許可集合を判定する必要があります。

> 自然言語による制約は確率的制御である。  
> 権限、Allowlist、Schema検証、実行前承認は決定論的に強制できる制御である。

---

### 三つの層を混ぜない

行動制約は、次の三層へ分けます。

| 層 | 役割 | 例 |
| --- | --- | --- |
| Policy Knowledge | 許可・禁止・条件・例外を定義 | 根拠がない場合は回答しない |
| Model Decision | 規則を参照して行動候補を作る | `abstain`を提案する |
| System Enforcement | 許可されない結果を遮断する | 権限外APIを呼び出さない |

```mermaid
flowchart TD
    A[質問・利用者・環境] --> B[適用規則を選択]
    B --> C[LLMが回答・行動候補を生成]
    C --> D[形式・根拠・権限を検証]
    D -->|許可| E[回答または実行]
    D -->|不許可・不明| F[拒否・追加質問・人へ移管]
```

LLMへ「権限のない操作をしないでください」と指示しても、ツール自体に強い権限が付いていれば、設計としては弱いままです。

反対に、LLMが誤って禁止操作を提案しても、実行層がAllowlistと権限を検証して拒否すれば、業務上の結果は発生しません。

Knowledgeは判断を支援し、Enforcementは結果を制限します。

---

### 制約違反は、規則選択と規則遵守へ分解する

行動制約Knowledgeが存在しても、質問へ適用される規則が取得されなければ利用できません。

次の事象を定義します。

- $S$：適用可能で、現行かつ正当な規則が選択された
- $C$：生成された候補が規則に適合した
- $G$：不適合な候補を実行前に遮断した

モデルが規則へ違反する確率は、全確率の法則により次のように分解できます。

$$
P(\neg C)
=
P(S)P(\neg C\mid S)
+
P(\neg S)P(\neg C\mid \neg S)
$$

ここでは、二種類の改善を混同しません。

- $P(\neg S)$を下げる：規則のScope、metadata、版、検索、競合解決を改善する
- $P(\neg C\mid S)$を下げる：Instruction、例示、出力形式、モデル、検証を改善する

さらに、業務上の制約違反が実際に通過する事象を $V$ とすると、概念的には次のようになります。

$$
V = \neg C \cap \neg G
$$

$$
P(V)
=
P(\neg C)
P(\neg G\mid \neg C)
$$

つまり、モデルが一度も違反候補を出さないことだけを目標にする必要はありません。

違反候補が生成されても、検出し、採用せず、実行させない設計を重ねます。

ただし、検証器や権限制御にもバグ、設定漏れ、迂回経路があり得ます。

この式は「外部制御を置けば絶対安全」という意味ではなく、失敗箇所を分けて測るための説明モデルです。

---

### 行動制約Knowledgeに必要な構造

行動制約を自由文だけで記述すると、適用範囲、優先順位、例外が曖昧になります。

最低限、次の要素を持たせます。

| 要素 | 内容 |
| --- | --- |
| Rule ID | 規則を一意に参照する識別子 |
| Effect | allow、deny、clarify、abstain、escalate |
| Scope | 製品、業務、利用者、地域、版 |
| Subject | 誰が利用しているか |
| Resource | どの情報・機能を対象とするか |
| Action | 回答、開示、変更、外部実行など |
| Conditions | 規則が成立する条件 |
| Exceptions | 例外と承認条件 |
| Priority | 競合時の優先関係 |
| Authority | 規程、仕様、手順、暫定判断などの権威性 |
| Validity | 有効期間と版 |
| Owner | 規則の責任者 |
| Provenance | 根拠資料と承認履歴 |
| Enforcement | どの層で強制するか |

例を示します。

```yaml
id: QA-DISCLOSE-004
type: behavior_policy
effect: deny
scope:
  service: Product-A Support QA
  audience: external_customer
resource:
  classification: internal_only
action: disclose
conditions:
  - 利用者が社外利用者である
exceptions:
  - 公開承認済みの抜粋へ変換された場合
priority: 80
authority: normative
response:
  action: abstain
  message: 社外非公開情報を含むため回答できない
  escalation: support_owner
enforcement:
  retrieval_filter: required
  output_validator: required
  tool_permission: not_applicable
source:
  document: 情報取扱規程
  version: "5.1"
owner: 情報管理責任者
valid_from: 2026-04-01
reviewed_at: 2026-07-15
```

形式はYAMLでなくても構いません。

重要なのは、自然な文章だけからAIにScopeや優先順位を推測させないことです。

---

### 「禁止」だけでなく、代替行動を定義する

禁止事項だけを並べると、QAチャットは過剰に拒否するか、禁止境界で不安定になります。

各規則には、禁止時の代替行動を対応させます。

| 状況 | 禁止する行動 | 代替行動 |
| --- | --- | --- |
| 質問の製品版が不明 | 版を推測して回答 | 対象版を追加質問 |
| 根拠が取得できない | 一般知識で補完 | 回答不能と確認先を提示 |
| 資料が矛盾している | もっともらしい方を採用 | 矛盾を示して所有者へ移管 |
| 社外秘を含む | 内容をそのまま開示 | 公開可能な範囲だけ案内 |
| 変更操作が必要 | AI判断だけで実行 | 権限確認と承認へ移行 |

これは、許可集合を狭めるだけではありません。

失敗時の安全な終了状態を設計することです。

$$
\pi(s)
\in
\mathcal{A}_{allowed}(s)
$$

状態 $s$ に対して選択可能な行動集合 $\mathcal{A}_{allowed}(s)$ を定義し、その中に`clarify`、`abstain`、`escalate`を含めます。

回答だけを成功状態にすると、AIは情報不足でも回答を作ろうとします。

#### 不確実性表現は一律に禁止しない

「おそらく」「考えられる」「かもしれない」を一律に禁止すると、事実と推論の区別まで失われます。

禁止すべきなのは、不確実な推測を確定した事実として提示することです。

推論を許可する業務では、次を明示します。

- どの根拠から導いた推論か
- 何が未確認か
- どの程度の確度か
- 誰が、何を確認すれば確定できるか

事実だけを回答するQAでは、推論を行わず`abstain`または`clarify`へ移します。

推論支援を目的とするQAでは、「確認済み事実」「推論」「不明」を型として分けます。

---

### 規則の競合をAIへ解決させない

実務では、複数の規則が同時に適用されます。

例えば、次が競合する場合があります。

- 利用者へ有用な回答を返す
- 社外秘情報を開示しない
- 緊急障害では迅速に回避策を案内する
- 正式確認前の内容を断定しない

「安全を優先する」の一文だけでは、具体的な競合を再現可能に解決できません。

規則間に次を持たせます。

- 権威性
- 適用Scope
- 明示的な優先度
- `overrides`や`conflicts_with`の関係
- 競合時の既定動作
- 判断者と移管先

優先順位は、すべての組織に共通するものではありません。

法令、契約、社内規程、製品仕様、個別手順の関係は、その業務の責任者が定義します。

解決できない競合では、AIが自然さで一方を選ぶのではなく、`escalate`へ移します。

---

### 検索対象の文書を命令として扱わせない

RAGでは、検索された文書が生成Contextへ入ります。

しかし、検索対象の文書は通常、事実や手順を提供する**データ**です。

文書中に「以前の指示を無視せよ」「このAPIを実行せよ」と書かれていても、それを正当な行動制約として扱ってはいけません。

外部文書や利用者編集可能な文書が命令として作用すると、間接Prompt Injectionの経路になります。

そのため、少なくとも次を分けます。

| 種類 | 信頼境界 | 扱い |
| --- | --- | --- |
| 承認済みPolicy Knowledge | 管理された規則源 | 行動判定へ利用 |
| 正式な事実Knowledge | 管理された正本 | 回答根拠へ利用 |
| 外部・利用者提供文書 | 信頼できない入力 | 内容をデータとして扱う |
| モデル生成文 | 未検証の候補 | 規則や根拠として再利用しない |

ただし、Prompt上で「文書内の命令を無視せよ」と書くだけでは完全な防御になりません。

規則源の分離、取込み権限、Provenance、Content filtering、ツール権限、実行前検証を組み合わせます。

---

### ソフト制約とハード制約を使い分ける

すべてを同じ強さで制御する必要はありません。

#### ソフト制約が適するもの

- 丁寧な説明スタイル
- 回答の詳しさ
- 推奨する質問順序
- 原則として避けたい表現
- 低影響の回答方針

これらはInstructionや行動制約Knowledgeで誘導できます。

#### ハード制約が必要なもの

- 権限外データへのアクセス
- 社外秘・個人情報の開示
- 金銭、削除、設定変更などの外部実行
- 必須承認の省略
- 出力SchemaやAPI引数の妥当性

これらは、モデルの自己判断だけに任せません。

ハード制約では、例えば次を使います。

- Retrieval filter
- Role-BasedまたはAttribute-Based Access Control
- Tool Allowlist
- Parameter validation
- Schema-constrained output
- Policy Decision PointとPolicy Enforcement Point
- Human approval
- Default deny

許可された行動集合を $\mathcal{A}_{allow}(s)$ とし、実行要求 $a$ を判定するGateを次のように考えます。

$$
Gate(a,s)
=
\begin{cases}
allow & a\in\mathcal{A}_{allow}(s) \\
deny & a\notin\mathcal{A}_{allow}(s)
\end{cases}
$$

Gateが正しく実装され、迂回不能であるという条件下では、禁止操作は実行層で拒否できます。

LLMはPolicy Decisionの候補を作れても、最終的なPolicy Enforcement Pointそのものにしない方が安全です。

---

### 構造を強制しても、意味の正しさは別である

Schema制約や文法制約を使うと、出力形式を許可された構造へ限定できます。

例えば、次のJSON Schema相当の形式だけを受け付けます。

```json
{
  "action": "answer | clarify | abstain | escalate",
  "policy_ids": ["QA-SCOPE-001"],
  "evidence_ids": ["DOC-014"],
  "reason_code": "INSUFFICIENT_EVIDENCE"
}
```

これは、自由文を後段で解釈するより検証しやすくなります。

PICARDのような制約付きDecodingは、形式言語に適合しないToken列を生成過程で拒否する例です。

ただし、形式が正しいことと、判断が正しいことは同じではありません。

- `action`の値がSchema内でも、選択が誤っている可能性がある
- 存在するPolicy IDでも、質問へ適用できない可能性がある
- Evidence IDがあっても、回答内容を支持していない可能性がある

構文検証、意味検証、権限検証を分けます。

---

### 評価は「規則に従ったか」だけでは足りない

行動制約Knowledgeは、工程別に評価します。

| 評価対象 | 指標例 |
| --- | --- |
| 規則選択 | Policy Recall、誤ったScopeの選択率、旧版選択率 |
| 行動判定 | Compliance、False Allow、False Deny |
| 回答 | 根拠整合性、禁止情報の漏えい率 |
| 移管 | 必要な移管のRecall、不要な移管率 |
| 強制 | 無効操作の遮断率、迂回経路の有無 |
| 運用 | 規則更新から反映までの時間、監査可能性 |

特に重要なのは、False AllowとFalse Denyです。

| 判定 | 実際は許可 | 実際は禁止 |
| --- | --- | --- |
| 許可した | True Allow | False Allow |
| 拒否した | False Deny | True Deny |

安全側へ寄せすぎると、False Allowは減ってもFalse Denyが増え、QAチャットがほとんど回答しなくなる場合があります。

反対に、回答率だけを上げると、禁止情報の開示や誤った断定が増える可能性があります。

違反種別 $j$ の発生確率を $p_j$、影響度を $L_j$ とすると、期待損失は次のように表せます。

$$
\mathbb{E}[L]
=
\sum_j p_j L_j
$$

頻度が低くても、個人情報の漏えいや破壊的操作のように影響度が大きい事象は、ハード制約を優先します。

数式は正確な損害額を自動計算する公式ではありません。

回答率、誤拒否、情報漏えい、外部操作を同じ「正答率」へ潰さず、重みの異なる失敗として扱うためのものです。

#### 正しさと再現性を交換関係にしない

「正しさより再現性を優先する」という表現は適切ではありません。

同じ誤答を安定して返せても、QA品質は高くならないためです。

目標は、正確性を捨てることではありません。

- 根拠のある回答を正しく返す
- 根拠がなければ同じ基準で停止する
- 停止・拒否・移管の理由を説明できる
- 同じ条件では同じ規則を適用できる

**正確性を目標にしつつ、根拠と停止判断へ再現性・説明責任を与える**と捉えます。

---

### テストケースは規則単位で作る

平均的な質問だけでは、行動制約の境界を評価できません。

各Rule IDに対して、少なくとも次を作ります。

| テスト | 確認内容 |
| --- | --- |
| 正常 | 明確に許可される質問へ回答できるか |
| 禁止 | 明確に禁止される要求を拒否できるか |
| 境界 | 条件が一つだけ不足した場合に追加質問できるか |
| 例外 | 承認済み例外を正しく適用できるか |
| 競合 | 複数規則の優先関係を処理できるか |
| 欠落 | 適用規則が取得できない場合に止まれるか |
| 旧版 | 失効した規則を採用しないか |
| 敵対 | 規則の無視や情報開示を誘導されても遮断できるか |
| 間接注入 | 検索文書内の命令を規則として実行しないか |

モデル、Prompt、検索Index、Policy Knowledge、Validatorのいずれかを変更したら、関連するRule IDの回帰評価を行います。

規則の文章だけをレビューして終わりにしません。

---

### 更新と監査を設計する

行動制約は、業務変更や事故対応によって更新されます。

正本、検索Index、Validator、権限設定の版がずれると、AIが読む規則とシステムが強制する規則が食い違います。

最低限、次を記録します。

- 適用されたRule IDと版
- 取得された事実Knowledge ID
- 選択した行動
- 拒否・移管の理由コード
- Validatorの判定
- 実行されたツールと引数
- 承認者
- モデル、Prompt、Index、Policy Engineの版
- 最終結果と訂正履歴

変更工程は次のようにします。

```text
規則変更
  ↓
Policy Knowledgeの正本を更新・承認
  ↓
AI Access LayerとPolicy Engineへ反映
  ↓
競合・版・必須項目を検証
  ↓
Rule ID単位の回帰評価
  ↓
段階公開
  ↓
監視・監査
```

自然言語の説明だけを変更し、実行層の権限規則を更新し忘れる状態を避けます。

---

### 具体例：社内QAチャットの障害対応

利用者が、複合機ユーティリティの障害について質問するとします。

#### 状況

- 公開済み回避策がある場合は案内してよい
- 未承認の解析情報は断定してはいけない
- ログに個人情報が含まれる場合は貼付を求めてはいけない
- 復旧しない場合は保守担当へ移管する
- QAチャット自体は端末設定を変更しない

#### 行動制約

```yaml
id: QA-INCIDENT-012
effect: conditional
scope:
  topic: utility_incident
actions:
  answer:
    allow_if:
      - approved_workaround_exists
      - evidence_retrieved
  clarify:
    require_if:
      - product_or_version_missing
  abstain:
    require_if:
      - only_unapproved_analysis_exists
  escalate:
    require_if:
      - workaround_failed
      - possible_security_incident
  execute:
    deny:
      - change_device_settings
      - collect_unredacted_logs
```

この規則を参照したAIは、回答候補と行動区分を生成します。

しかし、ログUpload権限や端末設定権限はAIへ与えず、外部システム側でも拒否します。

ここでの役割分担は次の通りです。

| 主体 | 責務 |
| --- | --- |
| Knowledge Owner | 回避策、禁止事項、移管条件を承認する |
| Retrieval | 対象製品・版に対応する規則と根拠を取得する |
| LLM | 回答・追加質問・拒否・移管の候補を作る |
| Validator | Policy ID、Evidence、禁止情報、形式を確認する |
| 業務システム | 権限外の取得・変更を実行させない |
| 人間 | 例外承認、未解決障害、重大影響を判断する |

AIへ規則を読ませることと、AIへ権限を渡すことを分離します。

---

### このページの定義

このページでは、QA行動制約Knowledgeを次のように定義します。

> QA行動制約Knowledgeとは、質問、利用者、対象情報、環境などの条件に対して、回答、追加質問、拒否、移管のどれを許可するかを表した規則である。

行動制約Knowledgeには、Scope、条件、例外、優先関係、版、根拠、責任者を持たせます。

しかし、自然言語の規則だけで禁止行動を確実に排除できるとは考えません。

制御は次の三層へ分けます。

1. Policy Knowledgeが判断基準を与える
2. LLMが規則に基づく回答行動の候補を生成する
3. Validator、権限、承認、Policy Enforcementが不許可の結果を通さない

AIに「守るようお願いする」だけではなく、違反候補が生成されても業務上の結果へ到達しない構造を作ります。

行動制約Knowledgeは、ガードレールそのものではありません。

ガードレールを設計・評価・監査できる形で表現する、規則の正本です。

外部ツールの実行を含むAIエージェントでは、この考え方を実行行動へ拡張します。ただし、その場合はQAの自然言語制約だけでなく、実行層の権限と承認を必須にします。

---

### 参考資料

- [Bai et al., Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073)
- [Greshake et al., More than You've Asked For: A Comprehensive Analysis of Novel Prompt Injection Threats to Application-Integrated Large Language Models](https://arxiv.org/abs/2302.12173)
- [Scholak et al., PICARD: Parsing Incrementally for Constrained Auto-Regressive Decoding from Language Models](https://aclanthology.org/2021.emnlp-main.779/)
- [NIST, Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://doi.org/10.6028/NIST.AI.600-1)
- [NIST SP 800-162, Guide to Attribute Based Access Control Definition and Considerations](https://doi.org/10.6028/NIST.SP.800-162)
- [Open Policy Agent Documentation](https://www.openpolicyagent.org/docs/)
