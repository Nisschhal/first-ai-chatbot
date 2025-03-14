import { getConvexClient } from "@/lib/convex"
import { ChatRequestBody } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

// post request for the client
export async function POST(req: Request) {
  // check authorization
  const { userId } = await auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  // get the request body
  const body = (await req.json()) as ChatRequestBody
  const { messages, newMessage, chatId } = body

  // store in db convex
  const convexClient = getConvexClient()

  // Create stream with larger queue strategy for better performance
  // tranformer is the function that is called for each chunk of data and modifes it and sends it to the writer
  const stream = new TransformStream({}, { highWaterMark: 1024 })
  const writer = stream.writable.getWriter()

  // validate the request body
  if (!chatId || !messages || !newMessage) {
    return new Response("Missing parameters", { status: 400 })
  }
}
