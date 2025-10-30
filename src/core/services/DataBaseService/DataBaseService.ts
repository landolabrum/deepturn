import environment from "~/src/core/environment";
import ApiService from "../ApiService";

import IDataBaseService, {
  IDataBaseData,
  ODataBaseData,
  SelectRequest,
  InsertRequest,
  LegacyInsertRequest,
  UpdateRequest,
  DeleteRequest,
  CreateTableRequest,
  DropTableRequest,
  ListTablesResponse,
  DescribeColumn,
  OverlayPingResponse,
  LiveStreamRow,
  LiveStreamAuth,
  StreamListParams,
} from "./IDataBaseService";

import {
  assertTable,
  toQS,
  normalizeSelect,
  normalizeInsert,
  normalizeUpdate,
  normalizeDelete,
} from "./DataBaseFunctions";

/* --------------------- API paths --------------------- */
const PATH_SELECT = "api/db/select";
const PATH_INSERT = "api/db/insert";
const PATH_UPDATE = "api/db/update";
const PATH_DELETE = "api/db/delete";
const PATH_CREATE_TABLE = "api/db/create_table";
const PATH_DROP_TABLE = "api/db/drop_table";
const PATH_LIST_TABLES = "api/db/list_tables";
const PATH_DESCRIBE_TABLE = "api/db/describe_table";
const PATH_INSERT_EVENT = "api/db/insert_event";
const PATH_OVERLAY_PING = "api/db/overlay_ping";          // NEW
const PATH_OVERLAY_STREAM = "api/db/overlay_stream";      // NEW
/* const PATH_UPSERT = "api/db/upsert";  // uncomment if you add a backend endpoint */
/* ===================================================== */
const PATH_STREAM_CFG_GET    = "api/db/stream_config";
const PATH_STREAM_CFG_SET    = "api/db/stream_config_set";
const PATH_STREAM_CFG_REVOKE = "api/db/stream_config_revoke";
const PATH_STREAM_CREATE     = "api/db/stream_create";
const PATH_STREAM_UPDATE     = "api/db/stream_update";
const PATH_STREAM_DELETE     = "api/db/stream_delete";
const PATH_STREAM_LIST       = "api/db/stream_list";
const PATH_STREAM_START      = "api/db/stream_start";
const PATH_STREAM_END        = "api/db/stream_end";

export default class DataBaseService extends ApiService implements IDataBaseService {
  constructor() {
    // points at your backend origin (e.g. https://api.yourdomain.com)
    super(environment.serviceEndpoints.data);
  }

  /* ---------------- helpers ---------------- */

  /** Absolute base URL this service is targeting (no trailing slash). */
  public getBaseUrl(): string {
    const raw =
      (this as any).baseUrl ||
      environment?.serviceEndpoints?.data ||
      "";
    return String(raw).replace(/\/+$/, "");
  }

  /** Build absolute SSE URL for overlay stream for an event. */
  public overlayStreamUrl(eventId: string | number): string {
    const base = this.getBaseUrl();
    const eid = encodeURIComponent(String(eventId));
    return `${base}/${PATH_OVERLAY_STREAM}?event_id=${eid}`;
  }

  /* ---------------- IDataBaseService (CRUD) ---------------- */

  public async selectData(data: SelectRequest | IDataBaseData): Promise<ODataBaseData> {
    assertTable(data);
    const payload = normalizeSelect(data);
    return this.post<typeof payload, ODataBaseData>(PATH_SELECT, payload);
  }

  public async insertData(req: InsertRequest | LegacyInsertRequest): Promise<ODataBaseData> {
    assertTable(req);
    const payload = normalizeInsert(req);
    return this.post<typeof payload, ODataBaseData>(PATH_INSERT, payload);
  }

  public async updateData(req: UpdateRequest | IDataBaseData): Promise<ODataBaseData> {
    assertTable(req);
    const payload = normalizeUpdate(req);
    return this.post<typeof payload, ODataBaseData>(PATH_UPDATE, payload);
  }

  public async deleteData(req: DeleteRequest | IDataBaseData): Promise<ODataBaseData> {
    assertTable(req);
    const payload = normalizeDelete(req);
    // Use POST to ensure body is sent; many clients drop bodies on DELETE.
    return this.post<typeof payload, ODataBaseData>(PATH_DELETE, payload);
  }

