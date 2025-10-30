/* ========= Shared shapes ========= */

export type WhereClause = {
  exact?: Record<string, any>;
  includes?: Record<string, any>;
  created?: number;
};

export type SelectRequest = {
  tableName: string;
  rows?: any[];
  cells?: string[];
  where?: WhereClause;
};

export type InsertRequest = {
  tableName: string;
  data: Record<string, any> | Record<string, any>[];
};

export type LegacyInsertRequest = {
  tableName: string;
  values: Record<string, any> | Record<string, any>[];
};

export type UpdateRequest = {
  tableName: string;
  set: Record<string, any>;
  /** simple equality map, e.g. { id: "..." } */
  where?: Record<string, any>;
};

export type DeleteRequest = {
  tableName: string;
  /** simple equality map */
  where?: Record<string, any>;
};

export type DescribeColumn = {
  name: string;
  type: string;
  nullable: boolean;
  default?: any;
  primary_key?: boolean;
};

export type ListTablesResponse = {
  schema: string | null;
  tables: string[];
};

export type IDataBaseData = {
  tableName: string;
  rows?: any[];
  cells?: string[];
  where?: WhereClause;
};

export type ODataBaseData = {
  tableName: string;
  data: any[];
  status: string;
};

/* ========= DDL request types ========= */

export type CreateTableRequest = {
  tableName: string;
  schema?: string | null;
  columns?: Array<{
    name: string;
    type: string;          // e.g. "uuid", "text", "integer", "jsonb", etc.
    nullable?: boolean;
    default?: string;      // raw SQL default, e.g. "now()", "gen_random_uuid()"
    primary_key?: boolean;
  }>;
  if_not_exists?: boolean; // default true
};

export type DropTableRequest = {
  tableName: string;
  schema?: string | null;
};

/* ========= App-specific extras ========= */

export type OverlayPingResponse = {
  ok: boolean;
  event_id?: string;
  error?: string;
};

/* ========= Livestream (NEW) ========= */


export type StreamPlatform =
  | "youtube" | "twitch" | "facebook" | "custom"
  | "vimeo"   | "kick"   | "rtmp"     | "instagram" | "tiktok";

export type LiveStreamStatus = "idle" | "live" | "ended";

// ✅ Use the unions here
export type LiveStreamRow = {
  id: number;
  event_id: number;
  stripe_id: string;
  platform: StreamPlatform;
  title: string;
  description?: string | null;
  status: LiveStreamStatus;
  ingest_url?: string | null;
  stream_key_enc?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  last_error?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
};
// src/core/services/DataBaseService/IDataBaseService.ts
export type LiveStreamAuth = {
  id: number;
  stripe_id: string;
  platform: StreamPlatform;
  account_id?: string | null;
  username?: string | null;
  access_token_enc?: string | null;
  refresh_token_enc?: string | null;
  expires_at?: string | null;
  scopes?: string[] | null;
  /** free-form blob to store provider specifics (instagrapi settings, etc.) */
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
};


// ✅ Param object stays optional and uses the unions
export type StreamListParams = {
  event_id?: number | string;
  stripe_id?: string;
  platform?: StreamPlatform;
  status?: LiveStreamStatus;
};

/* ========= Service interface ========= */

export default interface IDataBaseService {
  // CRUD
  selectData(data: SelectRequest | IDataBaseData): Promise<ODataBaseData>;
  insertData(req: InsertRequest | LegacyInsertRequest): Promise<ODataBaseData>;
  updateData(req: UpdateRequest | IDataBaseData): Promise<ODataBaseData>;
  deleteData(req: DeleteRequest | IDataBaseData): Promise<ODataBaseData>;

  // DDL
  createTable(req: CreateTableRequest): Promise<{
    tableName: string;
    data: Array<Record<string, unknown>>;
    status: string;
  }>;

  dropTable(req: DropTableRequest): Promise<{
    tableName: string;
    data: Array<Record<string, unknown>>;
    
    atus: string;
  }>;

  // Introspection
  listTables(schema?: string | null): Promise<ListTablesResponse>;
  describeTable(tableName: string, schema?: string | null): Promise<DescribeColumn[]>;

  // App-specific
  insertEvent(values: Record<string, any>): Promise<ODataBaseData>;

  /** Optional upsert; when present, callers may prefer it to reduce round trips. */
  upsertData?(
    args: { tableName: string; values: any[]; conflictKeys: string[] }
  ): Promise<any>;

  /** Helper: absolute base URL (no trailing slash). */
  getBaseUrl(): string;

  /** Build absolute SSE URL for overlay stream for a given event. */
  overlayStreamUrl?(eventId: string | number): string;

  /** Ask backend to broadcast an overlay change for a given event_id. */
  pingOverlay?(eventId: string | number): Promise<OverlayPingResponse>;

  /* ========= Livestream convenience (NEW) ========= */

  // Auth / Config
  streamConfigSet?(values: Partial<LiveStreamAuth>): Promise<{
    tableName: string; data: LiveStreamAuth[]; status: string;
  }>;
  streamConfigRevoke?(args: { stripe_id: string; platform: StreamPlatform }): Promise<{
    tableName: string; data: LiveStreamAuth[]; status: string;
  }>;
  streamConfigGet?(args?: { stripe_id?: string }): Promise<{
    tableName: string; data: LiveStreamAuth[]; status: string;
  }>;



// Streams
streamList(args?: StreamListParams): Promise<{
  tableName: "livestream_stream";
  data: LiveStreamRow[];
  status: string;
  note?: string;
}>;
streamCreate(values: Partial<LiveStreamRow>): Promise<{
  tableName: string; data: LiveStreamRow[]; status: string;
}>;
streamUpdate(id: number, values: Partial<LiveStreamRow>): Promise<{
  tableName: string; data: LiveStreamRow[]; status: string;
}>;
streamDelete(id: number): Promise<{
  tableName: string; data: LiveStreamRow[]; status: string;
}>;

// Control
streamStart(id: number): Promise<{
  tableName: string; data: LiveStreamRow[]; status: string;
}>;
streamEnd(id: number): Promise<{
  tableName: string; data: LiveStreamRow[]; status: string;
}>;
}
