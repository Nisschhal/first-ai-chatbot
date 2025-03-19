import { getConvexClient } from "@/lib/convex"
import {
  ChatRequestBody,
  SSE_DATA_PREFIX,
  SSE_LINE_DELIMITER,
  StreamMessage,
  StreamMessageType,
} from "@/lib/types"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { api } from "../../../../../convex/_generated/api"

// post request for the client
export async function POST(req: Request) {
  try {
    // check authorization
    const { userId } = await auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    // get the request body
    const body = (await req.json()) as ChatRequestBody
    const { messages, newMessage, chatId } = body

    // validate the request body
    if (!chatId || !messages || !newMessage) {
      return new Response("Missing parameters", { status: 400 })
    }

    // store in db convex
    const convexClient = getConvexClient()

    // Create stream with larger queue strategy for better performance
    // tranformer is the function that is called for each chunk of data and modifes it and sends it to the writer for users to receive
    const stream = new TransformStream({}, { highWaterMark: 1024 })

    // Writer for response to hold data as stream
    const writer = stream.writable.getWriter()

    // create response with stream
    const response = new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no", // disable buffering for nginx which is required to sse to work properly
      },
    })

    const startStream = async () => {
      try {
        // Stream will be implemented here
        // send the connection message to frontend
        await sendSSEmessage(writer, {
          type: StreamMessageType.Connected,
        })

        // send user message to convex db
        await convexClient.mutation(api.messages.send, {
          chatId,
          content: newMessage,
        })
        
      } catch (error) {
        console.log("Error in chat API in start streaming: ", error)
        return NextResponse.json(
          {
            error: "Failed to process chat request",
          } as const,
          { status: 500 }
        )
      }
    }

    startStream()

    return response
  } catch (error) {
    console.log("Error in chat API: ", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
      } as const,
      { status: 500 }
    )
  }
}

// Function to send Message to Chat Interface
function sendSSEmessage(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  data: StreamMessage
) {
  // encode text/data
  const encoder = new TextEncoder()

  // write encoded data/message to streame
  return writer.write(
    encoder.encode(
      `${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`
    )
  )
}
