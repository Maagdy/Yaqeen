/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute, setCatchHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache app shell (injected by vite-plugin-pwa at build time)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ─── SPA Navigation Fallback ─────────────────────────────────────────────────
// All navigation requests (HTML) fall back to the precached index.html
// so React Router can handle client-side routing offline.
const navHandler = createHandlerBoundToURL("/index.html");
registerRoute(new NavigationRoute(navHandler));

// ─── Proxy URL Helper ─────────────────────────────────────────────────────────
// All API requests go through /api/proxy?url=<encoded-external-url>
// We need to extract the real target domain from the encoded `url` param.

function getProxiedOrigin(url: URL): string | null {
  if (url.pathname !== "/api/proxy") return null;
  const target = url.searchParams.get("url");
  if (!target) return null;
  try {
    return new URL(target).hostname;
  } catch {
    return null;
  }
}

// ─── API Caching Routes ───────────────────────────────────────────────────────

// AlQuran API — static Quran text, cache aggressively
// 114 surahs + 30 juzs + metadata/search = need generous entry limit
registerRoute(
  ({ url }) => getProxiedOrigin(url) === "api.alquran.cloud",
  new CacheFirst({
    cacheName: "alquran-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 500 }),
    ],
  }),
);

// MP3Quran API — reciter metadata (not audio streams)
registerRoute(
  ({ url }) => {
    const origin = getProxiedOrigin(url);
    if (origin !== "mp3quran.net") return false;
    const target = url.searchParams.get("url") ?? "";
    return !target.endsWith(".mp3");
  },
  new CacheFirst({
    cacheName: "mp3quran-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 100 }),
    ],
  }),
);

// Sunnah.com API — hadith data (many books × pages, need generous limit)
registerRoute(
  ({ url }) => getProxiedOrigin(url) === "api.sunnah.com",
  new CacheFirst({
    cacheName: "sunnah-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60, maxEntries: 500 }),
    ],
  }),
);

// Tafsir API
registerRoute(
  ({ url }) => {
    const origin = getProxiedOrigin(url);
    if (!origin) return false;
    return origin.includes("quran-tafseer") || origin.includes("tafsir");
  },
  new CacheFirst({
    cacheName: "tafsir-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 100 }),
    ],
  }),
);

// Aladhan prayer times API — time-sensitive, prefer network
registerRoute(
  ({ url }) => getProxiedOrigin(url) === "api.aladhan.com",
  new NetworkFirst({
    cacheName: "aladhan-api",
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60, maxEntries: 30 }),
    ],
  }),
);

// QuranPedia API — mushaf data, cache aggressively
registerRoute(
  ({ url }) => {
    const origin = getProxiedOrigin(url);
    return origin !== null && origin.includes("quranpedia");
  },
  new CacheFirst({
    cacheName: "quranpedia-api",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 200 }),
    ],
  }),
);

// Islamic Network CDN — audio & images through proxy
registerRoute(
  ({ url }) => {
    const origin = getProxiedOrigin(url);
    return origin !== null && origin.includes("islamic.network");
  },
  new CacheFirst({
    cacheName: "islamic-network-cdn",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 500 }),
    ],
  }),
);

// Never cache radio live streams — pure passthrough
registerRoute(
  ({ url }) => {
    const origin = getProxiedOrigin(url);
    if (origin !== "mp3quran.net") return false;
    const target = url.searchParams.get("url") ?? "";
    return target.endsWith(".mp3");
  },
  new NetworkOnly(),
);

// ─── Direct (non-proxied) image caching ───────────────────────────────────────

registerRoute(
  ({ url }) =>
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg)$/) != null &&
    !url.hostname.includes("localhost"),
  new CacheFirst({
    cacheName: "static-images",
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60, maxEntries: 500 }),
    ],
  }),
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

// ─── Global Catch Handler ────────────────────────────────────────────────────
// Graceful fallback when a request fails and isn't matched by any cache route.
setCatchHandler(async ({ request }) => {
  // For page navigations, serve the cached app shell
  if (request.destination === "document") {
    const cached = await caches.match("/index.html");
    if (cached) return cached;
  }
  return Response.error();
});

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
