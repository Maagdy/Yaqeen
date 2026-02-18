import { useState, useEffect } from "react";

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline };
}
