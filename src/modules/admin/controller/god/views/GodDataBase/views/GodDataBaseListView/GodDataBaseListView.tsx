// Relative Path: ./GodDataBaseListView.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './GodDataBaseListView.scss';
import { getService } from '@webstack/common';
import IDataBaseService, { ListTablesResponse } from '~/src/core/services/DataBaseService/IDataBaseService';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

export interface GodDBListViewProps {
  /** Current schema value controlled by parent (optional). If omitted, component manages its own. */
  schema?: string | null;
  /** When user changes schema or the API resolves it (e.g., defaults), notify parent. */
  onSchemaChange?: (schema: string | null) => void;
  /** Notify parent when a table is selected. */
  onSelect: (tableName: string) => void;
  /** Optional initial filter text. */
  initialFilter?: string;
  /** Optional initially selected table. */
  initialSelected?: string | null;
  /** Bump this to force a reload from the parent (e.g., after create/delete). */
  refreshKey?: number;
}

const GodDataBaseListView: React.FC<GodDBListViewProps> = ({
  schema: schemaProp = null,
  onSchemaChange,
  onSelect,
  initialFilter = '',
  initialSelected = null,
  refreshKey = 0,
}) => {
  const db = getService<IDataBaseService>('IDataBaseService');

  // local state (controlled/uncontrolled hybrid for schema)
  const [schemaInput, setSchemaInput] = useState<string>(schemaProp ?? '');
  const [schema, setSchema] = useState<string | null>(schemaProp ?? null);

  // tables + ui
  const [tables, setTables] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const [filter, setFilter] = useState<string>(initialFilter);
  const [state, setState] = useState<LoadState>('idle');
  const [err, setErr] = useState<string | null>(null);

  // keep schema field in sync if parent changes it
  useEffect(() => {
    setSchema(schemaProp ?? null);
    setSchemaInput(schemaProp ?? '');
  }, [schemaProp]);

  const loadTables = useCallback(async () => {
    setState('loading');
    setErr(null);
    try {
      // pass `null` if empty string
      const effectiveSchema = schemaInput.trim() ? schemaInput.trim() : null;
      const res: ListTablesResponse = await db.listTables(effectiveSchema);
      setSchema(res.schema ?? null);
      onSchemaChange?.(res.schema ?? null);

      const list = res.tables ?? [];
      setTables(list);

      // choose selection
      const nextSelected =
        list.includes(selected || '') ? selected : (list[0] ?? null);

      setSelected(nextSelected ?? null);
      if (nextSelected) onSelect(nextSelected);

      setState('loaded');
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load tables');
      setState('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, schemaInput, selected, onSchemaChange, onSelect]);

  // initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    loadTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reload when parent bumps refreshKey
  useEffect(() => {
    if (typeof window === 'undefined') return;
    loadTables();
  }, [refreshKey, loadTables]);

  // reload if parent-controlled schema changes (and we’ve already mounted)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // only reload if schemaProp differs from current input (to avoid double fetches)
    if ((schemaProp ?? '') !== schemaInput) {
      setSchemaInput(schemaProp ?? '');
      loadTables();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaProp]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return tables;
    return tables.filter(t => t.toLowerCase().includes(q));
  }, [tables, filter]);

  const handleSelect = (t: string) => {
    setSelected(t);
    onSelect(t);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <aside className="gdb__sidebar">
        <div className="gdb__side-head">
          <h2>Tables{schema ? ` · ${schema}` : ''}</h2>
          <div className="gdb__row gdb__row--schema">
            <input
              className="gdb__input"
              placeholder="schema (e.g. public)"
              value={schemaInput}
              onChange={(e) => setSchemaInput(e.target.value)}
            />
            <button className="gdb__btn" onClick={loadTables} disabled={state === 'loading'}>
              {state === 'loading' ? '…' : '↻'}
            </button>
          </div>
          <div className="gdb__row">
            <input
              className="gdb__input"
              placeholder="Search tables…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {state === 'error' && <div className="gdb__error">{err}</div>}

        <div className="gdb__list">
          {filtered.map((t) => (
            <button
              key={t}
              className={`gdb__list-item ${t === selected ? 'is-active' : ''}`}
              onClick={() => handleSelect(t)}
              title={t}
            >
              {t}
            </button>
          ))}
          {!filtered.length && state === 'loaded' && (
            <div className="gdb__empty">No tables found.</div>
          )}
        </div>
      </aside>
    </>
  );
};

export default GodDataBaseListView;
