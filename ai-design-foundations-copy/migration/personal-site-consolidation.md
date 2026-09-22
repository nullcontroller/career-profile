# Personal Site Consolidation

## サイトと導線

サイト全体を「立林 裕太朗 / Applied AI / System Architecture」の個人公開サイトへ変更。AI Design Foundationsは技術知識・設計体系の領域として維持する。

Navigation: Home / Career / 詳細職務経歴、AI Design / AI数学論 / Practices / Case Studies、Articles / Books / 連載 / Essays、全体目次 / Reference / About / Search。

Homeには人物紹介、Careerと全体目次への入口、各技術領域と記事への概要付きリンクを配置。既存のDocument UI、Light/Dark、モバイルNavigationを維持。

## Career統合

career-profileのmainと一致するcommit `426338274e7bbb0b6a66bc6edf95a2161356fbdc` を参照し、概要と詳細をそれぞれ `/career/`、`/career/profile/` に収録。元Repositoryは変更していない。経歴・実績・希望条件の文章を保持し、front matter、見出し階層、内部リンクのみ調整。追跡情報は `career-integration-manifest.json` に保存。

## 技術文書・Publication

AI DesignとAI数学論の分類・本文・Summaryを維持。Zenn由来16 Article、3 Book、22 Chapter、Wiki由来30文書を引き続きmanifestで追跡。Bookの公開上の分類は実務事例2冊と設計原則の連載1件。本文を二重コピーせず、内部リンクで読む。

Publicationの表示形式を `publication_format` で管理し、出典から分離。Source表示・Source filter・検索のSource metadata・ページ下部の出典リンクとGitHub原文リンクを非表示化。出典・元canonicalはMarkdown metadataに保持し、公開canonicalは自サイトを使用する。

Markdownの既存本文中の外部出典リンクは描画時に変換。移行済み本文が特定できる場合は内部ページへ、それ以外のGitHub/Zennリンクは文字列を保持してリンクのみ外す。架空の遷移先は作成していない。

## 非公開化

Project / Project Journal / Toolsの公開ルートを削除。Journal本文2件は `docs/history/` へ保存。Authoring GuideはRepository内docsで管理し公開ルートは廃止。Wiki概要と設計体系の原点は `public: false` として保持し、生成・索引・検索から除外。

通常の技術文書URL、ホスト名、base path、masterは維持。上記の明示的に廃止した公開ルートと移行資料は例外。Career詳細の `/career/profile/` を新設。

## 検証

- npm run check: 成功、Astro診断0件。移行本文・metadata・Career本文の完全性検査成功。
- npm test: 5件成功。
- npm run build: 成功、HTML 99ページ、検索対象72ページ。
- Link validation: 4,775件成功。
- Index validation: Summary、分類、737件のコンテンツ導線、Book/連載、全体目次、関連Publicationを検証。
- 公開HTMLの外部href出現数（重複を含む）: GitHub 223→0、旧Career Profile 1→0、Zenn 86→0。
- 禁止した公開ルート・孤立リンク・Source UI metadata: 0件。
- PC/MobileとLight/DarkのHome・Navigationを目視確認。検索「DPAPI」で実務事例とCareerの5件を表示し、Summaryと内部リンクを確認。
- 元Career Repositoryは変更なし。不要な生成物、node_modules、別Repositoryの.gitは差分に含まない。

## 公開状態と残作業

ローカルで実装・検証済み。今回の変更は未commit・未pushであり、公開サイトには未反映。公開後の最終確認は残る。Mermaid由来の既存bundle size warningは非阻害で、今回の構造整理では変更していない。
