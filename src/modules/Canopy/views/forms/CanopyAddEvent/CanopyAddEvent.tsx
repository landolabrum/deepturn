import React, { useMemo, useState } from "react";
import styles from "./CanopyAddEvent.scss";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import { useRouter } from "next/router";

type Props = {
  onCreated?: (newEventId?: string) => void;
  compact?: boolean;
};

const TZ_OPTS = [
  "UTC", "America/Denver", "America/Los_Angeles", "America/Chicago", "America/New_York",
  "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Australia/Sydney"
].map(z => ({ label: z, value: z }));

function toISO(dtLocal?: string | null) {
  if (!dtLocal) return null;
  const d = new Date(dtLocal);
  return isNaN(+d) ? null : d.toISOString(); // convert local “datetime-local” -> UTC ISO
}

const TABLE_EVENT = "livestream_event";

const CanopyAddEvent: React.FC<Props> = ({ onCreated, compact }) => {
  const db = getService<IDataBaseService>("IDataBaseService");
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  // Keep timezone as a string for the select; store as string in DB.
  const [values, setValues] = useState<Record<string, any>>({
    name: "",
    starts_at: "",
    ends_at: "",
    timezone: "America/Denver",
    is_live: false,
    address: null as any,
    lat: null as number | null,
    lng: null as number | null,
  });

  const fields: IFormField[] = useMemo(() => ([
    { name: "name", label: "Event name", type: "text", required: true, value: values.name, constraints: { min: 3 } },
    { name: "starts_at", label: "Starts at", type: "datetime-local", required: true, value: values.starts_at, width: "50%" },
    { name: "ends_at", label: "Ends at", type: "datetime-local", value: values.ends_at, width: "50%" },
    {
      name: "set start = Now", label: "set start = Now", type: "button", onClick: () =>
        setValues(v => ({ ...v, starts_at: new Date().toISOString().slice(0, 16), value: " undefined" }))
    },
    {name:'ends-plus',onClick:() =>
                setValues(v => ({
                  ...v,
                  ends_at: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
                })), type:"button",label:"ends +1H"},
    { name: "timezone", label: "Timezone", type: "select", options: TZ_OPTS, value: values.timezone, input: true },
    { name: "address", label: "Location (optional)", type: "address", value: values.address },
    values.lat != null ? { name: "lat", label: "Latitude", readonly: true, value: String(values.lat) } : ({} as any),
    values.lng != null ? { name: "lng", label: "Longitude", readonly: true, value: String(values.lng) } : ({} as any),
    { name: "is_live", label: "Is live?", type: "checkbox", value: !!values.is_live },
  ].filter(Boolean) as IFormField[]), [values]);

  const handleChange = (e: any) => {
    const { name, value } = e.target || e;

    if (name === "address") {
      setValues(v => ({
        ...v,
        address: value,
        lat: value?.lat ?? null,
        lng: value?.lng ?? null,
      }));
      return;
    }

    if (name === "starts_at") {
      setValues(v => {
        const next: any = { ...v, starts_at: value };
        if (!v.ends_at && value) {
          const start = new Date(value);
          if (!isNaN(+start)) {
            const plus1h = new Date(start.getTime() + 60 * 60 * 1000);
            next.ends_at = plus1h.toISOString().slice(0, 16);
          }
        }
        return next;
      });
      return;
    }

    setValues(v => ({ ...v, [name]: value }));
  };

  const handleSubmit = async () => {
    setBusy(true);
    setError(null);
    setCreatedId(null);

    try {
      const row = {
        name: values.name?.trim(),
        starts_at: toISO(values.starts_at),
        ends_at: toISO(values.ends_at),
        timezone: values.timezone || null,        // ← store as string
        is_live: !!values.is_live,
        lat: values.lat ?? null,
        lng: values.lng ?? null,
      };

      if (!row.name || !row.starts_at) throw new Error("Name and start time are required.");

      // Use the same API shape read elsewhere by useLiveStream
      const res = await db.insertData({
        tableName: TABLE_EVENT,
        values: [row],
      } as any);

      const inserted =
        (Array.isArray((res as any)?.data) ? (res as any).data[0] : (res as any)?.data) || null;

      const id = inserted?.id ?? inserted?.event_id ?? null;
      if (!id) throw new Error("Event created but no id returned.");

      setCreatedId(String(id));

      // Set URL to the new event so Nav/View pick it up, then reload to repopulate events
      try {
        await router.replace(
          { pathname: router.pathname, query: { ...router.query, event: id } },
          undefined,
          { shallow: true }
        );
      } catch { /* no-op */ }

      onCreated?.(String(id));

      // Soft reset (keep tz/live/address)
      setValues(v => ({ ...v, name: "", starts_at: "", ends_at: "" }));

      // Reload to ensure the fresh event list is fetched and selected
      router.reload();
    } catch (e: any) {
      setError(e?.message || "Failed to create event");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-live-stream-add-event'>
        {createdId && (
          <div className='admin-live-stream-add-event--created'>
            <small style={{ opacity: 0.7 }}>created: {createdId}</small>
          </div>
        )}

        {error && <div style={{ color: "var(--red-600)", marginBottom: 8 }}>{error}</div>}

        <UiForm
          fields={fields}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitText="Add event"
          submitIcon="fas-plus"
          loading={busy}
        />
      </div>
    </>
  );
};

export default CanopyAddEvent;
