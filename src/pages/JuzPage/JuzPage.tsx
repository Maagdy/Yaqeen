import { useParams } from "react-router-dom";
import type { JuzPageProps } from "./JuzPage.types";
import { useTranslation } from "react-i18next";
import { useJuzQuery, type Ayah } from "../../api";
import { useLanguage } from "../../hooks";
import { Loading } from "../../components/ui";
import ErrorPage from "../ErrorPage/ErrorPage";
import { SurahDetails } from "@/components/pages/surah-components/surah-details";

import {
  useFavoriteJuzsQuery,
  useAddFavoriteJuzMutation,
  useRemoveFavoriteJuzMutation,
} from "@/api/domains/user";
import { useAuth } from "@/hooks";
import { toast } from "react-toastify";
import { IconButton } from "@/components/common/icon-button/icon-button";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";

const JuzPage: React.FC<JuzPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user, isLoggedIn } = useAuth();

  const juzNumber = Number(id);
  const edition = language === "ar" ? "ar.alafasy" : "en.asad";

  const {
    data: juz,
    isLoading,
    isError,
    refetch: juzRefetch,
  } = useJuzQuery(juzNumber, edition);

  const { data: favoriteJuzs } = useFavoriteJuzsQuery(user?.id);
  const addFavoriteJuzMutation = useAddFavoriteJuzMutation(user?.id);
  const removeFavoriteJuzMutation = useRemoveFavoriteJuzMutation(user?.id);

  const isFavorite = favoriteJuzs?.some((fav) => fav.juz_number === juzNumber);

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      toast.warning(
        t("auth.login_required", { defaultValue: "Please login to bookmark" }),
      );
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteJuzMutation.mutateAsync(juzNumber);
        toast.success(
          t("favorites.juz_removed", {
            defaultValue: "Juz removed from favorites",
          }),
        );
      } else {
        await addFavoriteJuzMutation.mutateAsync(juzNumber);
        toast.success(
          t("favorites.juz_added", { defaultValue: "Juz added to favorites" }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite juz", error);
      toast.error(
        t("common.error_occurred", { defaultValue: "An error occurred" }),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (isError || !juz) {
    return (
      <ErrorPage
        message={t("juz.error_loading_page")}
        showBackButton
        showHomeButton
        showRetryButton
        onRetry={() => juzRefetch()}
      />
    );
  }

  const ayahsBySurah: Record<number, Ayah[]> = {};
  juz.ayahs.forEach((ayah) => {
    const surahNumber = ayah.surah.number;
    if (!ayahsBySurah[surahNumber]) {
      ayahsBySurah[surahNumber] = [];
    }
    ayahsBySurah[surahNumber].push(ayah);
  });

  const surahNumbers = Object.keys(ayahsBySurah)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-6">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-3 relative">
          <h1 className="text-3xl font-bold text-text-primary text-center">
            {t("juz.title", { number: juzNumber })}
          </h1>
          <IconButton
            icon={
              isFavorite ? (
                <Bookmark fontSize="medium" className="text-primary" />
              ) : (
                <BookmarkBorder
                  fontSize="medium"
                  className="text-muted-foreground hover:text-primary"
                />
              )
            }
            onClick={handleBookmarkClick}
            className={
              isFavorite
                ? "text-primary hover:text-primary/80 absolute right-4 md:static"
                : "text-primary/70 hover:text-primary absolute right-4 md:static"
            }
            size="sm"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {surahNumbers.map((surahNumber) => {
          const surah = juz.surahs[surahNumber];
          const ayahs = ayahsBySurah[surahNumber];

          return (
            <SurahDetails
              key={surahNumber}
              surah={surah}
              ayahs={ayahs}
              isJuzPage
            />
          );
        })}
      </div>
    </div>
  );
};

export default JuzPage;
