# Phase 3 分類とURL互換性

本文・summary・source・canonical・物理パスは保持し、layerとdesign_topicのみ再配置した。Zennで公開されたLLM確率モデルの記事は指定に沿ってAI数学論へ配置し、出版物としての記事一覧にも同じURLで掲載する。

| URL / ID | Layer | AI Design topic | Source |
|---|---|---|---|
| architecture/agents-tools-and-workflows | publication | — | zenn |
| architecture/change-and-reevaluation | ai-design | lifecycle-operations | wiki |
| architecture/cost-latency-routing | ai-design | architecture | wiki |
| architecture/observability-and-slo | ai-design | lifecycle-operations | wiki |
| architecture/prompts-as-interfaces | ai-design | architecture | wiki |
| architecture/reference-architecture | ai-design | architecture | wiki |
| architecture/security-threat-modeling | ai-design | architecture | wiki |
| cases/system-understanding | publication | — | zenn |
| cases/three-ai-maintenance | publication | — | zenn |
| cases/understanding-systems-as-capability | publication | — | zenn |
| essays/ai-career-market | publication | — | zenn |
| essays/ai-roles-beyond-fde | publication | — | zenn |
| essays/model-competition-and-ecosystems | publication | — | zenn |
| essays/trust-in-ai-generated-content | publication | — | zenn |
| evaluation-hitl/code-evaluation-acceptance | ai-design | evaluation-hitl | wiki |
| evaluation-hitl/datasets-and-regression | ai-design | evaluation-hitl | wiki |
| evaluation-hitl/human-review-capability | publication | — | zenn |
| evaluation-hitl/qa-evaluation | ai-design | evaluation-hitl | wiki |
| evaluation-hitl/responsibility-and-hitl | ai-design | responsibility-control | wiki |
| foundations/ai-business-design | publication | — | zenn |
| foundations/answer-scope | ai-design | responsibility-control | wiki |
| foundations/applicability-and-delegation | ai-design | applicability | wiki |
| foundations/conditional-probability | ai-mathematics | — | wiki |
| foundations/design-system-overview | reference | — | repository |
| foundations/generation-and-acceptance | publication | — | zenn |
| foundations/glossary | reference | — | wiki |
| foundations/guardrail-models | ai-design | responsibility-control | wiki |
| foundations/hallucination-mechanisms | ai-mathematics | — | wiki |
| foundations/layered-hallucination-controls | ai-design | responsibility-control | wiki |
| foundations/llm-as-probabilistic-model | ai-mathematics | — | zenn |
| foundations/temperature-design | ai-mathematics | — | wiki |
| foundations/wiki-overview | reference | — | wiki |
| knowledge-context/context-before-model-performance | publication | — | zenn |
| knowledge-context/human-and-ai-documentation | ai-design | knowledge-context | wiki |
| knowledge-context/instruction-knowledge-evidence | ai-design | knowledge-context | wiki |
| knowledge-context/prompt-failure-modes | ai-design | knowledge-context | wiki |
| knowledge-context/prompt-structure | ai-design | knowledge-context | wiki |
| knowledge-context/qa-behavior-constraints | ai-design | knowledge-context | wiki |
| knowledge-context/qa-operations | ai-design | lifecycle-operations | wiki |
| practices/ai-adoption-and-effective-use | publication | — | zenn |
| practices/ai-education-principles | publication | — | zenn |
| practices/transferring-ai-practices | publication | — | zenn |
| software-engineering/ai-design-assistance | publication | — | zenn |
| software-engineering/ai-driven-development | publication | — | zenn |
| software-engineering/code-generation-and-work-design | publication | — | zenn |
| software-engineering/code-generation-boundaries | ai-design | software-engineering | wiki |
| software-engineering/code-generation-models | ai-mathematics | — | wiki |
| software-engineering/code-maintenance-context | ai-design | software-engineering | wiki |
| software-engineering/development-workflow | practice | — | wiki |
| software-engineering/multi-ai-orchestration | ai-design | software-engineering | wiki |
| cases/system-understanding/connecting-ui-and-internals | publication | — | zenn |
| cases/system-understanding/human-and-ai-knowledge | publication | — | zenn |
| cases/system-understanding/project-structure | publication | — | zenn |
| cases/system-understanding/qa-case-study-revisited | publication | — | zenn |
| cases/system-understanding/qa-case-study | publication | — | zenn |
| cases/system-understanding/qa-evaluation | publication | — | zenn |
| cases/system-understanding/qa-operations | publication | — | zenn |
| cases/system-understanding/rag-implementation | publication | — | zenn |
| cases/system-understanding/rag-improvement | publication | — | zenn |
| cases/system-understanding/recovering-code-structure | publication | — | zenn |
| cases/system-understanding/system-understanding-problems | publication | — | zenn |
| cases/system-understanding/visualizing-process-flows | publication | — | zenn |
| cases/three-ai-maintenance/code-generation-and-unit-tests | publication | — | zenn |
| cases/three-ai-maintenance/cryptography-and-failure-modes | publication | — | zenn |
| cases/three-ai-maintenance/implementation-design | publication | — | zenn |
| cases/three-ai-maintenance/results-and-reflections | publication | — | zenn |
| cases/three-ai-maintenance/reviewable-specifications | publication | — | zenn |
| cases/three-ai-maintenance/sharing-current-specifications | publication | — | zenn |
| cases/three-ai-maintenance/structuring-failure-handling | publication | — | zenn |
| foundations/ai-business-design/asking-versus-delegating | publication | — | zenn |
| foundations/ai-business-design/delegation-and-responsibility | publication | — | zenn |
| foundations/ai-business-design/evaluating-business-efficiency | publication | — | zenn |

