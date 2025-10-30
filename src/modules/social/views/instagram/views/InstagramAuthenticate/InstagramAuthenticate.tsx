import React, { useMemo, useState, useCallback } from "react";
import styles from "./InstagramAuthenticate.scss";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useLoader } from "@webstack/components/Loader/Loader";
import useInstagram from "~/src/core/services/SocialService/hooks/useInstagram";

type Props = {
  user: { id?: string | number; [k: string]: any };
  mode: "signin" | "configure";
  defaults?: { username?: string; email?: string };
  autoAuth?: boolean;
  onAuthenticating?: (username?: string) => void;
  onFinished?: (ok: boolean) => void;
  onSuccess?: () => void;
};

type AuthResult = {
  status: "ok" | "error";
  username?: string;
  error?: string;
  details?: string;
  hint?: string;
  actions?: string[];
  [k: string]: any;
};

const InstagramAuthenticate: React.FC<Props> = ({
  user,
  defaults,
  onAuthenticating,
  onFinished,
  onSuccess,
}) => {
  const stripe_id = useMemo(() => (user?.id != null ? String(user.id) : ""), [user]);
  const ig = useInstagram();
  const [notif, setNotif] = useNotification();
  const [loader, setLoader] = useLoader();

  // ───────────────────────── form model (UiForm) ─────────────────────────
  const [fields, setFields] = useState<IFormField[]>([
    {
      name: "username",
      label: "Username",
      type: "text",
      autoComplete: "off",
      placeholder: "your_username",
      value: defaults?.username || "",
      required: true,
    },
    {
      name: "ig_password",
      label: "IG Password",
      type: "password",
      autoComplete: "on",
      placeholder: "••••••••••",
      value: "!@!123Qwe",
      required: true,
      traits: { afterIcon: { icon: "fas-eye-slash" } },
    },
    {
      name: "attempt_wall_timeout",
      label: "Max Attempt (s)",
      type: "pill",
      min: 1,
      max: 60,
      value: 25,
    },
    {
      name: "connect_timeout",
      label: "Connect Timeout",
      type: "pill",
      min: 1,
      max: 60,
      value: 5,
    },
    {
      name: "read_timeout",
      label: "Read Timeout",
      type: "pill",
      min: 1,
      max: 120,
      value: 10,
      width: "220px",
    },
    {
      name: "reset_session",
      label: "Reset Session",
      type: "checkbox",
      value: false,
    },
    {
      name: "debug",
      label: "Debug Logs",
      type: "checkbox",
      value: false,
    },
    {
      name: "proxy",
      label: "Proxy (optional)",
      type: "text",
      placeholder: "http://user:pass@host:port",
    },
  ]);

  // Error panel content from last backend response
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverHint, setServerHint] = useState<string | null>(null);
  const [serverActions, setServerActions] = useState<string[]>([]);

  const spin = useCallback(
    (active: boolean, body?: string) =>
      setLoader?.({ active, body, backgroundColor: "#20202090" }),
    [setLoader]
  );

  const toast = useCallback(
    (title: string, body?: string) =>
      setNotif({
        active: true,
        dismissable: true,
        persistence: 3500,
        list: [{ label: title }, ...(body ? [{ label: body }] : [])],
      }),
    [setNotif]
  );

  // UiForm onChange: expects e.target.{name,value}
  const handleChange = useCallback(
    (e: any) => {
      const { name, value } = e?.target || {};
      if (!name) return;
      setFields((prev: IFormField[]) =>
        prev.map((f: IFormField) =>
          f.name === name ? { ...f, error: undefined, value } : f
        )
      );
    },
    [setFields]
  );

  const val = useCallback(
    (name: string) => fields.find((f) => f.name === name)?.value,
    [fields]
  );

  // Submit → call backend authenticate
  const submit = async () => {
    setServerError(null);
    setServerHint(null);
    setServerActions([]);

    const username = String(val("username") || "");
    const ig_password = String(val("ig_password") || "");
    const attempt_wall_timeout = Number(val("attempt_wall_timeout") ?? 25);
    const connect_timeout = Number(val("connect_timeout") ?? 5);
    const read_timeout = Number(val("read_timeout") ?? 10);
    const reset_session = Boolean(val("reset_session"));
    const debug = Boolean(val("debug"));
    const proxy = String(val("proxy") || "");

    if (!stripe_id) {
      toast("Missing customer id (stripe_id).");
      return;
    }
    if (!username || !ig_password) {
      toast("Username and IG password are required.");
      setFields((prev) =>
        prev.map((f) =>
          ["username", "ig_password"].includes(f.name) && !f.value
            ? { ...f, error: "required" }
            : f
        )
      );
      return;
    }

    spin(true, `Signing in as ${username}…`);
    onAuthenticating?.(username);

    try {
      // 🔑 IMPORTANT: backend expects ig_password (not password)
      const payload = {
        username,
        ig_password,
        stripe_id,
        attempt_wall_timeout,
        connect_timeout,
        read_timeout,
        reset_session,
        debug,
        ...(proxy ? { proxy } : {}),
      };

      const res: AuthResult = await ig.authenticate(payload, {
        auth_proxy: Boolean(proxy),
      });

      if (res?.status === "ok") {
        toast("Session established ✔");
        onSuccess?.();
        onFinished?.(true);
        return;
      }

      // Error path: surface everything + actions
      const detail = res?.details || res?.error || "Authentication failed.";
      const hint = res?.hint || "";
      setServerError(detail);
      setServerHint(hint || null);
      setServerActions(Array.isArray(res?.actions) ? res.actions : []);
      toast(res?.error || "Authentication failed", `${detail}${hint ? `\n\n${hint}` : ""}`);
      onFinished?.(false);
    } catch (e: any) {
      const msg = e?.message || "Network/Server error during authentication.";
      setServerError(msg);
      toast("Authentication failed", msg);
      onFinished?.(false);
    } finally {
      spin(false);
    }
  };

  // Action buttons from backend (always UiButton)
  const ActionButtons = () => {
    if (!serverActions?.length) return null;
    const unique = Array.from(new Set(serverActions));
    return (
      <div className="auth-actions">
        {unique.map((a) => {
          switch (a) {
            case "retry":
              return (
                <UiButton key="retry" onClick={submit}>
                  Try Again
                </UiButton>
              );
            case "open_configure":
              return (
                <UiButton
                  key="open_configure"
                  variant="ghost"
                  onClick={() =>
                    toast(
                      "Open Configure",
                      "Switch to Configure to update IMAP/Proxy/Password."
                    )
                  }
                >
                  Open Configure
                </UiButton>
              );
            case "toggle_proxy": {
              const current = String(val("proxy") || "");
              const next =
                current.trim() === ""
                  ? "http://user:pass@host:port"
                  : "";
              return (
                <UiButton
                  key="toggle_proxy"
                  variant="ghost"
                  onClick={() =>
                    handleChange({ target: { name: "proxy", value: next } })
                  }
                >
                  {current ? "Disable Proxy" : "Enable Proxy"}
                </UiButton>
              );
            }
            case "check_imap":
              return (
                <UiButton
                  key="check_imap"
                  variant="ghost"
                  onClick={() =>
                    toast(
                      "Check IMAP",
                      "Verify IMAP app password & folder; make sure EMAIL challenge is visible."
                    )
                  }
                >
                  Check IMAP
                </UiButton>
              );
            case "backoff":
              return (
                <UiButton
                  key="backoff"
                  variant="ghost"
                  onClick={() =>
                    toast("Rate Limited", "Wait 10–15 minutes, then try again.")
                  }
                >
                  Wait & Retry
                </UiButton>
              );
            case "reset_session": {
              const current = Boolean(val("reset_session"));
              return (
                <UiButton
                  key="reset_session"
                  variant="ghost"
                  onClick={() =>
                    handleChange({
                      target: { name: "reset_session", value: !current },
                    })
                  }
                >
                  {current ? "Use Existing Session" : "Reset Session Next Try"}
                </UiButton>
              );
            }
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="ig-auth">
        <UiForm
          title="Sign in"
          fields={fields}
          onChange={handleChange}
          onSubmit={() => submit()}
          submitText="Sign In"
          variant="default"
        />

        {(serverError || serverHint || serverActions.length > 0) && (
          <div className="auth-error">
            {serverError && (
              <>
                <div className="auth-error__title">Authentication Error</div>
                <div className="auth-error__detail">{serverError}</div>
              </>
            )}
            {serverHint && <div className="auth-error__hint">Hint: {serverHint}</div>}
            <ActionButtons />
          </div>
        )}
      </div>
    </>
  );
};

export default InstagramAuthenticate;
