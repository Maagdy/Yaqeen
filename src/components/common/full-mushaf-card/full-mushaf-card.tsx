import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import type { FullMushafCardProps } from "./full-mushaf-card.types";

import { IconButton } from "@/components/common/icon-button/icon-button";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import {
  useFavoriteMushafsQuery,
  useAddFavoriteMushafMutation,
  useRemoveFavoriteMushafMutation,
} from "@/api/domains/user";
import { useAuth } from "@/hooks";
import { toast } from "react-toastify";

export const FullMushafCard = ({ mushaf, onClick }: FullMushafCardProps) => {
  const { t } = useTranslation();
  const { isRtl } = useLanguage();
  const { user, isLoggedIn } = useAuth();

  const { data: favoriteMushafs } = useFavoriteMushafsQuery(user?.id);
  const addFavoriteMushafMutation = useAddFavoriteMushafMutation(user?.id);
  const removeFavoriteMushafMutation = useRemoveFavoriteMushafMutation(
    user?.id,
  );

  const isFavorite = favoriteMushafs?.some(
    (fav) => fav.mushaf_id === mushaf.id,
  );

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.warning(
        t("auth.login_required", { defaultValue: "Please login to bookmark" }),
      );
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteMushafMutation.mutateAsync(mushaf.id);
        toast.success(
          t("favorites.mushaf_removed", {
            defaultValue: "Mushaf removed from favorites",
          }),
        );
      } else {
        await addFavoriteMushafMutation.mutateAsync({
          mushafId: mushaf.id,
          mushafName: mushaf.name,
        });
        toast.success(
          t("favorites.mushaf_added", {
            defaultValue: "Mushaf added to favorites",
          }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite mushaf", error);
      toast.error(
        t("common.error_occurred", { defaultValue: "An error occurred" }),
      );
    }
  };
  console.log(mushaf.image);

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden bg-linear-to-br from-background to-primary/5 border border-primary/20 rounded-2xl transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 cursor-pointer"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden bg-primary/10">
        {mushaf.image ? (
          <img
            src={mushaf.image.replace(/^http:\/\//, "https://")}
            alt={mushaf.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
            <div className="text-6xl text-primary/30">📖</div>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className={`text-xl sm:text-2xl font-bold text-white drop-shadow-lg ${
              isRtl ? "font-amiri" : ""
            }`}
          >
            {mushaf.name}
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 min-h-10">
          {mushaf.description}
        </p>

        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
          <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full shrink-0">
            <span className="text-primary text-lg">🎙️</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {t("quran.rawi")}
            </p>
            <p
              className={`font-semibold text-sm sm:text-base text-primary truncate ${
                isRtl ? "font-amiri" : ""
              }`}
            >
              {mushaf.rawi.name}
            </p>
          </div>
          <div className="z-10">
            <IconButton
              icon={
                isFavorite ? <Bookmark color="primary" /> : <BookmarkBorder />
              }
              onClick={handleBookmarkClick}
              size="sm"
              className="bg-transparent!"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20 text-center">
            <p className="text-xs text-muted-foreground mb-1">
              {t("quran.qiraa")}
            </p>
            <p className="font-semibold text-sm text-primary truncate">
              {mushaf.rawi.qiraa.short_name}
            </p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20 text-center">
            <p className="text-xs text-muted-foreground mb-1">
              {t("quran.qiraa-school")}
            </p>
            <p className="font-semibold text-sm text-primary truncate">
              {mushaf.rawi.qiraa.count.name}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <span>{t("quran.view_details")}</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
