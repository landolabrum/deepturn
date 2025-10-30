import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";

export function getApiBaseFromDb(): string {
  const db: any = getService<IDataBaseService>("IDataBaseService");
  return String(
    db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE || ""
  ).replace(/\/$/, "");
}
