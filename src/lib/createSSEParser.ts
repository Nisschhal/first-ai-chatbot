// import {
//   SSE_DONE_MESSAGE,
//   StreamMessage,
//   SSE_DATA_PREFIX,
//   StreamMessageType,
// } from "./types"

// // Create a function to parse SSE data
// export const createSSEParse = () => {
//   let buffer = " "

//   const parser = (chunk: string): StreamMessage[] => {
//     // Combine buffer with new chunk and split into line
//     const line = (buffer + chunk).split("\n")
//     // Save last potentially incomplete line
//     buffer = line.pop() || " "

//     return line
//       .map((line) => {
//         const trimmed = line.trim()
//         // if the line is `data:` then it's a start of a message from the server/llm
//         if (!trimmed || !trimmed.startsWith(SSE_DATA_PREFIX)) return null
//         const data = trimmed.substring(SSE_DATA_PREFIX.length) // get the data
//         if (data === SSE_DONE_MESSAGE) {
//           return {
//             type: StreamMessageType.Done,
//           }
//         }
//         try {
//           const parsed = JSON.parse(data) as StreamMessage
//           return Object.values(StreamMessageType).includes(parsed.type)
//             ? parsed
//             : null
//         } catch (error) {
//           // if there's an error, return an error message
//           return {
//             type: StreamMessageType.Error,
//             error,
//           }
//         }
//       })
//       .filter((msg): msg is StreamMessage => msg !== null)
//   }
//   return {
//     parser,
//   }
// }

import {
  SSE_DONE_MESSAGE,
  StreamMessage,
  SSE_DATA_PREFIX,
  StreamMessageType,
} from "./types"

// Factory function to create an SSE parser
export const createSSEParser = () => {
  // Buffer to hold incomplete lines between chunks
  let buffer = ""

  // The main parser function: takes a chunk of SSE data and returns parsed messages
  const parse = (chunk: string): StreamMessage[] => {
    // Combine leftover buffer with new chunk and split into lines
    const line = (buffer + chunk).split("\n")
    // Save the last (possibly incomplete) line back to buffer for next time
    buffer = line.pop() || " "

    // Process each complete line
    return (
      line
        .map((line) => {
          const trimmed = line.trim()
          // Ignore empty lines or lines that don't start with the SSE data prefix
          if (!trimmed || !trimmed.startsWith(SSE_DATA_PREFIX)) return null
          // Extract the data after the prefix (e.g., after "data:")
          const data = trimmed.substring(SSE_DATA_PREFIX.length)
          // If the data is the special done message, return a Done message
          if (data === SSE_DONE_MESSAGE) {
            return {
              type: StreamMessageType.Done,
            }
          }
          try {
            // Try to parse the data as JSON and cast to StreamMessage
            const parsed = JSON.parse(data) as StreamMessage
            // Only return if the type is a valid StreamMessageType
            return Object.values(StreamMessageType).includes(parsed.type)
              ? parsed
              : null
          } catch (error) {
            // If parsing fails, return an error message
            return {
              type: StreamMessageType.Error,
              error,
            }
          }
        })
        // Filter out any nulls (invalid or ignored lines)
        .filter((msg): msg is StreamMessage => msg !== null)
    )
  }

  // Return the parser function so it can be used elsewhere
  return {
    parse,
  }
}
