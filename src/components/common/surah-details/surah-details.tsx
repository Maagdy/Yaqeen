import type { SurahDetailsProps } from "./surah-details.types";
import { useTranslation } from "react-i18next";

export const SurahDetails: React.FC<SurahDetailsProps> = ({
  surah,
  ayahs,
  language,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-12">
      {/* Surah Header - Centered */}
      <div className="mb-6 pb-4 border-b-2 border-primary/20 text-center">
        <h2
          className={`text-2xl md:text-3xl font-bold text-primary mb-2 ${
            language === "ar" ? "font-amiri" : ""
          }`}
        >
          {language === "ar" ? surah.name : surah.englishName}
        </h2>
        <p className="text-sm text-text-secondary">
          {t(
            surah.revelationType.toLowerCase() === "meccan"
              ? "home.revelation_place.makkah"
              : "home.revelation_place.madinah",
          )}{" "}
          • {surah.numberOfAyahs} {t("home.verses")}
        </p>
      </div>

      {/* Ayahs - Centered */}
      <div
        className={`space-y-4 text-center ${
          language === "ar" ? "font-amiri" : ""
        }`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {ayahs.map((ayah) => (
          <div key={ayah.number} className="leading-loose text-text-primary">
            <span className="text-xl md:text-2xl">{ayah.text}</span>
            {/* Ayah Number Badge - Traditional Quran octagonal style */}
            <span className="inline-flex items-center justify-center relative mx-2 w-9 h-9">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 36 36"
              >
                {/* Octagonal shape */}
                <path
                  d="M18 2 L26 6 L30 14 L30 22 L26 30 L18 34 L10 30 L6 22 L6 14 L10 6 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/90"
                />
              </svg>
              <span className="relative z-10 text-sm font-bold text-text-primary">
                {ayah.numberInSurah}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* End of Surah Marker */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {}
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />{" "}
        <span className="text-sm font-medium text-primary/70 px-4">
          {t("surah.end")}
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-primary/30 to-transparent" />
      </div>
    </div>
  );
};
