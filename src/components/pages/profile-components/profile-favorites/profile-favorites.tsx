import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Person } from "@mui/icons-material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileFavoritesProps } from "./profile-favorites.types";
import { quranSurahs } from "@/utils/constants";
import { useLanguage } from "@/hooks";
import { formatNumber } from "@/utils/numbers";

export const ProfileFavorites: React.FC<ProfileFavoritesProps> = ({
  favoriteReciters,
  favoriteSurahs,
  favoriteAyahs,
  favoriteJuzs,
  favoriteMushafs,
  favoriteRadios,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-text-primary">
        {t("common.favorites")}
      </h2>

      {/* Favorite Reciters */}
      {favoriteReciters && favoriteReciters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("profile.favorite_reciters")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteReciters.map((fav) => (
                <div
                  key={fav.id}
                  className="p-3 border rounded-lg flex items-center gap-3 bg-surface hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    navigate(`/reciters/${fav.reciter_id}`);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Person />
                  </div>
                  <span className="font-medium text-text-primary">
                    {language === "en"
                      ? fav.reciter_name_english
                      : fav.reciter_name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorite Surahs */}
      {favoriteSurahs && favoriteSurahs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("profile.favorite_surahs")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteSurahs.map((fav) => {
                const favSurah = quranSurahs.find(
                  (s) => s.number === fav.surah_number,
                );
                return (
                  <div
                    key={fav.id}
                    className="p-3 border rounded-lg flex items-center gap-3 bg-surface hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (fav.reciter_id) {
                        navigate(`/reciters/${fav.reciter_id}`);
                      } else {
                        navigate(`/surah/${fav.surah_number}`);
                      }
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                      {formatNumber(fav.surah_number, language)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium text-text-primary truncate">
                        {language === "en"
                          ? favSurah?.name
                          : favSurah?.arabicName}
                      </span>
                      {fav.reciter_id && (
                        <span className="text-xs text-text-secondary truncate">
                          {language === "en"
                            ? fav.reciter_name_english || fav.reciter_name
                            : fav.reciter_name || fav.reciter_name_english}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorite Juzs */}
      {favoriteJuzs && favoriteJuzs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("profile.favorite_juzs")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteJuzs.map((fav) => (
                <div
                  key={fav.id}
                  className="p-3 border rounded-lg flex items-center gap-3 bg-surface hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    navigate(`/juz/${fav.juz_number}`);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                    {formatNumber(fav.juz_number, language)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-text-primary truncate">
                      {t("home.tabs.juz")}{" "}
                      {formatNumber(fav.juz_number, language)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorite Mushafs */}
      {favoriteMushafs && favoriteMushafs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("favorites.favorite_mushafs", {
                defaultValue: "Favorite Mushafs",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteMushafs.map((fav) => (
                <div
                  key={fav.id}
                  className="p-3 border rounded-lg flex items-center gap-3 bg-surface hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    navigate(`/quran/${fav.mushaf_id}`);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                    📖
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-text-primary truncate">
                      {fav.mushaf_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorite Radios */}
      {favoriteRadios && favoriteRadios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("favorites.favorite_radios", {
                defaultValue: "Favorite Radios",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteRadios.map((fav) => (
                <div
                  key={fav.id}
                  className="p-3 border rounded-lg flex items-center gap-3 bg-surface hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    navigate(`/radio`);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                    📻
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-text-primary truncate">
                      {fav.radio_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorite Ayahs */}
      {favoriteAyahs && favoriteAyahs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("profile.favorite_ayahs")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteAyahs.map((fav) => {
                const favSurah = quranSurahs.find(
                  (s) => s.number === fav.surah_number,
                );
                return (
                  <div
                    key={fav.id}
                    className="p-3 border rounded-lg flex flex-col gap-2 bg-surface hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => {
                      navigate(`/surah/${fav.surah_number}`);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                        {formatNumber(fav.surah_number, language)}:
                        {formatNumber(fav.ayah_number, language)}
                      </div>
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="text-xs text-text-secondary truncate">
                          {language === "en"
                            ? favSurah?.name
                            : favSurah?.arabicName}
                        </span>
                      </div>
                    </div>
                    {fav.ayah_text && (
                      <p className="text-sm text-text-primary font-amiri line-clamp-2 leading-relaxed">
                        {fav.ayah_text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {!favoriteReciters?.length &&
        !favoriteSurahs?.length &&
        !favoriteJuzs?.length &&
        !favoriteAyahs?.length &&
        !favoriteMushafs?.length &&
        !favoriteRadios?.length && (
          <Card>
            <CardContent className="py-8 text-center text-text-secondary">
              <p>{t("profile.no_favorites")}</p>
            </CardContent>
          </Card>
        )}
    </div>
  );
};
