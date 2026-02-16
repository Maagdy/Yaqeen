import type {
  FavoriteReciter,
  FavoriteSurah,
  FavoriteAyah,
  FavoriteJuz,
  FavoriteMushaf,
  FavoriteRadio,
  FavoriteHadith,
  FavoriteDua,
} from "@/api";

export interface ProfileFavoritesProps {
  favoriteReciters: FavoriteReciter[] | undefined;
  favoriteSurahs: FavoriteSurah[] | undefined;
  favoriteAyahs: FavoriteAyah[] | undefined;
  favoriteJuzs: FavoriteJuz[] | undefined;
  favoriteMushafs: FavoriteMushaf[] | undefined;
  favoriteRadios: FavoriteRadio[] | undefined;
  favoriteHadiths: FavoriteHadith[] | undefined;
  favoriteDuas: FavoriteDua[] | undefined;
}
