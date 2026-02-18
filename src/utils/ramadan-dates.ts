import moment from "moment-hijri";

// PRODUCTION MODE: Use actual Hijri calendar dates
// All calculations are dynamic based on real Islamic calendar

// HIJRI_OFFSET_DAYS: Correction for official moon sighting vs astronomical calculation.
// Egypt's official Ramadan 1447 start is Feb 19, 2026, while moment-hijri gives Feb 18.
// A value of -1 shifts all Gregorian→Hijri lookups back by 1 day so the Hijri date
// only advances when the official crescent has been sighted.
// Set to 0 to disable the correction.
const HIJRI_OFFSET_DAYS = -1;

// Use this instead of moment() for any Gregorian→Hijri conversion.
const getAdjustedMoment = () => moment().add(HIJRI_OFFSET_DAYS, "days");

export const getCurrentHijriYear = (): number => {
  return getAdjustedMoment().iYear();
};

export const getCurrentHijriMonth = (): number => {
  return getAdjustedMoment().iMonth() + 1;
};

export const getCurrentHijriDay = (): number => {
  return getAdjustedMoment().iDate();
};

export const isRamadan = (): boolean => {
  const currentMonth = getCurrentHijriMonth();
  const isRamadan = currentMonth === 9;
  return isRamadan;
};

export const getCurrentRamadanYear = (): number => {
  const currentYear = getCurrentHijriYear();
  const currentMonth = getCurrentHijriMonth();

  if (currentMonth > 9) {
    return currentYear + 1;
  }

  return currentYear;
};

export const getCurrentRamadanDay = (): number => {
  if (!isRamadan()) {
    return 0;
  }

  const currentDay = getCurrentHijriDay();
  return currentDay;
};

export const getRamadanStartDate = (hijriYear: number): Date => {
  const ramadanStart = moment(`${hijriYear}/09/01`, "iYYYY/iM/iD");
  // Shift the Gregorian result by the inverse of HIJRI_OFFSET_DAYS so that
  // the start date aligns with the official moon-sighting announcement.
  return ramadanStart.subtract(HIJRI_OFFSET_DAYS, "days").toDate();
};

export const getRamadanEndDate = (hijriYear: number): Date => {
  const ramadanEnd = moment(`${hijriYear}/09/30`, "iYYYY/iM/iD");
  return ramadanEnd.subtract(HIJRI_OFFSET_DAYS, "days").toDate();
};

export const getDaysUntilRamadan = (): number => {
  if (isRamadan()) {
    return 0;
  }

  const ramadanYear = getCurrentRamadanYear();
  const ramadanStart = getRamadanStartDate(ramadanYear);
  const today = new Date();

  const diffTime = ramadanStart.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

export const getDaysRemainingInRamadan = (): number => {
  if (!isRamadan()) {
    return 0;
  }

  const currentDay = getCurrentRamadanDay();
  return 30 - currentDay;
};

export const formatHijriDate = (
  date: Date = new Date(),
  format: string = "iYYYY/iMM/iDD",
): string => {
  return moment(date).format(format);
};

export const getRamadanProgress = (): number => {
  if (!isRamadan()) {
    return 0;
  }

  const currentDay = getCurrentRamadanDay();
  return Math.round((currentDay / 30) * 100);
};

export const isLast10Nights = (): boolean => {
  if (!isRamadan()) {
    return false;
  }

  const currentDay = getCurrentRamadanDay();
  return currentDay >= 21 && currentDay <= 30;
};

export const isOddNight = (): boolean => {
  if (!isRamadan()) {
    return false;
  }

  const currentDay = getCurrentRamadanDay();
  return currentDay >= 21 && currentDay <= 30 && currentDay % 2 !== 0;
};

export const getRamadanStatus = (): {
  status: "before" | "during" | "after";
  message: string;
  arabicMessage?: string;
  daysCount?: number;
} => {
  const currentMonth = getCurrentHijriMonth();
  const currentDay = getCurrentHijriDay();

  if (currentMonth < 9) {
    const daysUntil = getDaysUntilRamadan();
    return {
      status: "before",
      message: `${daysUntil} days until Ramadan`,
      arabicMessage: `${daysUntil} أيام حتى رمضان`,
      daysCount: daysUntil,
    };
  } else if (currentMonth === 9) {
    const daysRemaining = getDaysRemainingInRamadan();
    return {
      status: "during",
      message: `Day ${currentDay} of Ramadan`,
      arabicMessage: `اليوم ${currentDay} من رمضان`,
      daysCount: daysRemaining,
    };
  } else {
    return {
      status: "after",
      message: "Ramadan has ended for this year",
      arabicMessage: "رمضان انتهى لهذا العام",
    };
  }
};

export const RamadanDateUtils = {
  getCurrentHijriYear,
  getCurrentHijriMonth,
  getCurrentHijriDay,
  isRamadan,
  getCurrentRamadanYear,
  getCurrentRamadanDay,
  getRamadanStartDate,
  getRamadanEndDate,
  getDaysUntilRamadan,
  getDaysRemainingInRamadan,
  formatHijriDate,
  getRamadanProgress,
  isLast10Nights,
  isOddNight,
  getRamadanStatus,
};
