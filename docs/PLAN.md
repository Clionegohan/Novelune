# 開発計画（現状・優先タスク・ロードマップ）

本ドキュメントは STATUS/NEXT_STEPS/ROADMAP を統合した一本化プランです。

## 最優先タスク: スキーマデプロイ

**目的**: 新規追加したフィールドをConvexに反映（他の機能の前提条件）

**状況**: `schema.ts`に新フィールドを追加済みだが、Convexへのデプロイが必要

**追加されたフィールド**:
- `users.bookshelfVisibility`: 本棚の公開範囲（`public`/`private`/`limited`）
- `bookshelves.order`: 並び順（カスタム順序用）
- `messages.type`: セリフ/地の文の区別（`dialogue`/`narration`）
- `messages.referencedBookId`: 参照された本のISBN
- `messages.editedAt`: 編集日時
- `messages.deletedAt`: 削除日時（論理削除用）

**新インデックス**:
- `bookshelves.by_user_order`: 並び順での取得用

**タスク**:
- [ ] `schema.ts`の変更をConvexにデプロイ（`npx convex dev` または Convexダッシュボード）
- [ ] 新インデックス（`by_user_order`等）の確認
- [ ] 既存データとの互換性確認（`order`が`undefined`の場合の処理）

**DoD**:
- Convexダッシュボードで新フィールドが確認できる
- 既存データでエラーが発生しない

## 現状サマリ

### 実装済み機能

#### 認証・基盤
- ✅ Clerk認証UI（ログイン/ログアウト）
- ✅ Convex接続の土台（ConvexClientProvider）
- ✅ 基本的なNext.js App Router構成

#### データモデル（スキーマ定義）
- ✅ 基本テーブル定義（`users`, `books`, `bookshelves`, `messages`）
- ✅ 新規フィールドの追加（`users.bookshelfVisibility`, `bookshelves.order`, `messages.type`等）
- ⚠️ **注意**: スキーマ変更はConvexにデプロイが必要（上記「最優先タスク」参照）

#### 書籍管理API（部分実装）
- ✅ `addBookToShelf`: 本棚への追加（重複チェックあり）
- ✅ `removeBookFromShelf`: 本棚からの削除
- ✅ `getUserBookshelf`: ユーザーの本棚取得
- ✅ `getBook`: 本の詳細取得
- ⚠️ `searchBooks`: モック実装（外部API未統合）
- ⚠️ `fetchBookData`: モック実装（外部API未統合）

### 未実装機能

#### 1. スキーマ反映
- [ ] Convexスキーマのデプロイ（新フィールド反映）
- [ ] インデックスの確認（`by_user_order`等）

#### 2. 書籍外部API統合
- [ ] `books.fetchByIsbn` Action実装（Google Books API等）
- [ ] `books.search` Action実装（キーワード検索）
- [ ] ISBN正規化ユーティリティ（ハイフン除去、10/13変換）
- [ ] エラーハンドリング（タイムアウト、レート制限、リトライ）
- [ ] `addBookToShelf`からAction呼び出しへの変更

#### 3. ユーザー同期
- [ ] `users.ts`作成（`ensureCurrentUser`, `getByAuthId`等）
- [ ] 初回ログイン時のユーザー作成ロジック
- [ ] Clerkセッションからユーザー情報取得
- [ ] （任意）Clerk Webhookでのユーザー更新同期

#### 4. 本棚UI
- [ ] ルーティング（`/books/shelf`, `/books/search`, `/books/[isbn]`, `/users/[userId]/shelf`）
- [ ] コンポーネント（検索フォーム、結果リスト、本棚一覧、書籍カード等）
- [ ] 公開範囲設定UI
- [ ] 並び順カスタム機能（ドラッグ&ドロップ）
- [ ] 他ユーザーの本棚閲覧UI
- [ ] 本棚からメッセージ送信機能

#### 5. メッセージング
- [ ] `messages.ts`作成（`send`, `edit`, `delete`, `listConversation`, `listInbox`）
- [ ] ルーティング（`/messages`, `/messages/[userId]`）
- [ ] 縦書き + 横スクロールUI
- [ ] セリフ/地の文の選択UI
- [ ] メッセージの編集・削除機能
- [ ] リアルタイム更新

#### 6. 品質・仕上げ
- [ ] エラーメッセージの日本語化・統一
- [ ] ローディング状態の表示
- [ ] 空状態のUI
- [ ] 型定義の明文化
- [ ] ドキュメント更新

## 優先タスク（サマリ）
1) 外部書籍API実装（Convex Action + キャッシュ）
2) ユーザー同期（初回作成 or Clerk Webhook）
3) 本棚UI（検索→追加/削除→一覧→詳細）
4) メッセージAPI/最小UI（`by_conversation_sentAt` 活用）
5) 品質/仕上げ（文言/空状態/型・Docs整備）

