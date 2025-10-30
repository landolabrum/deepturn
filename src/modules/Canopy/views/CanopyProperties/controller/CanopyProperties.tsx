import React, { useCallback, useMemo, useState, useEffect } from "react";
import styles from "./CanopyProperties.scss";

import UiSelect from "@webstack/components/UiForm/components/UiSelect/UiSelect";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { useRouter } from "next/router";
import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";
import CanopyAddEvent from "../../forms/CanopyAddEvent/CanopyAddEvent";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { defaultOverlayFor, OVERLAY_TYPES, OverlayType, jsonEq } from "../../../models/canopyOverlayTypes";
import useWindow from "@webstack/hooks/window/useWindow";
import UiCollapse from "@webstack/components/UiCollapse/UiCollapse";
import { useOverlayStore } from "../../../functions/overlayStore";
import AdapTable from "@webstack/components/AdapTable/views/AdapTable";
import environment from "~/src/core/environment";
import UiTabsLayout from "@webstack/layouts/UiTabsLayout/UiTabsLayout";
import { EventRow } from "@Canopy/hooks/useCanopy";


type Props = {
  current: EventRow | null;
  events: EventRow[] | { data: EventRow[] } | null | undefined;
  setCurrent: (e: EventRow | null) => void;
  onDelete: (id?: string) => void;
  deletingId?: string;
};

/* ================= helpers ================= */

const TZ_OPTS = [
  "UTC",
  "America/Denver",
  "America/Los_Angeles",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Australia/Sydney",
].map((z) => ({ label: z, value: z }));

// Note: storage keys and writing are handled by useOverlayStore; avoid duplicating writes here

type Overlay = {
  id?: string;
  type?: string;
  enabled?: boolean;
  z_index?: number;
  x?: number;
  y?: number;
  title?: any;
  description?: any;
  data?: any;
  variant?: string;
  animation?: string;
};

function toLocalInputValue(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(+d)) return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function toISO(dtLocal?: string | null) {
  if (!dtLocal) return null;
  const d = new Date(dtLocal);
  return isNaN(+d) ? null : d.toISOString();
}

/** Build the public /live/:id link (optionally carry merchant mid as a query) */
const buildLiveUrl = (eventId?: string | number) => {
  if (!eventId) return "";
  const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
  const base = origin || (environment as any)?.publicBaseUrl || "";
  const url = new URL(`${base.replace(/\/$/, "")}/live/${eventId}`);
  const mid = (environment as any)?.merchant?.mid;
  if (mid) url.searchParams.set("mid", mid);
  return url.toString();
};

/* ================= Edit Event Modal ================= */

const EditEventForm: React.FC<{ event: EventRow; onDone: (u?: Partial<EventRow>) => void }> = ({ event, onDone }) => {
  const router = useRouter();
  const db = getService<IDataBaseService>("IDataBaseService");
  const [, setNotification] = useNotification();
  // alert(event.ends_at)
  const [values, setValues] = useState({
    name: event.name ?? "",
    starts_at: toLocalInputValue(event.starts_at ?? null),
    ends_at: toLocalInputValue(event.ends_at ?? null),
    timezone: event.timezone ?? "America/Denver",
    is_live: !!event.is_live,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields: IFormField[] = useMemo(
    () => [
      { name: "name", label: "Event name", type: "text", required: true, value: values.name, constraints: { min: 3 } },
      { name: "starts_at", label: "Starts at", type: "datetime-local", required: true, value: values.starts_at },
      { name: "ends_at", label: "Ends at", type: "datetime-local", value: values.ends_at },
      { name: "timezone", label: "Timezone", type: "select", value: values.timezone, options: TZ_OPTS, input: true },
      { name: "is_live", label: "Is live?", type: "checkbox", value: !!values.is_live },
    ],
    [values]
  );

  const handleChange = (e: any) => {
    let name: string | undefined;
    let next: any;
    if (e?.target) {
      const t = e.target;
      name = t.name;
      next = t.type === "checkbox" ? !!t.checked : t.value;
    } else if (e && typeof e === "object") {
      name = (e as any).name;
      next = "checked" in e ? !!(e as any).checked : "value" in e ? (e as any).value : (e as any).val;
    }
    if (!name) return;
    setValues((v) => ({ ...v, [name!]: next }));
  };

  const handleSubmit = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name: values.name?.trim(),
        starts_at: toISO(values.starts_at),
        ends_at: toISO(values.ends_at),
        timezone: values.timezone,
        is_live: !!values.is_live,
      };
      if (!payload.name || !payload.starts_at) throw new Error("Name and start time are required.");
      const res = await db.updateData({
        tableName: "livestream_event",
        set: payload,
        where: { id: event.id },
      });
      const updated = (Array.isArray((res as any)?.data) ? (res as any).data[0] : (res as any)?.data) ?? {
        ...event,
        ...payload,
      };
      router.reload();
      setNotification({
        active: true,
        dismissable: true,
        persistence: 3500,
        list: [
          {
            label: "Event updated",
            message: `“${updated.name}” • ${updated.timezone ?? "—"} • live: ${updated.is_live ? "Yes" : "No"}`,
          },
        ],
      });
      onDone(updated);
    } catch (e: any) {
      setError(e?.message || "Failed to update event");
      setNotification({
        active: true,
        dismissable: true,
        persistence: 6000,
        apiError: { message: "Failed to update event", status: 0, detail: e?.message ?? e, error: true },
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minWidth: 360 }}>
      {error && <div style={{ color: "var(--red-60)", marginBottom: 8 }}>{error}</div>}
      <UiForm
        fields={fields}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitText="Save changes"
        loading={busy}
      />
    </div>
  );
};

