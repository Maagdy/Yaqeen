import { useEffect } from "react";

// Cached once at module load — false on the regular website, true only in installed PWA.
// This means on the website: no imports of API modules, no useEffect body runs, zero overhead.
const IS_STANDALONE =
  typeof window !== "undefined" &&
  window.matchMedia("(display-mode: standalone)").matches;

type SurahParams = { surahNumber: number; edition: string };
type JuzParams = { juzNumber: number; edition: string };
type MushafSurahParams = { mushafId: number; surahNumber: number };
type HadithParams = {
  collection: string;
  book: number;
  page: number;
  limit: number;
};

type PrefetchConfig =
  | { type: "surah"; params: SurahParams }
  | { type: "juz"; params: JuzParams }
  | { type: "mushaf-surah"; params: MushafSurahParams }
  | { type: "hadith"; params: HadithParams };

// Lazy-load all API dependencies so they are NEVER imported on the regular website.
// Tree-shaking can't help here since the functions are re-exported, but dynamic import
// ensures the code paths (and their transitive deps) are only pulled in for PWA users.
async function runPrefetch(config: PrefetchConfig) {
  const [{ queryClient }, chapterMod, juzMod, mushafsMod, tafsirMod] =
    await Promise.all([
      import("@/contexts/queryClient"),
      import("@/api/domains/chapter/chapter.queries"),
      import("@/api/domains/juz/juz.queries"),
      import("@/api/domains/mushafs/mushafs.queries"),
      import("@/api/domains/tafsir/tafsir.queries"),
    ]);

  const STALE_STATIC = Infinity; // Quran text never changes
  const STALE_24H = 1000 * 60 * 60 * 24;

  switch (config.type) {
    case "surah": {
      const { surahNumber, edition } = config.params;
      const nearby = [surahNumber - 1, surahNumber + 1, surahNumber + 2].filter(
        (n) => n >= 1 && n <= 114,
      );
      for (const n of nearby) {
        queryClient.prefetchQuery({
          queryKey: ["surah", n, edition, undefined, undefined],
          queryFn: () => chapterMod.getSurah(n, edition),
          staleTime: STALE_STATIC,
        });
      }
      break;
    }

    case "juz": {
      const { juzNumber, edition } = config.params;
      const next = juzNumber + 1;
      if (next <= 30) {
        queryClient.prefetchQuery({
          queryKey: ["juz", next, edition],
          queryFn: () => juzMod.getJuz(next, edition),
          staleTime: STALE_STATIC,
        });
      }
      break;
    }

    case "mushaf-surah": {
      const { mushafId, surahNumber } = config.params;
      const nearby = [surahNumber - 1, surahNumber + 1, surahNumber + 2].filter(
        (n) => n >= 1 && n <= 114,
      );
      for (const n of nearby) {
        queryClient.prefetchQuery({
          queryKey: ["mushaf-surah", mushafId, n],
          queryFn: () => mushafsMod.getMushafSurah(mushafId, n),
          staleTime: STALE_24H,
        });
      }
      break;
    }

    case "hadith": {
      const { collection, book, page, limit } = config.params;
      // Next page of current book
      const nextPageParams = { collection, book, page: page + 1, limit };
      queryClient.prefetchQuery({
        queryKey: ["hadiths", nextPageParams],
        queryFn: () => tafsirMod.getHadiths(nextPageParams),
        staleTime: STALE_24H,
      });
      // First page of next book
      const nextBookParams = { collection, book: book + 1, page: 1, limit };
      queryClient.prefetchQuery({
        queryKey: ["hadiths", nextBookParams],
        queryFn: () => tafsirMod.getHadiths(nextBookParams),
        staleTime: STALE_24H,
      });
      break;
    }
  }
}

/**
 * Prefetches nearby content in the background for offline PWA use.
 *
 * On the regular website (non-standalone): this is a complete no-op.
 * - The IS_STANDALONE constant is false → useEffect body never executes.
 * - All API modules are lazy-imported inside runPrefetch() → zero bundle cost on the website.
 */
export function useSmartPrefetch(config: PrefetchConfig) {
  const { type, params } = config;

  useEffect(() => {
    if (!IS_STANDALONE) return;

    runPrefetch({ type, params } as PrefetchConfig).catch((err) => {
      console.warn("[SmartPrefetch] Error:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, JSON.stringify(params)]);
}
