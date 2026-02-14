import React from "react";
import { useTranslation } from "react-i18next";
import {
  LibraryBooks,
  FormatListNumbered,
  ArrowForward,
  ArrowBack,
} from "@mui/icons-material";
import type { HadithCollectionCardProps } from "./HadithCollectionCard.types";
import { useLanguage } from "@/hooks";
import { formatNumber } from "@/utils/numbers";

export const HadithCollectionCard: React.FC<HadithCollectionCardProps> = ({
  collection,
  onClick,
}) => {
  const { t } = useTranslation();
  const { language, isRtl } = useLanguage();

  // Find the details for the current language, default to English or first available
  const details =
    collection.collection.find((c) => c.lang === language) ||
    collection.collection.find((c) => c.lang === "en") ||
    collection.collection[0];

  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-300
        hover:shadow-lg hover:border-primary cursor-pointer
        ${onClick ? "active:scale-[0.98]" : ""}
      `}
    >
      {/* Decorative Background Pattern */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative z-10 flex flex-col h-full gap-5">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
            <LibraryBooks fontSize="medium" />
          </div>
          {collection.hasChapters && (
            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
              {t("hadith.chapters", { defaultValue: "Chapters" })}
            </span>
          )}
        </div>

        <div>
          <h3
            className={`text-xl font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300 ${
              isRtl ? "font-amiri" : ""
            }`}
          >
            {details?.title || collection.name}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2 min-h-10">
            {details?.shortIntro}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border/50" />

        {/* Stats Section & Action */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <FormatListNumbered fontSize="small" className="text-primary/70" />
            <span className="font-medium">
              {formatNumber(collection.totalHadith, language)}{" "}
              {t("hadith.hadith")}
            </span>
          </div>

          {collection.hasChapters && (
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                {t("hadith.chapters", { defaultValue: "Chapters" })}
              </span>
            </div>
          )}

          <div className="text-primary/50 group-hover:text-primary transition-colors transform duration-300">
            {isRtl ? (
              <ArrowBack fontSize="small" />
            ) : (
              <ArrowForward fontSize="small" />
            )}
          </div>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
    </div>
  );
};
