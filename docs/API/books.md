# books モジュール API 仕様

Convex モジュール: `novelune/convex/books.ts`

注意: 外部API呼び出し（Google Books 等）は未実装でモックを返しています。今後は Action 化して実装します。

## addBookToShelf（mutation）
- 目的: 指定ユーザーの本棚に ISBN の本を追加。存在しない本は外部APIから取得して `books` にキャッシュ作成（現状はモック）。
- 引数:
  - `isbn: string`
  - `userId: Id<"users">`
- 戻り値: 生成された `bookshelves` ドキュメントID
- 失敗:
  - 既に登録済みの場合: `Error("この本は既に本棚にあります")`
- インデックス依存:
  - `bookshelves.by_user_book(userId, bookId)`
  - `books.by_isbn(isbn)`

使用例（フロント）:
```tsx
const add = useMutation(api.books.addBookToShelf);
await add({ isbn: "9784101010014", userId });
```

## removeBookFromShelf（mutation）
- 目的: 指定ユーザーの本棚から ISBN の本を削除。
- 引数:
  - `isbn: string`
  - `userId: Id<"users">`
- 戻り値: なし（void）
- 失敗:
  - 未登録の場合: `Error("この本は本棚にありません")`
- インデックス依存:
  - `bookshelves.by_user_book(userId, bookId)`

使用例:
```tsx
const remove = useMutation(api.books.removeBookFromShelf);
await remove({ isbn: "9784101010014", userId });
```

## getUserBookshelf（query）
- 目的: ユーザーの本棚一覧を取得。各エントリに `books` の詳細を付与。
- 引数:
  - `userId: Id<"users">`
- 戻り値: `Array<{ _id, userId, bookId: string, book?: Book | null }>`
- 備考: `book` は `books.by_isbn(isbn)` で検索。

使用例:
```tsx
const shelf = useQuery(api.books.getUserBookshelf, { userId });
```

## getBook（query）
- 目的: ISBN に対応する `books` レコードを1件取得。
- 引数:
  - `isbn: string`
- 戻り値: `Book | null`

## searchBooks（query）
- 目的: 書籍検索（外部API）。現状はモックで1件返却。
- 引数:
  - `searchTerm: string`
  - `author?: string`
- 戻り値: `Array<BookLike>`（ISBN含む軽量データ）
- 今後の設計:
  - Convex Action として外部APIを呼び出し → 結果を必要に応じて `books` にキャッシュ。
  - レート制限/エラーハンドリング/タイムアウトを実装。

## モデル（抜粋）
```ts
// books
{
  isbn: string,
  title: string,
  author?: string,
  coverUrl?: string,
  description?: string,
  publishedDate?: string,
  publisher?: string,
  pageCount?: number,
}

// bookshelves
{
  userId: Id<"users">,
  bookId: string, // ISBN
}
```

## 既知の課題/注意点
- 外部API呼び出しは未実装。モックのまま本棚に追加される。
- `bookId` は ISBN を直接保持する設計（現状踏襲）。将来的に `books` の _id 参照へ変更する場合は移行計画が必要。
- バリデーション/正規化（ISBN-10/13、ハイフン除去等）は未対応。

