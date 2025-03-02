"use client"
import { Authenticated } from "convex/react"
import React from "react"
import Header from "@/components/Header"
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Authenticated>
        <h1>Sidebar</h1>
      </Authenticated>

      <div className="flex-1 bg-red-50">
        <Header />
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
