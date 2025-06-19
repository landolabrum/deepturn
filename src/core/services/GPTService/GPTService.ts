import { encryptString } from "@webstack/helpers/Encryption";
import environment from "../../environment";
import ApiService from "../ApiService";
import IGPTService, { GPTPayload, GPTReply, GPTMessage } from "./IGPTService";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

export default class GPTService extends ApiService implements IGPTService {
  constructor() {
    super(environment.serviceEndpoints.membership);
  }

  public async getNewChat(uid: string): Promise<{ uid: string; messages: GPTMessage[] }> {
    try {
      const response = await this.get<{ uid: string; messages: GPTMessage[] }>(
        `/api/gpt/new?uid=${uid}`
      );
      return response;
    } catch (error: any) {
      console.error("[GPT ERROR - NEW CHAT]", error);
      throw error;
    }
  }

  public async getChatHistory(uid: string): Promise<{ uid: string; messages: GPTMessage[] }> {
    try {
      const response = await this.get<{ uid: string; messages: GPTMessage[] }>(
        `/api/gpt/history?uid=${uid}`
      );
      return response;
    } catch (error: any) {
      console.error("[GPT ERROR - CHAT HISTORY]", error);
      throw error;
    }
  }

  public async listChats(uid: string): Promise<string[]> {
    try {
      const response = await this.get<string[]>(`/api/gpt/list?uid=${uid}`);
      return response;
    } catch (error: any) {
      console.error("[GPT ERROR - LIST CHATS]", error);
      throw error;
    }
  }

  public async sendChat(payload: GPTPayload): Promise<GPTReply> {
    try {
      const response = await this.post<GPTPayload, GPTReply>(`/api/gpt/current`, payload);
      return response;
    } catch (error: any) {
      console.error("[GPT ERROR - SEND CHAT]", error);
      throw error;
    }
  }
}
