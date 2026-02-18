import { Workbox } from "workbox-window";
import { toast } from "react-toastify";

export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return;

  const wb = new Workbox("/sw.js");

  // When a new SW is waiting, prompt the user (non-blocking)
  wb.addEventListener("waiting", () => {
    toast.info("New version available — tap to update", {
      toastId: "sw-update",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      onClick: () => {
        wb.messageSkipWaiting();
        window.location.reload();
      },
    });
  });

  // Relay drain message from SW background sync to the app
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "DRAIN_SYNC_QUEUE") {
      window.dispatchEvent(new CustomEvent("yaqeen-drain-sync"));
    }
  });

  wb.register();
}
