import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// create a new chat
export const createChat = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    // auth check
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not Authenticated")
    }

    // create new chat in db
    const chat = await ctx.db.insert("chats", {
      title: args.title,
      userId: identity.subject, // token.sub => user Id
      createdAt: Date.now(),
    })
    return chat
  },
})

// get the chat by id and get all the messages of the correspoinding chat and check if chat or message exist and also if chat is of the auth user id and delete all the mesaage and chat
export const deleteChat = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    // auth check
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not Authenticated")
    }

    const chat = await ctx.db.get(args.id)

    if (!chat || chat.userId !== identity.subject) {
      throw new Error("Unauthorized")
    }
    // delete all messages of that chat id
    const messages = await ctx.db.query("messages").collect()

    // loop and delete all message of that chat
    for (const message of messages) {
      await ctx.db.delete(message._id)
    }

    // delete the chat
    await ctx.db.delete(args.id)
  },
})

// get all the chats of the auth user id
export const listChats = query({
  handler: async (ctx) => {
    // auth check
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not Authenticated")
    }

    // get all the chats of the auth user id
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect()

    return chats
  },
})
