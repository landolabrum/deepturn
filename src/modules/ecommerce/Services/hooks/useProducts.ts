import { useCallback, useEffect, useState } from "react";
import { getService } from "@webstack/common";
import useSessionStorage from "@webstack/hooks/storage/useSessionStorage";
import { useLoader } from "@webstack/components/Loader/Loader";
import IProductService from "~/src/core/services/ProductService/IProductService";
import { IProduct } from "~/src/models/Shopping/IProduct";
import environment from "~/src/core/environment";

type Filter = {
  name: string;
  value: any;
  method?: "equals" | "greaterThan" | "lessThan" | "includes";
};

interface UseProductsOptions {
  showAll?: boolean;
  serverRefresh?: boolean;    // allows fetch even when products exist
  filters?: Filter[];
  setFilters?: (filters: Filter[]) => void;
  limit? :number;
}

interface FetchOptions {
  bypassCache?: boolean;      // NEW: force skip session cache and refetch
  showLoader?: boolean;       // NEW: optionally hide global loader
}

export const useProducts = (
  { showAll = false, filters = [], setFilters, serverRefresh,limit=10 }: UseProductsOptions = {}
) => {
  const { mid } = environment.merchant;
  const EXPIRY_MS = 60_000; // 1 minute

  const productService = getService<IProductService>("IProductService");
  const { sessionData, setSessionItem } = useSessionStorage();
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [current, setCurrent] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [liveMode, setLiveMode] = useState<boolean | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [, setLoader] = useLoader();

  const getValue = (obj: any, path: string): any =>
    path.split(".").reduce((acc, part) => acc?.[part], obj);

  const applyFilters = useCallback(
    (list: IProduct[], fltrs: Filter[]) => {
      if (!fltrs?.length) return list;
      return list.filter((product) =>
        fltrs.every(({ name, value, method = "equals" }) => {
          const target = getValue(product, name);
          switch (method) {
            case "equals":
              return target == value;
            case "greaterThan":
              return Number(target) > Number(value);
            case "lessThan":
              return Number(target) < Number(value);
            case "includes":
              return Array.isArray(target)
                ? target.includes(value)
                : String(target ?? "").includes(String(value ?? ""));
            default:
              return true;
          }
        })
      );
    },
    []
  );

  const activeFilter = (list: IProduct[]) => list.filter((p) => p?.active);
  const merchantProductFilter = (list: IProduct[]) =>
    list.filter((p) => p?.metadata?.mid === mid);

  const loadFromCache = useCallback(() => {
    const raw = sessionData?.products;
    if (!raw) return false;

    const payload = (raw as any)?.value ?? raw;
    if (!payload) return false;

    const now = Date.now();
    const hasExplicitExpiry = typeof payload.expiry === "number";
    if (hasExplicitExpiry && now > payload.expiry) return false;

    const created: number | undefined = payload.created;
    if (!hasExplicitExpiry) {
      if (!created) return false;
      if (now - created > EXPIRY_MS) return false;
    }

    let list: IProduct[] = payload.data || [];
    if (!showAll) list = merchantProductFilter(activeFilter(list));
    if (filters.length) list = applyFilters(list, filters);

    setProducts(list);
    setTotal(list.length);
    setHasMore(Boolean(payload.has_more));
    setLiveMode(payload.live_mode as boolean | undefined);
    return true;
  }, [sessionData, showAll, filters, applyFilters, EXPIRY_MS, mid]);

  const fetchProducts = useCallback(
    async (opts: FetchOptions = {}) => {
      const { bypassCache = false, showLoader = true } = opts;

      if (loading) return;

      // If we already have products and caller didn't request server refresh,
      // bail early (unless bypassCache is forcing a refetch).
      if (!bypassCache && products && !serverRefresh) return;

      // Cache hit? Only if not bypassing cache
      if (!bypassCache && loadFromCache()) return;

      if (showLoader) setLoader({ active: true });
      setLoading(true);
      try {
        const response = await productService.getProducts({ limit, mid });
        if (response?.data) {
          const payload = {
            object: response.object,
            data: response.data,
            has_more: response.has_more,
            live_mode: response.live_mode,
            created: Date.now(),
          };

          let list = payload.data as IProduct[];
          if (!showAll) list = merchantProductFilter(activeFilter(list));
          if (filters.length) list = applyFilters(list, filters);

          setProducts(list);
          setTotal(list.length);
          setHasMore(Boolean(payload.has_more));
          setLiveMode(payload.live_mode as boolean | undefined);

          setSessionItem("products", payload, { expiryMs: EXPIRY_MS });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        if (showLoader) setLoader({ active: false });
        setLoading(false);
      }
    },
    [
      loading,
      products,
      serverRefresh,
      loadFromCache,
      filters,
      applyFilters,
      mid,
      setLoader,
      showAll,
      productService,
      EXPIRY_MS,
    ]
  );

  useEffect(() => {
    // If already hydrated, skip.
    if (products || sessionData === undefined) return;

    if (loadFromCache()) return;
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData !== undefined]);

  return {
    products,
    current,
    setCurrent,
    loading,
    liveMode,
    hasMore,
    error,
    // NOTE: now accepts options like { bypassCache: true }
    fetchProducts,
    total,
    filters,
    setFilters,
  };
};
