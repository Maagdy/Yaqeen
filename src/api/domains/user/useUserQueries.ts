import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  getFavoriteReciters,
  getFavoriteSurahs,
  getFavoriteAyahs,
  getUserProgress,
  getUserStreaks,
  addFavoriteReciter,
  removeFavoriteReciter,
  addFavoriteSurah,
  removeFavoriteSurah,
  addFavoriteAyah,
  removeFavoriteAyah,
  getFavoriteJuzs,
  addFavoriteJuz,
  removeFavoriteJuz,
  getFavoriteBooks,
  addFavoriteBook,
  removeFavoriteBook,
  getFavoriteHadiths,
  addFavoriteHadith,
  removeFavoriteHadith,
  getFavoriteMushafs,
  addFavoriteMushaf,
  removeFavoriteMushaf,
  getFavoriteRadios,
  addFavoriteRadio,
  removeFavoriteRadio,
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

export const useFavoriteAyahsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorite-ayahs", userId],
    queryFn: () => (userId ? getFavoriteAyahs(userId) : []),
    enabled: !!userId,
  });
};

export const useAddFavoriteAyahMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      surahNumber,
      ayahNumber,
      surahName,
      ayahText,
      surahNameEnglish,
    }: {
      surahNumber: number;
      ayahNumber: number;
      surahName?: string;
      ayahText?: string;
      surahNameEnglish?: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return addFavoriteAyah(
        userId,
        surahNumber,
        ayahNumber,
        surahName,
        ayahText,
        surahNameEnglish,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-ayahs", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-ayahs", userId],
      });
    },
  });
};

export const useRemoveFavoriteAyahMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      surahNumber,
      ayahNumber,
    }: {
      surahNumber: number;
      ayahNumber: number;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return removeFavoriteAyah(userId, surahNumber, ayahNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-ayahs", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-ayahs", userId],
      });
    },
  });
};

export const useFavoriteJuzsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorite-juzs", userId],
    queryFn: () => (userId ? getFavoriteJuzs(userId) : []),
    enabled: !!userId,
  });
};

export const useAddFavoriteJuzMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: (juzNumber: number) => {
      if (!userId) throw new Error("User must be logged in");
      return addFavoriteJuz(userId, juzNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-juzs", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-juzs", userId],
      });
    },
  });
};

export const useRemoveFavoriteJuzMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: (juzNumber: number) => {
      if (!userId) throw new Error("User must be logged in");
      return removeFavoriteJuz(userId, juzNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-juzs", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-juzs", userId],
      });
    },
  });
};

// --- Favorite Books ---
export const useFavoriteBooksQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorite-books", userId],
    queryFn: () => (userId ? getFavoriteBooks(userId) : []),
    enabled: !!userId,
  });
};

export const useAddFavoriteBookMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      collectionName,
      bookNumber,
      bookName,
    }: {
      collectionName: string;
      bookNumber?: string;
      bookName?: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return addFavoriteBook(userId, collectionName, bookNumber, bookName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-books", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-books", userId],
      });
    },
  });
};

export const useRemoveFavoriteBookMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      collectionName,
      bookNumber,
    }: {
      collectionName: string;
      bookNumber?: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return removeFavoriteBook(userId, collectionName, bookNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-books", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-books", userId],
      });
    },
  });
};

// --- Favorite Hadiths ---
export const useFavoriteHadithsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorite-hadiths", userId],
    queryFn: () => (userId ? getFavoriteHadiths(userId) : []),
    enabled: !!userId,
  });
};

export const useAddFavoriteHadithMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      collectionName,
      bookNumber,
      hadithNumber,
      chapterId,
      hadithText,
    }: {
      collectionName: string;
      bookNumber: string;
      hadithNumber: string;
      chapterId?: string;
      hadithText?: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return addFavoriteHadith(
        userId,
        collectionName,
        bookNumber,
        hadithNumber,
        chapterId,
        hadithText,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-hadiths", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-hadiths", userId],
      });
    },
  });
};

export const useRemoveFavoriteHadithMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      collectionName,
      bookNumber,
      hadithNumber,
    }: {
      collectionName: string;
      bookNumber: string;
      hadithNumber: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return removeFavoriteHadith(
        userId,
        collectionName,
        bookNumber,
        hadithNumber,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-hadiths", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-hadiths", userId],
      });
    },
  });
};

// --- Favorite Mushafs ---
export const useFavoriteMushafsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorite-mushafs", userId],
    queryFn: () => (userId ? getFavoriteMushafs(userId) : []),
    enabled: !!userId,
  });
};

export const useAddFavoriteMushafMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      mushafId,
      mushafName,
      mushafNameEnglish,
    }: {
      mushafId: number;
      mushafName?: string;
      mushafNameEnglish?: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return addFavoriteMushaf(userId, mushafId, mushafName, mushafNameEnglish);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-mushafs", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-mushafs", userId],
      });
    },
  });
};

export const useRemoveFavoriteMushafMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: (mushafId: number) => {
      if (!userId) throw new Error("User must be logged in");
      return removeFavoriteMushaf(userId, mushafId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-mushafs", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-mushafs", userId],
      });
    },
  });
};

// --- Favorite Radios ---
export const useFavoriteRadiosQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorite-radios", userId],
    queryFn: () => (userId ? getFavoriteRadios(userId) : []),
    enabled: !!userId,
  });
};

export const useAddFavoriteRadioMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      radioId,
      radioName,
      radioUrl,
    }: {
      radioId: number;
      radioName?: string;
      radioUrl?: string;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return addFavoriteRadio(userId, radioId, radioName, radioUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-radios", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-radios", userId],
      });
    },
  });
};

export const useRemoveFavoriteRadioMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: (radioId: number) => {
      if (!userId) throw new Error("User must be logged in");
      return removeFavoriteRadio(userId, radioId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-radios", userId],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-radios", userId],
      });
    },
  });
};
