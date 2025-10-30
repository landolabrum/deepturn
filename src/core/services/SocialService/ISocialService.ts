// /webapp/src/core/services/SocialService/ISocialService.ts

/* ───────────────────────── Shared primitives ───────────────────────── */
export type JsonMap = Record<string, any>;

export interface IGOk {
  status: "ok";
  [k: string]: any;
}

/* Reusable “ok” for Twitch as well */
export interface TwitchOk {
  status: "ok";
  [k: string]: any;
}

export interface IGDeviceSession {
  device?: {
    user_agent?: string;
    locale?: string;
    country?: string;
    timezone_offset?: number | string;
    device_settings?: JsonMap;
  };
  session?: {
    mid?: string;
    ig_u_rur?: string;
    ig_www_claim?: string;
    last_login?: string;
  };
}

/* ───────────────────────── Feed (timeline) ───────────────────────── */

export interface IGFeedMediaImage {
  url: string;
  width?: number;
  height?: number;
}

export interface IGFeedMediaVideo {
  url: string;
  width?: number;
  height?: number;
  duration?: number;
}

export type IGMediaType = "photo" | "video" | "carousel";

export interface IGFeedItem {
  id: string;
  code?: string;
  taken_at?: string | number;
  caption?: string;
  like_count?: number;
  comment_count?: number;
  media_type: IGMediaType;
  images?: IGFeedMediaImage[];
  videos?: IGFeedMediaVideo[];
  owner?: {
    pk?: string | number;
    username?: string;
    full_name?: string;
    profile_pic_url?: string;
  };
  [k: string]: any;
}

export interface IGFeedResponse {
  status: "ok" | "error";
  items?: IGFeedItem[];
  next_max_id?: string | null;
  error?: string;
}

/* ───────────────────────── Upload ───────────────────────── */

export type IGUploadKind = "photo" | "video" | "album";

export interface IGUploadResponse {
  status: "ok" | "error";
  media?: {
    id: string;
    code?: string;
    media_type?: IGMediaType;
    caption?: string;
    [k: string]: any;
  };
  error?: string;
}

/* ───────────────────────── List (accounts for a customer) ───────────────────────── */

export interface IGAccountSummary {
  username: string;
  email?: string;
  stripe_id?: string;
  has_session?: boolean;
  last_login?: string;
  proxy?: string | null;
  imap_username?: string;
  [k: string]: any;
}

export interface IGListResponse {
  status: "ok" | "error";
  accounts?: IGAccountSummary[];
  error?: string;
}

/* ───────────────────────── Debug fingerprint ───────────────────────── */

export interface IGDebug {
  status: "ok";
  user_agent?: string;
  locale?: string;
  country?: string;
  timezone_offset?: number | string;
  public_ip?: string;
  [k: string]: any;
}

/* ───────────────────────── Configure / Auth payloads (Instagram) ───────────────────────── */

export interface InstagramConfigureRequest {
  username: string;
  email: string;
  stripe_id: string;
  ig_password: string;
  proxy?: string | null;
  imap_host: string;
  imap_port: number;
  imap_username: string;
  imap_password: string;
  imap_folder?: string;
  imap_tls?: boolean;
}

export interface InstagramAuthenticateRequest {
  username: string;
  email?: string;
  ig_password: string;
  stripe_id: string;
  proxy?: string | null;
  attempt_wall_timeout?: number;
  connect_timeout?: number;
  read_timeout?: number;
  reset_session?: boolean;
  debug?: boolean;
}

export interface InstagramStatusQuery {
  stripe_id: string;
  username: string;
}

/* ───────────────────────── “whoami” / auth envelopes (Instagram) ───────────────────────── */

export interface IGWhoAmI extends IGDeviceSession {
  status: "ok" | "missing_session" | "warning" | "error";
  account?: {
    pk?: string | number;
    username?: string;
    full_name?: string;
    is_private?: boolean;
    profile_pic_url?: string;
    follower_count?: number;
    following_count?: number;
    media_count?: number;
    [k: string]: any;
  };
  username?: string;
  note?: string;
  details?: string;
  error?: string;
}

