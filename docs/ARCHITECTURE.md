# Novelune アーキテクチャ設計

> 現状注記: 本ドキュメントは将来像も含む設計方針です。現時点の実装は認証UIとConvex接続、`books` モジュールの一部に限られます。最新の実装状況は `docs/PLAN.md`、スキーマの差分は `docs/DATABASE.md` の「将来拡張」を参照してください。

## ビジョン

### 核となる哲学

**本棚は人生の軌跡**

本棚はその人の人生の辿った道と言っても過言ではありません。人の本棚を見ることによって、その人と話す以上の背景をも類推することができます。

**現状の問題**: 人の本棚がインターフェースとなるコミュニケーションツールが存在しない。

**Noveluneの解決策**: 本棚を起点とした新しいコミュニケーション体験を提供する。

### コア機能の目的

#### 1. 本棚機能（Bookshelf）
- **目的**: ユーザーの読書履歴・興味関心を可視化
- **価値**: 本棚を通じて相手の背景を理解し、コミュニケーションのきっかけを作る
- **機能**:
  - ISBN検索・追加
  - 本棚の公開範囲設定（公開/非公開/特定ユーザーのみ）
  - 本棚の並び順をカスタム可能
  - 他ユーザーの本棚閲覧
  - 本棚をきっかけにしたメッセージ送信
  - 気になった本を参照して話しかける機能

#### 2. 小説のようなチャット機能（Novel-style Messaging）
- **目的**: 従来のチャットアプリとは異なる、小説のような体験を提供
- **デザイン原則**:
  1. **縦書き表示**: 書籍のように縦書きでメッセージを表示（横スクロール）
  2. **統一されたスタイル**: LINEのような色分けは行わない。全メッセージを統一されたスタイルで表示
  3. **セリフと地の文の両立**: 
     - ユーザーが明示的にセリフ/地の文を選択可能
     - セリフ: 「」鉤括弧で囲まれた会話部分（従来の小説通り）
     - 地の文: ナレーション部分（通常テキスト）
     - 例: 「〇〇で草」しかし、私の口角は硬くきっと閉じている。
  4. **メタ的なやり取り**: 会話の内容だけでなく、その場の状況や感情を地の文で表現できる
  5. **メッセージ編集・削除**: 投稿後の編集・削除が可能

### ユーザー体験の流れ

1. **本棚を公開**: 自分の読書履歴を本棚として公開
2. **他ユーザーの本棚を閲覧**: 興味のある本棚を見つける
3. **コミュニケーション開始**: 本棚をきっかけにメッセージを送る
4. **小説のような会話**: 縦書きで、セリフと地の文を織り交ぜた会話を楽しむ

## システム概要

Noveluneは、Next.js、Convex、Clerkを組み合わせたモダンなフルスタックアプリケーションです。

### アーキテクチャ図

```
┌─────────────────────────────────────────────────────────┐
│                      ユーザー                             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│               Next.js 15 (App Router)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Server Components  │  Client Components          │  │
│  │  - SSR/SSG         │  - インタラクティブUI         │  │
│  │  - データプリロード │  - リアルタイム更新          │  │
│  └──────────────────────────────────────────────────┘  │
└──────────┬──────────────────────────────┬───────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────┐      ┌─────────────────────────┐
│   Clerk (認証)       │      │   Convex (Backend)      │
│  - ユーザー管理      │      │  - データベース         │
│  - セッション管理    │◄─────┤  - リアルタイムAPI      │
│  - 認証フロー        │      │  - サーバーレス関数     │
└─────────────────────┘      └─────────────────────────┘
```

## レイヤー構造

### 1. プレゼンテーション層（Frontend）

**技術**: Next.js 15 App Router + React 19 + TypeScript

#### Server Components
- **役割**: 初期HTML生成、データプリフェッチ、SEO最適化
- **配置**: `src/app/**/page.tsx`, `src/app/**/layout.tsx`
- **データ取得**: Convexの`preloadQuery`を使用
- **メリット**:
  - ゼロJavaScriptのデフォルト
  - 高速な初期表示
  - サーバーサイドでのデータ取得

#### Client Components
- **役割**: インタラクティブなUI、リアルタイム更新
- **配置**: `src/components/**/*.tsx`（`"use client"`ディレクティブ付き）
- **データ取得**: Convexの`useQuery`, `useMutation`を使用
- **メリット**:
  - リアルタイムデータ同期
  - ユーザーインタラクション対応

#### スタイリング
- **Tailwind CSS v4**: ユーティリティファーストCSS
- **レスポンシブ**: モバイルファースト設計

