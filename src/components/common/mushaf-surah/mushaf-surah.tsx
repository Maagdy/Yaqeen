import type { MushafSurahCardProps } from "./mushaf-surah.types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatNumber } from "../../../utils/numbers";
import { quranSurahs } from "../../../utils/constants";

export const MushafSurahCard = ({ surah, onClick }: MushafSurahCardProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const surahInfo = quranSurahs.find((s) => s.number === surah.id);
  const englishName = surahInfo?.name || "";

  return (
    <div
      onClick={onClick}
      className="group relative flex items-center justify-between p-4 bg-background border border-border rounded-xl transition-all duration-300 hover:border-primary hover:shadow-md cursor-pointer h-24"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-12 h-12 flex items-center justify-center bg-secondary/10 rotate-45 rounded-lg group-hover:bg-primary/10 transition-colors duration-300 ml-2 shrink-0">
          <span className="text-primary font-bold -rotate-45 text-sm sm:text-base group-hover:scale-110 transition-transform duration-300">
            {formatNumber(surah.id, language)}
          </span>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-text-primary text-base sm:text-lg group-hover:text-primary transition-colors duration-300 truncate">
            {language === "ar" ? surah.name : englishName}
          </h3>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-right shrink-0">
        <span
          className={`text-text-secondary text-xs sm:text-sm font-bold ${language === "ar" ? "font-amiri" : ""}`}
        >
          {formatNumber(surah.ayahs.length, language)} {t("home.verses")}
        </span>
      </div>
    </div>
  );
};
