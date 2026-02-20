import { useTranslation } from "react-i18next";
import {
  PlayCircleFilledRounded,
  PauseCircleFilledRounded,
  Bookmark,
  BookmarkBorder,
  Share,
} from "@mui/icons-material";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { IconButton } from "../../../../../common/icon-button/icon-button";
import { formatNumber } from "@/utils/numbers";
import type { SurahHeaderProps } from "./SurahHeader.types";
import { filterReciters } from "@/hooks/useReciterSelector";
import { useNavigate } from "react-router-dom";
import { generateRoute } from "@/router/routes";
import { quranSurahs } from "@/utils/constants";

import { useAuth } from "@/hooks";
import {
  useFavoriteSurahsQuery,
  useAddFavoriteSurahMutation,
  useRemoveFavoriteSurahMutation,
} from "@/api/domains/user";
import { toast } from "react-toastify";
import { FormControl, MenuItem, Select } from "@mui/material";

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  surah,
  isRtl,
  language,
  fullSurahAudioUrl,
  isFullSurahPlaying,
  onFullSurahClick,
  isJuzPage = false,
  availableReciters = [],
  selectedReciter,
  onReciterChange,
  isRecitersLoading = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { data: favoriteSurahs } = useFavoriteSurahsQuery(user?.id);
  const addFavoriteSurahMutation = useAddFavoriteSurahMutation(user?.id);
  const removeFavoriteSurahMutation = useRemoveFavoriteSurahMutation(user?.id);

  const isFavorite = favoriteSurahs?.some(
    (fav) => fav.surah_number === surah.number,
  );

  const isBookmarkLoading =
    addFavoriteSurahMutation.isPending || removeFavoriteSurahMutation.isPending;

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      toast.warning(
        t("auth.login_required", { defaultValue: "Please login to bookmark" }),
      );
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteSurahMutation.mutateAsync({
          surahNumber: surah.number,
          reciterId: undefined,
        });
        toast.success(
          t("favorites.surah_removed", {
            defaultValue: "Surah removed from favorites",
          }),
        );
      } else {
        await addFavoriteSurahMutation.mutateAsync({
          surahNumber: surah.number,
          reciterId: undefined,
        });
        toast.success(
          t("favorites.surah_added", {
            defaultValue: "Surah added to favorites",
          }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite surah", error);
      toast.error(
        t("common.error_occurred", { defaultValue: "An error occurred" }),
      );
    }
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(
        t("surah.surah_link_copied_to_clipboard", {
          defaultValue: "Copied to clipboard",
        }),
      );
    } catch (error) {
      console.error(error);
      toast.error(
        t("common.error_occurred", { defaultValue: "An error occurred" }),
      );
    }
  };

  return (
    <div className="mb-6 pb-4 border-b-2 border-primary/20">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Share fontSize="medium" />}
            onClick={() => {
              handleShare();
            }}
            className="text-primary/70 hover:text-primary"
            size="sm"
          />
          <IconButton
            icon={
              isBookmarkLoading ? (
                <CircularProgress size={20} />
              ) : isFavorite ? (
                <Bookmark fontSize="medium" color="primary" />
              ) : (
                <BookmarkBorder fontSize="medium" />
              )
            }
            onClick={handleBookmarkClick}
            size="sm"
            disabled={isBookmarkLoading}
          />
        </div>

        <div className="flex-1 text-center">
          <h2
            className={`text-2xl md:text-3xl font-bold text-primary mb-1 ${
              isRtl ? "font-amiri" : ""
            }`}
          >
            {"name" in surah ? (isRtl ? surah.name : surah.englishName) : ""}
          </h2>
          <p className="text-sm text-text-secondary">
            {"revelationType" in surah &&
              t(
                surah.revelationType.toLowerCase() === "meccan"
                  ? "home.revelation_place.makkah"
                  : "home.revelation_place.madinah",
              )}{" "}
            • {formatNumber(surah.numberOfAyahs, language)} {t("home.verses")}
          </p>
        </div>

        {!isJuzPage && (
          <FormControl size="small" className="min-w-[80px] max-w-[120px] md:min-w-[120px] md:max-w-[160px]">
            <Select
              labelId="surah-select-label"
              id="surah-select"
              value={surah.number}
              className="text-primary text-xs md:text-sm"
              onChange={(e) => {
                navigate(generateRoute.surah(e.target.value));
              }}
              sx={{
                "& .MuiSelect-select": {
                  paddingY: { xs: "6px", md: "8px" },
                  paddingX: { xs: "8px", md: "12px" },
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                },
              }}
            >
              {quranSurahs.map((s) => (
                <MenuItem
                  key={s.number}
                  value={s.number}
                  className="text-xs md:text-sm"
                >
                  {formatNumber(s.number, language)}.{" "}
                  {isRtl ? s.arabicName : s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {isJuzPage && <div className="w-[80px] md:w-20"></div>}
      </div>

      {fullSurahAudioUrl && (
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <IconButton
            onClick={onFullSurahClick}
            icon={
              isFullSurahPlaying ? (
                <PauseCircleFilledRounded />
              ) : (
                <PlayCircleFilledRounded />
              )
            }
            label={
              isFullSurahPlaying
                ? t("surah.pause_full")
                : t("surah.listen_full")
            }
            size="md"
          />
          {isRecitersLoading ? (
            <CircularProgress size={20} />
          ) : availableReciters.length > 0 && onReciterChange ? (
            <Autocomplete
              size="small"
              options={availableReciters}
              getOptionLabel={(option) => option.reciterName}
              value={selectedReciter ?? undefined}
              onChange={(_, newValue) => {
                if (newValue) onReciterChange(newValue.reciterId);
              }}
              filterOptions={(options, { inputValue }) =>
                filterReciters(options, inputValue)
              }
              isOptionEqualToValue={(option, value) =>
                option.reciterId === value.reciterId
              }
              disableClearable
              sx={{ minWidth: 180, maxWidth: 260 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("surah.select_reciter")}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                    },
                  }}
                />
              )}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
