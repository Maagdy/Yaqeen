import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatNumber } from "../../../utils/numbers";
import { SurahCard } from "../surah-card/surah-card";
import type { JuzCardProps } from "./juz-card.types";
import { useNavigate } from "react-router-dom";

import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useAuth } from "@/hooks";
import {
  useFavoriteJuzsQuery,
  useAddFavoriteJuzMutation,
  useRemoveFavoriteJuzMutation,
} from "@/api/domains/user";
import { toast } from "react-toastify";
import { IconButton } from "../icon-button";

export const JuzCard = ({ juzNumber, surahs, onClick }: JuzCardProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigation = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const { data: favoriteJuzs } = useFavoriteJuzsQuery(user?.id);
  const addFavoriteJuzMutation = useAddFavoriteJuzMutation(user?.id);
  const removeFavoriteJuzMutation = useRemoveFavoriteJuzMutation(user?.id);

  const isFavorite = favoriteJuzs?.some((fav) => fav.juz_number === juzNumber);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.warning(
        t("auth.login_required", { defaultValue: "Please login to bookmark" }),
      );
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteJuzMutation.mutateAsync(juzNumber);
        toast.success(
          t("favorites.juz_removed", {
            defaultValue: "Juz removed from favorites",
          }),
        );
      } else {
        await addFavoriteJuzMutation.mutateAsync(juzNumber);
        toast.success(
          t("favorites.juz_added", { defaultValue: "Juz added to favorites" }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite juz", error);
      toast.error(
        t("common.error_occurred", { defaultValue: "An error occurred" }),
      );
    }
  };

  return (
    <div className="bg-surface border border-transparent rounded-xl overflow-hidden p-4 break-inside-avoid mb-4 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary text-base">
            {t("home.tabs.juz")} {formatNumber(juzNumber, language)}
          </span>
          <IconButton
            icon={
              isFavorite ? (
                <Bookmark fontSize="small" className="text-primary" />
              ) : (
                <BookmarkBorder fontSize="small" />
              )
            }
            variant="ghost"
            onClick={handleBookmarkClick}
            size="sm"
          />
        </div>

        <button
          onClick={() => onClick?.()}
          className="text-text-primary underline text-sm font-medium hover:text-primary transition-colors"
        >
          {t("home.read_juz")}
        </button>
      </div>

      <div className="space-y-3">
        {surahs.map((chapter) => (
          <SurahCard
            key={chapter.number}
            chapter={chapter}
            onClick={() => navigation(`/juz/${juzNumber}`)}
          />
        ))}
      </div>
    </div>
  );
};
