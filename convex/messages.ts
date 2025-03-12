import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// get all the message of the given chatId
export const getmessages = query({
  // name of the table, chats to get id
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect()
    return messages
  },
})

// send message || save message to db with in certain chat: chatId
export const send = mutation({
  args: { chatId: v.id("chats"), content: v.string() },
  handler: async (ctx, args) => {
    // Save the user message with preserved newlines
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content,
      role: "user",
      createdAt: Date.now(),
    })
    return messageId
  },
})
// store message of llm
export const store = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  },
  handler: async (ctx, args) => {
    // Save the message with preserved newlines
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content.replace(/\n/g, "\\n").replace(/\\/g, "\\\\"),
      role: args.role,
      createdAt: Date.now(),
    })
    return messageId
  },
})
// get the last message of the chat
export const getLastMessage = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const lastMessage = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .first()

    return lastMessage
  },
})
