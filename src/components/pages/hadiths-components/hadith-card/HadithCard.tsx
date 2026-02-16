import React from "react";
import type { HadithCardProps } from "./HadithCard.types";
import { useTranslation } from "react-i18next";
import {
  Share,
  ContentCopy,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { formatNumber } from "@/utils/numbers";
import type { HadithContent } from "@/api/domains/tafsir";
import { processHadithText } from "@/utils/process-hadith-text";
import {
  useAddFavoriteHadithMutation,
  useFavoriteHadithsQuery,
  useRemoveFavoriteHadithMutation,
} from "@/api/domains/user/useUserQueries";
import { useAuth } from "@/hooks";
import { IconButton } from "@/components/common";

export const HadithCard: React.FC<HadithCardProps> = ({
  hadith,
  isRtl,
  bookName,
}) => {
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn } = useAuth();

  const getContent = (lang: string) => {
    return hadith.hadith.find(
      (content: HadithContent) => content.lang === lang,
    );
  };

  const arabicContent = getContent("ar");
  const englishContent = getContent("en");

  const { data: favorites } = useFavoriteHadithsQuery(user?.id);
  const isFavorited = favorites?.some(
    (f) =>
      f.hadith_number === hadith.hadithNumber &&
      f.collection_name === hadith.collection &&
      f.book_number === hadith.bookNumber,
  );

  const addFavoriteMutation = useAddFavoriteHadithMutation(user?.id);
  const removeFavoriteMutation = useRemoveFavoriteHadithMutation(user?.id);

  const handleToggleFavorite = () => {
    if (!user || !isLoggedIn) {
      toast.warning(t("auth.login_required"));
      return;
    }

    if (isFavorited) {
      removeFavoriteMutation.mutate(
        {
          collectionName: hadith.collection,
          bookNumber: hadith.bookNumber,
          hadithNumber: hadith.hadithNumber,
        },
        {
          onSuccess: () => {
            toast.success(t("common.removed_from_favorites"));
          },
          onError: () => {
            toast.error(t("common.error_removing_favorite"));
          },
        },
      );
    } else {
      addFavoriteMutation.mutate(
        {
          collectionName: hadith.collection,
          bookNumber: hadith.bookNumber,
          hadithNumber: hadith.hadithNumber,
          chapterId: hadith.chapterId,
          hadithText: arabicContent?.body || englishContent?.body || "",
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

  const grades = englishContent?.grades || arabicContent?.grades || [];
  const primaryGrade = grades.length > 0 ? grades[0] : null;

  const handleCopy = () => {
    const text = `${arabicContent?.body || ""}\n\n${englishContent?.body || ""}`;
    navigator.clipboard.writeText(text);
    toast.success(t("common.copied"));
  };

  const handleShare = () => {};
  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {bookName && (
            <span className="font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              {bookName}
            </span>
          )}

          {(englishContent?.chapterTitle || arabicContent?.chapterTitle) && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span>
                {englishContent?.chapterTitle || arabicContent?.chapterTitle}
              </span>
            </>
          )}

          <span className="text-muted-foreground/50">•</span>
          <span>
            {t("hadith.hadith")}{" "}
            {formatNumber(hadith.hadithNumber, i18n.language)}
          </span>
        </div>

        {primaryGrade && (
          <span className="text-xs font-semibold px-2 py-1 rounded bg-secondary text-secondary-foreground">
            {primaryGrade.grade}{" "}
            {primaryGrade.value ? `(${primaryGrade.value})` : ""}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {arabicContent?.body && (
            <div
              className={`text-right font-amiri text-2xl leading-loose text-foreground ${isRtl ? "font-bold" : ""}`}
              dir="rtl"
              dangerouslySetInnerHTML={{
                __html: processHadithText(arabicContent.body),
              }}
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          {englishContent?.body && (
            <div
              className="text-base leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: processHadithText(englishContent.body),
              }}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
        <IconButton
          icon={<ContentCopy fontSize="small" />}
          onClick={handleCopy}
        />
        <IconButton icon={<Share fontSize="small" />} onClick={handleShare} />

        <IconButton
          icon={
            isFavorited ? (
              <Bookmark fontSize="small" color="primary" />
            ) : (
              <BookmarkBorder fontSize="small" />
            )
          }
          onClick={handleToggleFavorite}
        />
      </div>
    </div>
  );
};
