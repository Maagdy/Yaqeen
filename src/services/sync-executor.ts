import type { SyncQueueItem } from "@/lib/db";
import {
  addFavoriteReciter,
  removeFavoriteReciter,
  addFavoriteSurah,
  removeFavoriteSurah,
  addFavoriteAyah,
  removeFavoriteAyah,
  addFavoriteJuz,
  removeFavoriteJuz,
  addFavoriteBook,
  removeFavoriteBook,
  addFavoriteHadith,
  removeFavoriteHadith,
  addFavoriteMushaf,
  removeFavoriteMushaf,
  addFavoriteRadio,
  removeFavoriteRadio,
  addFavoriteDua,
  removeFavoriteDua,
  updateDailyProgress,
} from "@/api/domains/user/user-queries";
import { RamadanChallengeService } from "@/services/ramadan-challenge-service";

type AnyPayload = Record<string, unknown>;

export async function executeSyncItem(item: SyncQueueItem): Promise<void> {
  const p = item.payload as AnyPayload;

  switch (item.operationType) {
    case "updateDailyProgress":
      await updateDailyProgress(p.userId as string, p.progress as Record<string, unknown>);
      break;

    case "addFavoriteReciter":
      await addFavoriteReciter(p.userId as string, p.reciterId as number, p.reciterName as string | undefined, p.reciterNameEnglish as string | undefined);
      break;
    case "removeFavoriteReciter":
      await removeFavoriteReciter(p.userId as string, p.reciterId as number);
      break;

    case "addFavoriteSurah":
      await addFavoriteSurah(p.userId as string, p.surahNumber as number, p.reciterId as number | undefined, p.reciterName as string | undefined, p.reciterNameEnglish as string | undefined);
      break;
    case "removeFavoriteSurah":
      await removeFavoriteSurah(p.userId as string, p.surahNumber as number, p.reciterId as number | undefined);
      break;

    case "addFavoriteAyah":
      await addFavoriteAyah(p.userId as string, p.surahNumber as number, p.ayahNumber as number, p.surahName as string | undefined, p.ayahText as string | undefined, p.surahNameEnglish as string | undefined);
      break;
    case "removeFavoriteAyah":
      await removeFavoriteAyah(p.userId as string, p.surahNumber as number, p.ayahNumber as number);
      break;

    case "addFavoriteJuz":
      await addFavoriteJuz(p.userId as string, p.juzNumber as number);
      break;
    case "removeFavoriteJuz":
      await removeFavoriteJuz(p.userId as string, p.juzNumber as number);
      break;

    case "addFavoriteBook":
      await addFavoriteBook(p.userId as string, p.collectionName as string, p.bookNumber as string | undefined, p.bookName as string | undefined);
      break;
    case "removeFavoriteBook":
      await removeFavoriteBook(p.userId as string, p.collectionName as string, p.bookNumber as string | undefined);
      break;

    case "addFavoriteHadith":
      await addFavoriteHadith(p.userId as string, p.collectionName as string, p.bookNumber as string, p.hadithNumber as string, p.chapterId as string | undefined, p.hadithText as string | undefined);
      break;
    case "removeFavoriteHadith":
      await removeFavoriteHadith(p.userId as string, p.collectionName as string, p.bookNumber as string, p.hadithNumber as string);
      break;

    case "addFavoriteMushaf":
      await addFavoriteMushaf(p.userId as string, p.mushafId as number, p.mushafName as string | undefined, p.mushafNameEnglish as string | undefined);
      break;
    case "removeFavoriteMushaf":
      await removeFavoriteMushaf(p.userId as string, p.mushafId as number);
      break;

    case "addFavoriteRadio":
      await addFavoriteRadio(p.userId as string, p.radioId as number, p.radioName as string | undefined, p.radioUrl as string | undefined, p.radioNameEnglish as string | undefined);
      break;
    case "removeFavoriteRadio":
      await removeFavoriteRadio(p.userId as string, p.radioId as number);
      break;

    case "addFavoriteDua":
      await addFavoriteDua(p.userId as string, p.duaId as number, p.duaCategory as string, p.duaTextArabic as string | undefined, p.duaTextEnglish as string | undefined, p.duaReference as string | undefined);
      break;
    case "removeFavoriteDua":
      await removeFavoriteDua(p.userId as string, p.duaId as number);
      break;

    case "trackUserActivity":
      await RamadanChallengeService.trackUserActivity({
        userId: p.userId as string,
        pagesRead: p.pagesRead as number | undefined,
        minutesListened: p.minutesListened as number | undefined,
        reflectionWritten: p.reflectionWritten as boolean | undefined,
        activityDate: item.activityTimestamp.split("T")[0],
      });
      break;

    default:
      console.warn("[SyncExecutor] Unknown operation:", item.operationType);
  }
}
