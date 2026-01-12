import { useEffect } from 'react';

// Simple reusable hook to auto-refresh data and re-fetch when the page becomes visible
export default function useAutoRefresh(refetchFn, intervalMs = 60000) {
  useEffect(() => {
    if (typeof refetchFn !== 'function') return;

    let stopped = false;

    const safeRefetch = async () => {
      if (stopped) return;
      try {
        await refetchFn();
      } catch (err) {
        // swallow errors - components handle notifications
        // console.debug('Auto-refresh error', err);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        safeRefetch();
      }
    };

    // Note: Initial fetch is handled by the component's useEffect, not here

    const id = setInterval(safeRefetch, intervalMs);

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stopped = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [refetchFn, intervalMs]);
} 
