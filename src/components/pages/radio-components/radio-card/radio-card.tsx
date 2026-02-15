import { useAudio } from "@/hooks/useAudio";
import { Play, Pause, Radio as RadioIcon, Bookmark } from "lucide-react";
import { cn } from "@/lib/cn";

import type { RadioCardProps } from "./radio-card.types";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/common/icon-button/icon-button";
import {
  useFavoriteRadiosQuery,
  useAddFavoriteRadioMutation,
  useRemoveFavoriteRadioMutation,
} from "@/api/domains/user";
import { useAuth, useLanguage } from "@/hooks";
import { toast } from "react-toastify";
import { getRadios } from "@/api";
import { toMp3QuranLanguage } from "@/api/utils";

export function RadioCard({ radio }: RadioCardProps) {
  const { t } = useTranslation();
  const { play, toggle, isPlaying, currentAudio } = useAudio();
  const { user, isLoggedIn } = useAuth();
  const { language } = useLanguage();

  const { data: favoriteRadios } = useFavoriteRadiosQuery(user?.id);
  const addFavoriteRadioMutation = useAddFavoriteRadioMutation(user?.id);
  const removeFavoriteRadioMutation = useRemoveFavoriteRadioMutation(user?.id);

  const isFavorite = favoriteRadios?.some((fav) => fav.radio_id === radio.id);

  const isCurrent = currentAudio === radio.url;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrent) {
      toggle();
    } else {
      play(radio.url);
    }
  };

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
        await removeFavoriteRadioMutation.mutateAsync(radio.id);
        toast.success(
          t("favorites.radio_removed", {
            defaultValue: "Radio removed from favorites",
          }),
        );
      } else {
        let nameAr = radio.name;
        let nameEn = radio.name; // Default to current name if we can't find English

        // If current language is English, try to get Arabic name
        if (language === "en") {
          try {
            const arRadios = await getRadios(toMp3QuranLanguage("ar"));
            const arRadio = arRadios.find((r) => r.id === radio.id);
            if (arRadio) nameAr = arRadio.name;
          } catch (error) {
            console.error("Failed to fetch Arabic radio name", error);
          }
        }
        // If current language is Arabic, try to get English name
        else {
          try {
            const enRadios = await getRadios(toMp3QuranLanguage("en"));
            const enRadio = enRadios.find((r) => r.id === radio.id);
            if (enRadio) nameEn = enRadio.name;
          } catch (error) {
            console.error("Failed to fetch English radio name", error);
          }
        }

        await addFavoriteRadioMutation.mutateAsync({
          radioId: radio.id,
          radioName: nameAr,
          radioUrl: radio.url,
          radioNameEnglish: nameEn,
        });
        toast.success(
          t("favorites.radio_added", {
            defaultValue: "Radio added to favorites",
          }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite radio", error);
      toast.error(
        t("common.error_occurred", { defaultValue: "An error occurred" }),
      );
    }
  };

  return (
    <div
      onClick={handlePlay}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md",
        isCurrent
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/50",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full transition-colors shadow-sm",
            isCurrent
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
          )}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <h3
            className={cn(
              "font-semibold text-sm sm:text-base transition-colors line-clamp-1",
              isCurrent
                ? "text-primary"
                : "text-foreground group-hover:text-primary",
            )}
          >
            {radio.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RadioIcon className="w-3 h-3" />
            <span>{t("radio.station")}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Visualizer bars */}
        {isCurrentlyPlaying && (
          <div className="flex items-end gap-0.5 h-5 ml-auto pl-2 mr-2">
            <span
              className="w-1 bg-primary/60 rounded-t-sm animate-[pulse_0.6s_ease-in-out_infinite]"
              style={{ height: "40%" }}
            />
            <span
              className="w-1 bg-primary/80 rounded-t-sm animate-[pulse_0.8s_ease-in-out_infinite]"
              style={{ height: "80%" }}
            />
            <span
              className="w-1 bg-primary/60 rounded-t-sm animate-[pulse_1.1s_ease-in-out_infinite]"
              style={{ height: "50%" }}
            />
            <span
              className="w-1 bg-primary/40 rounded-t-sm animate-[pulse_0.9s_ease-in-out_infinite]"
              style={{ height: "30%" }}
            />
          </div>
        )}

        {/* Favorite Button */}
        <div onClick={(e) => e.stopPropagation()}>
          <IconButton
            icon={
              <Bookmark
                className={cn(
                  "w-5 h-5 transition-colors",
                  isFavorite
                    ? "fill-current text-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
              />
            }
            onClick={handleBookmarkClick}
            size="sm"
            variant="default"
          />
        </div>
      </div>
    </div>
  );
}
