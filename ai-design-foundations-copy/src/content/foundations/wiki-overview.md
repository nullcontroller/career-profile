---
summary: "公開Wikiの設計思想と読み進め方を示す。確率・条件・制約・誤りの伝播という見方を、RAG・QA・コード生成・複数AI・HITLの実務設計へつなぐ。"
layer: reference
public: false
title: AI Design Foundations — Wiki概要
kind: principle
section: foundations
status: evolving
tags:
  - foundations
published_at: null
source:
  type: wiki
  url: https://github.com/nullcontroller/ai-design-foundations/wiki/Home
  original_type: wiki
  slug: Home
  topics: []
---
## AI Design Foundations

AIを「使う」のではなく、**確率的に出力するAIを、実務システムの中でどう設計するか**を整理するWikiです。

生成AIは、同じ入力に対して常に一つの正解を返す決定論的な部品ではありません。入力、Context、指示、モデル、生成条件によって、出力の分布が変化します。

このWikiでは、その性質を確率・条件・制約・探索空間・誤りの伝播といった数学的な見方で整理し、QAチャット、RAG、コード生成、複数AI、Human in the Loopなどの実務設計へ接続します。

---

### 中心となる考え方

AIシステムの出力を、簡略化して次のように考えます。

$$
P(Y \mid X, C, I, M, D)
$$

| 記号 | 意味 |
| --- | --- |
| $X$ | 利用者からの入力 |
| $C$ | 仕様、履歴、検索結果などのContext |
| $I$ | 指示、制約、役割、出力形式 |
| $M$ | 利用するモデル |
| $D$ | Temperatureなどの生成条件 |
| $Y$ | AIが生成する出力 |

実務上のAI性能は、モデル $M$ だけでは決まりません。

同じモデルでも、Contextや制約、生成条件が変われば、望ましい出力が得られる確率も、誤った出力が生まれる確率も変化します。

したがってAI設計では、モデル選定だけでなく、

- 何をContextとして与えるか
- どの回答範囲を許可するか
- どの条件で回答を止めるか
- AI出力を誰が検証するか
- 誤りを次工程へ伝播させないか

まで設計対象として扱います。

---

### 数学は「性能保証」ではなく「設計の補助線」

このWikiで用いる数式は、AIの内部動作を完全に証明したり、実システムの精度を数値保証したりするものではありません。

複雑なAIシステムを簡略化し、設計上の関係を考えるためのモデルです。

例えば、複数工程をAI出力だけで接続すると、前工程の誤りが後工程の前提になります。各工程が独立で、一工程が正しい確率を $p$ と単純化した場合、$n$ 工程すべてが正しい確率は次のように低下します。

$$
P(\text{all correct}) = p^n
$$

実際の工程は独立とは限らないため、この式をそのまま品質予測には使えません。ただし、**確認されていないAI出力を連鎖させるほど、誤りを後工程へ持ち込む機会が増える**ことを理解する補助線にはなります。

また、AI利用上のリスクは誤る確率だけでは決まりません。簡略化すれば、次の二つを分けて考えられます。

$$
Risk = P(\text{error}) \times Impact
$$

低リスクな下書きと、契約・品質・安全に関わる判断では、同じ精度のAIでも必要な統制が異なります。

このWikiでは、数式を結論の代わりにせず、**なぜ制約、検証、停止条件、責任分界が必要なのかを説明するために使います。**

---

### 設計原則

1. **AIは確率的な構成要素として扱う**  
   一回の成功例ではなく、出力の分布と失敗時の動作を見る。

2. **Contextを設計する**  
   必要な情報を与えるだけでなく、古い情報、無関係な情報、矛盾した情報を管理する。

3. **制約で出力空間を調整する**  
   回答範囲や形式を限定し、望ましくない出力の発生可能性を下げる。ただし、制約だけで正しさが保証されるとは考えない。

4. **AI出力を候補として扱う**  
   AI生成、人間確認済み、組織確定を区別する。

5. **誤りを工程内に閉じ込める**  
   AI間の受け渡しでは、未確認の出力をそのまま次工程の前提にしない。

6. **精度だけでなく影響度から統制する**  
   誤回答時の影響、検証可能性、可逆性に応じて、人間確認や停止条件を変える。

7. **責任主体を消さない**  
   AI・人間・既存システムの責務を分離し、最終判断者と記録主体を明確にする。

---

### Wikiの構成

#### 100. 数学から見たAI

確率分布、ハルシネーション、Temperature、回答範囲などを、AI設計へ利用できる形で整理します。

