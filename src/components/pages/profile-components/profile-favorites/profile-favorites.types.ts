import type { FavoriteReciter, FavoriteSurah } from "@/api";

export interface ProfileFavoritesProps {
  favoriteReciters: FavoriteReciter[] | undefined;
  favoriteSurahs: FavoriteSurah[] | undefined;
}
