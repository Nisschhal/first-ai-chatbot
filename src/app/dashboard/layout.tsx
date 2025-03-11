"use client"
import { Authenticated } from "convex/react"
import Header from "@/components/Header"
import { NavigationProvider } from "../../../lib/context/NavigationProvider"
import Sidebar from "@/components/Sidebar"
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationProvider>
      <div className="flex h-screen">
        <Authenticated>
          <Sidebar />
        </Authenticated>

        <div className="flex-1 ">
          <Header />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </NavigationProvider>
  )
}

export default DashboardLayout
