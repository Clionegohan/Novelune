# 貢献ガイド（Gitルール要約）

本プロジェクトのGit運用ルールをまとめます。詳細は各PRのテンプレートとリポジトリの自動チェックに従ってください。

注: 詳細な開発者向けガイドは `docs/CONTRIBUTING.md`（別PRで追加）も参照してください。

## 方針
- トランクベース開発: `main` は常にデプロイ可能、直接push禁止（PR必須）
- 小さく早く: 1PR=1責務、300行前後を目安に小さく
- Squash & merge: 履歴はPRタイトルで要約

## ブランチ規約
- 命名: `type/scope-kebab`
  - 例: `feat/books-actions`, `fix/messages-order`, `docs/git-rules`
- 短命ブランチ: 作成→実装→PR→レビュー→マージを短サイクルで

## コミット/PRタイトル（Conventional Commits）
- 形式: `type(scope): subject`
- type: `feat` | `fix` | `docs` | `refactor` | `chore` | `test` | `perf`
- 例: `feat(books): add search action with timeout`

## PR運用
- テンプレ必須: `.github/pull_request_template.md` を使用
- 説明: 目的/変更範囲/動作確認/影響範囲/チェックリスト
- 付帯: 関連Issue/計画（docs/PLAN.md）へのリンクがあれば記載

## 自動チェック（GitHub Actions）
- Semantic PR Title: PRタイトルのConventional Commits検証
- PR Labeler: 変更ファイルに応じた自動ラベル付与

## 秘密情報/生成物
- `.env*` はコミット禁止
- ビルド成果物/IDE設定は `.gitignore` 済み

## マージ前チェックリスト
- [ ] 1PR=1責務になっている
- [ ] PRタイトルがConventional Commits
- [ ] 破壊的変更があれば移行手順を明記
- [ ] 必要なドキュメント（docs/API/* など）を更新
