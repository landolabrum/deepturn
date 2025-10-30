'use client';

import React, { useMemo } from 'react';
import styles from "./AdminCustomersPage.scss";
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import { NaCell } from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
import AdminCustomer from "../views/AdminCustomersList/controller/AdminCustomers";
import useAdminCustomers from '../views/AdminCustomersList/views/AdminCustomerList/hooks/useAdminCustomers';

type CellLike =
  | { props?: { cell?: string; data?: any; children?: any } }
  | null
  | undefined;

type DeviceLike = {
  created?: number | string;
};

type CustomerRow = {
  customer?: CellLike;
  created?: CellLike;
  tax_exempt?: CellLike;
  default_source?: CellLike;
  clearance?: CellLike; // e.g., "Admin 3" | "Member"
  extras?: {
    user?: {
      email_verified?: boolean;
      clearance?: number;
      devices?: DeviceLike[];
    } | null;
    merchant?: { mid?: string; name?: string } | null;
    default_payment_method?: string | null;
    next_invoice_sequence?: number | null;
  } | null;
  // allow unknown keys
  [k: string]: any;
};

function isCell(v: any): v is { props: { cell?: string; data?: any } } {
  return !!(v && typeof v === 'object' && v.props);
}

function getCellData<T = any>(v: CellLike): T | undefined {
  return isCell(v) ? (v.props?.data as T) : undefined;
}

function parseCreatedToMs(v: CellLike): number | undefined {
  // your data uses epoch seconds (e.g., 1758660532). Convert safely.
  const raw = getCellData<number | string>(v);
  if (raw == null) return undefined;
  const n = typeof raw === 'string' ? parseInt(raw, 10) : raw;
  if (!Number.isFinite(n)) return undefined;
  // Heuristic: if number is 10 digits-ish, treat as seconds; if 13+, ms.
  return n < 1e12 ? n * 1000 : n;
}

function coerceNum(n: any): number | undefined {
  if (n == null) return undefined;
  const x = typeof n === 'string' ? parseInt(n, 10) : Number(n);
  return Number.isFinite(x) ? x : undefined;
}

function deviceCreatedMs(d: DeviceLike | undefined): number | undefined {
  if (!d) return undefined;
  const raw = d.created;
  if (raw == null) return undefined;
  if (typeof raw === 'number') {
    return raw < 1e12 ? raw * 1000 : raw;
  }
  if (typeof raw === 'string') {
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n)) return undefined;
    return n < 1e12 ? n * 1000 : n;
  }
  return undefined;
}

const MS_DAY = 24 * 60 * 60 * 1000;

const AdminCustomersPage: React.FC = () => {
  const { customers = [], refresh, hasMore } = useAdminCustomers();
  const props = { customers, refresh, hasMore };

  const stats = useMemo(() => {
    const now = Date.now();
    const last7d = now - 7 * MS_DAY;
    const last30d = now - 30 * MS_DAY;

    let newCustomers7d = 0;
    let adminCount = 0;
    let verifiedEmails = 0;
    let activeDevices30d = 0;

    for (const row of customers as CustomerRow[]) {
      // createdAt
      const createdMs = parseCreatedToMs(row?.created);
      if (createdMs && createdMs >= last7d) {
        newCustomers7d++;
      }

      // admin: prefer numeric clearance in extras.user; otherwise parse "Admin X"
      const clearanceNum = row?.extras?.user?.clearance;
      if (typeof clearanceNum === 'number') {
        if (clearanceNum >= 10) adminCount++;
      } else {
        const label = getCellData<string>(row?.clearance);
        if (typeof label === 'string' && /^admin\b/i.test(label)) {
          adminCount++;
        }
      }

      // verified email
      if (row?.extras?.user?.email_verified === true) {
        verifiedEmails++;
      }

      // active devices (device.created within 30d)
      const devices = row?.extras?.user?.devices || [];
      for (const d of devices) {
        const ms = deviceCreatedMs(d);
        if (ms && ms >= last30d) activeDevices30d++;
      }
    }

    return {
      newCustomers7d,
      adminCount,
      verifiedEmails,
      activeDevices30d,
    };
  }, [customers]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-mgmt'>
        <div className='admin-mgmt__header' />
        <div className='admin-mgmt__body'>
          <AdaptGrid xs={2} md={4} variant='card' gap={10}>
            <div className='admin-mgmt__card'>
              <div className='admin-mgmt__card-header'>new customers (7d)</div>
              <div className='admin-mgmt__card-body'>
                {Number.isFinite(stats.newCustomers7d) ? stats.newCustomers7d : <NaCell/>}
              </div>
            </div>

            <div className='admin-mgmt__card'>
              <div className='admin-mgmt__card-header'>admins</div>
              <div className='admin-mgmt__card-body'>
                {Number.isFinite(stats.adminCount) ? stats.adminCount : <NaCell/>}
              </div>
            </div>

            <div className='admin-mgmt__card'>
              <div className='admin-mgmt__card-header'>verified emails</div>
              <div className='admin-mgmt__card-body'>
                {Number.isFinite(stats.verifiedEmails) ? stats.verifiedEmails : <NaCell/>}
              </div>
            </div>

            <div className='admin-mgmt__card'>
              <div className='admin-mgmt__card-header'>active devices (30d)</div>
              <div className='admin-mgmt__card-body'>
                {Number.isFinite(stats.activeDevices30d) ? stats.activeDevices30d : <NaCell/>}
              </div>
            </div>
          </AdaptGrid>

          <AdminCustomer {...props} />
          {/* <UiBarGraph title="customer signup" data={data}/> */}
        </div>
      </div>
    </>
  );
};

export default AdminCustomersPage;
