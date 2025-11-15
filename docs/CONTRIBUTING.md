# 貢献ガイド（ルール・Git運用・AI向け）

## 基本原則
- スコープ最小: 既存構造/命名を尊重し関連範囲のみ変更
- 型安全: Convex validators + TypeScript でI/O境界を厳格化
- 責務分離: 外部API=Action / DB変更=Mutation / 読み取り=Query
- ドキュメント追従: API変更時は docs/API/* と docs/PLAN.md を更新

## Git運用（トランクベース）
- ブランチ: `feat/<scope>-<short>`, `fix/<scope>-<short>`, `docs/<topic>`
- mainはPR必須（Squash merge推奨）
- コミット: Conventional Commits（例: `feat(books): add search action`）
- PRテンプレ: `.github/pull_request_template.md` を使用

## セキュリティ/認可
- 認証必須の関数は `ctx.auth` を確認、Clerk `authId`→`users` の整合
- 秘密情報は `.env.local` から参照（Gitに含めない）

## 性能・データ
- クエリ粒度は適切に、必要に応じページング
- ISBNはハイフン除去/10↔13統一など前処理で正規化

## AI/エージェント向けメモ
- 変更時は docs/API/* と docs/PLAN.md を必ず更新
- Actionで外部API、MutationはDB書込に専念
- エラー文言はUI表示可能な日本語で簡潔に

