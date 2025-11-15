# データベーススキーマ（Convex）

ソース: `novelune/convex/schema.ts`

## テーブル一覧

- `users`
  - `name: string`
  - `email: string`
  - `image?: string`
  - `authId: string`（Clerkユーザーと連携）
  - `bookshelfVisibility?: "public" | "private" | "limited"`（本棚の公開範囲）
  - インデックス:
    - `by_auth_id(authId)`
    - `by_email(email)`

- `books`
  - `isbn: string`
  - `title: string`
  - `author?: string`
  - `coverUrl?: string`
  - `description?: string`
  - `publishedDate?: string`
  - `publisher?: string`
  - `pageCount?: number`
  - インデックス:
    - `by_isbn(isbn)`

- `bookshelves`
  - `userId: Id<"users">`
  - `bookId: string`（ISBNを直接格納）
  - `order?: number`（並び順、カスタム順序用）
  - インデックス:
    - `by_user_book(userId, bookId)`
    - `by_user_order(userId, order)`

- `messages`
  - `fromUserId: Id<"users">`
  - `toUserId: Id<"users">`
  - `content: string`
  - `type: "dialogue" | "narration"`（セリフ or 地の文）
  - `referencedBookId?: string`（参照された本のISBN）
  - `sentAt: number`（epoch ms）
  - `editedAt?: number`（編集日時、epoch ms）
  - `deletedAt?: number`（削除日時、論理削除用、epoch ms）
  - インデックス:
    - `by_from_to(fromUserId, toUserId)`
    - `by_to(toUserId)`
    - `by_conversation_sentAt(fromUserId, toUserId, sentAt)`

## 設計メモ
- 書籍キャッシュ: 外部APIから取得した書籍情報は `books` に保存し、`bookshelves.bookId`（ISBN）から `books.by_isbn` で解決。
- 参照の一貫性: 将来的に `bookshelves.bookId` を `Id<"books">` に変更する場合はマイグレーション方針が必要（両立期間やバックフィル）。
- メッセージ並び順: `by_conversation_sentAt` により会話ごとの時系列取得を想定。
- 本棚の公開範囲: `users.bookshelfVisibility` で本棚全体の公開範囲を設定（`public`: 公開、`private`: 非公開、`limited`: 特定ユーザーのみ）。
- 本棚の並び順: `bookshelves.order` でカスタム順序を保存。`by_user_order` インデックスで効率的に取得。
- メッセージタイプ: `messages.type` でセリフ（`dialogue`）と地の文（`narration`）を区別。
- メッセージの論理削除: `deletedAt` が設定されているメッセージは削除済みとして扱う。

## サンプル
```json
// books
{
  "isbn": "9784101010014",
  "title": "こころ",
  "author": "夏目漱石",
  "coverUrl": "https://...",
  "description": "..."
}

// bookshelves
{
  "userId": "u_abc123",
  "bookId": "9784101010014"
}
```

