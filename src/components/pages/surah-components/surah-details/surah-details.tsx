import type { SurahDetailsProps } from "./surah-details.types";
import { useEffect, useState } from "react";
import { useLanguage, useMediaQuery, useAuth, useReciterSelector } from "../../../../hooks";
import { useSurahNavigation } from "../../../../hooks/useSurahNavigation";
import { useAudio } from "../../../../hooks/useAudio";
import type { Ayah, Surah } from "../../../../api";
import { useFavoriteAyahsQuery } from "@/api/domains/user";
import { useMobileAyahHandlers } from "./hooks";
import { SurahHeader, MobileAyahsList, DesktopAyahsList } from "./components";
import { useTranslation } from "react-i18next";
import ViewListRounded from "@mui/icons-material/ViewListRounded";
import ArticleRounded from "@mui/icons-material/ArticleRounded";

type MobileViewMode = "ayah" | "full";

export const SurahDetails: React.FC<SurahDetailsProps> = ({
  surah,
  ayahs,
  isJuzPage = false,
  onAyahClick,
}) => {
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();
  const { user, isLoggedIn } = useAuth();
  const { play, pause, isPlaying, currentSurahNumber, currentAudio } =
    useAudio();
  const { clearNavigationHandlers } = useSurahNavigation();
  const [hoveredAyah, setHoveredAyah] = useState<number | null>(null);
  const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>("ayah");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: favoriteAyahs = [] } = useFavoriteAyahsQuery(user?.id);

  const {
    availableReciters,
    selectedReciter,
    fullSurahAudioUrl,
    onReciterChange,
    isLoading: isRecitersLoading,
  } = useReciterSelector({ surahNumber: surah.number });

  useEffect(() => {
    clearNavigationHandlers();
  }, [clearNavigationHandlers]);

  const handleAyahClick = (ayah: Ayah) => {
    let audioUrl = ayah.audio;

    if (!audioUrl) {
      audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
    }

    if (
      isPlaying &&
      (currentSurahNumber === ayah.number || currentAudio === audioUrl)
    ) {
      pause();
      return;
    }

    play(audioUrl, surah.number, 'ayah');
  };

  const handleFullSurahClick = () => {
    if (fullSurahAudioUrl) {
      if (isPlaying && currentAudio === fullSurahAudioUrl) {
        pause();
      } else {
        play(fullSurahAudioUrl, surah.number, 'surah');
      }
    }
  };

  const isFullSurahPlaying = isPlaying && currentAudio === fullSurahAudioUrl;

  const getSurahForMobileCard = (): Surah => ({
    name: surah.name,
    number: surah.number,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    numberOfAyahs: surah.numberOfAyahs,
    revelationType: surah.revelationType,
  });

  const mobileHandlers = useMobileAyahHandlers({
    surah: getSurahForMobileCard(),
    favoriteAyahs,
    user,
    isLoggedIn,
    onAyahClick: handleAyahClick,
  });

  return (
    <div className="mb-12 mt-4">
      <SurahHeader
        surah={surah}
        isRtl={isRtl}
        isJuzPage={isJuzPage}
        language={language}
        fullSurahAudioUrl={fullSurahAudioUrl}
        isFullSurahPlaying={isFullSurahPlaying}
        onFullSurahClick={handleFullSurahClick}
        availableReciters={availableReciters}
        selectedReciter={selectedReciter}
        onReciterChange={onReciterChange}
        isRecitersLoading={isRecitersLoading}
      />

      {isMobile && (
        <div className="flex items-center gap-1 mb-4 p-1 bg-muted/30 rounded-xl border border-border/50">
          <button
            onClick={() => setMobileViewMode("ayah")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              mobileViewMode === "ayah"
                ? "bg-card text-primary shadow-sm border border-border/50"
                : "text-text-secondary border border-border/50"
            }`}
          >
            <ViewListRounded fontSize="small" />
            {t("surah.view_ayah_by_ayah")}
          </button>
          <button
            onClick={() => setMobileViewMode("full")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              mobileViewMode === "full"
                ? "bg-card text-primary shadow-sm border border-border/50"
                : "text-text-secondary border border-border/50"
            }`}
          >
            <ArticleRounded fontSize="small" />
            {t("surah.view_full_surah")}
          </button>
        </div>
      )}

      {isMobile && mobileViewMode === "ayah" ? (
        <MobileAyahsList
          ayahs={ayahs}
          surah={getSurahForMobileCard()}
          isPlaying={isPlaying}
          currentSurahNumber={currentSurahNumber}
          currentAudio={currentAudio}
          onPlay={mobileHandlers.handlePlay}
          onBookmark={mobileHandlers.handleBookmark}
          onShare={mobileHandlers.handleShare}
          onCopy={mobileHandlers.handleCopy}
          onTafsirClick={onAyahClick || (() => {})}
          isBookmarked={mobileHandlers.isBookmarked}
          isBookmarkLoading={mobileHandlers.isBookmarkLoading}
        />
      ) : (
        <DesktopAyahsList
          ayahs={ayahs}
          isRtl={isRtl}
          language={language}
          isMobile={isMobile}
          isPlaying={isPlaying}
          currentSurahNumber={currentSurahNumber}
          currentAudio={currentAudio}
          hoveredAyah={hoveredAyah}
          onAyahHover={setHoveredAyah}
          onAyahClick={handleAyahClick}
          onDetailsClick={onAyahClick}
        />
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
