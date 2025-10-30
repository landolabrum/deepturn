import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './CanopyTeamForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { getService } from '@webstack/common';
import IDataBaseService from '~/src/core/services/DataBaseService/IDataBaseService';
import IHomeService from '~/src/core/services/HomeService/IHomeService';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiInput from '@webstack/components/UiForm/components/UiInput/UiInput';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

export type RosterRow = {
  id?: string | number;
  event_id?: string | number;
  team_id?: string | number | null;
  team_name?: string;
  vehicle_number?: string | number | null;
  driver_name?: string | null;
  throttleman_name?: string | null;
  primary_vehicle?: string | null;
};

type AdminLiveStreamEditTeamProps = {
  team?: Partial<RosterRow> | null;
  eventId?: string;
  onUpdated?: (saved?: RosterRow) => void;
};

type GpsSource = 'ic2' | 'udp' | 'tcp';

const TEAM_FIELDS: Array<{ name: keyof RosterRow; label: string; required?: boolean }> = [
  { name: 'team_name', label: 'Team Name', required: true },
  { name: 'vehicle_number', label: 'Vehicle Number' },
  { name: 'driver_name', label: 'Driver Name' },
    { name: 'throttleman_name', label: 'Throttleman Name' },

  { name: 'primary_vehicle', label: 'Primary Vehicle' },
];

const pick = <T extends object>(obj: T, keys: (keyof T)[]) =>
  keys.reduce((acc, k) => {
    if (obj[k] !== undefined) (acc as any)[k] = obj[k];
    return acc;
  }, {} as Partial<T>);

const compact = (obj: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === '')) out[k] = v;
  }
  return out;
};

const keyForTeam = (r: RosterRow) =>
  `${(r.team_name || '').toString().trim().toLowerCase()}|${(r.vehicle_number ?? '')}`
    .toString()
    .trim()
    .toLowerCase();

/** Coerce UiSelect/mixed values to primitives for storage/rendering */
const coerceSelectVal = (v: any) => (v && typeof v === 'object' ? (v.value ?? v.label ?? '') : v);

