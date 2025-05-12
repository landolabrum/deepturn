import { useState, useEffect } from 'react';

type SessionData = {
  [key: string]: any;
} | null | undefined;

interface SessionOptions {
  expiry?: number; // Expiration time in seconds
}

const useSessionStorage = () => {
  const [sessionData, setSessionData] = useState<SessionData>();
  const [loading, setLoading] = useState<boolean>(true);

  const getSessionData = (): SessionData => {
    const result: SessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        try {
          const storedValue = JSON.parse(sessionStorage.getItem(key) as string);
          const { value, expiry } = storedValue;
          // console.log({value, expiry})
          // Check if the item has expired
          if (expiry && Date.now() > expiry) {
            sessionStorage.removeItem(key); // Remove expired item
          } else {
            result[key] = value; // Otherwise, add to result
          }
        } catch (e) {
          result[key] = sessionStorage.getItem(key);
        }
      }
    }
    return Object.keys(result).length ? result : null;
  };

  const setSessionItem = (name: string, value: any, options?: SessionOptions) => {
    try {
      const item = {
        value,
        expiry: options?.expiry ? Date.now() + options.expiry : null, // Convert expires to milliseconds
      };
      sessionStorage.setItem(name, JSON.stringify(item));
    } catch (err) {
      console.error("Failed to set session storage item:", err);
    }
  };

  const deleteSessionItem = (name: string) => {
    sessionStorage.removeItem(name);
  };

  const initializeSessionData = () => {
    const retrievedData = getSessionData();
    setSessionData(retrievedData);
    setLoading(false);
  };

  useEffect(() => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initializeSessionData();
    } else {
      window.addEventListener('DOMContentLoaded', initializeSessionData);
      return () => window.removeEventListener('DOMContentLoaded', initializeSessionData);
    }
  }, []);

  return { sessionData, loading, setSessionItem, deleteSessionItem };
};

export default useSessionStorage;