## タイムライン目安（5週間）
- W1: 外部API統合（検索/ISBN取得 + キャッシュ）
- W2: ユーザー同期（Clerk→Convex）
- W3: 本棚UI（検索→追加/削除→一覧/詳細）
- W4: メッセージング（Backend→最小UI）
- W5: 品質/仕上げ（文言/空状態/型・Docs整備）

## 成功指標（KPI）
- 検索→本棚追加: 平均3クリック以内、操作エラー率 < 2%
- 初回描画 < 2.5s（ローカル基準）、主要操作遅延 < 150ms
- API往復成功率 99%（開発時試行）
- ドキュメント更新遅延ゼロ（実装PRと同時）

## リスクと対策
- 外部API制限: Actionでタイムアウト/リトライ/キャッシュを実装
- ISBN揺れ: 正規化ユーティリティで一元化（ハイフン/10↔13）
- ユーザー未同期: `ensureCurrentUser` ガード導入
- リアルタイム反映遅延: クエリ粒度見直し + 楽観更新

## マイルストーン詳細

### M1: 書籍外部API統合（最低限）

**目的**: ISBN検索/取得をモックから実データに置換、`books` にキャッシュ

**タスク**:
- [ ] Action `books.fetchByIsbn` を追加（Google Books等）
  - 関連ファイル: `novelune/convex/books.ts`
  - 環境変数: `GOOGLE_BOOKS_API_KEY`（`.env.local`）
- [ ] Action `books.search` を追加（キーワード+著者）
  - 関連ファイル: `novelune/convex/books.ts`
- [ ] ISBN前処理（ハイフン除去・10/13の正規化）
  - 関連ファイル: `novelune/convex/lib/isbn.ts`（新規作成）
- [ ] タイムアウト/レート制限/エラーハンドリング実装
  - リトライロジック、タイムアウト設定、レート制限対応
- [ ] `addBookToShelf` から Action を利用し `books` を作成/更新
  - 関連ファイル: `novelune/convex/books.ts`
- [ ] docs/API/books.md を更新（Action I/F、エラー、例）

**DoD**:
- ISBNで追加時に実在書籍が保存され、再追加で重複エラー
- 検索で複数候補が返却される（最低3件想定）
- 失敗時はユーザー向けに明瞭な日本語エラー

**KPI**: 検索<=1.5s, 追加<=1.2s（ローカル目安）

---

### M2: ユーザー同期（Clerk→Convex）

**目的**: 認証ユーザーが `users` に存在することを保証

**タスク**:
- [ ] `users.ts` 追加: `ensureCurrentUser`, `getByAuthId` など
  - 関連ファイル: `novelune/convex/users.ts`（新規作成）
- [ ] 初回ログイン時に `users` を作成（Clerkセッションから取得）
  - 関連ファイル: `novelune/src/app/page.tsx`（ユーザー作成呼び出し追加）
- [ ] （任意）Clerk Webhook でユーザー更新を同期
- [ ] docs/API/users.md と docs/DATABASE.md 反映
  - 関連ファイル: `docs/API/users.md`（新規作成）

**DoD**:
- 認証済みで `users` 未作成の状態が発生しない
- `by_auth_id` での取得が安定して機能

**KPI**: 初回認証→ユーザー作成<=1s, 失敗率<1%

---

### M3: 本棚UI（MVP）

**目的**: 追加/削除・一覧・検索・詳細の最小UI + 公開範囲・並び順カスタム

**タスク**:

#### ルーティング
- [ ] `/books/shelf` - 自分の本棚一覧
  - 関連ファイル: `novelune/src/app/books/shelf/page.tsx`（新規）
- [ ] `/books/search` - 書籍検索
  - 関連ファイル: `novelune/src/app/books/search/page.tsx`（新規）
- [ ] `/books/[isbn]` - 書籍詳細
  - 関連ファイル: `novelune/src/app/books/[isbn]/page.tsx`（新規）
- [ ] `/users/[userId]/shelf` - 他ユーザーの本棚閲覧
  - 関連ファイル: `novelune/src/app/users/[userId]/shelf/page.tsx`（新規）

#### コンポーネント
- [ ] `BookSearchForm` - 検索フォーム
  - 関連ファイル: `novelune/src/components/books/BookSearchForm.tsx`（新規）
- [ ] `BookSearchResults` - 検索結果リスト
  - 関連ファイル: `novelune/src/components/books/BookSearchResults.tsx`（新規）
- [ ] `BookshelfList` - 本棚一覧表示
  - 関連ファイル: `novelune/src/components/books/BookshelfList.tsx`（新規）
- [ ] `BookCard` - 書籍カードコンポーネント
  - 関連ファイル: `novelune/src/components/books/BookCard.tsx`（新規）
