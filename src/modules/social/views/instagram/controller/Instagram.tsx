import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import styles from "./Instagram.scss";
import UiLoader from "@webstack/components/UiLoader/view/UiLoader";
import { useLoader } from "@webstack/components/Loader/Loader";
import { useNotification } from "@webstack/components/Notification/Notification";
import useInstagram from "~/src/core/services/SocialService/hooks/useInstagram";
import InstagramAuthenticate from "../views/InstagramAuthenticate/InstagramAuthenticate";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";

type InstagramProps = {
  user: { id?: string | number; [k: string]: any };
  current?: "configure" | "status";
  autoAuth?: boolean;
};

type View = "loading" | "status" | "configure" | "authenticating";

// gentle background polling
const POLL_INTERVAL_MIN_MS = 5 * 60_000; // 5 minutes
const JITTER_PERCENT = 0.1; // ±10 %

const Instagram: React.FC<InstagramProps> = ({
  user,
  current = "status",
  autoAuth = true,
}) => {
  const stripeId = useMemo(() => (user?.id != null ? String(user.id) : ""), [user]);
  const [view, setView] = useState<View>(stripeId ? current : "loading");

  const [loader, setLoader] = useLoader();
  const [notif, setNotif] = useNotification();
  const ig = useInstagram();

  const [hasAccount, setHasAccount] = useState(false);
  const [username, setUsername] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [sessionOk, setSessionOk] = useState<boolean | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const pollTimer = useRef<NodeJS.Timeout | null>(null);

  const clearSpinner = useCallback(() => setLoader?.({ active: false }), [setLoader]);
  const spin = useCallback(
    (text: string) =>
      setLoader?.({ active: true, body: text, backgroundColor: "#20202090" }),
    [setLoader]
  );

  const note = useCallback(
    (message: string, opts?: { persistMs?: number }) =>
      setNotif({
        active: true,
        dismissable: true,
        persistence: opts?.persistMs ?? 2500,
        list: [{ label: message }],
      }),
    [setNotif]
  );

  const errorNote = useCallback(
    (message: string, detail?: any) =>
      setNotif({
        active: true,
        dismissable: true,
        apiError: {
          message,
          status: 400,
          detail: detail ?? "",
          error: true,
        },
      }),
    [setNotif]
  );

  // unified backend refresh
  const refreshBackendState = useCallback(async () => {
    if (!stripeId) return;
    try {
      setView((v) => (v === "status" ? v : "loading"));
      const list = await ig.list(stripeId);
      const acc = list?.accounts?.[0];
      const exists = !!acc;
      setHasAccount(exists);
      setUsername(acc?.username || undefined);
      setEmail(acc?.email || undefined);

      if (!exists) {
        setSessionOk(null);
        setView("configure");
        note("No Instagram account configured yet. Please add it.");
        return;
      }

      const st = await ig.whoami(acc.username);
      const ok = st?.status === "ok";
      setSessionOk(ok);
      setView("status");

      if (ok) {
        note(`Active session for ${acc.username}`);
      } else {
        const reason = st?.error || st?.details || "missing_session";
        setLastError(reason);
        note(`No active session for ${acc.username}. Sign in required.`, {
          persistMs: 3500,
        });
      }
    } catch (e: any) {
      setSessionOk(false);
      setLastError(e?.message || "Could not get session status.");
      setView("status");
      errorNote("Failed to read session status", e?.message);
    }
  }, [ig, stripeId, note, errorNote]);

  // run once on mount
  useEffect(() => {
    if (!stripeId) return;
    let cancelled = false;
    (async () => {
      await refreshBackendState();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [stripeId]);

  // polling every 5 min (with jitter)
  useEffect(() => {
    if (!stripeId || !hasAccount || !username) return;
    if (view !== "status") return; // only poll when idle

    const jitter = 1 + (Math.random() * 2 - 1) * JITTER_PERCENT;
    const nextMs = POLL_INTERVAL_MIN_MS * jitter;

    pollTimer.current = setTimeout(async () => {
      await refreshBackendState();
    }, nextMs);

    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
      pollTimer.current = null;
    };
  }, [stripeId, hasAccount, username, view, refreshBackendState]);

  const handleStartAuth = (u?: string) => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
    setView("authenticating");
    spin(`signing in: ${u || username || "…"}`);
    note(`Authenticating ${u || username || ""}…`, { persistMs: 1200 });
  };
const handleFinished = async (ok: boolean) => {
  clearSpinner();
  if (ok) {
    // show status view immediately
    setView("status");
    note("Session established ✔");
    // we already hydrated lastWhoAmI / lastFeed from authenticate()
    // Optionally still refresh in background:
    await refreshBackendState();
  } else {
    setView("configure");
  }
};


  const handleLogout = async () => {
    if (!stripeId) return;
    spin("logging out…");
    try {
      await ig.logout(stripeId, username || "");
      note("Logged out of Instagram.");
    } catch (e: any) {
      errorNote("Logout failed", e?.message);
    } finally {
      clearSpinner();
      await refreshBackendState();
    }
  };

  const handleReauth = () => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
    setView("configure");
    note("Re-authenticate to create a fresh session.");
  };

  if (!stripeId) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className="instagram">
          <div className="instagram--view">
            <div className="error">Missing customer id (stripe_id).</div>
          </div>
        </div>
      </>
    );
  }

const StatusPanel = () => (
  <div className="ig-status">
    <div className="ig-status__row">
      <div className="ig-status__label">Username</div>
      <div className="ig-status__value">{username || "—"}</div>
    </div>
    <div className="ig-status__row">
      <div className="ig-status__label">Email</div>
      <div className="ig-status__value">{email || "—"}</div>
    </div>
    <div className="ig-status__row">
      <div className="ig-status__label">Session</div>
      <div className={`badge ${sessionOk ? "ok" : "bad"}`}>
        {sessionOk ? "active" : "not authenticated"}
      </div>
    </div>
    {lastError && <div className="error">{lastError}</div>}

    <div className="ig-status__actions">
      {sessionOk ? (
        <>
          <UiButton
            variant="solid"
            size="md"
            onClick={handleLogout}
            traits={{ afterIcon: "fas-right-from-bracket" }}
          >
            Logout
          </UiButton>

          <UiButton
            variant="ghost"
            size="md"
            onClick={handleReauth}
            traits={{ afterIcon: "fas-repeat" }}
          >
            Re-authenticate
          </UiButton>
        </>
      ) : (
        <UiButton
          variant="primary"
          size="md"
          onClick={handleReauth}
          traits={{ afterIcon: "fas-sign-in-alt" }}
        >
          Sign In
        </UiButton>
      )}
    </div>
  </div>
);

  const views: Record<View, React.ReactNode> = {
    loading: <UiLoader height="640px" text="Loading…" />,
    authenticating: <UiLoader height="640px" text="Signing in…" />,
    status: <StatusPanel />,
    configure: (
      <InstagramAuthenticate
        user={user}
        mode={hasAccount ? "signin" : "configure"}
        defaults={{ username, email }}
        autoAuth={autoAuth}
        onAuthenticating={handleStartAuth}
        onFinished={handleFinished}
        onSuccess={() => void 0}
      />
    ),
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="instagram">
        <div className="instagram--view">{views[view]}</div>
      </div>
      <div className="instagram__tandc">Not Responsible</div>
    </>
  );
};

export default Instagram;
