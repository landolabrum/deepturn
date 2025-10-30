import ApiService from "../ApiService";
import environment from "~/src/core/environment";
import ISocialService, {
  IGOk,
  IGWhoAmI,
  IGDebug,
  IGFeedResponse,
  IGUploadResponse,
  IGListResponse,
  InstagramConfigureRequest,
  InstagramAuthenticateRequest,
  InstagramAuthResponse,
  InstagramStatusQuery,
  TwitchConfigureRequest,
  TwitchAuthUrlResponse,
  TwitchAuthRequest,
  TwitchAuthExchangeResponse,
  TwitchWhoAmIResponse,
  TwitchFeedResponse,
  TwitchListResponse,
  TwitchChatStartRequest,
  TwitchChatSendRequest,
  TwitchOk,
} from "./ISocialService";

export default class SocialService extends ApiService implements ISocialService {
constructor() {
    // Prefer explicit social endpoint, else derive from apiBase and ensure /usage/social suffix
    const root =
      (environment as any).serviceEndpoints?.social ??
      (environment as any).apiBase ??
      "";

    // normalize: ensure we end up at .../usage/social
    const ensureSocial = (u: string) => {
      const clean = (u || "").replace(/\/+$/, ""); // strip trailing slash
      if (/\/usage\/social$/.test(clean)) return clean;
      return `${clean}/usage/social`;
    };

    const base = ensureSocial(root);
    super(base);
  }

  /* ───────── Instagram ───────── */

  public async instagramConfigure(payload: InstagramConfigureRequest): Promise<IGOk> {
    return this.post("instagram/configure", payload);
  }

  public async instagramAuthenticate(
    payload: InstagramAuthenticateRequest,
    opts?: { auth_proxy?: boolean }
  ): Promise<InstagramAuthResponse> {
    if (!payload?.username) throw new Error("username is required");
    const path = "instagram/authenticate" + (opts?.auth_proxy ? "?auth_proxy=1" : "");
    return this.post(path, payload);
  }

  public async instagramWhoAmI(username: string): Promise<IGWhoAmI> {
    if (!username) throw new Error("username is required");
    return this.get(`instagram/whoami?username=${encodeURIComponent(username)}`);
  }

  public async instagramFeed(username: string): Promise<IGFeedResponse> {
    if (!username) throw new Error("username is required");
    return this.get(`instagram/feed?username=${encodeURIComponent(username)}`);
  }

  public async instagramUpload(
    stripe_id: string,
    file: File,
    caption?: string
  ): Promise<IGUploadResponse> {
    if (!stripe_id || !file) throw new Error("stripe_id and file are required");
    const form = new FormData();
    form.append("stripe_id", stripe_id);
    form.append("file", file);
    if (caption) form.append("caption", caption);
    return this.post("instagram/upload", form);
  }

  public async instagramLogout(stripe_id: string, username = ""): Promise<IGOk> {
    if (!stripe_id) throw new Error("stripe_id is required");
    return this.post("instagram/logout", { stripe_id, username });
  }

  public async instagramList(stripe_id: string): Promise<IGListResponse> {
    if (!stripe_id) throw new Error("stripe_id is required");
    return this.get(`instagram/list?stripe_id=${encodeURIComponent(stripe_id)}`);
  }

  public async instagramStatus(q: InstagramStatusQuery): Promise<InstagramAuthResponse> {
    const { stripe_id, username } = q || ({} as InstagramStatusQuery);
    if (!stripe_id || !username) throw new Error("stripe_id and username are required");

    try {
      const who = await this.instagramWhoAmI(username);
      if ((who as any)?.status === "ok" && (who as any)?.account?.username) {
        return {
          status: "ok",
          username: (who as any).account.username,
          source: "whoami",
          whoami: who,
        } as any;
      }
    } catch {}

    try {
      const lst = await this.instagramList(stripe_id);
      const found = lst?.accounts?.find?.((a: any) => a.username === username);
      if (found) {
        return {
          status: found.has_session ? "ok" : "error",
          username: found.username,
          has_session: !!found.has_session,
          source: "list",
        } as any;
      }
    } catch {}

    return { status: "error", username, error: "not_found", detail: "No session or account found" } as any;
  }

  public async instagramDebug(): Promise<IGDebug> {
    return this.get("instagram/debug_fingerprint");
  }

  /* ───────── Twitch ───────── */

  public async twitchConfigure(payload: TwitchConfigureRequest): Promise<TwitchOk> {
    return this.post("twitch/configure", payload);
  }

  public async twitchAuthUrl(login: string): Promise<TwitchAuthUrlResponse> {
    if (!login) throw new Error("login is required");
    return this.get(`twitch/auth_url?login=${encodeURIComponent(login)}`);
  }

  public async twitchAuthenticate(payload: TwitchAuthRequest): Promise<TwitchAuthExchangeResponse> {
    if (!payload?.login || !payload?.code) throw new Error("login and code are required");
    return this.post("twitch/authenticate", payload);
  }

  public async twitchWhoAmI(login: string): Promise<TwitchWhoAmIResponse> {
    if (!login) throw new Error("login is required");
    return this.get(`twitch/whoami?login=${encodeURIComponent(login)}`);
  }

  public async twitchFeed(login: string, limit = 6, target_id?: string): Promise<TwitchFeedResponse> {
    if (!login) throw new Error("login is required");
    const p = new URLSearchParams({ login, limit: String(limit) });
    if (target_id) p.set("target_id", target_id);
    return this.get(`twitch/feed?${p.toString()}`);
  }

  public async twitchList(stripe_id: string): Promise<TwitchListResponse> {
    if (!stripe_id) throw new Error("stripe_id is required");
    return this.get(`twitch/list?stripe_id=${encodeURIComponent(stripe_id)}`);
  }

  public async twitchChatStart(req: TwitchChatStartRequest): Promise<TwitchOk> {
    if (!req?.login) throw new Error("login is required");
    return this.post("twitch/chat/start", req);
  }

  public async twitchChatStop(login: string): Promise<TwitchOk> {
    if (!login) throw new Error("login is required");
    return this.post("twitch/chat/stop", { login });
  }

  public async twitchChatSend(req: TwitchChatSendRequest): Promise<TwitchOk> {
    if (!req?.login || !req?.channel || !req?.message)
      throw new Error("login, channel and message are required");
    return this.post("twitch/chat/send", req);
  }

  public twitchChatWsUrl(login: string, channel?: string): string {
    if (!login) throw new Error("login is required");

    const base =
      (environment as any).serviceEndpoints?.social ||
      (environment as any).serviceEndpoints?.stream ||
      (environment as any).apiBase ||
      "";

    const toWs = (u: string) =>
      u.startsWith("https://") ? u.replace("https://", "wss://")
      : u.startsWith("http://") ? u.replace("http://", "ws://")
      : u;

    const root = toWs(base.endsWith("/") ? base.slice(0, -1) : base);
    const p = new URLSearchParams({ login });
    if (channel) p.set("channel", channel);
    return `${root}/twitch/chat/ws?${p.toString()}`;
  }
}
