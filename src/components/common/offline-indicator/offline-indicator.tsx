import { useState, useEffect } from "react";
import { WifiOff, X } from "lucide-react";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { SyncQueueService } from "@/services/sync-queue-service";
import { useAuth } from "@/hooks";

export function OfflineIndicator() {
  const { isOnline } = useOfflineStatus();
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Reset dismissed state when going offline
    if (!isOnline) setDismissed(false);
  }, [isOnline]);

  useEffect(() => {
    if (!user || isOnline) return;
    SyncQueueService.getPendingCount(user.id).then(setPendingCount);
  }, [user, isOnline]);

  if (isOnline || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 shadow-lg text-sm font-medium max-w-sm">
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {pendingCount > 0
            ? `Offline — ${pendingCount} action${pendingCount === 1 ? "" : "s"} will sync when online`
            : "You are offline"}
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss offline notice"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
