import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  getFavoriteReciters,
  getFavoriteSurahs,
  getUserProgress,
  getUserStreaks,
  addFavoriteReciter,
  removeFavoriteReciter,
  addFavoriteSurah,
  removeFavoriteSurah,
} from "./user-queries";
import type { Profile } from "./user.types";
import { queryClient } from "@/contexts/queryClient";

export const useProfileQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => (userId ? getProfile(userId) : null),
    enabled: !!userId,
  });
};

export const useUpdateProfileMutation = (userId: string) => {
  return useMutation({
    mutationFn: (updates: Partial<Profile>) => updateProfile(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
};

export const useFavoriteRecitersQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorite-reciters", userId],
    queryFn: () => (userId ? getFavoriteReciters(userId) : []),
    enabled: !!userId,
  });
};

export const useFavoriteSurahsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorite-surahs", userId],
    queryFn: () => (userId ? getFavoriteSurahs(userId) : []),
    enabled: !!userId,
  });
};

export const useUserStatsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async () => {
      if (!userId) return null;
      const progress = await getUserProgress(userId); // Fetches all or recent
      const streak = await getUserStreaks(userId);
      return { progress, streak };
    },
    enabled: !!userId,
  });
};

export const useAddFavoriteReciterMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      reciterId,
      reciterName,
      reciterNameEnglish,
    }: {
      reciterId: number;
      reciterName: string;
      reciterNameEnglish?: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return addFavoriteReciter(
        userId,
        reciterId,
        reciterName,
        reciterNameEnglish,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-reciters", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-reciters", userId],
      });
    },
  });
};

export const useRemoveFavoriteReciterMutation = (
  userId: string | undefined,
) => {
  return useMutation({
    mutationFn: (reciterId: number) => {
      if (!userId) throw new Error("User must be logged in");
      return removeFavoriteReciter(userId, reciterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-reciters", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-reciters", userId],
      });
    },
  });
};

export const useAddFavoriteSurahMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      surahNumber,
      reciterId,
      reciterName,
      reciterNameEnglish,
    }: {
      surahNumber: number;
      reciterId?: number;
      reciterName?: string;
      reciterNameEnglish?: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return addFavoriteSurah(
        userId,
        surahNumber,
        reciterId,
        reciterName,
        reciterNameEnglish,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-surahs", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-surahs", userId],
      });
    },
  });
};

export const useRemoveFavoriteSurahMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      surahNumber,
      reciterId,
    }: {
      surahNumber: number;
      reciterId?: number;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return removeFavoriteSurah(userId, surahNumber, reciterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-surahs", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-surahs", userId],
      });
    },
  });
};