- [ ] `BookshelfSettings` - 公開範囲設定UI
  - 関連ファイル: `novelune/src/components/books/BookshelfSettings.tsx`（新規）
- [ ] `BookshelfReorder` - 並び順カスタム（ドラッグ&ドロップ）
  - 関連ファイル: `novelune/src/components/books/BookshelfReorder.tsx`（新規）

#### 機能
- [ ] 検索→結果表示→追加フロー
- [ ] 本棚からの削除機能
- [ ] 公開範囲設定（`public`/`private`/`limited`）
  - 関連API: `updateBookshelfVisibility` mutation（新規作成）
- [ ] 並び順カスタマイズ（`bookshelves.order`更新）
  - 関連API: `updateBookshelfOrder` mutation（新規作成）
- [ ] 他ユーザーの本棚閲覧（公開範囲チェック）
  - 関連API: `getPublicBookshelf` query（新規作成）
- [ ] 「このユーザーと話す」ボタン
- [ ] 特定の本を参照してメッセージ送信
- [ ] 追加/削除ボタンの楽観更新とエラートースト
- [ ] docs/DEVELOPMENT.md にUIの動作手順を追記

**DoD**:
- 認証後、検索→本棚追加→一覧→詳細の一連が手動検証可能
- 公開範囲の設定・変更が可能
- 並び順のカスタマイズが可能
- 他ユーザーの本棚からメッセージ送信が可能

**KPI**: 操作3クリック以内、主要操作の体感<150ms

---

### M4: メッセージング（Backend→プロトタイプUI）

**目的**: 小説のような縦書きチャット機能のプロトタイプ実装

**タスク**:

#### バックエンドAPI
- [ ] スキーマ更新確認: `messages.type`（セリフ/地の文）、`messages.referencedBookId`、`messages.editedAt`、`messages.deletedAt`が反映されているか確認
- [ ] `messages.ts` 追加: `send`, `edit`, `delete`, `listConversation(userA,userB)`, `listInbox(user)`
  - 関連ファイル: `novelune/convex/messages.ts`（新規作成）

#### フロントエンドUI
- [ ] UIルート `/messages` と会話ビュー（プロトタイプ）
  - 関連ファイル: `novelune/src/app/messages/page.tsx`（新規）
- [ ] `/messages/[userId]` 会話ビュー
  - 関連ファイル: `novelune/src/app/messages/[userId]/page.tsx`（新規）
- [ ] `MessageList` コンポーネント（縦書き + 横スクロール）
  - 関連ファイル: `novelune/src/components/messages/MessageList.tsx`（新規）
- [ ] `MessageInput` コンポーネント（セリフ/地の文選択）
  - 関連ファイル: `novelune/src/components/messages/MessageInput.tsx`（新規）
- [ ] `MessageItem` コンポーネント（編集・削除対応）
  - 関連ファイル: `novelune/src/components/messages/MessageItem.tsx`（新規）

#### スタイリング
- [ ] 縦書きレンダリング（CSS `writing-mode: vertical-rl`）
- [ ] 横スクロールレイアウト
- [ ] セリフ/地の文の視覚的区別
- [ ] タイポグラフィ最適化（読みやすさ）

#### 機能
- [ ] セリフ/地の文の選択UI（トグルまたはボタン）
- [ ] メッセージの編集・削除機能
- [ ] `by_conversation_sentAt` を利用した時系列取得
- [ ] リアルタイム更新の実装（`useQuery`活用）
- [ ] docs/API/messages.md を作成

**DoD**:
- 2ユーザー間で送受信・リロードなしで反映
- セリフ/地の文を選択して送信可能
- 縦書き + 横スクロールで表示される
- メッセージの編集・削除が可能

**KPI**: 送信→相手反映<=300ms（開発環境）

---

### M5: 品質/仕上げ

**目的**: UXと運用性の底上げ

**タスク**:
- [ ] エラー文言、ローディング/空状態の整備
  - エラーメッセージの日本語化・統一
  - ローディング状態の表示（スケルトンUI等）
  - 空状態のUI（本棚が空、メッセージがない等）
- [ ] 主要APIの引数/戻り値型の明文化
  - `docs/API/*` の型定義を詳細化
- [ ] 既存ドキュメントの差分反映（STATUS/ARCHITECTURE）
  - 実装状況の更新
- [ ] テスト・検証
  - 主要機能の手動検証
  - エッジケースの確認

**DoD**:
- 主要画面で致命的なエラー/不整合なく触れる状態
- エラーメッセージが統一され、ユーザーフレンドリー
- 空状態で適切な案内が表示される

**KPI**: 既知バグ0件、ドキュメント遅延0件、空状態での案内率100%

## 依存関係
- M1→M3: 検索/取得が本棚UIに必須
- M2→M4: ユーザーID解決がメッセージAPIに必須
- M1→M4: ユーザー名/アイコン表示のため `users` 拡張の可能性

