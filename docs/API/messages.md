# messages モジュール API 仕様（予定）

> スキーマは `messages` テーブルが定義済み。以下のAPIを追加実装予定。

## send（mutation）
- 目的: メッセージ送信。
- 引数:
  - `toUserId: Id<"users">`
  - `content: string`
- 戻り値: 作成されたメッセージ
- 動作:
  - `fromUserId` は認証ユーザーから解決。
  - `sentAt` はサーバー時刻（epoch ms）。

## listConversation（query）
- 目的: 2ユーザー間のメッセージ履歴を時系列で取得。
- 引数:
  - `userA: Id<"users">`, `userB: Id<"users">`
- 戻り値: メッセージ配列
- インデックス: `by_conversation_sentAt(fromUserId, toUserId, sentAt)` を活用。

## listInbox（query）
- 目的: 指定ユーザーの受信スレッドの最新一覧。
- 引数:
  - `userId: Id<"users">`
- 戻り値: 相手ユーザーごとの最新メッセージ概要

## 認可
- 認証必須。`fromUserId`/`toUserId` の整合性をチェック。

