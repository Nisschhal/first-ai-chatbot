import React from "react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getConvexClient } from "@/lib/convex"
import { api } from "../../../../../convex/_generated/api"
import ChatInterface from "@/components/ChatInterface"

interface ChatPageProps {
  params: Promise<{ chatId: Id<"chats"> }>
}

const ChatPage = async ({ params }: ChatPageProps) => {
  // from next 15 params needs await
  const { chatId } = await params

  // check auth
  const { userId } = await auth()

  if (!userId) return redirect("/")

  try {
    // get convex client and fetch chat and message
    const convexClient = getConvexClient()

    // get messages
    const initalMessage = await convexClient.query(api.messages.getmessages, {
      chatId,
    })

    return (
      <div className="flex-1 overflow-hidden">
        <ChatInterface chatId={chatId} initalMessage={initalMessage} />
      </div>
    )
  } catch (error) {
    console.error("🔥 Error while loading chat", error)
    redirect("/")
  }
}

export default ChatPage