### 2. ビジネスロジック層（Backend）

**技術**: Convex

#### Convex関数の種類

##### Query（クエリ）
- **用途**: データの読み取り
- **特徴**:
  - リアクティブ（データ変更時に自動再実行）
  - キャッシュ可能
  - 副作用なし
- **例**:
  ```typescript
  // convex/books.ts
  export const list = query({
    handler: async (ctx) => {
      return await ctx.db.query("books").collect();
    },
  });
  ```

##### Mutation（ミューテーション）
- **用途**: データの作成・更新・削除
- **特徴**:
  - トランザクショナル
  - 認証チェック可能
- **例**:
  ```typescript
  export const create = mutation({
    args: { isbn: v.string(), title: v.string() },
    handler: async (ctx, args) => {
      return await ctx.db.insert("books", args);
    },
  });
  ```

##### Action（アクション）
- **用途**: 外部API呼び出し、非決定的処理
- **特徴**:
  - HTTP通信可能
  - サードパーティAPI統合
- **例**:
  ```typescript
  export const fetchBookInfo = action({
    args: { isbn: v.string() },
    handler: async (ctx, args) => {
      const response = await fetch(`https://api.example.com/books/${args.isbn}`);
      return await response.json();
    },
  });
  ```

### 3. データ層

**技術**: Convex Database

#### データモデル設計

##### テーブル構造
```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({...}),
  books: defineTable({...}),
  bookshelves: defineTable({...}),
  messages: defineTable({...}),
});
```

##### インデックス戦略
- **単一カラムインデックス**: 高速検索
- **複合インデックス**: 複数条件での効率的なクエリ
- **例**:
  ```typescript
  .index("by_user_book", ["userId", "bookId"])
  ```

### 4. 認証層

**技術**: Clerk

#### 認証フロー
```
1. ユーザーがログイン
   ↓
2. Clerkがトークン発行
   ↓
3. Next.jsミドルウェアで認証チェック
   ↓
4. ConvexがClerkトークンを検証
   ↓
5. usersテーブルとauthIdを紐付け
```

#### セッション管理
- **フロントエンド**: `@clerk/nextjs`によるセッション維持
- **バックエンド**: ConvexがClerk JWTを検証
- **同期**: Clerk WebhookでユーザーテーブルとClerkを同期

## ディレクトリ構造詳細

```
novelune/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # 認証関連ルートグループ
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # ダッシュボードルートグループ
│   │   │   ├── books/           # 書籍一覧・詳細
│   │   │   ├── messages/        # メッセージ
│   │   │   └── profile/         # プロフィール
│   │   ├── layout.tsx           # ルートレイアウト
│   │   ├── page.tsx             # ホームページ
│   │   └── globals.css          # グローバルスタイル
│   │
│   ├── components/              # 再利用可能コンポーネント
│   │   ├── ui/                 # UIプリミティブ
│   │   ├── books/              # 書籍関連コンポーネント
│   │   └── messages/           # メッセージ関連コンポーネント
│   │
│   ├── lib/                     # ユーティリティ関数
│   │   ├── utils.ts            # 汎用ユーティリティ
│   │   └── validators.ts       # バリデーション
│   │
│   ├── providers/               # React Context Providers
│   │   └── convex-client-provider.tsx
│   │
│   └── types/                   # 型定義
│       └── index.ts
│
├── convex/                       # Convexバックエンド
│   ├── schema.ts                # データベーススキーマ
│   ├── books.ts                 # 書籍関連関数
│   ├── users.ts                 # ユーザー関連関数
│   ├── messages.ts              # メッセージ関連関数
│   ├── auth.config.js           # 認証設定
│   └── _generated/              # 自動生成ファイル
│
└── public/                       # 静的アセット
    └── images/
```

## データフロー

### 1. ページ表示時（Server Component）

```
ユーザーリクエスト
  ↓
Next.jsサーバー
  ↓
preloadQuery(api.books.list) ← Convexクエリ実行
  ↓
Server Componentレンダリング
  ↓
HTMLをクライアントに送信
  ↓
ハイドレーション（Client Componentのみ）
```

### 2. リアルタイム更新（Client Component）

```
Client Component マウント
  ↓
useQuery(api.books.list) ← WebSocket接続
  ↓
Convexから初期データ受信
  ↓
レンダリング
  ↓
（データ変更時）
  ↓
Convexから更新通知受信
  ↓
自動再レンダリング
```

### 3. データ変更（Mutation）

```
ユーザーアクション
  ↓
