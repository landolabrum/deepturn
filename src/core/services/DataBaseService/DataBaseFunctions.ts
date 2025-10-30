import { ApiError } from "../ApiService";
import {
  IDataBaseData,
  SelectRequest,
  InsertRequest,
  LegacyInsertRequest,
  UpdateRequest,
  DeleteRequest,
} from "./IDataBaseService";

/* --------------------- Helpers --------------------- */

export function assertTable(obj?: { tableName?: string }) {
  if (!obj?.tableName) throw new ApiError("tableName is required", 400, "DB.SVC.01");
}

export function serializeLegacyEnvelope(data: IDataBaseData) {
  return {
    tableName: data.tableName,
    rows: data.rows ?? [],
    cells: data.cells ?? [],
    where: {
      exact: data.where?.exact ?? null,
      includes: data.where?.includes ?? null,
      created:
        data.where?.created !== undefined && data.where?.created !== null
          ? data.where.created
          : undefined,
    },
  };
}

export function toQS(params?: Record<string, string | number | boolean | null | undefined>): string {
  if (!params) return "";
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return q ? `?${q}` : "";
}

/* ---------------- Type guards ---------------- */

export function isLegacy(data: any): data is IDataBaseData {
  return data && typeof data === "object" && "rows" in data && "cells" in data;
}

export function isLegacyInsert(data: any): data is LegacyInsertRequest {
  return data && typeof data === "object" && "tableName" in data && "values" in data;
}

export function isUpdate(data: any): data is UpdateRequest {
  return data && typeof data === "object" && "tableName" in data && "set" in data;
}

export function isDelete(data: any): data is DeleteRequest {
  return (
    data &&
    typeof data === "object" &&
    "tableName" in data &&
    !("set" in data) &&
    !("data" in data) &&
    !("values" in data)
  );
}

/* ---------------- Normalizers ---------------- */

export function normalizeInsert(req: InsertRequest | LegacyInsertRequest) {
  const tableName = (req as any).tableName;

  if (isLegacyInsert(req)) {
    const raw = req.values;
    const data = Array.isArray(raw) ? raw : [raw];
    return { tableName, data };
  }

  const raw = (req as InsertRequest).data;
  const data = Array.isArray(raw) ? raw : [raw];
  return { tableName, data };
}

export function normalizeSelect(req: SelectRequest | IDataBaseData) {
  if (isLegacy(req)) return serializeLegacyEnvelope(req);
  const r = req as SelectRequest;
  return {
    tableName: r.tableName,
    rows: r.rows ?? [],
    cells: r.cells ?? [],
    where: r.where ?? undefined,
  };
}

export function normalizeUpdate(req: UpdateRequest | IDataBaseData) {
  if (isUpdate(req)) {
    const u = req as UpdateRequest;

    let where = u.where as any | undefined;
    if (where && typeof where === "object" && "exact" in where && typeof where.exact === "object") {
      where = where.exact;
    }

    return {
      tableName: u.tableName,
      set: u.set ?? {},
      where: where ?? undefined,
    };
  }
  return serializeLegacyEnvelope(req as IDataBaseData);
}

export function normalizeDelete(req: DeleteRequest | IDataBaseData) {
  if (isDelete(req)) {
    const d = req as DeleteRequest;
    return {
      tableName: d.tableName,
      where: d.where ?? undefined,
    };
  }
  return serializeLegacyEnvelope(req as IDataBaseData);
}
