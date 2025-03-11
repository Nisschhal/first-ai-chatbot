import React from "react"
import { Id } from "../../../../convex/_generated/dataModel"

interface ChatPageProps {
  params: Promise<{ chatId: Id<"chats"> }>
}

const ChatPage = async ({ params }: ChatPageProps) => {
  // from next 15 params needs await
  const { chatId } = await params

  return <div>ChatPage: {chatId}</div>
}

export default ChatPage