最初に読むページ：

- [生成AIの条件付き確率モデル基礎](/foundations/conditional-probability/)
- [Instruction・Knowledge・Evidenceの責務分離](/knowledge-context/instruction-knowledge-evidence/)
- [ハルシネーションの発生原理](/foundations/hallucination-mechanisms/)

#### 200. QAチャット設計思想

RAGを利用したQAチャットについて、回答範囲、Knowledge、評価、運用を整理します。

最初に読むページ：

- [QAチャット運用思想](/knowledge-context/qa-operations/)
- [QAチャット評価設計思想](/evaluation-hitl/qa-evaluation/)
- [人向け資料とAI向け資料の分離設計](/knowledge-context/human-and-ai-documentation/)

#### 300. プロンプト構造

プロンプトをお願い文ではなく、初期条件、制約、Context、AI間インターフェースとして捉えます。

最初に読むページ：

- [プロンプト設計の基本構造](/knowledge-context/prompt-structure/)
- [ガードレールの数学的説明](/foundations/guardrail-models/)
- [AI間インターフェースとしてのプロンプト](/architecture/prompts-as-interfaces/)

#### 400. コード生成・開発工程

コード生成だけでなく、要求、既存コード調査、設計、仕様化、実装、レビュー、テストまで含めてAIの役割を考えます。

最初に読むページ：

- [コード生成AIの正体](/software-engineering/code-generation-models/)
- [なぜAIは新規コードよりコード保守に強いのか](/software-engineering/code-maintenance-context/)
- [AIを開発工程に組み込む](/software-engineering/development-workflow/)

#### 500. AIオーケストレーション

複数AIを競わせるのではなく、情報環境、工程、出力形式、検証地点によって役割を分けます。

- [複数AIの役割分担と工程設計](/software-engineering/multi-ai-orchestration/)
- [AIコスト・Latency・モデルルーティング設計](/architecture/cost-latency-routing/)

#### 600. AIガバナンスとHITL

AIを使うべきか、どこまで委任できるかを判断し、承認、記録、例外処理、責任境界を設計します。

- [AI適用可否と委任レベルの設計](/foundations/applicability-and-delegation/)
- [AI出力の責任境界とHITL](/evaluation-hitl/responsibility-and-hitl/)
- [生成AIセキュリティと脅威モデリング](/architecture/security-threat-modeling/)

#### 700. AIシステムアーキテクチャとライフサイクル

各章の設計原則を一つの業務Systemへ接続し、変更、再評価、段階Release、監視、RollbackまでをLifecycleとして扱います。

- [AI業務システムの参照アーキテクチャ](/architecture/reference-architecture/)
- [AIシステムの変更・再評価設計](/architecture/change-and-reevaluation/)
- [AIシステムのオブザーバビリティとSLO設計](/architecture/observability-and-slo/)
- [AI評価データセットと回帰評価設計](/evaluation-hitl/datasets-and-regression/)

#### 補助ページ

- [用語・数式索引](/foundations/glossary/)

---

### このWikiで扱うもの

- 確率的AIを業務へ組み込むための設計原則
- QAチャット、RAG、コード生成、複数AIの工程設計
- Context、Knowledge、制約、評価、Human in the Loop
- AI・人間・既存システムの責任分界
- レガシーを含む既存システムへのAI統合
- Model、Prompt、Knowledge、Tool、Workflowの変更・再評価

Legacy Systemへの適用では、既存Codeを正解ではなくEvidenceとして扱い、暗黙仕様、依存関係、検証可能性を踏まえてAIへ委任する単位を設計します。

- [なぜAIは新規コードよりコード保守に強いのか](/software-engineering/code-maintenance-context/)

モデルの学習方法や機械学習理論そのものを網羅することは目的としていません。

また、個別製品の操作方法よりも、モデルや製品が変わっても比較的残り続ける設計原則を重視します。

---

### 記述の位置付け

このWikiには、一般的な確率・ソフトウェア設計の考え方と、実務で生成AIを利用する中から整理した設計仮説の両方が含まれます。

数式は必要に応じて簡略化しています。数学的な一般式、測定済みの実証結果、筆者による説明モデルを混同せず、適用範囲と前提を明記する方針です。

内容は完成した理論ではありません。設計、実装、評価、運用を通じて継続的に更新します。

---

### 関連

- [Zenn](https://zenn.dev/nullcontroller)
- [Repository](https://github.com/nullcontroller/ai-design-foundations)
