import type {
  FavoriteReciter,
  FavoriteSurah,
  FavoriteAyah,
  FavoriteJuz,
} from "@/api";

export interface ProfileFavoritesProps {
  favoriteReciters: FavoriteReciter[] | undefined;
  favoriteSurahs: FavoriteSurah[] | undefined;
  favoriteAyahs: FavoriteAyah[] | undefined;
  favoriteJuzs: FavoriteJuz[] | undefined;
}
