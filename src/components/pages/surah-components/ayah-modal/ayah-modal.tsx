import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bookmark, BookmarkBorder, ContentCopy } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { IconButton, MushafCard } from "../../../common";
import { useLanguage, useAuth } from "../../../../hooks";
import type { AyahModalProps } from "./ayah-modal.types";
import { formatNumber } from "../../../../utils/numbers";
import { useAyahTafsir, useTafsirBooks } from "../../../../api/domains/tafsir";
import {
  useFavoriteAyahsQuery,
  useAddFavoriteAyahMutation,
  useRemoveFavoriteAyahMutation,
} from "@/api/domains/user";
import { toast } from "react-toastify";
import {
  Loading,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
  Separator,
} from "../../../ui";
import ErrorPage from "../../../../pages/ErrorPage/ErrorPage";

export const AyahModal: React.FC<AyahModalProps> = ({
  open,
  onClose,
  ayah,
  surah,
  onAyahChange,
}) => {
  const { t } = useTranslation();
  const { language, isRtl } = useLanguage();
  const { user, isLoggedIn } = useAuth();
  const [currentTafsirBook, setCurrentTafsirBook] = useState<number>(1);

  const {
    data: tafsirBooks,
    isPending: tafsirBooksLoading,
    isError: tafsirBooksError,
  } = useTafsirBooks();

  const {
    data: tafsir,
    isPending: ayahTafsirLoading,
    isError: ayahTafsirError,
  } = useAyahTafsir(currentTafsirBook, surah.number, ayah?.numberInSurah || 0);

  // Favorite ayahs functionality
  const { data: favoriteAyahs = [] } = useFavoriteAyahsQuery(user?.id);
  const addFavoriteAyah = useAddFavoriteAyahMutation(user?.id);
  const removeFavoriteAyah = useRemoveFavoriteAyahMutation(user?.id);

  const isBookmarked = favoriteAyahs.some(
    (fav) =>
      fav.surah_number === surah.number &&
      fav.ayah_number === ayah?.numberInSurah,
  );

  const handleBookmarkToggle = async () => {
    if (!isLoggedIn) {
      toast.warning(
        t("auth.login_required", {
          defaultValue: "Please login to bookmark ayahs",
        }),
      );
      return;
    }

    if (!ayah) return;

    try {
      if (isBookmarked) {
        await removeFavoriteAyah.mutateAsync({
          surahNumber: surah.number,
          ayahNumber: ayah.numberInSurah,
        });
        toast.success(
          t("favorites.ayah_removed", {
            defaultValue: "Ayah removed from favorites",
          }),
        );
      } else {
        await addFavoriteAyah.mutateAsync({
          surahNumber: surah.number,
          ayahNumber: ayah.numberInSurah,
          surahName: surah.name,
          ayahText: ayah.text,
          surahNameEnglish: surah.englishName,
        });
        toast.success(
          t("favorites.ayah_added", {
            defaultValue: "Ayah added to favorites",
          }),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(t("common.error", { defaultValue: "An error occurred" }));
    }
  };

  if (!ayah || !surah) return null;

  const currentAyahIndex = surah.ayahs.findIndex(
    (a) => a.numberInSurah === ayah.numberInSurah,
  );

  const handleNext = () => {
    if (currentAyahIndex < surah.ayahs.length - 1) {
      onAyahChange(surah.ayahs[currentAyahIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentAyahIndex > 0) {
      onAyahChange(surah.ayahs[currentAyahIndex - 1]);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(ayah.text);
    toast.success(t("common.copied", { defaultValue: "Copied to clipboard" }));
  };
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background border-primary/10">
        <DialogHeader className="flex flex-row justify-between items-center pb-1">
          <DialogTitle className="text-xl font-bold">
            {t("surah.ayah-details")}
          </DialogTitle>
          <div className="flex flex-row gap-2">
            <IconButton
              icon={
                isBookmarked ? (
                  <Bookmark fontSize="medium" color="primary" />
                ) : (
                  <BookmarkBorder fontSize="medium" />
                )
              }
              onClick={handleBookmarkToggle}
              size="sm"
              label={t("common.bookmark")}
            />

            <IconButton
              icon={
                <ContentCopy
                  fontSize="small"
                  className="text-muted-foreground"
                />
              }
              onClick={() => handleCopy()}
              size="sm"
              label={t("common.copy")}
            />
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Surah Info Header */}
          <div className="flex flex-row justify-center items-center gap-4">
            <IconButton
              icon={
                isRtl ? (
                  <ChevronRight className="w-4 h-4 mt-0.5" />
                ) : (
                  <ChevronLeft className="w-4 h-4 mt-0.5" />
                )
              }
              onClick={handleNext}
              label={t("surah.next")}
              size="md"
              className="bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
              disabled={currentAyahIndex === surah.ayahs.length - 1}
            />

            <h3 className="text-xl font-bold text-primary">
              {surah.number}:{ayah.numberInSurah}
            </h3>

            <IconButton
              icon={
                isRtl ? (
                  <ChevronLeft className="w-4 h-4 mt-0.5" />
                ) : (
                  <ChevronRight className="w-4 h-4 mt-0.5" />
                )
              }
              onClick={handlePrevious}
              iconPosition="right"
              label={t("surah.previous")}
              size="md"
              className="bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
              disabled={currentAyahIndex === 0}
            />
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
            <h2
              className={`text-4xl font-bold mb-2 text-primary ${isRtl ? "font-amiri" : ""}`}
            >
              {isRtl ? surah.name : surah.englishName}
            </h2>
            <p className="text-base text-muted-foreground mb-4">
              {isRtl ? surah.englishName : surah.name} •{" "}
              {surah.englishNameTranslation}
            </p>

            <div className="flex flex-row gap-2 justify-center">
              <Badge variant="outline" className="font-medium">
                {t(
                  surah.revelationType.toLowerCase() === "meccan"
                    ? "home.revelation_place.makkah"
                    : "home.revelation_place.madinah",
                )}
              </Badge>
              <Badge variant="outline" className="font-medium">
                {`${formatNumber(surah.numberOfAyahs, language)} ${t("home.verses")}`}
              </Badge>
            </div>
          </div>

          <div className="relative flex items-center">
            <Separator className="flex-1" />
            <Badge variant="outline" className="mx-4">
              {t("surah.verse") +
                " " +
                formatNumber(ayah.numberInSurah, language)}
            </Badge>
            <Separator className="flex-1" />
          </div>

          {/* Ayah Text */}
          <div className="text-center py-2">
            <p className="font-amiri flex justify-start px-2 leading-relaxed text-primary text-2xl md:text-4xl">
              {ayah.text}
            </p>
          </div>

          {tafsirBooks && tafsirBooks.length > 1 && (
            <div className="flex flex-row flex-wrap gap-2 mb-2">
              {tafsirBooks.map((book) => (
                <MushafCard
                  key={book.id}
                  id={book.id}
                  name={book.name}
                  active={currentTafsirBook === book.id}
                  onClick={() => setCurrentTafsirBook(book.id)}
                />
              ))}
            </div>
          )}

          {ayahTafsirLoading || tafsirBooksLoading ? (
            <div className="py-8 flex justify-center">
              <Loading message={t("surah.loading_tafsir")} size="sm" />
            </div>
          ) : ayahTafsirError || tafsirBooksError ? (
            <div className="py-4">
              <ErrorPage
                error={ayahTafsirError || tafsirBooksError}
                message={
                  ayahTafsirError
                    ? t("surah.error_loading_tafsir")
                    : t("surah.error_loading_tafsir_books")
                }
                showBackButton
                showHomeButton
              />
            </div>
          ) : (
            tafsir && (
              <div>
                <div className="flex flex-col items-start mb-2">
                  <h3 className="text-lg font-bold mb-2">
                    {t("surah.tafsir")}
                  </h3>

                  <p className="leading-relaxed text-base">{tafsir.text}</p>
                </div>
              </div>
            )
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <DetailItem
              label={t("surah.juz")}
              value={formatNumber(ayah.juz, language)}
            />
            <DetailItem
              label={t("surah.page")}
              value={formatNumber(ayah.page, language)}
            />
            <DetailItem
              label={t("surah.hizb")}
              value={formatNumber(ayah.hizbQuarter, language)}
            />
            <DetailItem
              label={t("surah.manzil")}
              value={formatNumber(ayah.manzil, language)}
            />
          </div>

          {/* Sajda Info if applicable */}
          {ayah.sajda && (
            <div className="flex justify-center">
              <Badge variant="outline" className="font-bold">
                {t("surah.sajda")}
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors">
    <span className="text-xs text-muted-foreground block mb-1">{label}</span>
    <p className="text-lg font-bold text-primary">{value}</p>
  </div>
);

export default AyahModal;
