import { useState, useEffect, useRef } from "react";

interface OfflineStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useOfflineStatus(): OfflineStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const handleOnline = async () => {
      // Verify connectivity with a lightweight HEAD request
      try {
        await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
        setIsOnline(true);
      } catch {
        // Still offline despite the event
        setIsOnline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      wasOfflineRef.current = true;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, wasOffline: wasOfflineRef.current };
}
