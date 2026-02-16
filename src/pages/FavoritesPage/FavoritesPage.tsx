import {
  useFavoriteAyahsQuery,
  useFavoriteJuzsQuery,
  useFavoriteMushafsQuery,
  useFavoriteRadiosQuery,
  useFavoriteRecitersQuery,
  useFavoriteSurahsQuery,
  useFavoriteHadithsQuery,
  useFavoriteDuasQuery,
} from "@/api";
import { ProfileFavorites } from "@/components/pages/profile-components/profile-favorites/profile-favorites";
import { SEO, SEO_CONFIG } from "@/components/seo";
import { useAuth, useLanguage } from "@/hooks";
import { ROUTES } from "@/router/routes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FavoritesPage() {
  const { isLoggedIn, user, loading } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigate();
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigation(ROUTES.AUTH);
    }
  }, [isLoggedIn, loading, navigation]);

  const { data: favoriteReciters } = useFavoriteRecitersQuery(user?.id);
  const { data: favoriteSurahs } = useFavoriteSurahsQuery(user?.id);
  const { data: favoriteJuzs } = useFavoriteJuzsQuery(user?.id);
  const { data: favoriteAyahs } = useFavoriteAyahsQuery(user?.id);
  const { data: favoriteMushafs } = useFavoriteMushafsQuery(user?.id);
  const { data: favoriteRadios } = useFavoriteRadiosQuery(user?.id);
  const { data: favoriteHadiths } = useFavoriteHadithsQuery(user?.id);
  const { data: favoriteDuas } = useFavoriteDuasQuery(user?.id);
  const seoConfig = SEO_CONFIG.profile[language as "en" | "ar"];

  return (
    <>
      <SEO {...seoConfig} />
      <div>
        <ProfileFavorites
          favoriteReciters={favoriteReciters}
          favoriteSurahs={favoriteSurahs}
          favoriteJuzs={favoriteJuzs}
          favoriteAyahs={favoriteAyahs}
          favoriteMushafs={favoriteMushafs}
          favoriteRadios={favoriteRadios}
          favoriteHadiths={favoriteHadiths}
          favoriteDuas={favoriteDuas}
        />
      </div>
    </>
  );
}

export default FavoritesPage;
