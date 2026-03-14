import { useState, useEffect } from 'react';

interface UseOfflineStatusReturn {
  isOffline: boolean;
  wasOffline: boolean;
  lastOnlineTime: Date | null;
}

export function useOfflineStatus(): UseOfflineStatusReturn {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    // Check initial online status
    setIsOffline(!navigator.onLine);
    if (navigator.onLine) {
      setLastOnlineTime(new Date());
    }

    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setLastOnlineTime(new Date());
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return { isOffline, wasOffline, lastOnlineTime };
}

export default useOfflineStatus;
