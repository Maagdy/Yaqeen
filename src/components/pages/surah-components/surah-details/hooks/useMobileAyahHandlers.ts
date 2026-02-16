import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type { Ayah, Surah } from "@/api";
import type { FavoriteAyah } from "@/api/domains/user";
import {
  useAddFavoriteAyahMutation,
  useRemoveFavoriteAyahMutation,
} from "@/api/domains/user";
import type { User } from "@supabase/supabase-js";

interface UseMobileAyahHandlersProps {
  surah: Surah;
  favoriteAyahs: FavoriteAyah[];
  user: User | null;
  isLoggedIn: boolean;
  onAyahClick: (ayah: Ayah) => void;
}

export const useMobileAyahHandlers = ({
  surah,
  favoriteAyahs,
  user,
  isLoggedIn,
  onAyahClick,
}: UseMobileAyahHandlersProps) => {
  const { t } = useTranslation();
  const addFavoriteAyah = useAddFavoriteAyahMutation(user?.id);
  const removeFavoriteAyah = useRemoveFavoriteAyahMutation(user?.id);

  const handlePlay = (ayah: Ayah) => {
    onAyahClick(ayah);
  };

  const handleBookmark = async (ayah: Ayah) => {
    if (!isLoggedIn) {
      toast.warning(
        t("auth.login_required", {
          defaultValue: "Please login to bookmark ayahs",
        }),
      );
      return;
    }

    const isBookmarked = favoriteAyahs.some(
      (fav) =>
        fav.surah_number === surah.number &&
        fav.ayah_number === ayah.numberInSurah,
    );

    try {
      if (isBookmarked) {
        await removeFavoriteAyah.mutateAsync({
          surahNumber: surah.number,
          ayahNumber: ayah.numberInSurah,
        });
        toast.success(
          t("favorites.ayah_removed", {
            defaultValue: "Ayah removed from favorites",
          }),
        );
      } else {
        await addFavoriteAyah.mutateAsync({
          surahNumber: surah.number,
          ayahNumber: ayah.numberInSurah,
          surahName: surah.name,
          ayahText: ayah.text,
          surahNameEnglish: surah.englishName,
        });
        toast.success(
          t("favorites.ayah_added", {
            defaultValue: "Ayah added to favorites",
          }),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(t("common.error", { defaultValue: "An error occurred" }));
    }
  };

  const handleShare = async (ayah: Ayah) => {
    const shareText = `${ayah.text}\n\n${surah.name} (${surah.number}:${ayah.numberInSurah})`;

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success(
        t("common.copied", { defaultValue: "Copied to clipboard" }),
      );
    }
  };

  const handleCopy = async (ayah: Ayah) => {
    try {
      await navigator.clipboard.writeText(ayah.text);
      toast.success(
        t("common.copied", { defaultValue: "Copied to clipboard" }),
      );
    } catch (error) {
      console.error(error);
      toast.error(t("common.error", { defaultValue: "An error occurred" }));
    }
  };

  const isBookmarked = (ayah: Ayah) => {
    return favoriteAyahs.some(
      (fav) =>
        fav.surah_number === surah.number &&
        fav.ayah_number === ayah.numberInSurah,
    );
  };

  const isBookmarkLoading = () => {
    return addFavoriteAyah.isPending || removeFavoriteAyah.isPending;
  };

  return {
    handlePlay,
    handleBookmark,
    handleShare,
    handleCopy,
    isBookmarked,
    isBookmarkLoading,
  };
};
