import React from "react";
import { getService } from "@webstack/common";
import ISocialService, {
  TwitchOk,
  TwitchConfigureRequest,
  TwitchAuthUrlResponse,
  TwitchAuthRequest,
  TwitchAuthExchangeResponse,
  TwitchWhoAmIResponse,
  TwitchFeedResponse,
  TwitchListResponse,
  TwitchChatStartRequest,
  TwitchChatSendRequest,
  TwitchChatServerEvent,
} from "~/src/core/services/SocialService/ISocialService";

type TwAction =
  | "configure"
  | "getAuthUrl"
  | "authenticate"
  | "whoami"
  | "feed"
  | "list"
  | "chatStart"
  | "chatStop"
  | "chatSend"
  | "chatConnect"
  | "chatDisconnect";

type BoolMap = Partial<Record<TwAction, boolean>>;
type ErrMap = Partial<Record<TwAction, string | null>>;

export type UseTwitch = {
  loading: BoolMap;
  error: ErrMap;
  lastConfigured?: TwitchOk;
  lastAuthUrl?: TwitchAuthUrlResponse;
  lastAuth?: TwitchAuthExchangeResponse;
  lastWhoAmI?: TwitchWhoAmIResponse;
  lastFeed?: TwitchFeedResponse;
  lastList?: TwitchListResponse;

  chatConnected: boolean;
  chatChannel?: string;
  chatEvents: TwitchChatServerEvent[];

  configure(payload: TwitchConfigureRequest): Promise<TwitchOk>;
  getAuthUrl(login: string): Promise<TwitchAuthUrlResponse>;
  authenticate(payload: TwitchAuthRequest): Promise<TwitchAuthExchangeResponse>;
  whoami(login: string): Promise<TwitchWhoAmIResponse>;
  feed(login: string, limit?: number, target_id?: string): Promise<TwitchFeedResponse>;
  list(stripe_id: string): Promise<TwitchListResponse>;

  chatStart(req: TwitchChatStartRequest): Promise<TwitchOk>;
  chatStop(login: string): Promise<TwitchOk>;
  chatSend(req: TwitchChatSendRequest): Promise<TwitchOk>;

  chatConnect(login: string, channel?: string): Promise<void>;
  chatDisconnect(): Promise<void>;
  chatSay(message: string, channelOverride?: string): Promise<TwitchOk>;
  clearChat(): void;

  resetError(action?: TwAction): void;
  resetAll(): void;
  abort(action?: TwAction): void;
};

