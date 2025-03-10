import React, { use } from "react"
import { NavigationContext } from "../../lib/context/NavigationProvider"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"

const Sidebar = () => {
  const { isMobileNavOpen, setIsMobileNavOpen, closeMobileNav } =
    use(NavigationContext)

  const router = useRouter()

  // TODO
  // const createChat = useQuery(api.chat.create())
  // const newChat = useMutation(createChat)
  // const deleteChat = useMutation(deleteChat)

  const handleNewChatClick = () => {
    // newChat()
    // router.push('/newchat')
  }
  return (
    <>
      {/* Background Overlay for Mobile Nav */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={closeMobileNav}
        />
      )}
      {/* SideBar */}
      <div
        className={cn(
          "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 w-72 bg-gray-50/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex flex-col",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200/50">
          <Button
            onClick={() => handleNewChatClick()}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm hover:shadow transition-all duration-200"
          >
            <PlusIcon className="mr-2 w-4 h-4" /> New Chat
          </Button>
        </div>
        {/* Content: List of Past Chats */}
        <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-gray-200/50 scrollbar-track-gray-50">
          {/* {chats.map((chat) => (<ChatRow key={chat} onDelete={handleDeleteChat} />))} */}
        </div>
      </div>
    </>
  )
}

export default Sidebar
