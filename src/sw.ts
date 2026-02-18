/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache app shell (injected by vite-plugin-pwa at build time)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ─── API Caching Routes ───────────────────────────────────────────────────────

// AlQuran API — static Quran text, cache aggressively
registerRoute(
  ({ url }) => url.hostname === "api.alquran.cloud",
  new CacheFirst({
    cacheName: "alquran-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 200 }),
    ],
  }),
);

// MP3Quran API — reciter metadata (not streams)
registerRoute(
  ({ url }) =>
    url.hostname === "mp3quran.net" && !url.pathname.endsWith(".mp3"),
  new CacheFirst({
    cacheName: "mp3quran-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 100 }),
    ],
  }),
);

// Sunnah.com API — hadith data
registerRoute(
  ({ url }) => url.hostname === "api.sunnah.com",
  new CacheFirst({
    cacheName: "sunnah-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60, maxEntries: 100 }),
    ],
  }),
);

// Tafsir API
registerRoute(
  ({ url }) => url.hostname.includes("quran-tafseer") || url.hostname.includes("tafsir"),
  new CacheFirst({
    cacheName: "tafsir-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 100 }),
    ],
  }),
);

// Aladhan prayer times API — time-sensitive, prefer network
registerRoute(
  ({ url }) => url.hostname === "api.aladhan.com",
  new NetworkFirst({
    cacheName: "aladhan-api",
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60, maxEntries: 30 }),
    ],
  }),
);

// QuranPedia / static images
registerRoute(
  ({ url }) =>
    url.hostname.includes("quranpedia") ||
    (url.pathname.match(/\.(png|jpg|jpeg|webp|svg)$/) != null &&
      !url.hostname.includes("localhost")),
  new CacheFirst({
    cacheName: "quran-images",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60, maxEntries: 500 }),
    ],
  }),
);

// Never cache radio live streams — pure passthrough
registerRoute(
  ({ url }) =>
    url.hostname.includes("mp3quran") && url.pathname.endsWith(".mp3"),
  new NetworkOnly(),
);

// ─── Background Sync ──────────────────────────────────────────────────────────

const bgSyncPlugin = new BackgroundSyncPlugin("yaqeen-sync", {
  maxRetentionTime: 24 * 60, // 24 hours in minutes
});

// Supabase writes go through background sync when offline
const supabaseWriteMatcher = ({ url }: { url: URL }) =>
  url.hostname.includes("supabase") &&
  (url.pathname.includes("/rest/v1/") || url.pathname.includes("/rpc/"));

const supabaseWriteStrategy = new NetworkFirst({
  cacheName: "supabase-writes",
  plugins: [bgSyncPlugin],
  networkTimeoutSeconds: 10,
});

// Register for all write methods
for (const method of ["POST", "PATCH", "PUT", "DELETE"] as const) {
  registerRoute(supabaseWriteMatcher, supabaseWriteStrategy, method);
}

// ─── Message Handler ──────────────────────────────────────────────────────────

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  // Relay sync drain request from background sync → main thread
  if (event.data?.type === "DRAIN_SYNC_QUEUE") {
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: "DRAIN_SYNC_QUEUE" });
      });
    });
  }
});

// ─── Background Sync event (native SyncManager) ───────────────────────────────

self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "yaqeen-sync") {
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "DRAIN_SYNC_QUEUE" });
        });
      }),
    );
  }
});
