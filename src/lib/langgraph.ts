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

import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
} from "@langchain/langgraph"

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts"

import SYSTEM_MESSAGE from "../../constants/systemMessage"
import {
  AIMessage,
  BaseMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages"

// Trim the message to manage conversation history
const trimmer = trimMessages({
  maxTokens: 10, // last ten message
  strategy: "last", // last message
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
})

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

// Worflow

const createWorkflow = () => {
  const model = initialiseMode()

  const stateGraph = new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
      // Create the system message content
      const systemContent = SYSTEM_MESSAGE

      // Create the prompt template with system message and messages placeholder
      const promptTemplate = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemContent, {
          cache_control: { type: "ephemeral" }, //  Set a cache breakpoint (max number of breakpoints is 4)
        }),
        new MessagesPlaceholder("messages"),
      ])

      // Trim the message to manage conversation history
      const trimmedMessage = await trimmer.invoke(state.messages)

      // Format the prompt with the current message
      const prompt = await promptTemplate.invoke({ message: trimmedMessage })

      // Get response from the model
      const response = await model.invoke(prompt)

      // Return the response
      return { messages: [response] }
    })
    .addEdge(START, "agent")
    .addNode("tools", toolNode)
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent")

  return stateGraph
}

export async function submitQuestion(messages: BaseMessage[], chatId: string) {}

// Define the function that determines whether to continue or not
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages
  const lastMessage = messages[messages.length - 1] as AIMessage

  // If the llms makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools"
  }

  // If the last message is a tool message, route back to agent
  if (lastMessage.content && lastMessage._getType() === "tool") {
    return "agent"
  }

  // Otherwise, we stop (reply to the user)
  return END
}
