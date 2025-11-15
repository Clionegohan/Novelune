# Novelune

小説愛好家のためのソーシャルプラットフォーム

## 概要

Noveluneは、**本棚を起点とした新しいコミュニケーションツール**です。

本棚はその人の人生の軌跡。人の本棚を見ることによって、その人と話す以上の背景をも類推することができます。Noveluneでは、本棚を通じて出会い、**小説のような縦書きチャット**で会話を楽しむことができます。

### コア機能

1. **本棚機能**: 読書履歴を管理し、公開範囲を設定して共有
2. **小説のようなチャット**: 縦書き + 横スクロールで、セリフと地の文を織り交ぜた会話
3. **本棚からのコミュニケーション**: 他ユーザーの本棚を見て、気になった本をきっかけに話しかける

## 技術スタック

### フロントエンド
- **Next.js 15.4.6** - React フレームワーク（App Router）
- **React 19 RC** - UI ライブラリ
- **TypeScript 5** - 型安全な開発
- **Tailwind CSS v4** - スタイリング

### バックエンド・認証
- **Convex** - リアルタイムバックエンドプラットフォーム
- **Clerk** - ユーザー認証・管理

### 開発ツール
- **ESLint** - コード品質チェック
- **Turbopack** - 高速ビルドツール

## プロジェクト構造

```
Novelune/
├── novelune/              # メインアプリケーション
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   └── providers/    # React Context Providers
│   ├── convex/           # Convexバックエンド定義
│   ├── public/           # 静的アセット
│   └── ...
├── docs/                 # プロジェクトドキュメント（AI参照用）
└── .claude/             # Claude Code設定
```

## セットアップ

### 必要要件
- Node.js 20以上
- npm または yarn

### インストール

```bash
cd novelune
npm install
```

### 環境変数

`.env.local`ファイルを作成し、以下を設定：

```env
# Clerk認証
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Convex
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## ドキュメント

詳細は `docs/` ディレクトリ：

- [Docs Index](./docs/README.md)
- [アーキテクチャ設計](./docs/ARCHITECTURE.md)
- [開発ガイド](./docs/DEVELOPMENT.md)
- [データベーススキーマ](./docs/DATABASE.md)
- [APIインデックス](./docs/API/README.md)
- [貢献ガイド（ルール・Git運用・AI向け）](./docs/CONTRIBUTING.md)
- [開発計画（現状・優先タスク・ロードマップ）](./docs/PLAN.md)

## 開発コマンド

```bash
npm run dev    # 開発サーバー起動（Turbopack使用）
npm run build  # 本番ビルド
npm run start  # 本番サーバー起動
npm run lint   # ESLintチェック
```

## 主要機能（実装状況）

- ユーザー認証（Clerk）: 基本UIあり
- 書籍管理（ISBN検索、本棚機能）: Convex APIの一部あり（外部APIは未実装）
- ユーザー間メッセージング: 未実装（スキーマのみ）
- リアルタイムデータ同期: Convex接続の土台のみ

## ライセンス

Private
