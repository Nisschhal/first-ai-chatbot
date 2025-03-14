import { Id } from "../../convex/_generated/dataModel"

// message role
export type MessageRole = "user" | "assistant"

// message
export interface Message {
  role: MessageRole
  content: string
}

// chatbody
export interface ChatRequestBody {
  messages: Message[]
  newMessage: string
  chatId: Id<"chats">
}

// enum stream message type for BaseStreamMessage
export enum StreamMessageType {
  Token = "token",
  Error = "error",
  Connected = "connected",
  Done = "done",
  ToolStart = "toolStart",
  ToolEnd = "toolEnd",
}

// BaseStreamMessage to inherit/extend upon
export interface BaseStreamMessage {
  type: StreamMessageType
  data: string
}

// interface for all possible stream message types with a body
export interface TokenMessage extends BaseStreamMessage {
  type: StreamMessageType.Token
  token: string
}
export interface ErrorMessage extends BaseStreamMessage {
  type: StreamMessageType.Error
  error: string
}
export interface ConnectedMessage extends BaseStreamMessage {
  type: StreamMessageType.Connected
}
export interface DoneMessage extends BaseStreamMessage {
  type: StreamMessageType.Done
}
export interface ToolStartMessage extends BaseStreamMessage {
  type: StreamMessageType.ToolStart
  tool: string
  input: unknown
}
export interface ToolEndMessage extends BaseStreamMessage {
  type: StreamMessageType.ToolEnd
  tool: string
  output: unknown
}

// stream message type
export type StreamMessage =
  | TokenMessage
  | ErrorMessage
  | ConnectedMessage
  | DoneMessage
  | ToolStartMessage
  | ToolEndMessage
