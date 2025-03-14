"use client"

import { useEffect, useRef, useState } from "react"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { ChatRequestBody } from "@/lib/types"

interface ChatInterfaceProps {
  chatId: Id<"chats">
  initalMessage: Doc<"messages">[]
}
const ChatInterface = ({ chatId, initalMessage }: ChatInterfaceProps) => {
  // state for user messages, input and loading
  const [messages, setMessages] = useState<Doc<"messages">[]>(initalMessage)

  const [input, setInput] = useState<string>("")

  const [isLoading, setLoading] = useState(false)

  // streamResponse from server/ai
  const [streamResponse, setStreamResponse] = useState<string>("")

  // MessageEnd Ref
  const messageEndRef = useRef<HTMLDivElement>(null)

  // handle prompt
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // trim the user input
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    // after work is done reset everything
    setLoading(true)
    setInput("")
    setStreamResponse("")

    // Optimistic message for better UX, add user input immediately on interface as user hit enter
    const optimisticUserMessage: Doc<"messages"> = {
      _id: crypto.randomUUID().toString(),
      chatId,
      content: trimmedInput,
      role: "user",
      createdAt: Date.now(),
    } as Doc<"messages">

    setMessages((prev) => [...prev, optimisticUserMessage])

    // Track compelete response from the server before saving to db
    const isResponseCompelete = false

    // Start streaming response
    try {
      // prepare request body
      const requestBody: ChatRequestBody = {
        messages: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        newMessage: trimmedInput,
        chatId,
      }

      // Initialize SSE connections
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      // Check for response errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error("No response body")
      }

      // --- -Handle Stream Response
      // Extract the response data and hanle the stream response
      const data = await response.json()
      const streamResponse = data.message
    } catch (error) {
      console.error("Error sending message", error)
      // Remove the optimistic user message if there was an error
      setMessages((prev) =>
        prev.filter((message) => message._id !== optimisticUserMessage._id)
      )

      // show the error message to user instead of streamed Response
      setStreamResponse("error")
    } finally {
      setLoading(false)
    }
  }

  // move the view to message end when ever message is added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" })
  }, [messages, streamResponse])

  return (
    <main className="flex-1 flex flex-col h-[calc(100vh-theme(spacing.16))]">
      {/* Messages container */}
      <section className=" flex-1 overflow-y-auto bg-red-50 p-2 md:p-0">
        <div>
          {/* Message */}
          {messages.map((message, index) => (
            <div
              key={message._id}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              {message.content}
            </div>
          ))}

          {/* Message End Part*/}
          <div ref={messageEndRef} />
        </div>
      </section>

      {/* Input form */}
      <footer className="border-t bg-white p-2">
        <form onSubmit={handleSubmit} className=" mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI Agent..."
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-gray-50 placeholder:text-gray-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`absolute right-1.5 rounded-xl h-9 w-9 p-0 flex items-center justify-center transition-all ${
                input.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <ArrowRight />
            </Button>
          </div>
        </form>
      </footer>
    </main>
  )
}

export default ChatInterface
