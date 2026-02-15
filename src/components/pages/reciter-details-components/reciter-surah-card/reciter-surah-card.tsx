import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DownloadIcon from "@mui/icons-material/Download";
import LinkIcon from "@mui/icons-material/Link";
import type { ReciterSurahCardProps } from "./reciter-surah-card.types";
import { formatNumber } from "../../../../utils/numbers";
import { useLanguage, useAuth } from "../../../../hooks";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  useAddFavoriteSurahMutation,
  useFavoriteSurahsQuery,
  useRemoveFavoriteSurahMutation,
} from "@/api/domains/user/useUserQueries";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { getReciters } from "@/api";

export const ReciterSurahCard = ({
  number,
  name,
  arabicName,
  onPlay,
  isPlaying = false,
  onDownload,
  onCopyLink,
  reciter,
}: ReciterSurahCardProps) => {
  const { language } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  const { data: favoriteSurahs } = useFavoriteSurahsQuery(user?.id);
  const { mutate: addFavoriteSurah, isPending: isAdding } =
    useAddFavoriteSurahMutation(user?.id);
  const { mutate: removeFavoriteSurah, isPending: isRemoving } =
    useRemoveFavoriteSurahMutation(user?.id);
  const { t } = useTranslation();
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);

  const isFavorite = favoriteSurahs?.some(
    (f) => f.surah_number === number && f.reciter_id === reciter?.id,
  );

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.warning(t("common.login_to_favorite"));
      return;
    }

    if (!reciter) return;

    if (isFavorite) {
      removeFavoriteSurah(
        { surahNumber: number, reciterId: reciter.id },
        {
          onSuccess: () => toast.success(t("common.removed_from_favorites")),
          onError: () => toast.error(t("common.error_removing_favorite")),
        },
      );
    } else {
      setIsFetchingInfo(true);
      try {
        let nameAr = reciter.name;
        let nameEn = reciter.englishName;

        if (language === "en") {
          nameEn = reciter.name;
          // Fetch Arabic name if missing
          try {
            const arData = await getReciters({
              reciter: reciter.id,
              language: "ar",
            });
            if (arData?.[0]) nameAr = arData[0].name;
          } catch (error) {
            console.error("Failed to fetch Arabic name", error);
          }
        } else {
          // Assuming Arabic or other
          // nameAr is already reciter.name
          // Fetch English name if missing
          try {
            const enData = await getReciters({
              reciter: reciter.id,
              language: "en",
            });
            if (enData?.[0]) nameEn = enData[0].name;
          } catch (error) {
            console.error("Failed to fetch English name", error);
          }
        }

        addFavoriteSurah(
          {
            surahNumber: number,
            reciterId: reciter.id,
            reciterName: nameAr,
            reciterNameEnglish: nameEn,
          },
          {
            onSuccess: () => toast.success(t("common.added_to_favorites")),
            onError: () => toast.error(t("common.error_adding_favorite")),
          },
        );
      } finally {
        setIsFetchingInfo(false);
      }
    }
  };

  return (
    <div className="group relative flex items-center justify-between p-4 h-24 bg-background border border-border rounded-xl transition-all duration-300 hover:border-primary hover:shadow-md">
      {/* LEFT */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Play Button */}
        <button
          onClick={onPlay}
          className={`cursor-pointer w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
            isPlaying
              ? "bg-primary text-white scale-105"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-105"
          }`}
        >
          {isPlaying ? (
            <PauseIcon fontSize="medium" />
          ) : (
            <PlayArrowIcon fontSize="medium" />
          )}
        </button>

        {/* Surah Info */}
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-text-primary text-base sm:text-lg truncate group-hover:text-primary transition-colors duration-300">
            {formatNumber(number, language)}. {name}
          </h3>

          {arabicName && (
            <span className="text-text-secondary text-sm font-amiri truncate">
              {arabicName}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onCopyLink}
          className="cursor-pointer text-text-secondary hover:text-primary transition-colors duration-200"
        >
          <LinkIcon fontSize="small" />
        </button>

        <button
          onClick={onDownload}
          className="cursor-pointer text-text-secondary hover:text-primary transition-colors duration-200"
        >
          <DownloadIcon fontSize="small" />
        </button>
        <button
          onClick={toggleFavorite}
          disabled={isAdding || isRemoving || isFetchingInfo}
          className={`cursor-pointer transition-colors duration-200 ${
            isFavorite
              ? "text-primary"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          {isFavorite ? (
            <Favorite fontSize="small" />
          ) : (
            <FavoriteBorder fontSize="small" />
          )}
        </button>
      </div>
    </div>
  );
};