  /* Optional: only if you add a backend endpoint for upsert
  public async upsertData(args: { tableName: string; values: any[]; conflictKeys: string[] }) {
    assertTable(args);
    return this.post<typeof args, any>(PATH_UPSERT, args);
  }
  */

  /* -------------------- DDL methods -------------------- */

  public async createTable(req: CreateTableRequest) {
    assertTable(req);
    const payload = {
      tableName: req.tableName,
      schema: req.schema ?? null,
      columns: req.columns ?? [],
      if_not_exists: req.if_not_exists ?? true,
    };
    return this.post<typeof payload, any>(PATH_CREATE_TABLE, payload);
  }

  public async dropTable(req: DropTableRequest) {
    assertTable(req);
    const payload = {
      tableName: req.tableName,
      schema: req.schema ?? null,
    };
    return this.post<typeof payload, any>(PATH_DROP_TABLE, payload);
  }

  public async listTables(schema?: string | null): Promise<ListTablesResponse> {
    const qs = toQS({ schema: schema ?? null });
    return this.get<ListTablesResponse>(`${PATH_LIST_TABLES}${qs}`);
  }

  public async describeTable(tableName: string, schema?: string | null): Promise<DescribeColumn[]> {
    assertTable({ tableName });
    const qs = toQS({ tableName, schema: schema ?? null });
    const res = await this.get<{ tableName: string; data: DescribeColumn[]; status: string }>(
      `${PATH_DESCRIBE_TABLE}${qs}`
    );
    return Array.isArray((res as any)) ? ((res as any) as DescribeColumn[]) : (res?.data ?? []);
  }

  public async insertEvent(values: Record<string, any>): Promise<ODataBaseData> {
    return this.post<{ values: Record<string, any> }, ODataBaseData>(PATH_INSERT_EVENT, { values });
  }

  /* -------------------- App-specific -------------------- */

  /** Ask backend to broadcast an overlay change for a given event_id. */
  public async pingOverlay(eventId: string | number): Promise<OverlayPingResponse> {
    const payload = { event_id: String(eventId) };
    return this.post<typeof payload, OverlayPingResponse>(PATH_OVERLAY_PING, payload);
  }

  /* -------------------- LiveStream helpers -------------------- */
public async streamList(
  args: StreamListParams = {}
): Promise<{
  tableName: "livestream_stream";
  data: LiveStreamRow[];
  status: string;
  note?: string;
}> {
  const qs = toQS({
    // keep undefineds out so toQS can omit them
    event_id: args.event_id ?? undefined,
    stripe_id: args.stripe_id ?? undefined,
    platform: args.platform ?? undefined,
    status: args.status ?? undefined,
  });

  return this.get<{
    tableName: "livestream_stream";
    data: LiveStreamRow[];
    status: string;
    note?: string;
  }>(`${PATH_STREAM_LIST}${qs}`);
}

public async streamConfigSet(values: Partial<LiveStreamAuth>) {
  return this.post<{ values: typeof values }, { tableName: string; data: LiveStreamAuth[]; status: string }>(
    PATH_STREAM_CFG_SET, { values }
  );
}

public async streamCreate(values: Partial<LiveStreamRow>) {
  return this.post<{ values: typeof values }, { tableName: string; data: LiveStreamRow[]; status: string }>(
    PATH_STREAM_CREATE, { values }
  );
}

public async streamUpdate(id: number, values: Partial<LiveStreamRow>) {
  return this.post<{ id: number; values: typeof values }, { tableName: string; data: LiveStreamRow[]; status: string }>(
    PATH_STREAM_UPDATE, { id, values }
  );
}

public async streamDelete(id: number) {
  return this.post<{ id: number }, { tableName: string; data: LiveStreamRow[]; status: string }>(
    PATH_STREAM_DELETE, { id }
  );
}

public async streamStart(id: number) {
  return this.post<{ id: number }, { tableName: string; data: LiveStreamRow[]; status: string }>(
    PATH_STREAM_START, { id }
  );
}

public async streamEnd(id: number) {
  return this.post<{ id: number }, { tableName: string; data: LiveStreamRow[]; status: string }>(
    PATH_STREAM_END, { id }
  );
}
}
