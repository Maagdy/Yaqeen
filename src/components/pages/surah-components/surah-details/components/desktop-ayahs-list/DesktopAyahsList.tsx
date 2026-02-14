import { useTranslation } from "react-i18next";
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
            className="leading-loose text-text-primary p-2"
          >
            <div className="flex items-center justify-center gap-2">
              <div
                onMouseEnter={() => !isMobile && onAyahHover(ayah.number)}
                onMouseLeave={() => !isMobile && onAyahHover(null)}
                className="relative"
              >
                {/* Desktop: Show on hover */}
                {hoveredAyah === ayah.number && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 z-10">
                    <IconButton
                      label={t("surah.ayah-details")}
                      onClick={() => onDetailsClick?.(ayah)}
                      size="md"
                      icon={<TipsAndUpdatesIcon fontSize="small" />}
                    />
                  </div>
                )}
                <span
                  onClick={() => onAyahClick(ayah)}
                  className={`text-xl md:text-2xl ${isRtl ? "cursor-pointer" : ""} hover:text-primary/80 transition-colors ${
                    isAyahPlaying ? "text-primary" : ""
                  }`}
                  title={t("audio.click_to_play")}
                >
                  {ayah.text}
                </span>
                {/* Ayah Number Badge - Arabic Glyph Style */}
                <span className="inline-flex items-center justify-center relative ">
                  <span className="inline-flex items-center justify-center relative mx-1 w-10 h-10 pt-1">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 36 36"
                    >
                      {/* Octagonal shape */}
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
