// Relative Path: ./GodDataBase.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './GodDataBase.scss';
import { getService } from '@webstack/common';
import IDataBaseService, {
  DescribeColumn,
  ODataBaseData,
} from '~/src/core/services/DataBaseService/IDataBaseService';
import GodDataBaseListView from '../views/GodDataBaseListView/GodDataBaseListView';
import GodDataBaseCreateTable from '../views/GodDataBaseCreateTable/GodDataBaseCreateTable';

// Adaptable table
import AdapTable, { TableOptions } from '@webstack/components/AdapTable/views/AdapTable';
import GodDataBaseDeleteTable from '../views/GodDataBaseDeleteTable/GodDataBaseDeleteTable';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';
const DEFAULT_LIMIT = 50;

const GodDataBase: React.FC = () => {
  const db = getService<IDataBaseService>('IDataBaseService');

  // schema is chosen in the ListView
  const [schema, setSchema] = useState<string | null>(null);
  // selected table (from ListView)
  const [selected, setSelected] = useState<string | null>(null);

  // columns & rows preview
  const [cols, setCols] = useState<DescribeColumn[]>([]);
  const [colsState, setColsState] = useState<LoadState>('idle');
  const [colsErr, setColsErr] = useState<string | null>(null);

  const [rows, setRows] = useState<any[]>([]);
  const [rowsState, setRowsState] = useState<LoadState>('idle');
  const [rowsErr, setRowsErr] = useState<string | null>(null);

  // Adaptable table state
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  // Create Table UI
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0); // bump to ask ListView to refetch

  /** Load column metadata for selected table */
  const loadColumns = useCallback(
    async (tableName: string | null) => {
      if (!tableName) return;
      setColsState('loading');
      setColsErr(null);
      try {
        const meta = await db.describeTable(tableName, schema ?? null);
        setCols(meta || []);
        setColsState('loaded');
      } catch (e: any) {
        setColsErr(e?.message ?? `Failed describing ${tableName}`);
        setColsState('error');
      }
    },
    [db, schema]
  );

  /** Load preview rows using selectData */
  const loadPreview = useCallback(
    async (tableName: string | null) => {
      if (!tableName) return;
      setRowsState('loading');
      setRowsErr(null);
      try {
        const res: ODataBaseData = await db.selectData({
          tableName,
          rows: [],
          cells: [], // all columns
          where: { exact: {}, includes: {}, created: 0 },
          // backend accepts 'schema' alias (mapped to db_schema server-side)
          // @ts-ignore
          schema: schema ?? undefined,
        } as any);

        const data = Array.isArray(res?.data) ? res.data : [];
        setRows(data);
        setRowsState('loaded');
        setPage(1);
      } catch (e: any) {
        setRowsErr(e?.message ?? `Failed loading ${tableName} preview`);
        setRowsState('error');
      }
    },
    [db, schema]
  );

  // When selected table changes -> refresh columns + preview
  useEffect(() => {
    if (!selected) return;
    loadColumns(selected);
    loadPreview(selected);
  }, [selected, loadColumns, loadPreview]);

  // After a table is created in the form
  const handleCreated = (newTableName?: string) => {
    setShowCreate(false);
    setRefreshKey(k => k + 1);      // signal the list view to refetch tables
    if (newTableName) setSelected(newTableName);
  };

  // Adaptable options
  const tableTitle = useMemo(
    () => (selected ? `Preview · ${selected}${schema ? ` · ${schema}` : ''}` : 'Preview'),
    [selected, schema]
  );

  const tableOptions: TableOptions = useMemo(
    () => ({
      tableTitle,
      hoverable: true,
      index: 0, // show row index column starting at 1 inside component
      placeholder: 'Search rows…',
      renderCell: (key, item) => {
        const v = item?.[key];
        if (v == null) return '—';
        if (typeof v === 'object') return JSON.stringify(v);
        if (typeof v === 'boolean') return v ? 'true' : 'false';
        return String(v);
      },
    }),
    [tableTitle]
  );

  // Column list for static table above Adaptable
  const colHeaders = useMemo(() => cols.map((c) => c.name), [cols]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="gdb">
        {/* Sidebar: schema + table list */}
        <GodDataBaseListView
          schema={schema}
          onSchemaChange={setSchema}
          onSelect={setSelected}
          refreshKey={refreshKey}        // <-- make sure ListView uses this in its useEffect deps
        />

        {/* Main */}
        <main className="gdb__main">
          <div className="gdb__main-head">
            <div className="gdb__title">
              <h1>GodDataBase</h1>
              {selected && <span className="gdb__badge">{selected}</span>}
              {schema && <span className="gdb__badge gdb__badge--muted">{schema}</span>}
            </div>
            <div className="gdb__controls">
              <button
                className="gdb__btn"
                onClick={() => selected && (loadColumns(selected), loadPreview(selected))}
                disabled={rowsState === 'loading' || colsState === 'loading'}
              >
                Refresh
              </button>
              <button
                className="gdb__btn"
                onClick={() => setShowCreate(v => !v)}
                title="Create a new table"
              >
                {showCreate ? 'Close Create' : 'Create Table'} 
              </button>
            </div>
          </div>

          {showCreate && (
            <section className="gdb__section">
              <GodDataBaseCreateTable schema={schema} onCreated={handleCreated} />
            </section>
          )}
          {selected && (
            <section className="gdb__section">
              <h3>Danger Zone</h3>
              <GodDataBaseDeleteTable
                tableName={selected}
                schema={schema}
                onDeleted={() => {
                  // Clear selection and refresh list
                  setSelected(null);
                  // If your list view exposes a refreshKey, bump it; otherwise trigger whatever you use to reload tables.
                  // setListRefreshKey(k => k + 1);
                }}
              />
            </section>
          )}
          {!selected && !showCreate && (
            <div className="gdb__placeholder">
              Select a table to view its columns and preview rows.
            </div>
          )}

          {selected && (
            <>
              {/* Columns */}
              <section className="gdb__section">
                <h3>Columns</h3>
                {colsState === 'error' && <div className="gdb__error">{colsErr}</div>}
                {colsState === 'loading' && <div className="gdb__loading">Loading columns…</div>}
                {colsState === 'loaded' && (
                  <div className="gdb__table-wrap">
                    <table className="gdb__table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Nullable</th>
                          <th>Primary</th>
                          <th>Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cols.map((c, i) => (
                          <tr key={c.name ?? i}>
                            <td>{c.name}</td>
                            <td>{String(c.type ?? '').replace(/^<|>$/g, '')}</td>
                            <td>{c.nullable ? 'true' : 'false'}</td>
                            <td>{(c as any).primary_key ? 'true' : 'false'}</td>
                            <td>{c.default == null ? '—' : String(c.default)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!cols.length && <div className="gdb__empty">No columns.</div>}
                  </div>
                )}
              </section>

              {/* Data preview via Adaptable */}
              <section className="gdb__section">
                <h3>Preview</h3>
                {rowsState === 'error' && <div className="gdb__error">{rowsErr}</div>}
                {rowsState === 'loading' && <div className="gdb__loading">Loading rows…</div>}
                {rowsState === 'loaded' && (
                  <>
                    <AdapTable
                      data={rows}
                      total={rows.length}
                      loading={String(rowsState) === 'loading'}
                      // header search
                      search={search}
                      setSearch={setSearch}
                      // pagination
                      page={page}
                      setPage={setPage}
                      limit={limit}
                      setLimit={setLimit}
                      // look & feel
                      options={tableOptions}
                      // optional actions
                      onRowClick={(row) => console.log('row click', row)}
                      onSelect={(row) => console.log('row select', row)}
                    />
                    {!rows.length && <div className="gdb__empty">No rows to display.</div>}
                  </>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default GodDataBase;
