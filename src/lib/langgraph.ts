// AI STUFFS

// import { ChatAnthropic } from "@langchain/anthropic"

// // initial model

// const initModel = async () => {
//   // TODO: Add initial model
//   const model = new ChatAnthropic({
//     model: "",
//   })
// }

import { ChatOpenAI } from "@langchain/openai"
import wxflows from "@wxflows/sdk/langchain"
import { ToolNode } from "@langchain/langgraph/prebuilt"

// Connect to wxflows
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT!,
  apikey: process.env.WXFLOWS_APIKEY!,
})

//Retrive the tools
const tools = await toolClient.lcTools
const toolNode = new ToolNode(tools)

const initialiseMode = () => {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7, // Controls the randomness of the model's output; higher is more random and creative, lower is more deterministic
    maxTokens: 4096, // Number of tokens to generate in the completion
    streaming: true, // SSE streaming, Allows the model to generate its output incrementally, which is useful for streaming responses
    callbacks: [
      {
        handleLLMStart: async () => {
          console.log("LLM start")
        },
        handleLLMEnd: async (output) => {
          console.log(JSON.stringify(output, null, 2))
        },
        handleLLMError: (error: Error) => {
          console.log("LLM error", error)
        },
      },
    ],
  }).bindTools(tools)

  return model
}
