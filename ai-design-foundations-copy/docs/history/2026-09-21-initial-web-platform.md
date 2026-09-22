---
title: "Zenn / Wiki資産を統合しWebサイト化"
summary: "分散していたZenn・Wiki・Markdown資産を、Markdownを正本とする技術知識基盤へ移行した。出典と本文を保持し、静的生成・検索・検証・自動公開を一つの運用へ接続した。"
layer: project
project: ai-design-foundations
journal_kind: milestone
date: "2026-09-21"
status: stable
---

## 目的

Zenn、GitHub Wiki、既存Markdownへ散在していた技術資産を、一つの技術知識基盤へ統合する。

## 課題

- 情報が複数箇所へ分散していた。
- 記事と設計原則が分離されていなかった。
- GitHub WikiではContent Modelを十分に表現しづらかった。
- 継続更新・AI編集・公開を一貫したWorkflowにしたかった。

## 設計判断

Markdownを正本とし、Astroで静的サイトを生成する。TypeScriptとContent CollectionsのSchemaでContent Modelを扱い、GitHub ActionsでBuild / Deploy、GitHub Pagesで公開する。

Zenn資産は本文を勝手に統合せず、元URL・slug・front matter・章順を保持する。移行元との対応をManifestで追跡し、Zenn側をcanonicalとして残す。

## 実装

Astro / TypeScript / Content Collectionsを導入し、Custom Markdown Directive、Mermaid、KaTeX、コードの構文強調、Pagefindによる検索を組み込んだ。

Zennの16記事・3冊・22章とWikiの30ページを移行し、Migration Manifestで出典と対応先を管理した。画像・Bookの章順・本文ハッシュを確認する検証と、生成後の内部リンク・索引検証を追加した。

GitHub Actionsで依存関係のインストール、Check、Test、Build、Pages成果物のアップロードとDeploymentを実行する構成にした。

## 成果

AI Design Foundationsという公開技術知識サイトとして運用可能になった。本文の編集から検証・公開までをRepositoryで追跡できる基盤ができた。

## 次にやること

情報アーキテクチャを再設計し、数学・設計原則・実務適用・公開物の役割を明確にする。
