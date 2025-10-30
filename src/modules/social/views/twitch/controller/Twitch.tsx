import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Twitch.scss";
import UiLoader from "@webstack/components/UiLoader/view/UiLoader";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { useFormState } from "@webstack/components/UiForm/functions/useFormState";
import { useLoader } from "@webstack/components/Loader/Loader";
import { useNotification } from "@webstack/components/Notification/Notification";
import useTwitch from "~/src/core/services/SocialService/hooks/useTwitch";

type Props = { user?: { id?: string | number; [k: string]: any } | null; current?: "status" | "connect" };
type View = "loading" | "status" | "connect" | "authenticating";

const POLL_INTERVAL_MIN_MS = 5 * 60_000;
const JITTER_PERCENT = 0.1;

const useMounted = () => {
  const [m, setM] = useState(false);
  useEffect(() => { setM(true); }, []);
  return m;
};

const isEditableEl = (el: Element | null) => {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || (el as HTMLElement).isContentEditable;
};

const Twitch: React.FC<Props> = ({ user, current = "status" }) => {
  const mounted = useMounted();

  const stripeId = useMemo(() => (user && user.id != null ? String(user.id) : ""), [user?.id]);
  const [view, setView] = useState<View>(stripeId ? current : "loading");

  const [, setLoader] = useLoader();
  const [, setNotif] = useNotification();
  const tw = useTwitch();

  const [login, setLogin] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [sessionOk, setSessionOk] = useState<boolean | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState<string>("");

  // form state (no size in fields)
  const [connectFields, setConnectField] = useFormState([
    { name: "login", label: "Twitch Login", type: "text", value: "", required: true } as IFormField,
    { name: "code",  label: "Auth Code",    type: "text", value: "" } as IFormField,
  ]);

  // mirror form values into refs so callback deps stay stable
  const fLoginRef = useRef<string>("");
  const fCodeRef  = useRef<string>("");
  useEffect(() => {
    fLoginRef.current = String(connectFields.find(f => f.name === "login")?.value ?? "").trim();
    fCodeRef.current  = String(connectFields.find(f => f.name === "code")?.value  ?? "").trim();
  }, [connectFields]);

  // stable refs for misc state
  const loginRef = useRef<string | undefined>(undefined);
  const emailRef = useRef<string | undefined>(undefined);
  useEffect(() => { loginRef.current = login; }, [login]);
  useEffect(() => { emailRef.current = email; }, [email]);

  // helpers
  const clearSpinner = useCallback(() => setLoader?.({ active: false }), [setLoader]);
  const spin = useCallback((t: string) => setLoader?.({ active: true, body: t, backgroundColor: "#20202090" }), [setLoader]);
  const note = useCallback((m: string, ms = 1800) =>
    setNotif({ active: true, dismissable: true, persistence: ms, list: [{ label: m }] }), [setNotif]);
  const errorNote = useCallback((m: string, d?: any) =>
    setNotif({ active: true, dismissable: true, apiError: { message: m, status: 400, detail: d ?? "", error: true } }), [setNotif]);

  // guards
  const didInit = useRef(false);
  const didTryList = useRef(false);
  const inFlight = useRef(false);
  const lastFetchAt = useRef(0);
  const pollTimer = useRef<NodeJS.Timeout | null>(null);

  // Avoid clobbering while the user is typing in our form/inputs
  const isEditing = useRef(false);
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => { isEditing.current = isEditableEl(e.target as Element); };
    const onFocusOut = (e: FocusEvent) => { if (isEditableEl(e.target as Element)) isEditing.current = false; };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // STABLE refresh — no deps on form; reads refs instead
  const refreshBackendState = useCallback(async () => {
    if (!mounted) return;

    // while on Connect and unauthenticated, do not hammer the API during typing
    if (didInit.current && view === "connect" && !sessionOk) return;

    // don't fetch while the user is typing to avoid cursor jumps
    if (isEditing.current || isEditableEl(document.activeElement)) return;

    const now = Date.now();
    if (now - lastFetchAt.current < 900 || inFlight.current) return;
    inFlight.current = true;
    lastFetchAt.current = now;

    try {
      let candidateLogin = loginRef.current || fLoginRef.current;

      // discover saved account once
      if (!candidateLogin && stripeId && !didTryList.current) {
        didTryList.current = true;
        try {
          const lst = await tw.list(stripeId);
          const first = (lst as any)?.accounts?.[0];
          if (first?.login) {
            candidateLogin = first.login;
            // only autofill if field is currently empty (do NOT overwrite user typing)
            if (!fLoginRef.current) {
              setConnectField({ target: { name: "login", value: first.login } }); // preserve focus
            }
          }
          if (first?.email) setEmail(first.email);
        } catch { /* ignore */ }
      }

      if (!candidateLogin) {
        setSessionOk(null);
        setView(v => (v === "status" ? "connect" : v));
        if (!didInit.current) note("No Twitch account session found. Connect your account.");
        return;
      }

      const who = await tw.whoami(candidateLogin);
      const ok = (who as any)?.status === "ok";

      if (ok) {
        setLogin((who as any).account?.login || candidateLogin);
        setEmail((who as any).account?.email || emailRef.current);
        setSessionOk(true);
        setView("status");
      } else {
        setLogin(candidateLogin);
        setSessionOk(false);
        setView("connect");
        setLastError((who as any)?.error || (who as any)?.details || "missing_session");
      }
    } catch (e: any) {
      setSessionOk(false);
      setLastError(e?.message || "Could not read Twitch session.");
      setView(v => (v === "status" ? "status" : "connect"));
      errorNote("Failed to read Twitch session.", e?.message);
    } finally {
      didInit.current = true;
      inFlight.current = false;
    }
  // ← do NOT include connectFields/fLogin/etc.
  }, [mounted, stripeId, tw, view, sessionOk, note, errorNote, setConnectField]);

  // run once after mount
  useEffect(() => {
    if (!mounted || !stripeId || didInit.current) return;
    void refreshBackendState();
  }, [mounted, stripeId, refreshBackendState]);

  // poll only when authenticated + status view
  useEffect(() => {
    if (!mounted || !stripeId || !login || !sessionOk || view !== "status") return;
    const jitter = 1 + (Math.random() * 2 - 1) * JITTER_PERCENT;
    const nextMs = POLL_INTERVAL_MIN_MS * jitter;
    pollTimer.current = setTimeout(() => { void refreshBackendState(); }, nextMs);
    return () => { if (pollTimer.current) clearTimeout(pollTimer.current); pollTimer.current = null; };
  }, [mounted, stripeId, login, sessionOk, view, refreshBackendState]);

  // auth
  const openAuthUrl = async () => {
    try {
      const who = fLoginRef.current || loginRef.current;
      if (!who) throw new Error("Enter your Twitch login to start auth.");
      const res = await tw.getAuthUrl(who);
      const url = (res as any)?.auth_url;
      if (!url) throw new Error("No auth_url returned.");
      window.open(url, "_blank", "noopener,noreferrer");
      note("Twitch auth window opened. Approve it, then paste the code here.");
      setView("connect");
    } catch (e: any) { errorNote("Failed to open Twitch auth URL", e?.message); }
  };

  const exchangeCode = async () => {
    try {
      const who = fLoginRef.current || loginRef.current;
      if (!who) throw new Error("Login is required.");
      const code = fCodeRef.current;
      if (!code) throw new Error("Paste the code from the callback page.");
      spin("Finishing Twitch sign-in…");
      const res = await tw.authenticate({ login: who, code, request_timeout: 15 });
      clearSpinner();
      if ((res as any)?.status === "ok") {
        note("Twitch session established ✔");
        setConnectField({ target: { name: "code", value: "" } });
        await refreshBackendState();
      } else {
        const msg = (res as any)?.details || (res as any)?.error || "Auth failed";
        errorNote("Twitch authentication failed", msg);
      }
    } catch (e: any) { clearSpinner(); errorNote("Auth error", e?.message); }
  };

  // chat
  const connectChat = async () => {
    try {
      const who = loginRef.current || fLoginRef.current;
      if (!who) throw new Error("Login required");
      await tw.chatStart({ login: who, channel: who });
      tw.chatConnect(who, who);
      note("Chat connected.");
    } catch (e: any) { errorNote("Chat connect failed", e?.message); }
  };

  const disconnectChat = async () => {
    try {
      tw.chatDisconnect();
      if (loginRef.current) await tw.chatStop(loginRef.current);
      note("Chat disconnected.");
    } catch (e: any) { errorNote("Failed to stop chat", e?.message); }
  };

  const sendChat = async () => {
    const text = chatMessage.trim();
    if (!text) return;
    try {
      if (tw.chatConnected) await tw.chatSay(text);
      else if (loginRef.current) await tw.chatSend({ login: loginRef.current, message: text });
      setChatMessage("");
    } catch (e: any) { errorNote("Send failed", e?.message); }
  };

  // views
  const StatusPanel: React.FC = () => (
    <div className="ig-status">
      <div className="ig-status__row"><div className="ig-status__label">Login</div><div className="ig-status__value">{loginRef.current || fLoginRef.current || "—"}</div></div>
      <div className="ig-status__row"><div className="ig-status__label">Email</div><div className="ig-status__value">{emailRef.current || "—"}</div></div>
      <div className="ig-status__row"><div className="ig-status__label">Session</div><div className={`badge ${sessionOk ? "ok" : "bad"}`}>{sessionOk ? "active" : "not authenticated"}</div></div>
      {lastError && !sessionOk && <div className="error">{lastError}</div>}

      <div className="ig-status__actions">
        {sessionOk ? (
          <>
            <UiButton variant={tw.chatConnected ? "ghost" : "primary"} onClick={tw.chatConnected ? disconnectChat : connectChat}
              traits={{ afterIcon: tw.chatConnected ? "fas-plug-circle-xmark" : "fas-comments" }}>
              {tw.chatConnected ? "Disconnect Chat" : "Connect Chat"}
            </UiButton>
            <UiButton variant="ghost" onClick={() => setView("connect")} traits={{ afterIcon: "fas-repeat" }}>
              Re-authenticate
            </UiButton>
          </>
        ) : (
          <UiButton variant="primary" onClick={() => setView("connect")} traits={{ afterIcon: "fas-right-to-bracket" }}>
            Connect Twitch
          </UiButton>
        )}
      </div>

      <div className="ig-status__chat" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
          Channel: <code>{tw.chatChannel || loginRef.current || "—"}</code> • {tw.chatConnected ? "connected" : "disconnected"}
        </div>

        <div style={{ height: 220, overflow: "auto", padding: 12, background: "#111", borderRadius: 8, border: "1px solid #222" }}>
          {tw.chatEvents.length === 0 ? (
            <div style={{ opacity: 0.5 }}>No chat yet.</div>
          ) : (
            tw.chatEvents.map((e: unknown, i: number) => {
              const evt: any = e;
              const k = evt?.kind as string | undefined;
              const ch = (evt?.channel as string | undefined) ?? tw.chatChannel ?? loginRef.current ?? "";
              if (k === "privmsg" || k === "message") {
                return (
                  <div key={i} style={{ whiteSpace: "pre-wrap", lineHeight: 1.35 }}>
                    <strong>[{ch}]</strong> <span style={{ color: "#9cf" }}>{evt.user ?? "?"}</span>: {evt.text ?? ""}
                  </div>
                );
              }
              if (k === "system") {
                return (
                  <div key={i} style={{ whiteSpace: "pre-wrap", lineHeight: 1.35 }}>
                    <em style={{ color: "#7f7" }}>[{ch}] {evt.line ?? JSON.stringify(e)}</em>
                  </div>
                );
              }
              return (<div key={i} style={{ opacity: 0.7 }}>{JSON.stringify(e)}</div>);
            })
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Say something…"
            className="ui-input"
            style={{ flex: 1 }}
            onKeyDown={(e) => { if (e.key === "Enter") void sendChat(); }}
          />
          <UiButton variant="solid" onClick={sendChat}>Send</UiButton>
          <UiButton variant="ghost" onClick={tw.clearChat}>Clear</UiButton>
        </div>
      </div>
    </div>
  );

  const ConnectPanel: React.FC = () => (
    <div className="ig-status">
      <UiForm
        variant="solid"
        title="Connect Twitch"
        fields={connectFields}
        onChange={setConnectField}         // preserves focus; single state source
        onSubmit={() => exchangeCode()}
        submitText="Exchange Code"
        submitIcon="fas-key"
      />
      <div className="ig-status__actions" style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <UiButton variant="primary" onClick={openAuthUrl} traits={{ afterIcon: "fas-external-link" }}>
          Open Twitch Auth
        </UiButton>
        <UiButton variant="ghost" onClick={() => setView("status")} traits={{ afterIcon: "fas-arrow-left" }}>
          Back to Status
        </UiButton>
      </div>
      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
        Approve the OAuth screen; you’ll land on our callback page showing a <code>code</code>. Paste it above.
      </div>
    </div>
  );

  // pre-mount: single stable branch to avoid hydration mismatch
  if (!mounted) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className="instagram"><div className="instagram--view"><UiLoader height="640px" text="Loading Twitch…" /></div></div>
        <div className="instagram__tandc">Not Responsible</div>
      </>
    );
  }

  if (!stripeId) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className="instagram"><div className="instagram--view"><div className="error">Missing customer id (stripe_id).</div></div></div>
        <div className="instagram__tandc">Not Responsible</div>
      </>
    );
  }

  const views: Record<View, React.ReactNode> = {
    loading: <UiLoader height="640px" text="Loading Twitch…" />,
    authenticating: <UiLoader height="640px" text="Signing in…" />,
    status: <StatusPanel />,
    connect: <ConnectPanel />,
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="instagram"><div className="instagram--view">{views[view]}</div></div>
      <div className="instagram__tandc">Not Responsible</div>
    </>
  );
};

export default Twitch;
