import React, { use } from "react"
import { Button } from "./ui/button"
import { HamIcon, Menu } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { NavigationContext } from "../../lib/context/NavigationProvider"

const Header = () => {
  // get the function from NavigationContext
  const { setIsMobileNavOpen, isMobileNavOpen, closeMobileNav } =
    use(NavigationContext)
  console.log(isMobileNavOpen)
  return (
    <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden text-gray-500 hover:text-gray-600 hover:bg-gray-100/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-semibole bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Chat with an AI Agent
          </div>
        </div>
        {/* Profile Icon */}
        <div className="flex item-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-8 w-8 ring-2 ring-gray-200/50 ring-offset-2 rounded-full transition-shadow hover:ring-gray-300/50",
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
