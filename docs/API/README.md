# API ドキュメント（Convex）

本プロジェクトのサーバーサイドAPIは Convex 関数として実装されます（本ドキュメントは `main` に存在する実装を基準に記載）。

## モジュール一覧
- `books`（実装済み / 一部モック）
  - `addBookToShelf`（mutation）
  - `removeBookFromShelf`（mutation）
  - `getUserBookshelf`（query）
  - `getBook`（query）
  - `searchBooks`（query, 外部APIは未実装）
- `users`（未実装）
- `messages`（未実装／仕様予定）

各APIの仕様はモジュール別ドキュメントを参照してください。

- [books API](./books.md)

## 利用方法（フロントエンド）
- 認証下で `ConvexProviderWithClerk` を使用。`useQuery`/`useMutation` または `preloadQuery` で呼び出します。
- 例：
  ```tsx
  import { useQuery, useMutation } from "convex/react";
  import { api } from "@/convex/_generated/api";

  const shelf = useQuery(api.books.getUserBookshelf, { userId });
  const add = useMutation(api.books.addBookToShelf);
  ```
