import React, { use } from "react"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { NavigationContext } from "../../lib/context/NavigationProvider"
import { Button } from "./ui/button"
import { Trash } from "lucide-react"

const ChatRow = ({
  chat,
  onDelete,
}: {
  chat: Doc<"chats">
  onDelete: (id: Id<"chats">) => void
}) => {
  const router = useRouter()
  const { isMobileNavOpen, setIsMobileNavOpen, closeMobileNav } =
    use(NavigationContext)

  // go the clicked chat
  const handleChatClick = () => {
    router.push(`/dashboard/chat/${chat._id}`)
    closeMobileNav()
  }
  return (
    <div
      className="group rounded-xl border border-gray-200/30 bg-white/50 backdrop-blur-sm hover:bg-white/80 
        cursor-pointer  transition-all duration-200 shadow-sm hover:shadow-md"
      onClick={handleChatClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          Chat
          {/* delete button with icons */}
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(chat._id)
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
          </Button>
        </div>
        {/* last message */}
      </div>
    </div>
  )
}

export default ChatRow