useMutation(api.books.create)実行
  ↓
Convex Mutation関数呼び出し
  ↓
認証チェック（ctx.auth.getUserIdentity()）
  ↓
データベース更新
  ↓
購読中のクエリに通知
  ↓
関連コンポーネント自動再レンダリング
```

## セキュリティ設計

### 認証
- **Clerk**: セキュアな認証・セッション管理
- **JWT**: ClerkからConvexへのトークン検証
- **middleware**: Next.jsミドルウェアでルート保護

### 認可
- **Convex関数内**: ユーザーIDベースのアクセス制御
- **例**:
  ```typescript
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  ```

### データ保護
- **環境変数**: `.env.local`に秘密情報を格納
- **HTTPS**: すべての通信を暗号化
- **CSP**: Content Security Policyでスクリプト実行制限

## パフォーマンス最適化

### フロントエンド
- **Server Components**: 初期表示高速化
- **動的インポート**: コード分割
- **next/image**: 画像最適化
- **Turbopack**: 高速ビルド

### バックエンド
- **Convexインデックス**: クエリ高速化
- **リアクティブクエリ**: 不要な再取得を削減
- **自動キャッシュ**: Convexの組み込みキャッシュ

## スケーラビリティ

### 水平スケーリング
- **Next.js**: Vercelでのオートスケーリング
- **Convex**: 自動スケーリング（サーバーレス）

### データベース
- **Convexインデックス**: 大規模データセットでも高速クエリ
- **シャーディング**: Convexが自動処理

## 監視・ロギング

### エラートラッキング
- **開発環境**: コンソールログ
- **本番環境**: Vercel Analytics、Convex Dashboard

### パフォーマンス監視
- **Vercel Analytics**: ページロード時間、Core Web Vitals
- **Convex Dashboard**: 関数実行時間、データベース使用状況

## 技術的実装方針

### メッセージングUI

#### レイアウト
- **縦書き**: CSS `writing-mode: vertical-rl` を使用
- **横スクロール**: 画面は横スクロールで縦書きの流れを表現
- **統一されたスタイル**: 全メッセージを統一されたフォント・色・行間で表示

#### スタイリング
- 統一されたフォント・色・行間
- 書籍のような読みやすいタイポグラフィ
- 改ページ・段落の適切な処理
- セリフは「」で表示、地の文は通常テキスト

#### 入力UI
- 縦書きテキストエリア
- セリフ/地の文の明示的な選択（トグルまたはボタン）
- プレビュー機能

#### 機能
- メッセージの編集・削除
- リアルタイム更新（Convex `useQuery`活用）

### 本棚機能

#### 公開範囲
- `public`: 公開（全ユーザーが閲覧可能）
- `private`: 非公開（本人のみ閲覧可能）
- `limited`: 特定ユーザーのみ（将来的な拡張）

#### 並び順
- カスタム順序を保存（`bookshelves.order`フィールド）
- ドラッグ&ドロップ等のUIで並び順を変更可能
- `by_user_order`インデックスで効率的に取得

#### 本棚からのメッセージ送信
- 他ユーザーの本棚閲覧時に「このユーザーと話す」ボタン
- 特定の本を参照してメッセージを送信（`messages.referencedBookId`にISBNを設定）

### データモデル

#### メッセージ
- `messages.content`: プレーンテキスト
- `messages.type`: `"dialogue"`（セリフ）または `"narration"`（地の文）
- `messages.referencedBookId`: 参照された本のISBN（オプション）
- `messages.editedAt`: 編集日時（オプション）
- `messages.deletedAt`: 削除日時（論理削除用、オプション）

#### 本棚
- `users.bookshelfVisibility`: 本棚の公開範囲
- `bookshelves.order`: 並び順（カスタム順序用）

## 今後の拡張予定

- [ ] 通知システム（リアルタイム通知）
- [ ] 検索機能（全文検索）
- [ ] レコメンデーションエンジン
- [ ] ソーシャル機能（フォロー、いいね）
- [ ] モバイルアプリ（React Native）
- [ ] 本棚ベースのマッチング機能
- [ ] 読書会・イベント機能
- [ ] レビュー・感想の共有
- [ ] 本棚の統計・可視化
- [ ] メッセージのエクスポート（小説として保存）

## 参考リソース

- [Next.js App Router](https://nextjs.org/docs/app)
- [Convexアーキテクチャ](https://docs.convex.dev/architecture)
- [Clerkセキュリティ](https://clerk.com/docs/security)
