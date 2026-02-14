import { useTranslation } from "react-i18next";
import {
  PlayCircleFilledRounded,
  PauseCircleFilledRounded,
  Bookmark,
  BookmarkBorder,
  Share,
} from "@mui/icons-material";
import { IconButton } from "../../../../../common/icon-button/icon-button";
import { formatNumber } from "@/utils/numbers";
import type { SurahHeaderProps } from "./SurahHeader.types";

import { useAuth } from "@/hooks";
import {
  useFavoriteSurahsQuery,
  useAddFavoriteSurahMutation,
  useRemoveFavoriteSurahMutation,
} from "@/api/domains/user";
import { toast } from "react-toastify";

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  surah,
  isRtl,
  language,
  fullSurahAudioUrl,
  isFullSurahPlaying,
  onFullSurahClick,
}) => {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const { data: favoriteSurahs } = useFavoriteSurahsQuery(user?.id);
  const addFavoriteSurahMutation = useAddFavoriteSurahMutation(user?.id);
  const removeFavoriteSurahMutation = useRemoveFavoriteSurahMutation(user?.id);

  // Check if surah is already favorited (we check for null reciter_id for generic surah favorites)
  // Or if we decide to treat any entry of this surah as "favorited" regardless of reciter
  // existing logic suggests checking surah_number.
  const isFavorite = favoriteSurahs?.some(
    (fav) => fav.surah_number === surah.number,
  );

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      toast.error(
        t("auth.login_required", { defaultValue: "Please login to bookmark" }),
      );
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteSurahMutation.mutateAsync({
          surahNumber: surah.number,
          // We pass null/undefined for reciterId to remove the generic surah favorite
          // If the user favorited this surah with a specific reciter elsewhere, this specific toggle
          // in the generic SurahHeader might act on the "generic" entry or all.
          // Based on user request "default behavior" (no reciter), we pass undefined/null
          reciterId: undefined,
        });
        toast.success(
          t("favorites.surah_removed", {
            defaultValue: "Surah removed from favorites",
          }),
        );
      } else {
        await addFavoriteSurahMutation.mutateAsync({
          surahNumber: surah.number,
          // No reciter for generic Surah page header
          reciterId: undefined,
        });
        toast.success(
          t("favorites.surah_added", {
            defaultValue: "Surah added to favorites",
          }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite surah", error);
      toast.error(
        t("common.error_occurred", { defaultValue: "An error occurred" }),
      );
    }
  };

  return (
    <div className="mb-6 pb-4 border-b-2 border-primary/20">
      <div className="flex items-start justify-between">
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Share fontSize="medium" />}
            onClick={() => {
              // TODO: Implement share logic
              console.log("Share clicked");
            }}
            className="text-primary/70 hover:text-primary"
            size="sm"
          />
          <IconButton
            icon={
              isFavorite ? (
                <Bookmark fontSize="medium" className="text-primary" />
              ) : (
                <BookmarkBorder
                  fontSize="medium"
                  className="text-primary/70 hover:text-primary"
                />
              )
            }
            onClick={handleBookmarkClick}
            className={
              isFavorite
                ? "text-primary hover:text-primary/80"
                : "text-primary/70 hover:text-primary"
            }
            size="sm"
          />
        </div>

        {/* Surah Name and Verse Count - Centered */}
        <div className="flex-1 text-center">
          <h2
            className={`text-2xl md:text-3xl font-bold text-primary mb-1 ${
              isRtl ? "font-amiri" : ""
            }`}
          >
            {"name" in surah ? (isRtl ? surah.name : surah.englishName) : ""}
          </h2>
          <p className="text-sm text-text-secondary">
            {"revelationType" in surah &&
              t(
                surah.revelationType.toLowerCase() === "meccan"
                  ? "home.revelation_place.makkah"
                  : "home.revelation_place.madinah",
              )}{" "}
            • {formatNumber(surah.numberOfAyahs, language)} {t("home.verses")}
          </p>
        </div>

        {/* Empty space for alignment */}
        <div className="w-20"></div>
      </div>

      {/* Listen to Full Surah Button */}
      {fullSurahAudioUrl && (
        <div className="mt-4 text-center">
          <IconButton
            onClick={onFullSurahClick}
            icon={
              isFullSurahPlaying ? (
                <PauseCircleFilledRounded />
              ) : (
                <PlayCircleFilledRounded />
              )
            }
            label={
              isFullSurahPlaying
                ? t("surah.pause_full")
                : t("surah.listen_full")
            }
            className="mx-auto"
            size="md"
          />
        </div>
      )}
    </div>
  );
};
