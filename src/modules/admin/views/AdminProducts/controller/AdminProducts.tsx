import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import styles from './AdminProducts.scss';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import AdminProduct from '../views/AdminProduct/AdminProduct';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useAdminLevel } from '~/src/core/authentication/hooks/useUser';
import useDeleteProduct from '../hooks/useDeleteProduct';
import { useLoader } from '@webstack/components/Loader/Loader';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { useProducts } from '~/src/modules/ecommerce/Services/hooks/useProducts';
import environment from '~/src/core/environment';

type Action = { label: string; icon?: string };

const AdminProducts: React.FC = () => {
  const { openModal } = useModal();
  const { user } = useAdminLevel();

  const [view, setView] = useState<'list' | 'add' | 'product'>('list');
  const [product, setProduct] = useState<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [select, setSelect] = useState(false);
  const [responseExtras, setExtras] = useState<Record<string, any>>();
  const [, setLoader] = useLoader();
  const [modified, setModified] = useState<any[]>();
  const [filterState, setFilterState] = useState({ visibility: 'active', merchant: 'all' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const { products, loading, liveMode, hasMore, error, fetchProducts, total } = useProducts({
    showAll: true,
    serverRefresh: true,
    limit: 10
  });

  // NEW: track last refresh time (ms since epoch)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number | null>(null);
  const lastRefreshLabel = useMemo(
    () => (lastRefreshedAt ? dateFormat(lastRefreshedAt, { isTimestamp: true }) : '—'),
    [lastRefreshedAt]
  );

  // Table rows formatted from products
  const [baseRows, setBaseRows] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const selected = useMemo(() => {
    if (!select || !filteredProducts) return [];
    return filteredProducts.filter((p) => p.selected);
  }, [select, filteredProducts]);

  const { initiateDelete } = useDeleteProduct();

  const handleSearch = useCallback((term: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearchTerm(term), 300);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const handleFilterChange = (field: IFormField) => {
    const [group, value] = field.name.split('-');
    setFilterState((prev) => ({ ...prev, [group]: value }));
  };

  const getUniqueMids = (list: any[]) => [...new Set(list.map((p) => p.mid).filter(Boolean))];

  const applyFilters = useCallback(() => {
    if (!baseRows) return;

    let filtered = [...baseRows];

    // visibility
    if (filterState.visibility === 'active') {
      filtered = filtered.filter((p) => p.active !== false);
    } else if (filterState.visibility === 'inactive') {
      filtered = filtered.filter((p) => p.active === false);
    }

    // merchant
    if (filterState.merchant !== 'all') {
      filtered = filtered.filter((p) => p.mid === filterState.merchant);
    }

    // search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        Object.values(p).some((v) => typeof v === 'string' && v.toLowerCase().includes(q)),
      );
    }

    setFilteredProducts(filtered);
  }, [baseRows, filterState, searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [filterState, searchTerm, applyFilters]);

  // Build baseRows when products change (only for list view)
  useEffect(() => {
    if (!products || products.length === 0 || view !== 'list') return;

    const rows = products
      .map((field: any) => {
        const notActive = field.active === false;
        const fieldMid = field?.metadata?.mid;
        const notAllowed = fieldMid !== environment.merchant.mid && user.type !== 'admin-3';
        if (notAllowed && notActive) return null;

        const ctx: any = {
          id: field.id,
          image: field.images,
          name: field.name,
          type: field.type,
          price_id: field.price?.id,
          price: numberToUsd(field.price?.unit_amount),
          livemode: JSON.stringify(field.livemode),
          created: dateFormat(field.created, { isTimestamp: true }),
          updated: dateFormat(field.updated, { isTimestamp: true }),
        };

        if (user.type === 'admin-3') {
          ctx.mid = fieldMid;
          ctx.active = field.active;
        }

        return ctx;
      })
      .filter(Boolean);

    setBaseRows(rows);
    setExtras({ total, livemode: liveMode, has_more: hasMore });

    // NEW: initialize lastRefreshedAt on first successful hydration
    if (lastRefreshedAt === null) {
      setLastRefreshedAt(Date.now());
    }
  }, [products, liveMode, hasMore, total, view, user.type, lastRefreshedAt]);

  useEffect(() => {
    if (view === 'list') applyFilters();
  }, [baseRows, view, applyFilters]);

  const onRowClick = (row: any) => {
    if (!row?.id) return;
    const full = products?.find((p: any) => p.id === row.id);
    if (!full) return;
    setProduct(full);
    setView('product');
  };

  const onSelect = (row: any) => {
    if (!row?.id) return;
    setFilteredProducts((prev) =>
      prev?.map((item) =>
        item.id === row.id && item.price_id === row.price_id
          ? { ...item, selected: !item.selected }
          : item,
      ),
    );
  };

  const handleDeselect = () => {
    setFilteredProducts((prev) => prev?.map((p) => ({ ...p, selected: undefined })));
    setSelect(false);
  };

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await fetchProducts({ bypassCache: true }); // forces network fetch
      setLastRefreshedAt(Date.now());             // NEW: stamp after successful refresh
    } catch (e) {
      console.error('Refresh failed:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchProducts]);

  const confirmDelete = () => {
    const toDelete =
      filteredProducts?.filter((p) => p.selected).map((p) => ({ ...p, label: p.name, status: 'incomplete' })) ?? [];
    setModified(toDelete);

    openModal({
      confirm: {
        title: `Delete ${toDelete.length} Products?`,
        statements: [
          {
            label: 'Delete',
            onClick: async () => {
              setLoader({ active: true, children: 'Deleting products...' });
              for (const p of toDelete) {
                try {
                  await initiateDelete(p);
                  p.status = 'complete';
                } catch {
                  p.status = 'error';
                }
              }
              setLoader({ active: false });
              openModal({
                title: 'Delete Completed',
                children: <ol>{toDelete.map((p) => <li key={p.id}>{p.name} - {p.status}</li>)}</ol>,
                confirm: {
                  statements: [{ label: 'back to products', onClick: handleDeselect }],
                },
              });
            },
          },
          { label: 'Cancel', onClick: handleDeselect },
        ],
        body: <ol>{toDelete.map((p) => <li key={p.id}>{p.name} - {p.id}</li>)}</ol>,
      },
    });
  };

  const handleAction = (action: string) => {
    if (action === 'edit') return setSelect((s) => !s);
    if (action === 'refresh') return void handleRefresh();
    setView(action as any);
  };

  const midOptions = useMemo(
    () =>
      getUniqueMids(products || [])
        .map((mid) => ({ label: mid, name: `merchant-${mid}` }))
        .concat([{ label: 'all', name: 'merchant-all' }])
        .reverse(),
    [products]
  );

  const pageContext: Record<typeof view, { actions: Action[]; view: React.ReactNode }> = {
    list: {
      actions: [
        { label: 'add', icon: 'fas-plus' },
        { label: 'edit', icon: 'fa-pen-to-square' },
        { label: 'refresh', icon: isRefreshing ? 'spinner' : 'fa-rotate' },
      ],
      view: (
        <div className="d-flex-col justify-end align-end g-9 s-w-100">
          <AdapTable
            onSelect={select ? onSelect : undefined}
            options={{ tableTitle: 'admin products', hideColumns: ['id', 'selected', 'price_id'] }}
            data={filteredProducts}
            filters={{
              visibility: [
                { label: 'everything', name: 'visibility-everything' },
                { label: 'active', name: 'visibility-active' },
                { label: 'inactive', name: 'visibility-inactive' },
              ],
              merchant: midOptions,
            }}
            setFilter={handleFilterChange}
            search={searchTerm}
            setSearch={handleSearch}
            onRowClick={onRowClick}
          />
        </div>
      ),
    },
    add: {
      actions: [{ label: 'list', icon: 'fa-list' }],
      view: <AdminProduct products={products} />,
    },
    product: {
      actions: [
        { label: 'list', icon: 'fa-list' },
        { label: 'add', icon: 'fas-plus' },
        { label: 'refresh', icon: isRefreshing ? 'spinner' : 'fa-rotate' },
      ],
      view: <AdminProduct product={product} />,
    },
  };

  if (loading) return <UiLoader />;

  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-products">
        <div className="admin-products__header">
          <div className="admin-products__header--left">
            <div className="admin-products__view">{view}</div>
            <div className="heiarchy">
              {responseExtras &&
                Object.entries(responseExtras).map(([k, v]) => (
                  <div key={k} className="heiarchy__item">
                    <div className="heiarchy-key">{k}</div>
                    <div className="heiarchy-value">{String(v)}</div>
                  </div>
                ))}
              {/* NEW: last refresh display */}
              <div className="heiarchy__item">
                <div className="heiarchy-key">last_refresh</div>
                <div className="heiarchy-value">{lastRefreshLabel}</div>
              </div>
            </div>
          </div>

          <div className="admin-products__header--right">
            {pageContext[view].actions.map((action) => {
              const label = typeof action.label === 'string' ? action.label : 'action';
              const isRefreshBtn = label === 'refresh';
              return (
                <div key={label}>
                  <UiButton
                    onClick={() => handleAction(label)}
                    disabled={isRefreshBtn && isRefreshing}
                    traits={{ afterIcon: action.icon || undefined }}
                  >
                    {label}
                  </UiButton>
                </div>
              );
            })}

            {selected.length > 0 && (
              <div>
                <UiButton onClick={confirmDelete} variant="error">
                  {selected.length} {selected.length === 1 ? 'Item' : 'Items'}
                </UiButton>
              </div>
            )}
          </div>
        </div>

        {pageContext[view].view}
      </div>
    </>
  );
};

export default AdminProducts;
