import React, { useState, useEffect, useCallback } from 'react';
import { getSheetsStatusUrl } from '../config/api';
import { SheetStatusContext } from './sheetStatusDef';

export function SheetStatusProvider({ children }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(getSheetsStatusUrl());
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch sheet status:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <SheetStatusContext.Provider value={{ status, loading, refetchStatus: fetchStatus }}>
      {children}
    </SheetStatusContext.Provider>
  );
}