## 分類理由・未整備の領域

- guardrail-modelsは数式を含むが、主題が制御系の設計なのでAI Design。hallucination-mechanismsは発生要因の説明、layered-hallucination-controlsは制御方法として分離。
- code-generation-modelsは学習・推論・Contextとモデルの振る舞いを説明するためAI数学論。コード採否・工程設計は別のAI Design / Practicesの文書へ分離したまま保持。
- observability-and-sloとqa-operationsは運用システム自体の設計なのでLifecycle / Operations。development-workflowは開発工程への適用としてPractices。
- Practicesの教育・導入・横展開は現状Zenn記事のみ。正本本文へ勝手に昇格させず、Related Publicationsとして案内する。
- Case Studiesは2つのBookについてテーマ・注目章・設計原則を接続した索引。新しい事例本文は作らない。
- Project / Project Journal / Toolsは作業開始時のローカル・origin/masterに存在しなかったため、独立した入口のみ追加。実績やJournalは生成していない。
- career.astroと全72本文・summary・source.metadata・canonical・章順は変更していない。

## 配置したページ（タイトル）

### ai-design

- AIシステムの変更・再評価設計 — `architecture/change-and-reevaluation` / lifecycle-operations
- AIコスト・Latency・モデルルーティング設計 — `architecture/cost-latency-routing` / architecture
- AIシステムのオブザーバビリティとSLO設計 — `architecture/observability-and-slo` / lifecycle-operations
- AI間インターフェースとしてのプロンプト — `architecture/prompts-as-interfaces` / architecture
- AI業務システムの参照アーキテクチャ — `architecture/reference-architecture` / architecture
- 生成AIセキュリティと脅威モデリング — `architecture/security-threat-modeling` / architecture
- コード生成AIの評価と採用設計 — `evaluation-hitl/code-evaluation-acceptance` / evaluation-hitl
- AI評価データセットと回帰評価設計 — `evaluation-hitl/datasets-and-regression` / evaluation-hitl
- QAチャット評価設計思想 — `evaluation-hitl/qa-evaluation` / evaluation-hitl
- AI出力の責任境界とHITL — `evaluation-hitl/responsibility-and-hitl` / responsibility-control
- なぜ回答範囲を制限した方がよいのか — `foundations/answer-scope` / responsibility-control
- AI適用可否と委任レベルの設計 — `foundations/applicability-and-delegation` / applicability
- ガードレールの数学的説明 — `foundations/guardrail-models` / responsibility-control
- ハルシネーションの多層制御設計 — `foundations/layered-hallucination-controls` / responsibility-control
- 人向け資料とAI向け資料の分離設計 — `knowledge-context/human-and-ai-documentation` / knowledge-context
- Instruction・Knowledge・Evidenceの責務分離 — `knowledge-context/instruction-knowledge-evidence` / knowledge-context
- プロンプト設計の失敗モード — `knowledge-context/prompt-failure-modes` / knowledge-context
- プロンプト設計の基本構造 — `knowledge-context/prompt-structure` / knowledge-context
- QA行動制約Knowledge — `knowledge-context/qa-behavior-constraints` / knowledge-context
- QAチャット運用思想 — `knowledge-context/qa-operations` / lifecycle-operations
- コード生成を使うべき場所 — `software-engineering/code-generation-boundaries` / software-engineering
- なぜAIは新規コードよりコード保守に強いのか — `software-engineering/code-maintenance-context` / software-engineering
- 複数AIの役割分担と工程設計 — `software-engineering/multi-ai-orchestration` / software-engineering

