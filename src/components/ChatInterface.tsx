"use client"

import { useState } from "react"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

interface ChatInterfaceProps {
  chatId: Id<"chats">
  initalMessage: Doc<"messages">[]
}
const ChatInterface = ({ chatId, initalMessage }: ChatInterfaceProps) => {
  // state for messages, input and loading
  const [messages, setMessages] = useState<Doc<"messages">[]>(initalMessage)

  const [input, setInput] = useState<string>("")

  const [isLoading, setLoading] = useState(false)

  // streamResponse
  const [streamResponse, setStreamResponse] = useState<string>("")

  // handle prompt
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    // after work is done reset everything
    setLoading(true)
    setInput("")
    setStreamResponse("")
  }
  return (
    <main className="flex-1 flex flex-col h-[calc(100vh-theme(spacing.16))]">
      {/* Messages container */}
      <section className=" flex-1 overflow-y-auto bg-red-50 p-2 md:p-0"></section>

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