/* ================= Main ================= */

const CanopyPropertiesContent: React.FC<Props> = ({ current, events, setCurrent, onDelete, deletingId }) => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [, setNotification] = useNotification();
  const db = getService<IDataBaseService>("IDataBaseService");
  const { merchant } = environment as any;

  /* -------- events list + select -------- */
  const eventList: EventRow[] = useMemo(() => {
    if (!events) return [];
    return Array.isArray(events) ? events : (events as { data: EventRow[] }).data ?? [];
  }, [events]);

  const options = useMemo(
    () =>
      eventList.map((e) => ({
        id: String(e.id),
        label: e.name,
        icon: e?.is_live ? { icon: "fa-broadcast-tower", color: "var(--green-10)" } : undefined,
        value: e.name,
        name: e.name,
      })),
    [eventList]
  );

  const liveEvent = useMemo(() => {
    const live = eventList.filter((e) => e.is_live);
    if (!live.length) return null;
    return live.slice().sort((a, b) => new Date(b.starts_at ?? 0).getTime() - new Date(a.starts_at ?? 0).getTime())[0];
  }, [eventList]);

  // Suggest switching to the live event
  useEffect(() => {
    if (!liveEvent) return;
    if (current && String(current.id) === String(liveEvent.id)) return;

    const ASK_KEY = `livestream_event:asked_switch_live:${liveEvent.id}`;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(ASK_KEY) === "1") return;

    const timer = setTimeout(() => {
      openModal({
        confirm: {
          title: "Switch to current LIVE event?",
          body: `“${liveEvent.name}” is currently LIVE. Do you want to switch to it now?`,
          statements: [
            {
              label: `Switch to “${liveEvent.name}”`,
              variant: "primary",
              onClick: () => {
                setCurrent(liveEvent);
                router.push({ pathname: router.pathname, query: { ...router.query, event: liveEvent.id } });
                try {
                  window.sessionStorage.setItem(ASK_KEY, "1");
                } catch {}
                closeModal();
              },
            },
            {
              label: "Create new blank event",
              variant: "success",
              onClick: () => {
                closeModal();
                setTimeout(() => {
                  openModal({
                    title: "Create event",
                    children: (
                      <CanopyAddEvent
                        compact
                        onCreated={(newEventId?: string) => {
                          if (newEventId) {
                            const created = eventList.find((e) => String(e.id) === String(newEventId));
                            if (created) {
                              setCurrent(created);
                              router.push({ pathname: router.pathname, query: { ...router.query, event: newEventId } });
                            }
                          }
                          try {
                            window.sessionStorage.setItem(ASK_KEY, "1");
                          } catch {}
                          closeModal();
                        }}
                      />
                    ),
                  });
                }, 0);
              },
            },
            {
              label: "Not now",
              variant: "secondary",
              onClick: () => {
                try {
                  window.sessionStorage.setItem(ASK_KEY, "1");
                } catch {}
                closeModal();
              },
            },
          ],
        },
      });
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveEvent && liveEvent.id, current && current.id]);

  /* -------- overlays: store <-> localStorage bridge -------- */

  const eventId = current?.id ? String(current.id) : undefined;

  const { overlays: storeOverlays, setOverlays } = useOverlayStore(eventId, current?.name);

  // Single source of truth: useOverlayStore
  const overlaysArr: Overlay[] = useMemo(() => {
    return Array.isArray(storeOverlays) ? (storeOverlays as any[]) : [];
  }, [storeOverlays]);

  /** ✅ Read enabled flag instead of existence */
  const isTypeEnabled = useCallback(
    (type: string) => {
      const o = overlaysArr.find((o) => String(o?.type).toLowerCase() === String(type).toLowerCase());
      return !!o && o.enabled !== false;
    },
    [overlaysArr]
  );

  /** ✅ Toggle enabled flag; never add/remove the canonical row */
  const toggleOverlay = useCallback(
    (type: OverlayType) => {
      if (!eventId) return;
      const key = String(type).toLowerCase();

      // Build next state and avoid no-op writes
      const next = (() => {
        const list = Array.isArray(storeOverlays) ? [...(storeOverlays as any[])] : [];
        const idx = list.findIndex((o: any) => String(o?.type).toLowerCase() === key);
        const base = idx >= 0 ? list[idx] : (defaultOverlayFor(type, current?.name) as any);
        const nextItem = { ...base, enabled: base.enabled === false ? true : !base.enabled };
        const copy = list.slice();
        if (idx >= 0) copy[idx] = nextItem;
        else copy.push(nextItem);
        return copy;
      })();

      if (jsonEq(storeOverlays, next)) return; // guard: no write if unchanged
      setOverlays(next as any);
    },
    [eventId, storeOverlays, setOverlays, current?.name]
  );

  /* -------- share live link (new) -------- */

  const onShareLive = useCallback(() => {
    if (!current?.id) return;
    const link = buildLiveUrl(current.id);

    const doCopy = async () => {
      try {
        await navigator.clipboard.writeText(link);
        setNotification({
          active: true,
          dismissable: true,
          persistence: 2000,
          list: [{ label: "Copied", message: "Live link copied to clipboard" }],
        });
      } catch (err: any) {
        setNotification({
          active: true,
          dismissable: true,
          persistence: 6000,
          apiError: { message: "Copy failed", status: 0, detail: err?.message ?? err, error: true },
        });
      }
    };

    openModal({
      title: "Share Live Overlay",
      children: (
        <div style={{ minWidth: 420 }}>
          <div style={{ marginBottom: 10, fontSize: "var(--s-6)", opacity: 0.8 }}>
            Share this link to load the live overlay page.
          </div>
          <div className="s-w-12" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--s-9)" }}>
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              style={{
                padding: "var(--s-10)",
                borderRadius: "var(--border-radius)",
                border: "1px solid var(--gray-70)",
                background: "var(--gray-90)",
                color: "var(--gray-20)",
                width: "100%",
              }}
            />
            <UiButton variant="primary" onClick={doCopy}>
              <UiIcon icon="fa-copy" />
              &nbsp;Copy
            </UiButton>
          </div>

          <div style={{ display: "flex", gap: "var(--s-9)", marginTop: "var(--s-9)" }}>
            <a href={link} target="_blank" rel="noreferrer">
              <UiButton variant="success">
                <UiIcon icon="fa-up-right-from-square" />
                &nbsp;Open in new tab
              </UiButton>
            </a>
            <UiButton variant="flat" onClick={() => closeModal()}>
              <UiIcon icon="fa-xmark" />
              &nbsp;Close
            </UiButton>
          </div>

          <div style={{ marginTop: "var(--s-9)", fontSize: "var(--s-5)", opacity: 0.7 }}>
            URL format: <code>/live/:eventId{merchant?.mid ? "?mid=" + merchant.mid : ""}</code>
          </div>
        </div>
      ),
    });
  }, [current?.id,  setNotification, merchant?.mid]);

  /* -------- selection + live toggle -------- */

  const deleteIcon = useMemo(() => {
    if (deletingId && String(deletingId) === String(current?.id)) return "fa-spinner fa-spin";
    return "fa-trash-can";
  }, [deletingId, current?.id]);

  const currentIsLive = !!(current && current.is_live);

  const onSelect = useCallback(
    (opt: { value?: string } | string) => {
      const valueName = typeof opt === "string" ? opt : opt?.value;
      if (!valueName) return;

      const selected = eventList.find((e) => (e.name ?? "").trim() === valueName.trim());
      if (!selected) return;
      setCurrent(selected);
      router.push({ pathname: router.pathname, query: { ...router.query, event: selected.id } });
      setNotification({
        active: true,
        persistence: 2000,
        dismissable: true,
        list: [{ label: "Event selected", message: `“${selected.name}”` }],
      });
    },
    [eventList, setCurrent, router, setNotification]
  );

  const handleToggleLive = useCallback(async () => {
    if (!current) return;

    const willEnable = !current.is_live;
    const prev = current;

    const optimistic: EventRow = { ...current, is_live: willEnable };
    setCurrent(optimistic);

    try {
      if (willEnable) {
        await db.updateData({ tableName: "livestream_event", set: { is_live: false }, where: { is_live: true } });
        await db.updateData({ tableName: "livestream_event", set: { is_live: true }, where: { id: current.id } });
        setNotification({
          active: true,
          dismissable: true,
          persistence: 2200,
          list: [{ label: "Live Enabled", message: `“${current.name}” is now LIVE` }],
        });
      } else {
        await db.updateData({ tableName: "livestream_event", set: { is_live: false }, where: { id: current.id } });
        setNotification({
          active: true,
          dismissable: true,
          persistence: 2000,
          list: [{ label: "Live Disabled", message: `“${current.name}” is no longer live` }],
        });
      }
    } catch (err: any) {
      setCurrent(prev);
      setNotification({
        active: true,
        dismissable: true,
        persistence: 6000,
        apiError: { message: "Failed to toggle Live", status: 0, detail: err?.message ?? err, error: true },
        list: [{ label: "Toggle failed", message: "State restored." }],
      });
    }
  }, [current, db, setCurrent, setNotification]);

  /* -------- render -------- */
  const EVENT_TABLE_KEYS = ["starts_at", "ends_at", "timezone", "is_live"] as const;

  const eventTableData = useMemo(
    () =>
      current
        ? Object.entries(current)
            .filter(([k]) => EVENT_TABLE_KEYS.includes(k as any))
            .map(([k, v]) => [k, v] as [string, any])
        : [],
    [current]
  );

  return (
    <>
      <style jsx>{styles}</style>
      <div className="canopy-properties">
        <UiTabsLayout
          direction="right"
          defaultView={current&&"overlays"||undefined}
          views={{
            events: (
              <>
                <div className="canopy-properties__actions">
                  <div className="canopy-properties__actions--list">
                    {/* Share */}
                    <UiIcon icon="fa-arrow-up-from-bracket" onClick={current ? onShareLive : undefined} />

                    {/* Create */}
                    <UiIcon
                      icon="fas-plus"
                      onClick={() =>
                        openModal({
                          title: "Create event",
                          children: (
                            <CanopyAddEvent
                              compact
                              onCreated={(newEventId?: string) => {
                                if (newEventId) {
                                  const created = eventList.find((e) => String(e.id) === String(newEventId));
                                  if (created) setCurrent(created);
                                  router.push({
                                    pathname: router.pathname,
                                    query: { ...router.query, event: newEventId },
                                  });
                                }
                                closeModal();
                              }}
                            />
                          ),
                        })
                      }
                    />

                    {/* Edit */}
                    <UiIcon
                      icon="fa-pen-to-square"
                      onClick={
                        current
                          ? () =>
                              openModal({
                                title: `Edit “${current.name}”`,
                                children: (
                                  <EditEventForm
                                    event={current}
                                    onDone={(updated) => {
                                      if (updated) {
                                        const merged = { ...current, ...updated } as EventRow;
                                        setCurrent(merged);
                                        router.push({
                                          pathname: router.pathname,
                                          query: { ...router.query, event: merged.id },
                                        });
                                      }
                                      closeModal();
                                    }}
                                  />
                                ),
                              })
                          : undefined
                      }
                    />

                    {/* Delete (delegate to parent; it will handle confirm + notifications) */}

                    <UiIcon
                      icon={deleteIcon}
                      onClick={current ? () => onDelete(current.id) : undefined}
                    />
                  </div>
                </div>
                <UiSelect
                  value={current ? current.name : "-- No Event --"}
                  options={options}
                  traits={{
                    beforeIcon: {
                      icon: "fa-broadcast-tower",
                      onClick: current ? handleToggleLive : undefined,
                      color: currentIsLive ? "var(--green-50)" : "var(--gray-60)",
                    },
                  }}
                  onSelect={onSelect}
                  label={!current ? "events" : !currentIsLive ? "switch to current live" : "current event"}
                  search
                />
                <AdapTable options={{ hide: "header" }} variant="mini" data={eventTableData} />
              </>
            ),
            overlays: (
              <>
                <div className="canopy-properties__overlay-list">
                  {OVERLAY_TYPES.map(({ type, label, icon }: any) => {
                    const enabled = isTypeEnabled(type);
                    return (
                      <UiButton
                        key={type}
                        variant={enabled ? "success blocky" : "blocky"}
                        onClick={() => current && toggleOverlay(type)}
                      >
                        <UiIcon icon={icon} />
                        &nbsp;{label}
                        {enabled ? " ✓" : ""}
                      </UiButton>
                    );
                  })}
                </div>
                {!current && <div className="canopy-properties__hint">select an event to enable overlays</div>}
              </>
            ),
          }}
        />
      </div>
    </>
  );
};

const CanopyNav = (props: any) => {
  const { width } = useWindow();
  if (props?.isDock) return <CanopyPropertiesContent {...props} />;

  if (width < 1100)
    return (
      <>
        <div className="s-w-9">
          <UiCollapse label="settings">
            <CanopyPropertiesContent {...props} />
          </UiCollapse>
        </div>
      </>
    );
  return <CanopyPropertiesContent {...props} />;
};
export default CanopyNav;