const useTwitch = (): UseTwitch => {
  const socialService = React.useMemo(
    () => getService<ISocialService>("ISocialService"),
    []
  );

  const [loading, setLoading] = React.useState<BoolMap>({});
  const [error, setError] = React.useState<ErrMap>({});

  const [lastConfigured, setLastConfigured] = React.useState<TwitchOk>();
  const [lastAuthUrl, setLastAuthUrl] = React.useState<TwitchAuthUrlResponse>();
  const [lastAuth, setLastAuth] = React.useState<TwitchAuthExchangeResponse>();
  const [lastWhoAmI, setLastWhoAmI] = React.useState<TwitchWhoAmIResponse>();
  const [lastFeed, setLastFeed] = React.useState<TwitchFeedResponse>();
  const [lastList, setLastList] = React.useState<TwitchListResponse>();

  const [chatConnected, setChatConnected] = React.useState(false);
  const [chatChannel, setChatChannel] = React.useState<string | undefined>();
  const [chatEvents, setChatEvents] = React.useState<TwitchChatServerEvent[]>([]);

  const ctrls = React.useRef<Partial<Record<TwAction, AbortController>>>({});

  const run = React.useCallback(
    async <T,>(action: TwAction, fn: (signal?: AbortSignal) => Promise<T>): Promise<T> => {
      ctrls.current[action]?.abort?.();
      const controller = new AbortController();
      ctrls.current[action] = controller;

      setLoading((m) => ({ ...m, [action]: true }));
      setError((m) => ({ ...m, [action]: null }));

      try {
        const out: T = await fn(controller.signal);
        return out;
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError((m) => ({ ...m, [action]: e?.message || "Unknown error" }));
        }
        throw e;
      } finally {
        setLoading((m) => ({ ...m, [action]: false }));
        delete ctrls.current[action];
      }
    },
    []
  );

  const abort = React.useCallback((action?: TwAction) => {
    if (action) {
      ctrls.current[action]?.abort?.();
      delete ctrls.current[action];
      return;
    }
    Object.values(ctrls.current).forEach((c) => c?.abort?.());
    ctrls.current = {};
  }, []);

  const configure = React.useCallback(
    async (payload: TwitchConfigureRequest): Promise<TwitchOk> => {
      const res = await run<TwitchOk>("configure", () => socialService.twitchConfigure(payload));
      setLastConfigured(res);
      return res;
    },
    [run, socialService]
  );

  const getAuthUrl = React.useCallback(
    async (login: string): Promise<TwitchAuthUrlResponse> => {
      const res = await run<TwitchAuthUrlResponse>("getAuthUrl", () => socialService.twitchAuthUrl(login));
      setLastAuthUrl(res);
      return res;
    },
    [run, socialService]
  );

  const authenticate = React.useCallback(
    async (payload: TwitchAuthRequest): Promise<TwitchAuthExchangeResponse> => {
      const res = await run<TwitchAuthExchangeResponse>("authenticate", () => socialService.twitchAuthenticate(payload));
      setLastAuth(res);

      if (res?.status === "ok") {
        if (res.whoami) {
          const who: TwitchWhoAmIResponse = { status: "ok", login: payload.login, account: res.whoami };
          setLastWhoAmI(who);
        }
        if (res.feed?.follows) {
          const f: TwitchFeedResponse = { status: "ok", items: res.feed.follows };
          setLastFeed(f);
        }
      }
      return res;
    },
    [run, socialService]
  );

  const whoami = React.useCallback(
    async (login: string): Promise<TwitchWhoAmIResponse> => {
      const res = await run<TwitchWhoAmIResponse>("whoami", () => socialService.twitchWhoAmI(login));
      setLastWhoAmI(res);
      return res;
    },
    [run, socialService]
  );

  const feed = React.useCallback(
    async (login: string, limit?: number, target_id?: string): Promise<TwitchFeedResponse> => {
      const res = await run<TwitchFeedResponse>("feed", () => socialService.twitchFeed(login, limit, target_id));
      setLastFeed(res);
      return res;
    },
    [run, socialService]
  );

  const list = React.useCallback(
    async (stripe_id: string): Promise<TwitchListResponse> => {
      const res = await run<TwitchListResponse>("list", () => socialService.twitchList(stripe_id));
      setLastList(res);
      return res;
    },
    [run, socialService]
  );

  const chatStart = React.useCallback(
    async (req: TwitchChatStartRequest): Promise<TwitchOk> => {
      const res = await run<TwitchOk>("chatStart", () => socialService.twitchChatStart(req));
      return res;
    },
    [run, socialService]
  );

  const chatStop = React.useCallback(
    async (login: string): Promise<TwitchOk> => {
      const res = await run<TwitchOk>("chatStop", () => socialService.twitchChatStop(login));
      return res;
    },
    [run, socialService]
  );

  const chatSend = React.useCallback(
    async (req: TwitchChatSendRequest): Promise<TwitchOk> => {
      // HTTP send shape is { login, message }
      const res = await run<TwitchOk>("chatSend", () => socialService.twitchChatSend(req));
      return res;
    },
    [run, socialService]
  );

  const wsRef = React.useRef<WebSocket | null>(null);

  const chatDisconnect = React.useCallback(async (): Promise<void> => {
    setChatConnected(false);
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
  }, []);

  const chatConnect = React.useCallback(
    async (login: string, channel?: string): Promise<void> => {
      await chatDisconnect();

      const url = socialService.twitchChatWsUrl(login, channel);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      setChatChannel(channel || login);
      setChatEvents([]);

      ws.onopen = () => setChatConnected(true);
      ws.onclose = () => setChatConnected(false);
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data as string) as TwitchChatServerEvent | TwitchChatServerEvent[];
          const arr = Array.isArray(data) ? data : [data];
          setChatEvents((prev) => [...prev, ...arr].slice(-500));
        } catch {
          setChatEvents((prev) => [
            ...prev,
            { kind: "system", line: String(evt.data ?? ""), channel: channel || login },
          ] as TwitchChatServerEvent[]);
        }
      };
    },
    [chatDisconnect, socialService]
  );

  const chatSay = React.useCallback(
    async (message: string, _channelOverride?: string): Promise<TwitchOk> => {
      const login = lastWhoAmI?.login || lastAuth?.login;
      if (!login) throw new Error("login not known; call whoami/authenticate first");
      const req: TwitchChatSendRequest = { login, message }; // server derives channel
      const res = await chatSend(req);
      return res;
    },
    [chatSend, lastWhoAmI, lastAuth]
  );

  const clearChat = React.useCallback(() => setChatEvents([]), []);

  const resetError = React.useCallback((action?: TwAction) => {
    if (!action) return setError({});
    setError((m) => ({ ...m, [action]: null }));
  }, []);

  const resetAll = React.useCallback(() => {
    setLoading({});
    setError({});
    setLastConfigured(undefined);
    setLastAuthUrl(undefined);
    setLastAuth(undefined);
    setLastWhoAmI(undefined);
    setLastFeed(undefined);
    setLastList(undefined);
    clearChat();
    abort();
  }, [abort, clearChat]);

  React.useEffect(() => {
    return () => {
      try { wsRef.current?.close(); } catch {}
      wsRef.current = null;
    };
  }, []);

  return {
    loading,
    error,
    lastConfigured,
    lastAuthUrl,
    lastAuth,
    lastWhoAmI,
    lastFeed,
    lastList,

    chatConnected,
    chatChannel,
    chatEvents,

    configure,
    getAuthUrl,
    authenticate,
    whoami,
    feed,
    list,

    chatStart,
    chatStop,
    chatSend,

    chatConnect,
    chatDisconnect,
    chatSay,
    clearChat,

    resetError,
    resetAll,
    abort,
  } as const;
};

export default useTwitch;
