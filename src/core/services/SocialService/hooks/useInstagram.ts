import React from "react";
import { getService } from "@webstack/common";
import ISocialService, {
  IGOk,
  IGDebug,
  IGWhoAmI,
  IGFeedResponse,
  IGUploadResponse,
  IGListResponse,
  InstagramConfigureRequest,
  InstagramAuthenticateRequest,
  InstagramAuthResponse,
  InstagramStatusQuery,
} from "../ISocialService"

type IGAction =
  | "configure"
  | "authenticate"
  | "whoami"
  | "feed"
  | "upload"
  | "logout"
  | "list"
  | "status"
  | "debug";

type BoolMap = Partial<Record<IGAction, boolean>>;
type ErrMap = Partial<Record<IGAction, string | null>>;

export type UseInstagram = {
  // state
  loading: BoolMap;
  error: ErrMap;
  lastConfigured?: IGOk;
  lastAuth?: InstagramAuthResponse;
  lastWhoAmI?: IGWhoAmI;
  lastFeed?: IGFeedResponse;
  lastUpload?: IGUploadResponse;
  lastLogout?: IGOk;
  lastList?: IGListResponse;
  lastStatus?: InstagramAuthResponse;
  lastDebug?: IGDebug;

  // actions
  configure(payload: InstagramConfigureRequest): Promise<IGOk>;
  authenticate(
    payload: InstagramAuthenticateRequest,
    opts?: { auth_proxy?: boolean }
  ): Promise<InstagramAuthResponse>;
  whoami(username: string): Promise<IGWhoAmI>;
  feed(username: string): Promise<IGFeedResponse>;
  upload(stripe_id: string, file: File, caption?: string): Promise<IGUploadResponse>;
  logout(stripe_id: string, username?: string): Promise<IGOk>;
  list(stripe_id: string): Promise<IGListResponse>;
  status(q: InstagramStatusQuery): Promise<InstagramAuthResponse>;
  debugFingerprint(opts?: { auth_proxy?: boolean }): Promise<IGDebug>;

  // helpers
  resetError(action?: IGAction): void;
  resetAll(): void;
  abort(action?: IGAction): void;
};

const COOLDOWN_MS_WHOAMI = 15_000; // 15s soft cooldown

