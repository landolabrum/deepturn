
import { useEffect, useMemo, useState } from 'react';

type StorageData = { [key: string]: any } | null | undefined;

interface StorageOptions {
  /** Expiration time in seconds */
  expiry?: number;
}

const isBrowser = () =>
  typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const unwrapStored = (raw: string | null) => {
  if (raw == null) return null;
  try {
    const parsed = JSON.parse(raw);
    // our wrapped shape: { value, expiry? }
    if (parsed && typeof parsed === 'object' && 'value' in parsed) {
      if (parsed.expiry && Date.now() > Number(parsed.expiry)) return null;
      return parsed.value;
    }
    return parsed;
  } catch {
    return raw;
  }
};

const LOCAL_EVT = 'localstorage:update';

const useLocalStorage = (incomingKey?: string) => {
  const [localData, setLocalData] = useState<StorageData>();
  const [loading, setLoading] = useState<boolean>(true);

  const notifyLocal = (key: string) => {
    if (!isBrowser()) return;
    try {
      window.dispatchEvent(new CustomEvent(LOCAL_EVT, { detail: { key } }));
    } catch {
      // no-op
    }
  };

  const getLocalData = (): StorageData => {
    if (!isBrowser()) return null;

    const result: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      try {
        const raw = localStorage.getItem(key);
        if (raw == null) continue;

        const parsed = JSON.parse(raw);
        const { value, expiry } = parsed ?? {};

        if (expiry && Date.now() > expiry) {
          localStorage.removeItem(key);
          continue;
        }

        if (parsed && Object.prototype.hasOwnProperty.call(parsed, 'value')) {
          result[key] = value;
        } else {
          result[key] = parsed;
        }
      } catch {
        result[key] = localStorage.getItem(key);
      }
    }

    return Object.keys(result).length ? result : null;
  };

  const getLocalItem = (name: string) => {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(name);
    return unwrapStored(raw);
  };

  const initializeLocalData = () => {
    const data = getLocalData();
    setLocalData(data);
    setLoading(false);
  };

  const wrapForStorage = (val: any) => {
    // Always store as { value, expiry? } to avoid array/object spreading
    if (val && typeof val === 'object' && 'value' in val && Object.keys(val).length <= 2) {
      return { ...val }; // already wrapped
    }
    return { value: val };
  };

  const setLocalItem = (name: string, val: any, options?: StorageOptions) => {
    // console.log("[ SET LOCAL ITEM ]",{name, val})
    if (!isBrowser()) return;
    try {
      const base = wrapForStorage(val);
      const item = {
        ...base,
        expiry: options?.expiry ? Date.now() + options.expiry * 1000 : null,
      };
      localStorage.setItem(name, JSON.stringify(item));
      initializeLocalData();     // update this hook
      notifyLocal(name);         // notify other instances in same tab
    } catch (err) {
      console.error('Failed to set local storage item:', err);
    }
  };

  const deleteLocalItem = (name: string) => {
    if (!isBrowser()) return;
    localStorage.removeItem(name);
    initializeLocalData();
    notifyLocal(name);
  };

  useEffect(() => {
    if (!isBrowser()) {
      setLoading(false);
      return;
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initializeLocalData();
    } else {
      const onReady = () => initializeLocalData();
      window.addEventListener('DOMContentLoaded', onReady, { once: true });
      return () => window.removeEventListener('DOMContentLoaded', onReady);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isBrowser()) return;
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea === localStorage) initializeLocalData();
    };
    const onLocal = () => initializeLocalData(); // same-tab updates
    window.addEventListener('storage', onStorage);
    window.addEventListener(LOCAL_EVT, onLocal as any);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(LOCAL_EVT, onLocal as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localItem = useMemo(() => {
    if (!incomingKey) return undefined;
    const fromMap =
      localData && Object.prototype.hasOwnProperty.call(localData, incomingKey)
        ? (localData as Record<string, any>)[incomingKey]
        : undefined;
    return fromMap !== undefined ? fromMap : getLocalItem(incomingKey);
  }, [incomingKey, localData]);

  return {
    localData,
    localItem,
    loading,
    setLocalItem,
    deleteLocalItem,
    getLocalItem,
  };
};

export default useLocalStorage;
