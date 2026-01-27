import type { SurahCardProps } from "./surah-card.types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatNumber } from "../../../utils/numbers";

export const SurahCard = ({ chapter, onClick }: SurahCardProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  return (
    <div
      onClick={onClick}
      className="group relative flex items-center justify-between p-4 bg-background border border-border rounded-xl transition-all duration-300 hover:border-primary hover:shadow-md cursor-pointer h-24"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-12 h-12 flex items-center justify-center bg-secondary/10 rotate-45 rounded-lg group-hover:bg-primary/10 transition-colors duration-300 ml-2 shrink-0">
          <span className="text-primary font-bold -rotate-45 text-sm sm:text-base group-hover:scale-110 transition-transform duration-300">
            {formatNumber(chapter.number, language)}
          </span>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-text-primary text-base sm:text-lg group-hover:text-primary transition-colors duration-300 truncate">
            {language === "ar" ? chapter.name : chapter.englishName}
          </h3>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-right shrink-0">
        <span
          className={`text-text-secondary text-xs sm:text-sm font-bold ${language === "ar" ? "font-amiri" : ""}`}
        >
          {formatNumber(chapter.numberOfAyahs, language)} {t("home.verses")}
        </span>
        <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">
          {t(
            chapter.revelationType.toLowerCase() === "meccan"
              ? "home.revelation_place.makkah"
              : "home.revelation_place.madinah",
            { defaultValue: chapter.revelationType },
          )}
        </span>
      </div>
    </div>
  );
};
