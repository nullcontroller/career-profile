# Content Modernization Report

監査日：2026-09-22

## 判断基準

| Decision | 意味 |
|---|---|
| KEEP | 現在の分類・主張・Summaryを正本として維持 |
| UPDATE | 古い媒体表現や局所的な前提を更新 |
| REWRITE | URLと出典を保ち、現在の理解で本文を再構成 |
| MERGE | 役割を分割先へ統合し、既存URLを索引として維持 |
| SPLIT | 集中していた責務を独立した正本として追加 |
| ARCHIVE | 履歴として保持し、通常の公開導線から除外 |
| REMOVE_FROM_PUBLIC | 出典記録は保持し、公開対象から除外 |

## Summary

| Decision | Count |
|---|---:|
| KEEP | 58 |
| UPDATE | 9 |
| REWRITE | 4 |
| MERGE | 1 |
| SPLIT | 7 |
| ARCHIVE | 1 |
| REMOVE_FROM_PUBLIC | 1 |
| **Total** | **81** |

## Full Audit

| Page | Decision | Reason | Major Change |
|---|---|---|---|
| `src/content/architecture/agents-tools-and-workflows.md` | KEEP | Tool・権限・停止条件を分離した現行設計として有効 | — |
| `src/content/architecture/change-and-reevaluation.md` | KEEP | 変更時の再評価とLifecycle設計が現行構造に一致 | — |
| `src/content/architecture/cost-latency-routing.md` | KEEP | Cost・Latency・品質のRouting判断を明示 | — |
| `src/content/architecture/observability-and-slo.md` | KEEP | 運用観測とSLOを設計へ接続 | — |
| `src/content/architecture/prompts-as-interfaces.md` | KEEP | Promptを工程間Interfaceとして整理 | — |
| `src/content/architecture/reference-architecture.md` | UPDATE | 現行構造・表現との不一致 | 旧章番号への依存を除去し、現在のDesign Topicへ接続 |
| `src/content/architecture/security-threat-modeling.md` | KEEP | 脅威・権限・Tool実行の境界が明確 | — |
| `src/content/career/overview.md` | KEEP | Careerの正本から承認済み内容を統合したページ | — |
| `src/content/career/profile.md` | KEEP | 詳細Careerの正本から承認済み内容を統合したページ | — |
| `src/content/cases/system-understanding.md` | REWRITE | 主題と事実は有効だが、現在の説明構造が必要 | 事実を保持し、ContextからResultと現在の改善点まで再構成 |
| `src/content/cases/system-understanding/connecting-ui-and-internals.md` | KEEP | Book章の工程と事実を保持 | — |
| `src/content/cases/system-understanding/human-and-ai-knowledge.md` | KEEP | 人間向け説明とAI参照構造の差を保持 | — |
| `src/content/cases/system-understanding/project-structure.md` | KEEP | Project構造の復元手順を保持 | — |
| `src/content/cases/system-understanding/qa-case-study-revisited.md` | KEEP | QA事例の再評価を保持 | — |
| `src/content/cases/system-understanding/qa-case-study.md` | KEEP | 実務QA事例を保持 | — |
| `src/content/cases/system-understanding/qa-evaluation.md` | KEEP | QA評価の実務工程を保持 | — |
| `src/content/cases/system-understanding/qa-operations.md` | KEEP | QA運用の実務工程を保持 | — |
| `src/content/cases/system-understanding/rag-implementation.md` | KEEP | RAG実装の事実と手順を保持 | — |
| `src/content/cases/system-understanding/rag-improvement.md` | KEEP | RAG改善の事実と手順を保持 | — |
| `src/content/cases/system-understanding/recovering-code-structure.md` | KEEP | Codeから構造を復元する工程を保持 | — |
| `src/content/cases/system-understanding/system-understanding-problems.md` | KEEP | 仕様不足時の問題設定を保持 | — |
| `src/content/cases/system-understanding/visualizing-process-flows.md` | KEEP | PlantUMLによる可視化工程を保持 | — |
| `src/content/cases/three-ai-maintenance.md` | REWRITE | 主題と事実は有効だが、現在の説明構造が必要 | 実績値を保持し、責任境界とWorkflowを明示 |
| `src/content/cases/three-ai-maintenance/code-generation-and-unit-tests.md` | KEEP | 実装・単体テスト工程を保持 | — |
| `src/content/cases/three-ai-maintenance/cryptography-and-failure-modes.md` | KEEP | CNG / DPAPIと異常系の事実を保持 | — |
| `src/content/cases/three-ai-maintenance/implementation-design.md` | KEEP | 実装設計の判断を保持 | — |
| `src/content/cases/three-ai-maintenance/results-and-reflections.md` | KEEP | 工期約7割短縮を含む結果を保持 | — |
| `src/content/cases/three-ai-maintenance/reviewable-specifications.md` | KEEP | 審議可能な仕様化工程を保持 | — |
| `src/content/cases/three-ai-maintenance/sharing-current-specifications.md` | KEEP | 現行仕様共有の工程を保持 | — |
| `src/content/cases/three-ai-maintenance/structuring-failure-handling.md` | KEEP | 異常系を構造化する工程を保持 | — |
| `src/content/cases/understanding-systems-as-capability.md` | UPDATE | 現行構造・表現との不一致 | 外部媒体名をCase Studyの現行導線へ変更 |
| `src/content/essays/ai-career-market.md` | UPDATE | 現行構造・表現との不一致 | 公開主体を外部媒体ではなく現在のサイトへ更新 |
| `src/content/essays/ai-roles-beyond-fde.md` | KEEP | Publicationとしての役割論を保持 | — |
| `src/content/essays/model-competition-and-ecosystems.md` | KEEP | Publicationとしての市場・Ecosystem論を保持 | — |
| `src/content/essays/trust-in-ai-generated-content.md` | KEEP | Publicationとしての信頼性論を保持 | — |
| `src/content/evaluation-hitl/code-evaluation-acceptance.md` | UPDATE | 現行構造・表現との不一致 | 旧媒体を主語にした表現を現在のサイトへ更新 |
| `src/content/evaluation-hitl/datasets-and-regression.md` | KEEP | 評価Datasetと回帰評価を分離した現行設計 | — |
| `src/content/evaluation-hitl/human-review-capability.md` | KEEP | 人間Reviewの能力条件を明示 | — |
| `src/content/evaluation-hitl/qa-evaluation.md` | KEEP | QA評価の指標と運用条件を整理 | — |
| `src/content/evaluation-hitl/responsibility-and-hitl.md` | KEEP | 責任境界とHITLの現行正本 | — |
| `src/content/foundations/ai-business-design.md` | KEEP | 独立した連載入口として役割が明確 | — |
| `src/content/foundations/ai-business-design/asking-versus-delegating.md` | KEEP | 質問と委任の差を保持 | — |
| `src/content/foundations/ai-business-design/delegation-and-responsibility.md` | KEEP | 委任と責任の関係を保持 | — |
| `src/content/foundations/ai-business-design/evaluating-business-efficiency.md` | KEEP | 業務全体で効率を測る観点を保持 | — |
| `src/content/foundations/answer-scope.md` | KEEP | CoverageとSelective Riskの設計を保持 | — |
| `src/content/foundations/applicability-and-delegation.md` | KEEP | AI適用判断と委任レベルの現行正本 | — |
| `src/content/foundations/conditional-probability.md` | UPDATE | 現行構造・表現との不一致 | 「確率空間」を説明モデルとして明示し、旧媒体表現を除去 |
| `src/content/foundations/design-system-overview.md` | ARCHIVE | 履歴価値はあるが現在の主導線には不要 | 過去の章構造を履歴として非公開保持 |
| `src/content/foundations/generation-and-acceptance.md` | KEEP | 生成と受理の分離を示す現行原則 | — |
| `src/content/foundations/glossary.md` | MERGE | 役割が新しいReferenceと重複 | 既存URLを維持し、4つのReference正本への索引に変更 |
| `src/content/foundations/guardrail-models.md` | KEEP | Guardrailの説明モデルと限界を保持 | — |
| `src/content/foundations/hallucination-mechanisms.md` | KEEP | 発生機序をAI数学論として保持 | — |
| `src/content/foundations/layered-hallucination-controls.md` | KEEP | 多層制御をAI Designへ接続 | — |
| `src/content/foundations/llm-as-probabilistic-model.md` | REWRITE | 主題と事実は有効だが、現在の説明構造が必要 | 数学的定義・説明モデル・設計判断・非含意を分離 |
| `src/content/foundations/temperature-design.md` | KEEP | Temperatureの数理と設計上の限界を保持 | — |
| `src/content/foundations/wiki-overview.md` | REMOVE_FROM_PUBLIC | 移行前構造を前提とし一般公開価値がない | 過去媒体の概要として非公開保持 |
| `src/content/knowledge-context/context-before-model-performance.md` | KEEP | Context条件をModel比較から分離 | — |
| `src/content/knowledge-context/human-and-ai-documentation.md` | KEEP | Human ViewとAI Access Layerの差を整理 | — |
| `src/content/knowledge-context/instruction-knowledge-evidence.md` | KEEP | 三責務の分離を示す現行正本 | — |
| `src/content/knowledge-context/prompt-failure-modes.md` | KEEP | Promptの失敗を構造別に整理 | — |
| `src/content/knowledge-context/prompt-structure.md` | UPDATE | 現行構造・表現との不一致 | 用語表の旧媒体表現を現在のサイトへ更新 |
| `src/content/knowledge-context/qa-behavior-constraints.md` | KEEP | QAの回答・拒否条件を設計 | — |
| `src/content/knowledge-context/qa-operations.md` | KEEP | Knowledge更新とQA運用を接続 | — |
| `src/content/practices/adoption-governance.md` | SPLIT | 安定して参照する責務を独立させる | AI導入を目的・委任・例外・改善の正本として独立 |
| `src/content/practices/ai-adoption-and-effective-use.md` | REWRITE | 主題と事実は有効だが、現在の説明構造が必要 | 属性の一般化を避け、影響・情報・責任による判断へ再構成 |
| `src/content/practices/ai-education-principles.md` | KEEP | Zenn Publicationとして教育論を保持 | — |
| `src/content/practices/education-and-capability.md` | SPLIT | 安定して参照する責務を独立させる | 変化しにくい原則と更新する実践を正本化 |
| `src/content/practices/transferring-ai-practices.md` | UPDATE | 現行構造・表現との不一致 | 本文の外部媒体名を現在の公開知識へ更新 |
| `src/content/practices/transferring-practices.md` | SPLIT | 安定して参照する責務を独立させる | 横展開を目的・情報・判断・Risk・評価へ分解して正本化 |
| `src/content/reference/evaluation-metrics.md` | SPLIT | 安定して参照する責務を独立させる | Retrieval・生成・受理・運用の指標を独立 |
| `src/content/reference/glossary.md` | SPLIT | 安定して参照する責務を独立させる | サイト共通の基本用語を独立 |
| `src/content/reference/mathematical-reference.md` | SPLIT | 安定して参照する責務を独立させる | 数学的定義・説明モデル・設計仮説の索引を独立 |
| `src/content/reference/responsibility-state-model.md` | SPLIT | 安定して参照する責務を独立させる | Capability・Authority・Accountabilityと状態遷移を独立 |
| `src/content/software-engineering/ai-design-assistance.md` | KEEP | AIによる設計支援の境界を保持 | — |
| `src/content/software-engineering/ai-driven-development.md` | UPDATE | 現行構造・表現との不一致 | 外部Bookという表現をCase Studyの現行導線へ更新 |
| `src/content/software-engineering/code-generation-and-work-design.md` | KEEP | Code生成と作業設計を接続 | — |
| `src/content/software-engineering/code-generation-boundaries.md` | KEEP | Code生成の委任境界を整理 | — |
| `src/content/software-engineering/code-generation-models.md` | UPDATE | 現行構造・表現との不一致 | 設計仮説と製品固有情報の扱いから旧媒体表現を除去 |
| `src/content/software-engineering/code-maintenance-context.md` | KEEP | 保守で必要なContext構成を整理 | — |
| `src/content/software-engineering/development-workflow.md` | KEEP | AI Assisted Software Engineeringの現行Practice | — |
| `src/content/software-engineering/multi-ai-orchestration.md` | KEEP | 複数AIの役割・受渡し・停止条件を整理 | — |

## Findings

- AI DesignとAI数学論の正本は、すでに事実、説明モデル、設計仮説を概ね分離できていたため、大部分をKEEPとした。
- 主な負債は、Referenceの一ページ集中、Practices正本の不足、公開本文に残る旧媒体表現、Case入口の説明不足だった。
- Zenn / Wiki由来であることは削除せず、front matterとmanifestで保持した。
- Bookの章順、実務上の数値、製品名、暗号方式、承認工程は変更していない。
