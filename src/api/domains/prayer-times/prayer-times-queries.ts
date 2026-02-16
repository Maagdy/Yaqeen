import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import type {
  PrayerTimesResponse,
  PrayerTimesParams,
  PrayerTimesCalendarResponse,
  PrayerTimesCalendarParams,
} from "./prayer-times.types";

export const getPrayerTimes = async (
  params: PrayerTimesParams,
): Promise<PrayerTimesResponse> => {
  const { city, country, date, method = 5 } = params;

  const response = await client.get<PrayerTimesResponse>(
    ENDPOINTS.PRAYER_TIMES({ city, country, date, method }),
  );

  return response;
};

export const getPrayerTimesCalendar = async (
  params: PrayerTimesCalendarParams,
): Promise<PrayerTimesCalendarResponse> => {
  const { latitude, longitude, month, year, method = 5 } = params;

  const response = await client.get<PrayerTimesCalendarResponse>(
    ENDPOINTS.PRAYER_TIMES_CALENDAR({ latitude, longitude, month, year, method }),
  );

  return response;
};
