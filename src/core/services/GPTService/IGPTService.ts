// IGPTService.ts

export interface GPTMessage {
  role: "user" | "assistant" | "system";
  content: string;
  name?: string; // optional sender name for collaboration
}

export interface GPTPayload {
  uid: string;
  messages: GPTMessage[];
}

export interface GPTReply {
  reply: string;
}

export interface IRemoteAccessResponse {
  status: "success" | "error";
  message: string;
}

export default interface IGPTService {
  getNewChat(uid: string): Promise<{ uid: string; messages: GPTMessage[] }>;
  getChatHistory(uid: string): Promise<{ uid: string; messages: GPTMessage[] }>;
  sendChat(payload: GPTPayload): Promise<GPTReply>;
  listChats(uid: string): Promise<string[]>; // New: list available chats for user
}
