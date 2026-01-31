import { useTranslation } from "react-i18next";
import type { ReciterCardProps } from "./reciter-card.types";

export const ReciterCard = ({ reciter, onClick }: ReciterCardProps) => {
  const { t } = useTranslation();
  const primaryMoshaf = reciter.moshaf[0];
  const totalRecitations = reciter.moshaf.length;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col p-6 bg-background border border-border rounded-xl transition-all duration-300 hover:border-primary hover:shadow-lg cursor-pointer"
    >
      {/* Header with Letter Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
            <span className="text-primary font-bold text-lg">
              {reciter.letter}
            </span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-text-primary text-lg group-hover:text-primary transition-colors duration-300">
              {reciter.name}
            </h3>
            <span className="text-text-secondary text-sm">
              {totalRecitations}{" "}
              {totalRecitations === 1
                ? t("reciters.recitation")
                : t("reciters.recitations")}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Moshaf Info */}
      {primaryMoshaf && (
        <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm">
              {t("reciters.primary_recitation")}:
            </span>
            <span className="text-text-primary text-sm font-medium">
              {primaryMoshaf.surah_total} {t("home.surahs")}
            </span>
          </div>
          <p className="text-text-secondary text-xs line-clamp-1">
            {primaryMoshaf.name}
          </p>
        </div>
      )}

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
    </div>
  );
};