const useInstagram = (): UseInstagram => {
  const socialService = React.useMemo(
    () => getService<ISocialService>("ISocialService"),
    []
  );

  const [loading, setLoading] = React.useState<BoolMap>({});
  const [error, setError] = React.useState<ErrMap>({});

  const [lastConfigured, setLastConfigured] = React.useState<IGOk>();
  const [lastAuth, setLastAuth] = React.useState<InstagramAuthResponse>();
  const [lastWhoAmI, setLastWhoAmI] = React.useState<IGWhoAmI>();
  const [lastFeed, setLastFeed] = React.useState<IGFeedResponse>();
  const [lastUpload, setLastUpload] = React.useState<IGUploadResponse>();
  const [lastLogout, setLastLogout] = React.useState<IGOk>();
  const [lastList, setLastList] = React.useState<IGListResponse>();
  const [lastStatus, setLastStatus] = React.useState<InstagramAuthResponse>();
  const [lastDebug, setLastDebug] = React.useState<IGDebug>();

  // keep one AbortController per action
  const ctrls = React.useRef<Partial<Record<IGAction, AbortController>>>({});

  const run = React.useCallback(
    async <T,>(action: IGAction, fn: (signal?: AbortSignal) => Promise<T>): Promise<T> => {
      ctrls.current[action]?.abort?.();
      const controller = new AbortController();
      ctrls.current[action] = controller;

      setLoading((m) => ({ ...m, [action]: true }));
      setError((m) => ({ ...m, [action]: null }));

      try {
        const out = await fn(controller.signal);
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

  const abort = React.useCallback((action?: IGAction) => {
    if (action) {
      ctrls.current[action]?.abort?.();
      delete ctrls.current[action];
      return;
    }
    Object.values(ctrls.current).forEach((c) => c?.abort?.());
    ctrls.current = {};
  }, []);

  // ─────────────── actions ───────────────

  const configure = React.useCallback(
    async (payload: InstagramConfigureRequest) => {
      const res = await run("configure", () => socialService.instagramConfigure(payload));
      setLastConfigured(res);
      return res;
    },
    [run, socialService]
  );

const authenticate = React.useCallback(
  async (payload: InstagramAuthenticateRequest, opts?: { auth_proxy?: boolean }) => {
    const res = await run("authenticate", () =>
      socialService.instagramAuthenticate(payload, opts)
    );

    setLastAuth(res);

    // hydrate local caches from auth envelope
    if (res?.status === "ok") {
      if (res?.whoami) {
        const who: IGWhoAmI = {
          status: "ok",
          account: res.whoami,
          username: res?.username || res?.whoami?.username,
          device: res.device,
          session: res.session,
        };
        setLastWhoAmI(who);
      }
      if (res?.feed?.items) {
        const f: IGFeedResponse = { status: "ok", items: res.feed.items, next_max_id: res.feed.next_max_id ?? null };
        setLastFeed(f);
      }
    }

    return res;
  },
  [run, socialService]
);

  // flood-guarded whoami — always returns an IGWhoAmI
  const whoamiInFlight = React.useRef(false);
  const whoamiLastAt = React.useRef<number>(0);

  const whoami = React.useCallback(
    async (username: string): Promise<IGWhoAmI> => {
      if (!username) {
        throw new Error("Missing username for whoami()");
      }

      // If a request is already in-flight, return cached or a placeholder.
      if (whoamiInFlight.current) {
        return (
          lastWhoAmI || {
            status: "warning",
            username,
            error: "in_flight",
            details: "Previous whoami request still in progress.",
          }
        );
      }

      const now = Date.now();
      const withinCooldown = now - (whoamiLastAt.current || 0) < COOLDOWN_MS_WHOAMI;

      // Respect cooldown only if we actually have something to return.
      if (withinCooldown && lastWhoAmI) {
        return lastWhoAmI;
      }

      whoamiInFlight.current = true;
      whoamiLastAt.current = now;

      try {
        const res = await run("whoami", () => socialService.instagramWhoAmI(username));
        setLastWhoAmI(res);
        return res;
      } finally {
        whoamiInFlight.current = false;
      }
    },
    [run, socialService, lastWhoAmI]
  );

  const feed = React.useCallback(
    async (username: string) => {
      const res = await run("feed", () => socialService.instagramFeed(username));
      setLastFeed(res);
      return res;
    },
    [run, socialService]
  );

  const upload = React.useCallback(
    async (stripe_id: string, file: File, caption?: string) => {
      const res = await run("upload", () =>
        socialService.instagramUpload(stripe_id, file, caption)
      );
      setLastUpload(res);
      return res;
    },
    [run, socialService]
  );

  const logout = React.useCallback(
    async (stripe_id: string, username = "") => {
      const res = await run("logout", () => socialService.instagramLogout(stripe_id, username));
      setLastLogout(res);
      return res;
    },
    [run, socialService]
  );

  const list = React.useCallback(
    async (stripe_id: string) => {
      const res = await run("list", () => socialService.instagramList(stripe_id));
      setLastList(res);
      return res;
    },
    [run, socialService]
  );

  const status = React.useCallback(
    async (q: InstagramStatusQuery) => {
      const res = await run("status", () => socialService.instagramStatus(q));
      setLastStatus(res);
      return res;
    },
    [run, socialService]
  );

  const debugFingerprint = React.useCallback(
    async (opts?: { auth_proxy?: boolean }) => {
      const res = await run("debug", () => socialService.instagramDebug(opts));
      setLastDebug(res);
      return res;
    },
    [run, socialService]
  );

  const resetError = React.useCallback((action?: IGAction) => {
    if (!action) return setError({});
    setError((m) => ({ ...m, [action]: null }));
  }, []);

  const resetAll = React.useCallback(() => {
    setLoading({});
    setError({});
    setLastConfigured(undefined);
    setLastAuth(undefined);
    setLastWhoAmI(undefined);
    setLastFeed(undefined);
    setLastUpload(undefined);
    setLastLogout(undefined);
    setLastList(undefined);
    setLastStatus(undefined);
    setLastDebug(undefined);
    abort();
  }, [abort]);

  return {
    // state
    loading,
    error,
    lastConfigured,
    lastAuth,
    lastWhoAmI,
    lastFeed,
    lastUpload,
    lastLogout,
    lastList,
    lastStatus,
    lastDebug,

    // actions
    configure,
    authenticate,
    whoami,
    feed,
    upload,
    logout,
    list,
    status,
    debugFingerprint,

    // helpers
    resetError,
    resetAll,
    abort,
  } as const;
};

export default useInstagram;
