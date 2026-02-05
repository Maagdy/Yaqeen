import type { MushafSurahDetailsProps } from "./mushaf-surah-details.types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks";
import { quranSurahs } from "@/utils/constants";
import { useState } from "react";
import { formatNumber } from "@/utils/numbers";
import { BookmarkAdd } from "@mui/icons-material";
import { IconButton } from "@/components/common";

export const MushafSurahDetails: React.FC<MushafSurahDetailsProps> = ({
  surah,
}) => {
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();
  const [hoveredAyah, setHoveredAyah] = useState<number | null>(null);

  // Lookup extra info from constants
  const surahInfo = quranSurahs.find((s) => s.number === surah.id);
  const englishName = surahInfo?.name || "";
  // Note: Revelation type is not available in current constants

  return (
    <div className="mb-12 mt-2">
      {/* Surah Header - Centered */}
      <div className="mb-6 pb-4 border-b-2 border-primary/20 text-center">
        <h2
          className={`text-2xl md:text-3xl font-bold text-primary mb-2 ${
            isRtl ? "font-amiri" : ""
          }`}
        >
          {isRtl ? surah.name : englishName}
          <div className="inline-block mx-2">
            <IconButton
              icon={<BookmarkAdd fontSize="medium" />}
              onClick={() => {
                // TODO: Implement bookmark logic
                console.log("Bookmark clicked");
              }}
              variant="default"
              className="text-primary/70 hover:text-primary"
              size="sm"
            />
          </div>
        </h2>

        <p className="text-sm text-text-secondary">
          {/* Defaulting to Meccan as placeholder or skipping if preferred. 
              Since user asked to skip revelation type in previous card, 
              we can just show verse count here. */}
          {formatNumber(surah.ayahs.length, language)} {t("home.verses")}
        </p>
      </div>

      {/* Ayahs - Centered */}
      <div
        className={`space-y-4 text-center ${isRtl ? "font-amiri" : ""}`}
        dir={"rtl"}
      >
        {surah.ayahs.map((ayah) => {
          return (
            <div
              key={ayah.number}
              className="leading-loose text-text-primary p-2"
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  onMouseEnter={() => setHoveredAyah(ayah.number)}
                  onMouseLeave={() => setHoveredAyah(null)}
                  className="relative"
                >
                  {/* Hover Actions (Optional - currently just placeholder without audio) */}
                  {hoveredAyah === ayah.number && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 z-10 pb-2">
                      {/* You can add actions here if needed like bookmarking in future */}
                    </div>
                  )}

                  <span className={`text-xl md:text-2xl transition-colors`}>
                    {ayah.text}
                  </span>

                  {/* Ayah Number Badge - Arabic Glyph Style */}
                  <span className="inline-flex items-center justify-center relative">
                    <span className="inline-flex items-center justify-center relative mx-1 w-9 h-9">
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

      {/* End of Surah Marker */}
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
