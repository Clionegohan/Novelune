import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    authId: v.string(),
  }).index("by_auth_id", ["authId"]),

  books: defineTable({
    isbn: v.string(),
    title: v.string(),
    author: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    publishedDate: v.optional(v.string()),
  }).index("by_isbn", ["isbn"]),

  bookshelves: defineTable({
    userId: v.id("users"),
    bookId: v.id("books"),
    status: v.union(
        v.literal("reading"), 
        v.literal("completed"), 
        v.literal("dropped"), 
        v.literal("want_to_read")),
  }).index("by_user_book", ["userId", "bookId"]),

  message: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    content: v.string(),
    sentAt: v.number(),
  }).index("by_from_to", ["fromUserId", "toUserId"]),

})
