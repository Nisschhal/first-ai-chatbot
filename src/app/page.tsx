import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    // Gradient effect with white full on top but gray with opacity 50 at bottom, making sure behind items are seen which is box background pattern
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 flex items-center justify-center">
      {/* Background pattern with 1px border box */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:6rem_4rem]" />

      <section className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center space-y-10 text-center">
        {/* Hero content */}
        <header className="space-y-6 flex flex-col items-center">
          <h1 className="py-1 text-3xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            AI Chatbot/Agent/Assistant
          </h1>
          <p className="max-w-[600px] text-base text-gray-600 md:text-lg/relaxed xl:text-xl/relaxed ">
            Meet your new AI chat companion that goes beyond conversation - it
            can actually get things done!
            <br />
            <span className="text-gray-400 text-sm">
              - Nischal Puri&apos;s First AI Chatbot
            </span>
            <br />
            <span className="text-gray-400 text-xs">
              Powered by IBM&apos;s WxTools & your favorite LLM&apos;s.
            </span>
          </p>
        </header>

        {/* Auth Buttons */}
        <SignedIn>
          <Link href="/dashboard">
            <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>
        </SignedIn>

        {/* Signed Out button */}
        <SignedOut>
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={"/dashboard"}
            forceRedirectUrl={"/dashboard"}
          >
            <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Sign Up
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </SignInButton>
        </SignedOut>

        {/* ----- Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-8 max-w-3xl mx-auto">
          {[
            { title: "Fast", description: "Read-time streamed response" },
            {
              title: "Modern",
              description: "Next.js 15, Tailwind CSS, Convex, Clerk",
            },
            { title: "Smart", description: "Powered by your favourite LLM's" },
          ].map(({ title, description }) => (
            <div className="text-center" key={title}>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
