import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  usePrayerTimesQuery,
  usePrayerTimesCalendarQuery,
} from "@/api/domains/prayer-times";
import { CircularProgress } from "@mui/material";
import { CalendarMonth, LocationOn } from "@mui/icons-material";
import { useLanguage } from "@/hooks";
import { formatNumber } from "@/utils/numbers";
import { LocationSelector } from "@/components/pages/paryer-times-components/location-selector";
import { PrayerTimeCard } from "@/components/pages/paryer-times-components/prayer-time-card";
import { getPrayerIcon } from "@/utils/getPrayerIcon";
import { ErrorPage } from "../ErrorPage";

const MAIN_PRAYERS = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
] as const;

export const PrayerTimesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const isRtl = i18n.language === "ar";

  const [locationMode, setLocationMode] = useState<"city" | "geolocation">(
    "city",
  );
  const [city, setCity] = useState("Cairo");
  const [country, setCountry] = useState("Egypt");
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const PRAYER_KEY_MAP = {
    Fajr: "prayer_times.prayers.fajr",
    Sunrise: "prayer_times.prayers.sunrise",
    Dhuhr: "prayer_times.prayers.dhuhr",
    Asr: "prayer_times.prayers.asr",
    Maghrib: "prayer_times.prayers.maghrib",
    Isha: "prayer_times.prayers.isha",
  } as const satisfies Record<
    (typeof MAIN_PRAYERS)[number],
    Parameters<typeof t>[0]
  >;

  const currentDate = useMemo(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  const cityQuery = usePrayerTimesQuery({
    city,
    country,
    date: currentDate,
    method: 5,
  });

  const geoQuery = usePrayerTimesCalendarQuery({
    latitude: coordinates?.latitude ?? 0,
    longitude: coordinates?.longitude ?? 0,
    method: 5,
  });

  const { data, isLoading, error } =
    locationMode === "geolocation" && coordinates
      ? {
          data: geoQuery.data
            ? {
                ...geoQuery.data,
                data: geoQuery.data.data[new Date().getDate() - 1],
              }
            : undefined,
          isLoading: geoQuery.isLoading,
          error: geoQuery.error,
        }
      : cityQuery;

  const handleLocationChange = (newCity: string, newCountry: string) => {
    setCity(newCity);
    setCountry(newCountry);
    setLocationMode("city");
  };

  const handleGeolocationChange = (latitude: number, longitude: number) => {
    setCoordinates({ latitude, longitude });
    setLocationMode("geolocation");
  };

  const displayCity = useMemo(() => {
    if (locationMode === "geolocation" && coordinates) {
      return t("prayer_times.your_location", { defaultValue: "Your Location" });
    }
    return city;
  }, [locationMode, coordinates, city, t]);

  const displayCountry = useMemo(() => {
    if (locationMode === "geolocation" && coordinates) {
      return "";
    }
    return country;
  }, [locationMode, coordinates, country]);

  const nextPrayer = useMemo(() => {
    if (!data?.data?.timings) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of MAIN_PRAYERS) {
      const prayerTime =
        data.data.timings[prayer as keyof typeof data.data.timings];
      if (prayerTime) {
        const [hours, minutes] = prayerTime.split(":").map(Number);
        const prayerMinutes = hours * 60 + minutes;

        if (prayerMinutes > currentTime) {
          return prayer;
        }
      }
    }

    return MAIN_PRAYERS[0];
  }, [data]);

  return (
    <>
      <Helmet>
        <title>{t("prayer_times.page_title")} | Yaqeen</title>
        <meta name="description" content={t("prayer_times.page_description")} />
      </Helmet>

      <div className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {t("prayer_times.title")}
            </h1>
            <p className="text-text-secondary text-sm md:text-base">
              {t("prayer_times.subtitle")}
            </p>
          </div>

          <div className="mb-8">
            <LocationSelector
              city={displayCity}
              country={displayCountry}
              onLocationChange={handleLocationChange}
              onGeolocationChange={handleGeolocationChange}
            />
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <CircularProgress size={60} />
            </div>
          )}

          {error && (
            <ErrorPage
              message={t("common.error_occurred")}
              onRetry={() => {
                if (locationMode === "geolocation" && coordinates) {
                  geoQuery.refetch();
                } else {
                  cityQuery.refetch();
                }
              }}
              showHomeButton
              showRetryButton
            />
          )}

          {data?.data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-surface rounded-xl p-4 md:p-6 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <CalendarMonth className="text-primary" />
                    <h3 className="text-lg font-semibold text-text-primary">
                      {t("prayer_times.gregorian_date")}
                    </h3>
                  </div>
                  <p className="text-text-secondary">
                    {data.data.date.gregorian.weekday.en},{" "}
                    {formatNumber(data.data.date.gregorian.day, language)}{" "}
                    {data.data.date.gregorian.month.en}{" "}
                    {data.data.date.gregorian.year}
                  </p>
                </div>

                <div className="bg-surface rounded-xl p-4 md:p-6 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <CalendarMonth className="text-primary" />
                    <h3
                      className={`text-lg font-semibold text-text-primary ${
                        isRtl ? "font-amiri" : ""
                      }`}
                    >
                      {t("prayer_times.hijri_date")}
                    </h3>
                  </div>
                  <p
                    className={`text-text-secondary ${isRtl ? "font-amiri" : ""}`}
                  >
                    {isRtl
                      ? data.data.date.hijri.weekday.ar
                      : data.data.date.hijri.weekday.en}
                    , {formatNumber(data.data.date.hijri.day, language)}{" "}
                    {isRtl
                      ? data.data.date.hijri.month.ar
                      : data.data.date.hijri.month.en}{" "}
                    {data.data.date.hijri.year}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {MAIN_PRAYERS.map((prayer) => {
                  const time =
                    data.data.timings[prayer as keyof typeof data.data.timings];
                  return (
                    <PrayerTimeCard
                      key={prayer}
                      name={t(PRAYER_KEY_MAP[prayer])}
                      time={time || ""}
                      icon={getPrayerIcon(prayer)}
                      isNext={prayer === nextPrayer}
                    />
                  );
                })}
              </div>

              <div className="mt-8 bg-surface rounded-xl p-4 md:p-6 border border-border">
                <div className="flex items-start gap-2 text-text-secondary text-sm">
                  <LocationOn fontSize="small" className="text-primary" />
                  <span>
                    {t("prayer_times.calculation_method")}:{" "}
                    <span className="font-semibold text-text-primary">
                      {data.data.meta.method.name}
                    </span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PrayerTimesPage;
