import { useQuery } from "@tanstack/react-query";
import { getPrayerTimes, getPrayerTimesCalendar } from "./prayer-times-queries";
import type { PrayerTimesParams, PrayerTimesCalendarParams } from "./prayer-times.types";

export const usePrayerTimesQuery = (params: PrayerTimesParams) => {
  return useQuery({
    queryKey: ["prayer-times", params.city, params.country, params.date, params.method],
    queryFn: () => getPrayerTimes(params),
    enabled: Boolean(params.city && params.country),
    staleTime: 1000 * 60 * 60, // 1 hour - prayer times don't change frequently
  });
};

export const usePrayerTimesCalendarQuery = (params: PrayerTimesCalendarParams) => {
  return useQuery({
    queryKey: [
      "prayer-times-calendar",
      params.latitude,
      params.longitude,
      params.month,
      params.year,
      params.method,
    ],
    queryFn: () => getPrayerTimesCalendar(params),
    enabled: Boolean(params.latitude && params.longitude),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - calendar doesn't change frequently
    gcTime: 1000 * 60 * 60 * 24 * 30, // Cache for 30 days
  });
};
