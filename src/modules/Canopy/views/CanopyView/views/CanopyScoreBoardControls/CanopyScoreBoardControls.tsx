

/* =========================================================================================
   4) AdminLiveStreamScoreBoardControls — single-flight roster, no spam; correct import path
   ========================================================================================= */

import stylesControls from './CanopyScoreBoardControls.scss';
import { getService as getSvc } from '@webstack/common';
import DBService from '~/src/core/services/DataBaseService/IDataBaseService';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import AdminLiveStreamEditTeam from '../../../forms/CanopyTeamForm/CanopyTeamForm';
import UiTicker from '@webstack/components/UiForm/components/UiTicker/UiTicker';
import { useLiveStreamCtx as _useLiveStreamCtx } from '../../../../context/CanopyProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type RosterRow = {
  id?: string | number;
  event_id: string | number;
  team_id?: string | number | null;
  team_name: string;
  vehicle_number?: string | number | null;
  category?: string | null;
  score?: number | null;
  driver_name?: string | null;
  primary_vehicle?: string | null;
};

type Props = { current: { id: string; name: string } | null };

const KEY = 'Roster';
const SAVE_DEBOUNCE_MS = 300;

function apiBaseFromDb() {
  const db: any = getSvc<DBService>('IDataBaseService');
  return String(db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
}

export const CanopyScoreBoardControls: React.FC<Props> = ({ current }) => {
  const db = getSvc<DBService>('IDataBaseService');
  const { openModal, closeModal } = useModal();

  const [pageState, setPageState] = useState
  <'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterRow[] | null>(null);

  const timers = useRef<Record<string, number>>({});
  const inflight = useRef<Promise<any> | null>(null);

  const coerceScore = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  const sortRoster = (list: RosterRow[]) =>
    [...list].sort((a, b) => {
      const as = coerceScore(a.score ?? 0);
      const bs = coerceScore(b.score ?? 0);
      if (as !== bs) return as - bs;

      const ac = (a.category ?? '').localeCompare(b.category ?? '');
      if (ac !== 0) return ac;

      const an = Number(String(a.vehicle_number ?? '').replace(/\D+/g, '')) || 0;
      const bn = Number(String(b.vehicle_number ?? '').replace(/\D+/g, '')) || 0;
      if (an !== bn) return an - bn;

      return (a.team_name ?? '').localeCompare(b.team_name ?? '');
    });

  const reflowScores = (list: RosterRow[], teamId: string | number, desired: number) => {
    if (!list?.length) return list;

    const desiredRank = Math.max(1, Math.floor(Number(desired) || 1));
    const ordered = sortRoster(list);
    const target = ordered.find((r) => String(r.id) === String(teamId));
    if (!target) return list;

    const others = ordered.filter((r) => r !== target);
    const insertAt = Math.min(desiredRank - 1, others.length);
    const newOrder = [...others.slice(0, insertAt), target, ...others.slice(insertAt)];

    return newOrder.map((r, i) => ({ ...r, score: i + 1 }));
  };

  const overlayPing = useCallback(async (eventId: string | number | undefined) => {
    if (!eventId) return;
    const base = apiBaseFromDb();
    if (!base) return;
    try {
      await fetch(`${base}/api/db/overlay_ping?event_id=${encodeURIComponent(String(eventId))}`, {
        method: 'POST',
        keepalive: true,
      });
    } catch {
      /* non-fatal */
    }
  }, []);

  const queueSave = (teamId: string | number, score: number) => {
    const key = String(teamId);
    if (timers.current[key]) window.clearTimeout(timers.current[key]);
    timers.current[key] = window.setTimeout(() => {
      void saveScore(teamId, score);
      delete timers.current[key];
    }, SAVE_DEBOUNCE_MS) as unknown as number;
  };

  const saveScore = async (teamId: string | number, score: number) => {
    if (teamId == null) return;
    try {
      await db.updateData({
        tableName: 'event_team',
        set: { score },
        where: { exact: { id: teamId } },
      });
      await overlayPing(current?.id);
    } catch (e) {
      console.error('[LIVE STREAM] failed to update score', e);
    }
  };

  const setScoreLocal = (teamId: string | number, desiredScore: number) => {
    // console.log('setScoreLocal', teamId, desiredScore, roster);
    setRoster((prev) => {
      const prevList = prev ?? [];
      const nextList = reflowScores(prevList, teamId, desiredScore);

      nextList.forEach((nextRow) => {
        const prevRow = prevList.find((r) => String(r.id) === String(nextRow.id));
        if (!prevRow || coerceScore(prevRow.score) !== coerceScore(nextRow.score)) {
          queueSave(nextRow.id!, coerceScore(nextRow.score));
        }
      });

      return nextList;
    });
  };

  const normalizeList = (res: any): RosterRow[] => {
    if (Array.isArray(res)) return res as RosterRow[];
    if (Array.isArray(res?.data)) return res.data as RosterRow[];
    return [];
  };

  const loadRoster = useCallback(
    async (eventId: string | number, { force = false }: { force?: boolean } = {}) => {
      if (!eventId) {
        setRoster(null);
        setPageState('loading');
        return;
      }
      if (inflight.current && !force) return inflight.current;

      setPageState((prev:any) => (prev === 'ready' && !force ? prev : 'loading'));
      setErrorMsg(null);

      const p = (async () => {
        try {
          const res = await db.selectData({
            tableName: 'event_team',
            where: { exact: { event_id: eventId } },
          });

          const base = normalizeList(res).map((r: RosterRow) => ({
            ...r,
            event_id: r.event_id,
            team_name: r.team_name ?? '',
            vehicle_number: r.vehicle_number != null ? String(r.vehicle_number) : null,
            score: coerceScore(r.score ?? 0),
          }));

          const seeded = sortRoster(base).map((r, i) => ({ ...r, score: i + 1 }));
          setRoster(seeded);
          setPageState('ready');
        } catch (e: any) {
          console.error('[LIVE STREAM] loadRoster', e);
          setRoster([]);
          setPageState('error');
          setErrorMsg(e?.message ?? 'Failed to load roster');
        } finally {
          inflight.current = null;
        }
      })();

      inflight.current = p;
      return p;
    },
    [db]
  );

  // Validate import path at compile time; not used otherwise
  _useLiveStreamCtx();

  const handleAddTeamModal = useCallback(() => {
    openModal({
      title: `Add Team • ${current?.name ?? ''}`,
      children: (
        <AdminLiveStreamEditTeam
          team={null}
          eventId={current?.id}
          onUpdated={async () => {
            closeModal();
            if (current?.id) {
              await loadRoster(current.id, { force: true });
              await overlayPing(current.id);
            }
          }}
        />
      ),
    });
  }, [closeModal, openModal, current?.id, loadRoster, overlayPing]);

  const handleEditTeamModal = useCallback(
    (team: RosterRow) => {
      openModal({
        title: `Edit Team: ${team.team_name}`,
        children: (
          <AdminLiveStreamEditTeam
            team={team}
            eventId={current?.id}
            onUpdated={async () => {
              closeModal();
              if (current?.id) {
                await loadRoster(current.id, { force: true });
                await overlayPing(current.id);
              }
            }}
          />
        ),
      });
    },
    [openModal, closeModal, current?.id, loadRoster, overlayPing]
  );

  const onRowClick = useCallback(
    (arg: MouseEvent | { id: string | number }, bypassed: boolean = false) => {
      let rowKey: string | undefined;

      if (typeof arg === 'string') {
        rowKey = arg;
      } else if (arg && typeof arg === 'object' && 'id' in arg) {
        const r = arg as { id: string | number };
        rowKey = r.id?.toString();
      } else if (arg && 'target' in arg) {
        let el: HTMLElement | null = (arg as MouseEvent).target as HTMLElement;
        while (el && !rowKey) {
          rowKey = el.dataset?.rowkey;
          el = el.parentElement;
        }
      }

      if (!rowKey && !bypassed) return;
      const teamToEdit = roster?.find((team) => String(team.id) === rowKey);
      if (teamToEdit) handleEditTeamModal(teamToEdit);
    },
    [handleEditTeamModal, roster]
  );
// AdapTable's onDrag gives: { data, from, to, row }
// The table is already rendered as sortRoster(roster), so `from`/`to` are rank-1 indexes.
const onRowDrag = (e: { data: any[]; from: number; to: number; row?: { id?: string|number } }) => {
  const { from, to, row } = e;
  if (from === to) return;

  // Get the moved team id robustly:
  // 1) Prefer the row.id AdapTable passes
  // 2) Fallback: derive from our current sorted roster by index
  let movedId = row?.id;

  if (movedId == null) {
    // use our source of truth (roster) to map UI index -> team id
    const ordered = sortRoster(roster ?? []);
    movedId = ordered[from]?.id;
  }

  if (movedId == null) return;

  // Desired rank is the drop index + 1 (scores are 1..N)
  const desiredScore = to + 1;

  // Single call — let setScoreLocal + reflowScores take care of the rest
  setScoreLocal(movedId, desiredScore);
};


  const rosterTableData = useMemo(() => {
    if (!roster) return null;

    return sortRoster(roster).map((f: RosterRow) => {
      const val = coerceScore(f.score ?? 0);
      return {
        [KEY]: f.team_name || '(unnamed team)',
        id: f.id ?? f.team_name,
        score: (
          <div key={`pill-wrap-${f.id}`} onClick={(e) => e.stopPropagation()}>
            <UiTicker
              variant="rank"
              amount={val}
              setAmount={(next: number) => setScoreLocal(f.id!, next)}
            />
          </div>
        ),
      };
    });
  }, [roster]);

  useEffect(() => {
    if (current?.id) void loadRoster(current.id);
    else {
      setRoster(null);
      setPageState('loading');
    }
  }, [current?.id, loadRoster]);

  return (
    <>
      <style jsx>{stylesControls}</style>
      <div className="admin-live-stream-controls">
        <div className="admin-live-stream-controls__section">
          {pageState === 'loading' && 'No event, or still loading'}
          {pageState === 'error' && <div role="alert">Error: {errorMsg}</div>}
          {pageState === 'ready' && rosterTableData && (
            <AdapTable
              options={{ hide: 'header' }}
              variant="mini"
              data={rosterTableData}
              onRowClick={onRowClick}
              onDrag={onRowDrag} 
            />
          )}

          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <UiButton onClick={handleAddTeamModal} variant="link" traits={{afterIcon:"fa-user-group"}}>
              Add Team
            </UiButton>
          </div>
        </div>
      </div>
    </>
  );
};