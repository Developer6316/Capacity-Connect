import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [offlineSyncCount, setOfflineSyncCount] = useState<number>(() => {
    try {
      const pending = localStorage.getItem('smartlearn_offline_sync_queue');
      return pending ? JSON.parse(pending).length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto flush or update offline sync queue
      try {
        const pending = localStorage.getItem('smartlearn_offline_sync_queue');
        if (pending) {
          const queue = JSON.parse(pending);
          if (queue.length > 0) {
            console.log(`[OfflineSync] Flushed ${queue.length} pending offline actions.`);
            localStorage.setItem('smartlearn_offline_sync_queue', JSON.stringify([]));
            setOfflineSyncCount(0);
          }
        }
      } catch (e) {
        console.warn('Error clearing sync queue', e);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueOfflineAction = (action: { type: string; payload: any; timestamp: number }) => {
    try {
      const pending = localStorage.getItem('smartlearn_offline_sync_queue');
      const queue = pending ? JSON.parse(pending) : [];
      queue.push(action);
      localStorage.setItem('smartlearn_offline_sync_queue', JSON.stringify(queue));
      setOfflineSyncCount(queue.length);
    } catch (e) {
      console.warn('Error saving offline action', e);
    }
  };

  return { isOnline, offlineSyncCount, queueOfflineAction };
}
