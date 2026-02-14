import type { MushafCardProps } from "./mushaf-card.types";

import { IconButton } from "@/components/common/icon-button/icon-button";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import {
  useFavoriteMushafsQuery,
  useAddFavoriteMushafMutation,
  useRemoveFavoriteMushafMutation,
} from "@/api/domains/user";
import { useAuth } from "@/hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const MushafCard: React.FC<MushafCardProps> = ({
  id,
  name,
  active,
  onClick,
}) => {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();

  const { data: favoriteMushafs } = useFavoriteMushafsQuery(user?.id);
  const addFavoriteMushafMutation = useAddFavoriteMushafMutation(user?.id);
  const removeFavoriteMushafMutation = useRemoveFavoriteMushafMutation(
    user?.id,
  );

  const isFavorite = favoriteMushafs?.some((fav) => fav.mushaf_id === id);

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
        await removeFavoriteMushafMutation.mutateAsync(id);
        toast.success(
          t("favorites.mushaf_removed", {
            defaultValue: "Mushaf removed from favorites",
          }),
        );
      } else {
        await addFavoriteMushafMutation.mutateAsync({
          mushafId: id,
          mushafName: name,
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

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full p-4 rounded-2xl border transition-all text-left pr-12
          ${
            active
              ? "bg-primary text-white border-primary shadow-lg"
              : "bg-surface border-border hover:border-primary"
          }
        `}
      >
        <p className="font-semibold">{name}</p>
      </button>
      <div className="absolute top-1/2 -translate-y-1/2 right-2">
        <IconButton
          icon={
            isFavorite ? (
              <Bookmark
                fontSize="small"
                className={active ? "text-white" : "text-primary"}
              />
            ) : (
              <BookmarkBorder
                fontSize="small"
                className={
                  active
                    ? "text-white/70 hover:text-white"
                    : "text-muted-foreground hover:text-primary"
                }
              />
            )
          }
          onClick={handleBookmarkClick}
          className="hover:bg-transparent"
          size="sm"
        />
      </div>
    </div>
  );
};
