import React from "react";
import { IconButton } from "../icon-button/icon-button";
import {
  PlayArrow,
  BookmarkBorder,
  Bookmark,
  ContentCopy,
  Share,
  MoreHoriz,
  MenuBook,
  School,
  TipsAndUpdates,
  FormatQuote,
  Pause,
} from "@mui/icons-material";
import type { MobileAyahCardProps } from "./mobile-ayah-card.types";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/utils/numbers";
import { useLanguage } from "@/hooks";

export const MobileAyahCard: React.FC<MobileAyahCardProps> = ({
  ayah,
  surah,
  isPlaying,
  onPlay,
  onBookmark,
  onShare,
  onCopy,
  onTafsirClick,
  isBookmarked,
}) => {
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();

  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-muted/30 border-b border-border/50 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">
            {formatNumber(surah.number, language)}:
            {formatNumber(ayah.numberInSurah, language)}
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              icon={
                isPlaying ? (
                  <Pause fontSize="small" className="text-primary" />
                ) : (
                  <PlayArrow fontSize="small" className="text-primary" />
                )
              }
              onClick={onPlay}
              size="sm"
              variant="ghost"
              className="hover:bg-primary/10"
              label={t("common.play")}
            />
            <IconButton
              icon={
                isBookmarked ? (
                  <Bookmark fontSize="small" className="text-primary" />
                ) : (
                  <BookmarkBorder
                    fontSize="small"
                    className="text-muted-foreground"
                  />
                )
              }
              onClick={onBookmark}
              size="sm"
              variant="ghost"
              className="hover:bg-primary/10 hover:text-primary"
              label={t("common.bookmark")}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
          <IconButton
            icon={
              <ContentCopy fontSize="small" className="text-muted-foreground" />
            }
            onClick={onCopy}
            size="sm"
            variant="ghost"
            className="hover:bg-primary/10 hover:text-primary"
            label={t("common.copy")}
          />
          <IconButton
            icon={<Share fontSize="small" className="text-muted-foreground" />}
            onClick={onShare}
            size="sm"
            variant="ghost"
            className="hover:bg-primary/10 hover:text-primary"
            label={t("common.share")}
          />
          <IconButton
            icon={
              <MoreHoriz fontSize="small" className="text-muted-foreground" />
            }
            onClick={() => {}}
            size="sm"
            variant="ghost"
            className="hover:bg-primary/10 hover:text-primary"
            label={t("common.more")}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-6">
        {/* Arabic Text */}
        <div
          className={`w-full ${isRtl ? "text-right" : "text-left"}`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <p className="text-3xl font-amiri leading-[2.5] text-foreground">
            {ayah.text}
          </p>
        </div>

        {/* Translation (Placeholder for now) */}
        <div className="text-left w-full" dir="ltr">
          <p className="text-lg text-muted-foreground leading-relaxed font-sans">
            {/* TODO: Integrate translation data */}
            {ayah.text.length > 50
              ? "In the Name of Allah—the Most Compassionate, Most Merciful."
              : "Translation text will appear here."}
          </p>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="mx-4 border-t border-border/50"></div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-2 px-4 gap-2 flex-wrap sm:flex-nowrap">
        <FooterButton
          icon={<MenuBook fontSize="small" />}
          label={t("surah.tafsirs", { defaultValue: "Tafsirs" })}
          onClick={onTafsirClick}
        />
        <FooterButton
          icon={<School fontSize="small" />}
          label={t("surah.reflections", { defaultValue: "Reflections" })}
        />
        <FooterButton
          icon={<TipsAndUpdates fontSize="small" />}
          label={t("surah.benefits", { defaultValue: "Benefits" })}
        />
        <FooterButton
          icon={<FormatQuote fontSize="small" />}
          label={t("surah.hadith", { defaultValue: "Hadith" })}
        />
      </div>
    </div>
  );
};

const FooterButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors text-sm whitespace-nowrap"
  >
    {icon}
    <span>{label}</span>
  </button>
);
