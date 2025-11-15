# 開発ガイド

## 動作要件
- Node.js 20+
- npm

## セットアップ/起動
プロジェクトのセットアップと起動手順はリポジトリの `README.md` を参照してください（重複を避けるため本ドキュメントからは割愛）。

## 構成の要点
- 認証: Clerk（`ConvexProviderWithClerk` 統合）。
- バックエンド: Convex（`novelune/convex`）。
- UI: Next.js App Router（現状は認証ボタンのみ）。

## Convex 関数の追加
1. `novelune/convex/` に `<module>.ts` を作成
2. `query`/`mutation`/`action` を定義
3. `npx convex dev` 実行中であれば自動生成が更新され、`convex/_generated/api` から参照可能

例:
```ts
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const list = query({ handler: async (ctx) => ctx.db.query("books").collect() });
export const create = mutation({ args: { isbn: v.string(), title: v.string() }, handler: async (ctx, args) => ctx.db.insert("books", args) });
```

## コーディング規約（要点）
- TypeScript/Convex validators を併用して型安全を担保。
- 外部API呼び出しは Action に分離（MutationはDB書込に専念）。
- 1 API 1 ドキュメント方針。`docs/API` を更新。
- UI/状態はできるだけサーバー由来（Server Components + preloadQuery）を活用。

## デバッグ
- Convexログを活用（`console.log` 可）
- クライアントのエラーはブラウザコンソール/Next.js overlay を確認
