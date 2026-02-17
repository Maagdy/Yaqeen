import type { MushafSurahDetailsProps } from "./mushaf-surah-details.types";
import { useTranslation } from "react-i18next";
import { useLanguage, useMediaQuery, useAuth } from "@/hooks";
import { quranSurahs } from "@/utils/constants";
import { useState } from "react";
import { formatNumber } from "@/utils/numbers";
import { padSurahNumber } from "@/utils/surahUtils";
import {
  Bookmark,
  BookmarkBorder,
  Share,
  PlayCircleFilledRounded,
  PauseCircleFilledRounded,
} from "@mui/icons-material";
import { IconButton } from "@/components/common";
import { MobileAyahCard } from "@/components/common/mobile-ayah-card";
import { useAudio } from "@/hooks/useAudio";
import {
  useFavoriteAyahsQuery,
  useAddFavoriteAyahMutation,
  useRemoveFavoriteAyahMutation,
  useFavoriteSurahsQuery,
  useAddFavoriteSurahMutation,
  useRemoveFavoriteSurahMutation,
} from "@/api/domains/user";
import { toast } from "react-toastify";
import type { Ayah } from "@/api";

export const MushafSurahDetails: React.FC<MushafSurahDetailsProps> = ({
  surah,
}) => {
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();
  const { user, isLoggedIn } = useAuth();
  const [hoveredAyah, setHoveredAyah] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: favoriteAyahs = [] } = useFavoriteAyahsQuery(user?.id);
  const addFavoriteAyah = useAddFavoriteAyahMutation(user?.id);
  const removeFavoriteAyah = useRemoveFavoriteAyahMutation(user?.id);

  const { data: favoriteSurahs } = useFavoriteSurahsQuery(user?.id);
  const addFavoriteSurahMutation = useAddFavoriteSurahMutation(user?.id);
  const removeFavoriteSurahMutation = useRemoveFavoriteSurahMutation(user?.id);

  const isFavoriteSurah = favoriteSurahs?.some(
    (fav) => fav.surah_number === surah.id,
  );

  const handleSurahBookmark = async () => {
    if (!isLoggedIn) {
      toast.warning(
        t("auth.login_required", { defaultValue: "Please login to bookmark" }),
      );
      return;
    }

    try {
      if (isFavoriteSurah) {
        await removeFavoriteSurahMutation.mutateAsync({
          surahNumber: surah.id,
          reciterId: undefined,
        });
        toast.success(
          t("favorites.surah_removed", {
            defaultValue: "Surah removed from favorites",
          }),
        );
      } else {
        await addFavoriteSurahMutation.mutateAsync({
          surahNumber: surah.id,
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

  const surahInfo = quranSurahs.find((s) => s.number === surah.id);
  const englishName = surahInfo?.name || "";

  const { play, pause, isPlaying, currentAudio } = useAudio();
  const DEFAULT_SURAH_SERVER = "https://server7.mp3quran.net/basit";
  const fullSurahAudioUrl = `${DEFAULT_SURAH_SERVER}/${padSurahNumber(surah.id)}.mp3`;
  const isFullSurahPlaying = isPlaying && currentAudio === fullSurahAudioUrl;

  const handleFullSurahClick = () => {
    if (fullSurahAudioUrl) {
      if (isPlaying && currentAudio === fullSurahAudioUrl) {
        pause();
      } else {
        play(fullSurahAudioUrl, surah.id, 'surah');
      }
    }
  };

  const handleMobileAyahBookmark = async (
    ayahNumber: number,
    ayahText: string,
  ) => {
    if (!isLoggedIn) {
      toast.warning(
        t("auth.login_required", {
          defaultValue: "Please login to bookmark ayahs",
        }),
      );
      return;
    }

    const isBookmarked = favoriteAyahs.some(
      (fav) => fav.surah_number === surah.id && fav.ayah_number === ayahNumber,
    );

    try {
      if (isBookmarked) {
        await removeFavoriteAyah.mutateAsync({
          surahNumber: surah.id,
          ayahNumber,
        });
        toast.success(
          t("favorites.ayah_removed", {
            defaultValue: "Ayah removed from favorites",
          }),
        );
      } else {
        await addFavoriteAyah.mutateAsync({
          surahNumber: surah.id,
          ayahNumber,
          surahName: surah.name,
          ayahText,
          surahNameEnglish: englishName,
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

  const handleMobileAyahShare = async (
    ayahNumber: number,
    ayahText: string,
  ) => {
    const shareText = `${ayahText}\n\n${surah.name} (${surah.id}:${ayahNumber})`;

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

  const handleMobileAyahCopy = async (ayahText: string) => {
    try {
      await navigator.clipboard.writeText(ayahText);
      toast.success(
        t("common.copied", { defaultValue: "Copied to clipboard" }),
      );
    } catch (error) {
      console.error(error);

      toast.error(t("common.error", { defaultValue: "An error occurred" }));
    }
  };

  const isAyahBookmarked = (ayahNumber: number) => {
    return favoriteAyahs.some(
      (fav) => fav.surah_number === surah.id && fav.ayah_number === ayahNumber,
    );
  };

  const getSurahForMobileCard = () => ({
    name: surah.name,
    number: surah.id,
    englishName,
    englishNameTranslation: englishName,
    numberOfAyahs: surah.ayahs.length,
    revelationType: "Meccan",
  });

  const convertToAyah = (mushafAyah: (typeof surah.ayahs)[0]): Ayah => ({
    number: mushafAyah.id,
    text: mushafAyah.text,
    numberInSurah: mushafAyah.number,
    juz: mushafAyah.juz,
    manzil: mushafAyah.manzil,
    page: mushafAyah.page_number,
    ruku: mushafAyah.ruku,
    hizbQuarter: mushafAyah.hizb * 4,
    sajda: false,
    surah: getSurahForMobileCard(),
  });

  return (
    <div className="mb-12 mt-2">
      <div className="mb-6 pb-4 border-b-2 border-primary/20">
        <div className="flex items-start justify-between">
          <div className={`w-20 ${isRtl ? "order-3" : "order-1"}`}></div>

          <div className="flex-1 text-center order-2">
            <h2
              className={`text-2xl md:text-3xl font-bold text-primary mb-1 ${
                isRtl ? "font-amiri" : ""
              }`}
            >
              {isRtl ? surah.name : englishName}
            </h2>
            <p className="text-sm text-text-secondary">
              {formatNumber(surah.ayahs.length, language)} {t("home.verses")}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 ${isRtl ? "order-1" : "order-3"}`}
          >
            <IconButton
              icon={<Share fontSize="medium" />}
              onClick={() => {
                // Share clicked
              }}
              className="text-primary/70 hover:text-primary"
              size="sm"
            />
            <IconButton
              icon={
                isFavoriteSurah ? (
                  <Bookmark fontSize="medium" className="text-primary" />
                ) : (
                  <BookmarkBorder
                    fontSize="medium"
                    className="text-primary/70"
                  />
                )
              }
              onClick={handleSurahBookmark}
              className={
                isFavoriteSurah
                  ? "text-primary hover:text-primary/80"
                  : "text-primary/70 hover:text-primary"
              }
              size="sm"
            />
          </div>
        </div>

        {fullSurahAudioUrl && (
          <div className="mt-4 text-center">
            <IconButton
              onClick={handleFullSurahClick}
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

      {isMobile ? (
        <div className="space-y-4">
          {surah.ayahs.map((ayah) => (
            <MobileAyahCard
              key={ayah.number}
              ayah={convertToAyah(ayah)}
              surah={getSurahForMobileCard()}
              onBookmark={() =>
                handleMobileAyahBookmark(ayah.number, ayah.text)
              }
              onShare={() => handleMobileAyahShare(ayah.number, ayah.text)}
              onCopy={() => handleMobileAyahCopy(ayah.text)}
              onTafsirClick={() => {
                // Tafsir - not yet implemented
              }}
              isBookmarked={isAyahBookmarked(ayah.number)}
            />
          ))}
        </div>
      ) : (
        <div
          className={`space-y-4 text-center ${isRtl ? "font-amiri" : ""}`}
          dir={"rtl"}
        >
          {surah.ayahs.map((ayah) => {
            return (
              <div
                key={ayah.number}
                data-page={ayah.page_number}
                className="leading-loose text-text-primary p-2"
              >
                <div className="flex items-center justify-center gap-2">
                  <div
                    onMouseEnter={() => setHoveredAyah(ayah.number)}
                    onMouseLeave={() => setHoveredAyah(null)}
                    className="relative"
                  >
                    {hoveredAyah === ayah.number && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 z-10 pb-2">
                      </div>
                    )}

                    <span className={`text-xl md:text-2xl transition-colors`}>
                      {ayah.text}
                    </span>

                    <span className="inline-flex items-center justify-center relative">
                      <span className="inline-flex items-center justify-center relative mx-1 w-9 h-9">
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18 2 L26 6 L30 14 L30 22 L26 30 L18 34 L10 30 L6 22 L6 14 L10 6 Z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-primary/90"
                          />
                        </svg>
                        <span className="relative z-10 text-sm font-bold text-text-primary">
                          {formatNumber(ayah.number, language)}
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <span className="text-sm font-medium text-primary/70 px-4">
          {t("surah.end")}
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-primary/30 to-transparent" />
      </div>
    </div>
  );
};
