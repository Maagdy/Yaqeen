import { useTranslation } from "react-i18next";
import { useRef, useCallback, useEffect } from "react";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { IconButton } from "../../../../../common/icon-button/icon-button";
import { formatNumber } from "@/utils/numbers";
import type { DesktopAyahsListProps } from "./DesktopAyahsList.types";

export const DesktopAyahsList: React.FC<DesktopAyahsListProps> = ({
  ayahs,
  isRtl,
  language,
  isMobile,
  isPlaying,
  currentSurahNumber,
  currentAudio,
  hoveredAyah,
  onAyahHover,
  onAyahClick,
  onDetailsClick,
}) => {
  const { t } = useTranslation();

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const handleTouchStart = useCallback(
    (ayahNumber: number) => {
      longPressTriggeredRef.current = false;
      longPressTimerRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        onAyahHover(ayahNumber);
      }, 500);
    },
    [onAyahHover],
  );

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  return (
    <div
      className={`space-y-4 text-center ${isRtl ? "font-amiri" : ""}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {ayahs.map((ayah) => {
        const isAyahPlaying =
          isPlaying &&
          ayah?.surah?.number === currentSurahNumber &&
          currentAudio === ayah?.audio;

        return (
          <div
            key={ayah.number}
            data-page={ayah.page}
            className="leading-loose text-text-primary p-2"
          >
            <div className="flex items-center justify-center gap-2">
              <div
                onMouseEnter={() => !isMobile && onAyahHover(ayah.number)}
                onMouseLeave={() => !isMobile && onAyahHover(null)}
                onTouchStart={() => isMobile && handleTouchStart(ayah.number)}
                onTouchEnd={() => isMobile && handleTouchEnd()}
                onTouchMove={() => isMobile && handleTouchEnd()}
                onContextMenu={(e) => {
                  if (isMobile) e.preventDefault();
                }}
                className="relative"
              >
                {hoveredAyah === ayah.number && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 z-10">
                    <IconButton
                      label={t("surah.ayah-details")}
                      onClick={() => {
                        onDetailsClick?.(ayah);
                        onAyahHover(null);
                      }}
                      size="md"
                      icon={<TipsAndUpdatesIcon fontSize="small" />}
                    />
                  </div>
                )}
                <span
                  onClick={() => {
                    if (longPressTriggeredRef.current) {
                      longPressTriggeredRef.current = false;
                      return;
                    }
                    if (isMobile && hoveredAyah !== null) {
                      onAyahHover(null);
                      return;
                    }
                    onAyahClick(ayah);
                  }}
                  className={`text-xl md:text-2xl ${isRtl ? "cursor-pointer" : ""} hover:text-primary/80 transition-colors ${
                    isAyahPlaying ? "text-primary" : ""
                  }`}
                  title={t("audio.click_to_play")}
                >
                  {ayah.text}
                </span>
                <span className="inline-flex items-center justify-center relative ">
                  <span className="inline-flex items-center justify-center relative mx-1 w-10 h-10 pt-1">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 35 35"
                    >
                      <path
                        d="M18 2 L26 6 L30 14 L30 22 L26 30 L18 34 L10 30 L6 22 L6 14 L10 6 Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={
                          isAyahPlaying ? "text-primary" : "text-primary/90"
                        }
                      />
                    </svg>
                    <span className="relative z-10 text-base -mt-1 font-bold text-text-primary">
                      {formatNumber(ayah.numberInSurah, language)}
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
