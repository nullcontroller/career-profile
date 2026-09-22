# Migration Report

## 対象と方針

Zenn `catalog/portfolio.md`を分類根拠に使用。Legacy ModernizationはCase / Capability側へ配置。
本文は統合・要約・リライトせず、見出しを1段下げ、Wiki記法・内部リンク・画像参照のみ変換。
旧READMEの全文は`foundations/design-system-overview`に保持。

## 結果

| 資産 | 移行 | 意図的に非公開 | 保留 |
|---|---:|---:|---:|
| Zenn Article | 16 | 0 | 0 |
| Zenn Book概要 | 3 | 0 | 0 |
| Zenn Chapter | 22 | 0 | 0 |
| 公開Wiki本文（Home・索引含む） | 30 | 0 | 0 |

3冊の章順は元config.yamlと一致。第2章と第12章など近似・重複するタイトルもそのまま保持。
元章に`free: false`があるが、親Bookは全て`published: true`, `price: 0`。所有者の全件移行指示に従って移行し、元設定もmetadataへ保持。
記事公開日は全16件保持。Book/Chapterの正確な公開日は元資料に存在しないためnull。catalogの公開月は保持。Git commit日時を公開日として代用しない。

外部画像14点・Book cover 3点、計17点をローカルへ保存。取得失敗0。URL・保存先・SHA-256はZenn manifest参照。
元Zenn repository、slug、公開状態、Git履歴は変更していない。

## Wiki

公開WikiのGit HEADを取得して30ページを移行。ローカルWikiには過去のネストした複製や別名があるため、公開HEADを正とした。
既存Wikiは削除しない。元URLとcommit・本文hashは`wiki-migration-manifest.yaml`へ記録。
`_Sidebar.md`と`_Footer.md`はサイト共通UIへ置換。ローカルZIPや重複バックアップはコピーしていない。

以下の重要ページは全て移行済み：適用可否・委任レベル、責任境界・HITL、参照アーキテクチャ、変更・再評価、オブザーバビリティ・SLO、評価データセット・回帰評価。

## 関連・重複候補（本文の統合は未実施）

| Zenn | Wiki | 関係 |
|---|---|---|
| generation-and-acceptance / ai-business-design | applicability-and-delegation / responsibility-and-hitl | 同一テーマ・重複可能性：委任・採否・責任 |
| llm-as-probabilistic-model | conditional-probability / hallucination-mechanisms | 近似テーマ：確率モデルと制御 |
| context-before-model-performance | instruction-knowledge-evidence / prompt-structure | 補完関係：Context選択と情報責務 |
| human-review-capability | responsibility-and-hitl / datasets-and-regression | 補完関係：レビュー能力・承認条件・回帰評価 |
| system-understanding（12章） | qa-operations / qa-evaluation / human-and-ai-documentation | 同一テーマ・補完関係：仕様復元・QA・評価 |
| three-ai-maintenance（7章） / ai-driven-development | multi-ai-orchestration / development-workflow | 近似テーマ・実務による補完 |
| 旧README / Wiki Home | reference-architecture / change-and-reevaluation | 重複可能性：体系概要と詳細ノート |

技術的な主張や古い表現の正否を初回移行で訂正していない。統合・再編集・canonical切替は別工程。

## 再現性と検証

Zenn41件とWiki30件は、元ファイル・移行先・元metadata・変換後本文hashを台帳化。
`npm run check`で完全性、`npm run build`で静的HTML・検索・内部リンク・画像・アンカーを検証。
生成物・node_modules・移行元.gitはGit管理対象に含めない。

## 人による確認が必要な事項

- Book/Chapterの正確な公開日が必要なら、Zenn側の情報で補完すること。
- 重複ページを将来統合する場合の正本・canonicalの選択。
- 意味を変えない初回分類について、著者の体系としての最終判断。
- 図中の長いラベルや元文書の数式は、元の表現を保持。文章自体の編集は別レビュー。

## 最終検証（2026-09-21）

- クリーンな `npm ci` 成功。依存監査0件。
- `npm run check`：型エラー・警告・hint 0、全移行件数・metadata・本文hash・章順・画像hash検証成功。
- `npm test`：Directive、未知Directive拒否、Mermaid fallback・表・base pathの3テスト成功。
- `npm run build`：85 HTMLページ、72本文ページの検索索引、2,829件の内部リンク・画像・アンカー検査成功。
- ブラウザ：19ページ・28個のMermaid図が描画成功。PC 1440px、Mobile 390px、Tablet 820pxで確認。Mobile/Tabletの横はみ出しなし。
- Light/Dark、7種のDirective表示、Book目次、画像、日本語キーワード「責任」の検索結果を確認。
- Git差分の空白指摘は元Markdownのhard break用スペースと末尾空行。元本文を保持するため残した。実装ファイル側には空白エラーなし。
- `40.Zenn`と`career-profile`の作業ツリーは変更なし。生成物・node_modules・移行元.gitの混入なし。

Mermaidは遅延ロードするローカルbundle。bundleサイズ警告はあるが、図のないページでは読み込まない。
公開処理の最終状態はGitHub ActionsのDeploy design knowledge to Pagesを参照。

## 追加改修：概要・Layer・Career

全72コンテンツの本文を確認し、front matterにsummaryを追加した。本文・元metadata・canonical・章順は変更していない。Zennの独立公開物41件はpublicationとして設計体系と区別し、テーマは従来のsectionで保持する。Wikiと旧READMEは本文の役割に応じてtheory / design / practiceを設定した。

全一覧・章目次・前後・関連・検索は同じsummaryを使用する。buildで全72ページの検索metadataと一覧の概要一致を検証する。Careerは運営者の実務背景を紹介する独立ページとして追加し、詳細職務経歴は別のCareer Profileへリンクする。
