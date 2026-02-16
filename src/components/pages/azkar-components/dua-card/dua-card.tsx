import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ContentCopy,
  Share,
  ExpandMore,
  ExpandLess,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { IconButton } from "@/components/common";
import { useAuth } from "@/hooks";
import {
  useFavoriteDuasQuery,
  useAddFavoriteDuaMutation,
  useRemoveFavoriteDuaMutation,
} from "@/api/domains/user/useUserQueries";
import type { DuaCardProps } from "./dua-card.types";

export const DuaCard: React.FC<DuaCardProps> = ({
  dua,
  isRtl,
  showCategoryBadge = true,
}) => {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if content is long (needs expansion)
  const isLongContent =
    dua.arabic.length + dua.transliteration.length + dua.english.length > 400;

  // Favorite Logic
  const { data: favorites } = useFavoriteDuasQuery(user?.id);
  const isFavorited = favorites?.some((f) => f.dua_id === dua.id);

  const addFavoriteMutation = useAddFavoriteDuaMutation(user?.id);
  const removeFavoriteMutation = useRemoveFavoriteDuaMutation(user?.id);

  const isBookmarkLoading =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const handleCopy = async () => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.english}\n\nReference: ${dua.reference}`;

    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("azkar.copied_dua"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleShare = async () => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.english}\n\nReference: ${dua.reference}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("azkar.title"),
          text: text,
        });
      } catch (error) {
        // User cancelled or error - fallback to copy
        handleCopy();
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const handleToggleFavorite = () => {
    if (!user || !isLoggedIn) {
      toast.warning(t("auth.login_required"));
      return;
    }

    if (isFavorited) {
      removeFavoriteMutation.mutate(dua.id, {
        onSuccess: () => {
          toast.success(t("common.removed_from_favorites"));
        },
        onError: () => {
          toast.error(t("common.error_removing_favorite"));
        },
      });
    } else {
      addFavoriteMutation.mutate(
        {
          duaId: dua.id,
          duaCategory: dua.category,
          duaTextArabic: dua.arabic,
          duaTextEnglish: dua.english,
          duaReference: dua.reference,
        },
        {
          onSuccess: () => {
            toast.success(t("common.added_to_favorites"));
          },
          onError: () => {
            toast.error(t("common.error_adding_favorite"));
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        {showCategoryBadge && (
          <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {t(`azkar.categories.${dua.category}`)}
          </span>
        )}
        <div className="flex items-center gap-1">
          <IconButton
            icon={<ContentCopy fontSize="small" />}
            onClick={handleCopy}
            aria-label={t("common.copy")}
          />
          <IconButton
            icon={<Share fontSize="small" />}
            onClick={handleShare}
            aria-label={t("common.share")}
          />
          <IconButton
            icon={
              isBookmarkLoading ? (
                <CircularProgress size={16} />
              ) : isFavorited ? (
                <Bookmark fontSize="small" color="primary" />
              ) : (
                <BookmarkBorder fontSize="small" />
              )
            }
            onClick={handleToggleFavorite}
            aria-label={t("common.bookmark")}
            disabled={isBookmarkLoading}
          />
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-4 ${
          isLongContent && !isExpanded ? "max-h-60 overflow-hidden relative" : ""
        }`}
      >
        {/* Arabic Text */}
        <div
          className={`text-xl font-amiri leading-loose text-text-primary ${
            isRtl ? "text-right font-bold" : "text-right"
          }`}
          dir="rtl"
        >
          {dua.arabic}
        </div>

        {/* Transliteration */}
        <div className="text-sm italic text-muted-foreground leading-relaxed">
          {dua.transliteration}
        </div>

        {/* English Translation */}
        <div className="text-base text-text-secondary leading-relaxed">
          {dua.english}
        </div>

        {/* Gradient overlay for collapsed long content */}
        {isLongContent && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand/Collapse Button */}
      {isLongContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors py-2"
        >
          {isExpanded ? (
            <>
              {t("azkar.show_less")}
              <ExpandLess fontSize="small" />
            </>
          ) : (
            <>
              {t("azkar.show_more")}
              <ExpandMore fontSize="small" />
            </>
          )}
        </button>
      )}

      {/* Footer - Reference */}
      <div className="pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">Reference:</span> {dua.reference}
        </p>
      </div>
    </div>
  );
};
