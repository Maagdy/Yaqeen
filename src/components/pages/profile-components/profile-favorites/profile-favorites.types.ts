import type {
  FavoriteReciter,
  FavoriteSurah,
  FavoriteAyah,
  FavoriteJuz,
  FavoriteMushaf,
  FavoriteRadio,
} from "@/api";

export interface ProfileFavoritesProps {
  favoriteReciters: FavoriteReciter[] | undefined;
  favoriteSurahs: FavoriteSurah[] | undefined;
  favoriteAyahs: FavoriteAyah[] | undefined;
  favoriteJuzs: FavoriteJuz[] | undefined;
  favoriteMushafs: FavoriteMushaf[] | undefined;
  favoriteRadios: FavoriteRadio[] | undefined;
}