export interface InstagramAuthResponse extends IGDeviceSession {
  status: "ok" | "error";
  username?: string;
  error?: string;
  details?: string;
  hint?: string;
  actions?: string[];
  whoami?: IGWhoAmI["account"];
  feed?: {
    items: IGFeedItem[];
    next_max_id?: string | null;
  };
  [k: string]: any;
}

/* ───────────────────────── Twitch models (NEW) ───────────────────────── */

export interface TwitchConfigureRequest {
  login: string;
  email?: string;
  stripe_id?: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export interface TwitchAuthUrlResponse {
  status: "ok" | "error";
  login?: string;
  auth_url?: string;
  error?: string;
  hint?: string;
  actions?: string[];
}

export interface TwitchAuthRequest {
  login: string;
  code: string;
  request_timeout?: number;
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url?: string;
  email?: string;
  [k: string]: any;
}

export interface TwitchAuthExchangeResponse {
  status: "ok" | "error";
  login?: string;
  persisted?: boolean;
  saved_at?: string;
  whoami?: TwitchUser;
  feed?: {
    follows: Array<{ id: string; login: string; display_name: string }>;
  };
  error?: string;
  details?: string;
  hint?: string;
  actions?: string[];
}

export interface TwitchWhoAmIResponse {
  status: "ok" | "missing_session" | "warning" | "error";
  login?: string;
  account?: TwitchUser;
  note?: string;
  details?: string;
  actions?: string[];
}

export interface TwitchFeedResponse {
  status: "ok" | "error" | "missing_session";
  items?: Array<{ id: string; login: string; display_name: string } | any>;
  error?: string;
  login?: string;
}

export interface TwitchAccountRow {
  login: string;
  email?: string;
  stripe_id?: string;
  client_id?: string;
  has_session?: boolean;
  expires_at?: string | null;
  updated_at?: string;
  chat_running?: boolean;
}

export interface TwitchListResponse {
  status: "ok" | "error";
  accounts?: TwitchAccountRow[];
  rows?: any[];
  error?: string;
}

export interface TwitchChatStartRequest {
  login: string;
  channel?: string; // defaults to login
}

export interface TwitchChatSendRequest {
  login: string;
  message: string;
  channel?: string; // defaults to login

}

/** Chat events from WS (for your UI if needed) */
export type TwitchChatServerEvent =
  | { kind: "message"; user: string; text: string; channel: string }
  | { kind: "system"; line: string; channel: string }
  | { status: "ok"; login: string; channel: string; auto_started?: boolean; connected?: boolean }
  | { status: "error"; error: string; [k: string]: any };


/* ───────────────────────── Service Interface ───────────────────────── */

export default interface ISocialService {
  /* Instagram */
  instagramConfigure(req: InstagramConfigureRequest): Promise<IGOk>;
  instagramAuthenticate(
    req: InstagramAuthenticateRequest,
    opts?: { auth_proxy?: boolean }
  ): Promise<InstagramAuthResponse>;
  instagramStatus(q: InstagramStatusQuery): Promise<InstagramAuthResponse>;
  instagramLogout(stripe_id: string, username?: string): Promise<IGOk>;
  instagramDebug(opts?: { auth_proxy?: boolean }): Promise<IGDebug>;
  instagramWhoAmI(username: string): Promise<IGWhoAmI>;
  instagramFeed(username: string): Promise<IGFeedResponse>;
  instagramUpload(stripe_id: string, file: File, caption?: string): Promise<IGUploadResponse>;
  instagramList(stripe_id: string): Promise<IGListResponse>;

  /* Twitch */
  twitchConfigure(req: TwitchConfigureRequest): Promise<TwitchOk>;
  twitchAuthUrl(login: string): Promise<TwitchAuthUrlResponse>;
  twitchAuthenticate(req: TwitchAuthRequest): Promise<TwitchAuthExchangeResponse>;
  twitchWhoAmI(login: string): Promise<TwitchWhoAmIResponse>;
  twitchFeed(login: string, limit?: number, target_id?: string): Promise<TwitchFeedResponse>;
  twitchList(stripe_id: string): Promise<TwitchListResponse>;

  twitchChatStart(req: TwitchChatStartRequest): Promise<TwitchOk>;
  twitchChatStop(login: string): Promise<TwitchOk>;
  twitchChatSend(req: TwitchChatSendRequest): Promise<TwitchOk>;
  twitchChatWsUrl(login: string, channel?: string): string;
}