### ai-mathematics

- 生成AIの条件付き確率モデル基礎 — `foundations/conditional-probability`
- ハルシネーションの発生原理 — `foundations/hallucination-mechanisms`
- LLMを確率モデルとして設計するという立場 — `foundations/llm-as-probabilistic-model`
- Temperature設計指針 — `foundations/temperature-design`
- コード生成AIの正体 — `software-engineering/code-generation-models`

### practice

- AIを開発工程に組み込む — `software-engineering/development-workflow`

### reference

- AI Design Foundations — 設計体系の原点 — `foundations/design-system-overview`
- 用語・数式索引 — `foundations/glossary`
- AI Design Foundations — Wiki概要 — `foundations/wiki-overview`

## 変更ファイル

- `docs/authoring-guide.md`
- `migration/phase-3-classification.md`
- `scripts/verify-index.mjs`
- `src/components/ContentIndex.astro`
- `src/components/ContentLink.astro`
- `src/components/PublicationLink.astro`
- `src/components/RelatedPublications.astro`
- `src/content.config.ts`
- `src/content/architecture/change-and-reevaluation.md`
- `src/content/architecture/cost-latency-routing.md`
- `src/content/architecture/observability-and-slo.md`
- `src/content/architecture/prompts-as-interfaces.md`
- `src/content/architecture/reference-architecture.md`
- `src/content/architecture/security-threat-modeling.md`
- `src/content/evaluation-hitl/code-evaluation-acceptance.md`
- `src/content/evaluation-hitl/datasets-and-regression.md`
- `src/content/evaluation-hitl/qa-evaluation.md`
- `src/content/evaluation-hitl/responsibility-and-hitl.md`
- `src/content/foundations/answer-scope.md`
- `src/content/foundations/applicability-and-delegation.md`
- `src/content/foundations/conditional-probability.md`
- `src/content/foundations/design-system-overview.md`
- `src/content/foundations/glossary.md`
- `src/content/foundations/guardrail-models.md`
- `src/content/foundations/hallucination-mechanisms.md`
- `src/content/foundations/layered-hallucination-controls.md`
- `src/content/foundations/llm-as-probabilistic-model.md`
- `src/content/foundations/temperature-design.md`
- `src/content/foundations/wiki-overview.md`
- `src/content/knowledge-context/human-and-ai-documentation.md`
- `src/content/knowledge-context/instruction-knowledge-evidence.md`
- `src/content/knowledge-context/prompt-failure-modes.md`
- `src/content/knowledge-context/prompt-structure.md`
- `src/content/knowledge-context/qa-behavior-constraints.md`
- `src/content/knowledge-context/qa-operations.md`
- `src/content/software-engineering/code-generation-boundaries.md`
- `src/content/software-engineering/code-generation-models.md`
- `src/content/software-engineering/code-maintenance-context.md`
- `src/content/software-engineering/multi-ai-orchestration.md`
- `src/layouts/Site.astro`
- `src/lib/navigation.ts`
- `src/lib/site.ts`
- `src/pages/[...id].astro`
- `src/pages/[section]/index.astro`
- `src/pages/ai-design/[topic].astro`
- `src/pages/ai-design/index.astro`
- `src/pages/ai-mathematics.astro`
- `src/pages/articles.astro`
- `src/pages/books.astro`
- `src/pages/cases.astro`
- `src/pages/index.astro`
- `src/pages/practices.astro`
- `src/pages/project/index.astro`
- `src/pages/project/journal.astro`
- `src/pages/reference.astro`
- `src/pages/start-here.astro`
- `src/pages/tools.astro`
- `src/styles/global.css`

## 検証結果

- npm run check: 0 errors / 0 warnings / 0 hints
- npm test: 3 passed
- npm run build: 102 HTML pages
- Link validation: 3,543 local links / assets / anchors
- Summary validation: 72 documents / 670 content links
- 全72本文・summary・source metadataについて、変更前commitとの一致を確認した。
- 主要Navigationの順序、AI Design / AI数学論 / Practicesの分離、Publication Hub全件掲載、全23設計文書のRelated Publications、旧URLを自動検証する。
- ブラウザでPC / 390px Mobile、Light / Dark、メニュー開閉と画面幅切替、Type / Topicの組合せ、0件表示と解除を確認した。
- 物理ファイル移動なし、既存URL削除なし。追加は各領域・テーマの索引と独立入口のみ。
