export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
    days: number;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
  holidays: string[];
  adjustedHolidays: string[];
  method: string;
}

export interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
  };
  month: {
    number: number;
    en: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
  lunarSighting: boolean;
}

export interface PrayerDate {
  readable: string;
  timestamp: string;
  hijri: HijriDate;
  gregorian: GregorianDate;
}

export interface PrayerMeta {
  latitude: number;
  longitude: number;
  timezone: string;
  method: {
    id: number;
    name: string;
    params: {
      Fajr: number;
      Isha: number;
    };
    location: {
      latitude: number;
      longitude: number;
    };
  };
  latitudeAdjustmentMethod: string;
  midnightMode: string;
  school: string;
  offset: Record<string, number>;
}

export interface PrayerTimesData {
  timings: PrayerTimings;
  date: PrayerDate;
  meta: PrayerMeta;
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: PrayerTimesData;
}

export interface PrayerTimesParams {
  city: string;
  country: string;
  date?: string; // Format: DD-MM-YYYY
  method?: number; // Calculation method (5 for Egyptian)
}

export interface PrayerTimesCalendarParams {
  latitude: number;
  longitude: number;
  month?: number; // 1-12
  year?: number;
  method?: number; // Calculation method (5 for Egyptian)
}

export interface PrayerTimesCalendarResponse {
  code: number;
  status: string;
  data: PrayerTimesData[];
}
