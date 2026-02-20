import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks";

// ─── Public data fetchers (no auth required) ─────────────────────────────────
import { getChapters } from "@/api/domains/chapter/chapter.queries";
import { getJuzs } from "@/api/domains/juz/juz.queries";
import { getAllMushafs } from "@/api/domains/mushafs/mushafs.queries";
import { getReciters } from "@/api/domains/reciters/reciters-queries";
import { getTafsirBooks, getHadithCollections } from "@/api/domains/tafsir/tafsir.queries";
import { getRadios } from "@/api/domains/radio/radio-queries";
import { getStaticRadios } from "@/data/static-radios";

// ─── User data fetchers (auth required) ──────────────────────────────────────
import {
  getProfile,
  getFavoriteReciters,
  getFavoriteSurahs,
  getFavoriteAyahs,
  getFavoriteJuzs,
  getFavoriteBooks,
  getFavoriteHadiths,
  getFavoriteMushafs,
  getFavoriteRadios,
  getFavoriteDuas,
  getUserProgress,
  getUserStreaks,
} from "@/api/domains/user/user-queries";

// Only prefetch in installed PWA (standalone mode), not on the website
const isStandalone =
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true);

/**
 * Prefetches critical metadata on app startup so navigation works offline.
 * Only runs when the app is installed as a PWA (standalone mode).
 *
 * - Public data: prefetched immediately (surah list, reciters, mushafs, etc.)
 * - User data: prefetched after login (favorites, profile, progress)
 * - Individual surah content is cached by the SW when the user visits it.
 */
export function usePrefetchData() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const publicPrefetched = useRef(false);
  const userPrefetched = useRef<string | null>(null);

  // ─── Public data (runs once on mount, PWA only) ─────────────────────────────
  useEffect(() => {
    if (!isStandalone) return;
    if (publicPrefetched.current) return;
    publicPrefetched.current = true;

    const prefetch = (queryKey: unknown[], queryFn: () => Promise<unknown>) =>
      queryClient.prefetchQuery({ queryKey, queryFn, staleTime: Infinity });

    // Core navigation data
    prefetch(["chapters"], getChapters);
    prefetch(["juzs"], getJuzs);
    prefetch(["mushafs"], getAllMushafs);
    prefetch(["tafsir-books"], getTafsirBooks);

    // Reciters — both languages
    prefetch(
      ["reciters", { language: "ar", rewaya: undefined, sura: undefined, reciterId: undefined }],
      () => getReciters({ language: "ar" }),
    );
    prefetch(
      ["reciters", { language: "en", rewaya: undefined, sura: undefined, reciterId: undefined }],
      () => getReciters({ language: "en" }),
    );

    // Radio — both languages (merge with static radios to match useRadios hook)
    prefetch(["radios", "ar"], async () => {
      const [apiRadios, staticRadios] = await Promise.all([
        getRadios("ar"),
        Promise.resolve(getStaticRadios("ar")),
      ]);
      return [...staticRadios, ...apiRadios];
    });
    prefetch(["radios", "en"], async () => {
      const [apiRadios, staticRadios] = await Promise.all([
        getRadios("eng"),
        Promise.resolve(getStaticRadios("en")),
      ]);
      return [...staticRadios, ...apiRadios];
    });

    // Hadith collections (with default exclusions to match useHadithCollections)
    const defaultExclusions = ["darimi", "nawawi40", "malik"];
    prefetch(["hadith-collections", defaultExclusions], () =>
      getHadithCollections(defaultExclusions),
    );
  }, [queryClient]);

  // ─── User data (runs when user logs in, PWA only) ───────────────────────────
  useEffect(() => {
    if (!isStandalone) return;
    if (!user) return;
    if (userPrefetched.current === user.id) return;
    userPrefetched.current = user.id;

    const prefetch = (queryKey: unknown[], queryFn: () => Promise<unknown>) =>
      queryClient.prefetchQuery({ queryKey, queryFn, staleTime: 5 * 60 * 1000 });

    const uid = user.id;

    prefetch(["profile", uid], () => getProfile(uid));
    prefetch(["user-stats", uid], async () => {
      const [progress, streaks] = await Promise.all([
        getUserProgress(uid),
        getUserStreaks(uid),
      ]);
      return { progress, streaks };
    });
    prefetch(["favorite-reciters", uid], () => getFavoriteReciters(uid));
    prefetch(["favorite-surahs", uid], () => getFavoriteSurahs(uid));
    prefetch(["favorite-ayahs", uid], () => getFavoriteAyahs(uid));
    prefetch(["favorite-juzs", uid], () => getFavoriteJuzs(uid));
    prefetch(["favorite-books", uid], () => getFavoriteBooks(uid));
    prefetch(["favorite-hadiths", uid], () => getFavoriteHadiths(uid));
    prefetch(["favorite-mushafs", uid], () => getFavoriteMushafs(uid));
    prefetch(["favorite-radios", uid], () => getFavoriteRadios(uid));
    prefetch(["favorite-duas", uid], () => getFavoriteDuas(uid));
  }, [queryClient, user]);
}
