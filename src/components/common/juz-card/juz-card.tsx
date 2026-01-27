import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatNumber } from "../../../utils/numbers";
import { SurahCard } from "../surah-card/surah-card";
import type { JuzCardProps } from "./juz-card.types";

export const JuzCard = ({ juzNumber, surahs, onClick }: JuzCardProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="bg-surface border border-transparent rounded-xl overflow-hidden p-4 break-inside-avoid mb-4">
      {/* Juz Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="font-bold text-text-primary text-base">
          {t("home.tabs.juz")} {formatNumber(juzNumber, language)}
        </span>

        <button
          onClick={() => onClick?.()}
          className="text-text-primary underline text-sm font-medium hover:text-primary transition-colors"
        >
          {t("home.read_juz")}
        </button>
      </div>

      {/* Surah Cards */}
      <div className="space-y-3">
        {surahs.map((chapter) => (
          <SurahCard key={chapter.number} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};
