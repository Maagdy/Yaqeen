import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/query-persist-client-core";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";

// App version used as cache buster — update when deploying breaking schema changes
const CACHE_BUSTER = "v1.0.0";

// IndexedDB-backed async storage for TanStack Query persistence
const idbStorage = {
  getItem: (key: string) => get<string>(key).then((v) => v ?? null),
  setItem: (key: string, value: string) => set(key, value),
  removeItem: (key: string) => del(key),
};

const persister = createAsyncStoragePersister({
  storage: idbStorage,
  key: "yaqeen-query-cache",
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes default
      retry: 1,
      gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
});

// Persist query cache to IndexedDB (survives page reloads + offline)
persistQueryClient({
  queryClient,
  persister,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  buster: CACHE_BUSTER,
});
