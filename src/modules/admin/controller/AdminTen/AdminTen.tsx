import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './AdminTen.scss';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/controller/UiSettingsLayout';
import AdminProducts from '../../views/AdminProducts/controller/AdminProducts';
import AdminAccounts from '../../views/AdminAccounts/controller/AdminAccounts';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import AdminMarketing from '../../views/AdminMarketing/AdminMarketing';
import { useRouter } from 'next/router';
import AdminSales from '../../views/AdminSales/controller/AdminSales';
import AdminCustomersPage from '../../views/AdminCustomers/controller/AdminCustomersPage';
import AdminData from '../../views/AdminData/controller/AdminData';
import RemoteAccessPage from '../../views/AdminRemote/controller/RemoteAccessPage';
import DashboardPage from '~/src/pages/dashboard';
import AdminFinance from '../../views/AdminFinance/controller/AdminFinance';

const AdminTen: React.FC = () => {
  const router = useRouter();
  const level = useClearance();

  /** ----------------------- Links (UI only) ----------------------- */
  const links = useMemo(() => ([
    { name: 'Dashboard', href: '/admin?vid=dashboard', label: 'Dashboard', icon: 'fa-star' },
    { name: 'Customers', href: '/admin?vid=customers', label: 'Customers', icon: 'fa-user-group' },
    { name: 'Products',  href: '/admin?vid=products',   label: 'Products',  icon: 'fa-cubes' },
    // { name: 'Stream',    href: '/admin?vid=stream',     label: 'Live Stream', icon: 'fa-broadcast-tower' },
    { name: 'Marketing', href: '/admin?vid=marketing',  label: 'Marketing', icon: 'fa-globe' },
    { name: 'Sales',     href: '/admin?vid=sales',      label: 'Sales',     icon: 'fa-cash-register' },
  ]), []);

  /** ----------------------- Views map ----------------------- */
  const baseViews = useMemo(() => ({
    dashboard: <DashboardPage links={links} />,
    customers: <AdminCustomersPage />,
    products:  <AdminProducts />,
    finance:   <AdminFinance />,
    data:      <AdminData />,
    remote:    <RemoteAccessPage />,
    sales:     <AdminSales />,
    marketing: <AdminMarketing />,
  }), [links]);

  const allowedKeysBase = useMemo(() => Object.keys(baseViews), [baseViews]);

  const views = useMemo(() => {
    if (level == null) return undefined; // waiting on clearance
    if (level >= 10) {
      return {
        ...baseViews,
        accounts: <AdminAccounts />,
      };
    }
    return baseViews;
  }, [level, baseViews]);

  const allowedKeys = useMemo(
    () => (views ? Object.keys(views) : allowedKeysBase),
    [views, allowedKeysBase]
  );

  const ensureDashboard = useCallback(() => {
    router.push('/admin?vid=dashboard', undefined, { shallow: true });
  }, [router]);

  useEffect(() => {
    if (!router.isReady) return;
    const vid = (router.query?.vid as string | undefined)?.toLowerCase?.();
    const allowed = allowedKeys.includes(vid || '');
    if (!vid || !allowed) ensureDashboard();
  }, [router.isReady, router.query, allowedKeys, ensureDashboard]);

  /** ----------------------- Layout toggles ----------------------- */
  const notFull = ['dashboard', 'products', 'stream'];
  const isOpen = useCallback(() => {
    const keepNavClosedArr = notFull;
    const vid = (router.query?.vid as string | undefined)?.toLowerCase?.();
    return ![undefined, ...keepNavClosedArr].includes(vid as any);
  }, [router.query]);

  /** ----------------------- Early exits ----------------------- */
  if (!router.isReady || views === undefined) {
    return null; // intentionally render nothing during bootstrap
  }

  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-ten">
        <UiSettingsLayout
          open={isOpen()}
          setViewCallback={() => { /* UiSettingsLayout drives vid via links; no-op here */ }}
          subTitle={`admin: level ${level}`}
          views={views}
          variant={isOpen() ? "full" : undefined}
        />
      </div>
    </>
  );
};

export default AdminTen;