/** API base for overlay ping */
function getApiBaseFromDb() {
  const db: any = getService<IDataBaseService>('IDataBaseService');
  return String(db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
}

async function overlayPing(eventId?: string | number) {
  if (!eventId) return;
  const api = getApiBaseFromDb();
  if (!api) return;
  try {
    await fetch(`${api}/api/db/overlay_ping?event_id=${encodeURIComponent(String(eventId))}`, {
      method: 'POST',
      keepalive: true,
    });
  } catch {
    /* best effort */
  }
}

/** Build GPS options from fields (includes optional IC2 overrides) */
function normalizeGpsFromFields(fields: IFormField[]) {
  const rawSrc = fields.find(f => f.name === 'gps_source')?.value;
  const src = String(coerceSelectVal(rawSrc) ?? 'ic2') as GpsSource;
  const label = String(fields.find(f => f.name === 'gps_label')?.value ?? '').trim() || undefined;

  if (src === 'ic2') {
    const device_id_raw = fields.find(f => f.name === 'gps_device_id')?.value;
    const device_id = Number(device_id_raw);
    if (!Number.isFinite(device_id)) return null;

    const org_id = String(fields.find(f => f.name === 'ic2_org_id')?.value ?? '').trim() || undefined;
    const group_id = String(fields.find(f => f.name === 'ic2_group_id')?.value ?? '').trim() || undefined;
    const client_id = String(fields.find(f => f.name === 'ic2_client_id')?.value ?? '').trim() || undefined;
    const client_secret = String(fields.find(f => f.name === 'ic2_client_secret')?.value ?? '').trim() || undefined;

    return compact({ source: src, device_id, label, org_id, group_id, client_id, client_secret });
  } else {
    const port_raw = fields.find(f => f.name === 'gps_port')?.value;
    const port = Number(port_raw);
    if (!Number.isFinite(port)) return null;
    return compact({ source: src, port, label });
  }
}

const AdminLiveStreamEditTeam: React.FC<AdminLiveStreamEditTeamProps> = ({ team, eventId, onUpdated }) => {
  const db = useMemo(() => getService<IDataBaseService>('IDataBaseService'), []);
  const home = useMemo(() => getService<IHomeService>('IHomeService'), []);
  const isEdit = Boolean(team?.id);
  const effectiveEventId = String(team?.event_id ?? eventId ?? '');

  /* ========= Previous Teams ========= */

  const [prevTeams, setPrevTeams] = useState<RosterRow[] | null>(null);
  const [prevLoading, setPrevLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const loadPreviousTeams = useCallback(async () => {
    setPrevLoading(true);
    try {
      const res = await db.selectData({ tableName: 'event_team' });
      const list: RosterRow[] = Array.isArray(res?.data) ? res.data : [];
      const filtered = effectiveEventId ? list.filter(r => String(r.event_id ?? '') !== String(effectiveEventId)) : list;
      const map = new Map<string, RosterRow>();
      filtered.forEach((r: RosterRow) => {
        const k = keyForTeam(r);
        if (!map.has(k)) map.set(k, r);
      });
      setPrevTeams(Array.from(map.values()));
    } catch (e) {
      setPrevTeams([]);
      console.error('[EditTeam] loadPreviousTeams failed', e);
    } finally {
      setPrevLoading(false);
    }
  }, [db, effectiveEventId]);

  useEffect(() => {
    void loadPreviousTeams();
  }, [loadPreviousTeams]);

  const filteredPrevTeams = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return prevTeams ?? [];
    return (prevTeams ?? []).filter((r: RosterRow) => {
      const hay = `${r.team_name ?? ''} ${r.vehicle_number ?? ''} ${r.driver_name ?? ''} ${r.primary_vehicle ?? ''}`
        .toLowerCase()
        .trim();
      return hay.includes(q);
    });
  }, [prevTeams, search]);

  /* ========= UiForm Fields (Team + GPS) ========= */

  // Initialize team fields
  const initialTeamFields: IFormField[] = TEAM_FIELDS.map(({ name, label, required }) => ({
    type: 'text',
    name,
    label,
    required: Boolean(required),
    value: (team as any)?.[name] ?? '',
  }));

  // Initialize GPS fields (includes IC2 overrides)
  const initialGpsFields: IFormField[] = [
    {
      type: 'select',
      name: 'gps_source',
      label: 'GPS Source',
      value: 'ic2',
      options: [
        { label: 'IC2', value: 'ic2' },
        { label: 'UDP', value: 'udp' },
        { label: 'TCP', value: 'tcp' },
      ],
    },
    { type: 'text', name: 'gps_device_id', label: 'IC2 Device ID', placeholder: 'e.g. 7', value: '', disabled: false },
    { type: 'text', name: 'ic2_org_id', label: 'IC2 Org ID', placeholder: 'e.g. fxu3ea', value: '', disabled: false },
    { type: 'text', name: 'ic2_group_id', label: 'IC2 Group ID', placeholder: 'e.g. 3', value: '', disabled: false },
    { type: 'text', name: 'ic2_client_id', label: 'IC2 Client ID', placeholder: 'OAuth client id', value: '', disabled: false },
    { type: 'text', name: 'ic2_client_secret', label: 'IC2 Client Secret', placeholder: 'OAuth client secret', value: '', disabled: false },
    { type: 'text', name: 'gps_port', label: 'Port', placeholder: 'e.g. 60660 or 60661', value: '', disabled: true },
    { type: 'text', name: 'gps_label', label: 'Label (optional)', placeholder: 'friendly label shown in gps_binding', value: '', disabled: false },
  ];

  const [formFields, setFormFields] = useState<IFormField[]>([...initialTeamFields, ...initialGpsFields]);

  // keep team fields in sync when editing or switching team prop
  useEffect(() => {
    setFormFields(prev => {
      const copy = [...prev];
      for (const def of TEAM_FIELDS) {
        const idx = copy.findIndex(f => f.name === def.name);
        if (idx >= 0) {
          copy[idx] = { ...copy[idx], value: (team as any)?.[def.name] ?? '' };
        } else {
          copy.push({
            type: 'text',
            name: def.name as string,
            label: def.label,
            required: Boolean(def.required),
            value: (team as any)?.[def.name] ?? '',
          });
        }
      }
      return copy;
    });
  }, [team]);

  // derived: current gps_source
  const gpsSource: GpsSource = useMemo(() => {
    const v = formFields.find(f => f.name === 'gps_source')?.value;
    const s = (typeof v === 'string' ? v : String(coerceSelectVal(v) || 'ic2')) as GpsSource;
    return (s || 'ic2') as GpsSource;
  }, [formFields]);

  // toggle visibility/enabled based on gps source
  useEffect(() => {
    setFormFields(prev =>
      prev.map(f => {
        if (f.name === 'gps_device_id' || (typeof f.name === 'string' && f.name.startsWith('ic2_'))) {
          const disabled = gpsSource !== 'ic2';
          return { ...f, disabled, value: disabled ? '' : f.value };
        }
        if (f.name === 'gps_port') {
          const disabled = !(gpsSource === 'udp' || gpsSource === 'tcp');
          return { ...f, disabled, value: disabled ? '' : f.value };
        }
        return f;
      })
    );
  }, [gpsSource]);

  /* ========= Actions for “Previous teams” ========= */

  const prefillFrom = useCallback((row: RosterRow) => {
    setFormFields(prev =>
      prev.map(f => {
        if (f.name === 'team_name') return { ...f, value: row.team_name ?? '' };
        if (f.name === 'vehicle_number') return { ...f, value: row.vehicle_number ?? '' };
        if (f.name === 'driver_name') return { ...f, value: row.driver_name ?? '' };
        if (f.name === 'primary_vehicle') return { ...f, value: row.primary_vehicle ?? '' };
        return f;
      })
    );
  }, []);

  const quickAddToEvent = useCallback(
    async (row: RosterRow) => {
      if (!effectiveEventId) return;
      try {
        const payload = compact({
          event_id: effectiveEventId,
          team_name: row.team_name,
          vehicle_number: row.vehicle_number,
          driver_name: row.driver_name,
          primary_vehicle: row.primary_vehicle,
        });

        const res = await db.insertData({ tableName: 'event_team', data: payload });
        const saved = (Array.isArray(res?.data) ? res.data?.[0] : res?.data) ?? payload;

        await overlayPing(effectiveEventId);
        onUpdated?.(saved as RosterRow);
      } catch (e) {
        console.error('[EditTeam] quickAddToEvent failed', e);
      }
    },
    [db, effectiveEventId, onUpdated]
  );

const prevTeamsRows = useMemo(
  () =>
    (filteredPrevTeams ?? []).map((r: RosterRow) => ({
      Team: r.team_name ?? '(unnamed)',
      Vehicle: r.vehicle_number ?? '',
      Driver: r.driver_name ?? '',
      Primary: r.primary_vehicle ?? '',
      id: r.id ?? keyForTeam(r),
      Actions: (
        <div className="row-actions" onClick={e => e.stopPropagation()}>
          <UiButton size="xs" variant="flat" onClick={() => prefillFrom(r)}>
            Prefill
          </UiButton>
          <UiButton size="xs" variant="success" onClick={() => quickAddToEvent(r)}>
            Quick-Add
          </UiButton>
        </div>
      ),
    })),
  [filteredPrevTeams, prefillFrom, quickAddToEvent]
);

  /* ========= UiForm submit / change ========= */

  const title = isEdit ? `Edit Team: ${team?.team_name ?? ''}` : 'Add Team';

  const handleFormChange = (e: any) => {
    const { name, value } = e?.target || {};
    if (!name) return;
    const next = coerceSelectVal(value);
    setFormFields(prev => prev.map(f => (f.name === name ? { ...f, value: next } : f)));
  };

  const handleSubmit = async (fieldsFromForm: IFormField[]) => {
    // Snapshot and coerce any select-ish objects to primitives
    const f = (fieldsFromForm?.length ? fieldsFromForm : formFields).map(ff => ({
      ...ff,
      value: coerceSelectVal(ff.value),
    })) as IFormField[];

    // Validate minimal team inputs
    const teamName = String(f.find(x => x.name === 'team_name')?.value ?? '').trim();
    if (!teamName || (!isEdit && !effectiveEventId)) {
      console.error('Missing required fields: team_name and event_id (for create).');
      return;
    }

    // Prepare team payload
    const teamPayload = {
      team_name: teamName,
      vehicle_number: String(f.find(x => x.name === 'vehicle_number')?.value ?? ''),
      driver_name: String(f.find(x => x.name === 'driver_name')?.value ?? ''),
      primary_vehicle: String(f.find(x => x.name === 'primary_vehicle')?.value ?? ''),
    };

    // Normalize GPS (optional)
    const gpsCfg = normalizeGpsFromFields(f); // null if invalid/incomplete

    try {
      let saved: RosterRow;

      if (isEdit && team?.id) {
        // UPDATE team
        const set = compact(pick({ ...team, ...teamPayload }, ['team_name', 'vehicle_number', 'driver_name', 'primary_vehicle']));
        const res = await db.updateData({ tableName: 'event_team', set, where: { id: team.id } });
        saved = { id: team.id, ...(Array.isArray(res?.data) ? res.data[0] : (res?.data ?? set)), event_id: team.event_id };

        // Bond on edit if GPS provided
        if (gpsCfg && home && (team.event_id ?? effectiveEventId)) {
          const eid = Number(team.event_id ?? effectiveEventId);
          const tid = Number(team.id);
          await home.gpsLiveForTeam(eid, tid, { ...(gpsCfg as any), save: true });
        }

        await overlayPing(team.event_id ?? effectiveEventId);
      } else {
        // INSERT team
        const payload = compact({ event_id: effectiveEventId, ...teamPayload });
        const res = await db.insertData({ tableName: 'event_team', data: payload });
        const row = (Array.isArray(res?.data) ? res.data[0] : res?.data) ?? payload;
        saved = { ...(row as RosterRow) };

        // Auto-bond on create if GPS provided
        if (gpsCfg && home && saved?.id && effectiveEventId) {
          await home.gpsLiveForTeam(Number(effectiveEventId), Number(saved.id), { ...(gpsCfg as any), save: true });
        }

        await overlayPing(effectiveEventId);
      }

      onUpdated?.(saved);

      // Reset after create (keep selected source)
      if (!isEdit) {
        setFormFields(prev =>
          prev.map(f => {
            if (['gps_source'].includes(f.name)) return f;
            return { ...f, value: '' };
          })
        );
      }
    } catch (err) {
      console.error('Error saving team:', err);
    }
  };

  /* ========= Delete ========= */

  const canDelete = isEdit && team?.id;
  const handleDelete = useCallback(async () => {
    if (!team?.id) return;
    try {
      await db.deleteData({ tableName: 'event_team', where: { exact: { id: team.id } } });
      await overlayPing(team.event_id ?? effectiveEventId);
      onUpdated?.();
    } catch (e) {
      console.error('[EditTeam] delete failed', e);
    }
  }, [db, team?.id, team?.event_id, effectiveEventId, onUpdated]);

  return (
    <>
      <style jsx>{styles}</style>

      <UiCollapse label="choose from previous teams">
        <div className="prev-teams s-w-100 " style={{ marginBottom: 16 }}>
          <div className="prev-teams__header">
            <div className="prev-teams__title">Previous teams</div>
            <div className="prev-teams__search">
              <UiInput
                name="search"
                placeholder="Search name, number, driver…"
                value={search}
                onChange={(e: any) => setSearch(e?.target?.value ?? '')}
              />
            </div>
          </div>

          <div className="prev-teams__table">
            {prevLoading ? (
              <div style={{ padding: 8, opacity: 0.7 }}>Loading…</div>
            ) : (prevTeamsRows?.length ?? 0) > 0 ? (
              <AdapTable
                variant="mini"
                data={prevTeamsRows}
                onRowClick={(row: any) => {
                  const match = (filteredPrevTeams ?? []).find(
                    t => String(t.id ?? keyForTeam(t)) === String(row?.id)
                  );
                  if (match) prefillFrom(match);
                }}
              />
            ) : (
              <div style={{ padding: 8, opacity: 0.6 }}>No previous teams found.</div>
            )}
          </div>
        </div>
      </UiCollapse>

      <UiForm
        title={title}
        fields={formFields}
        submitText={isEdit ? 'Update Team' : 'Create Team'}
        onSubmit={handleSubmit}
        onChange={handleFormChange}
      />

      {canDelete && (
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <UiButton variant="danger" onClick={handleDelete}>
            Delete Team
          </UiButton>
        </div>
      )}
    </>
  );
};

export default AdminLiveStreamEditTeam;
