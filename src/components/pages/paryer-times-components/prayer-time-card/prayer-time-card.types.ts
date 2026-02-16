import type { ReactNode } from "react";

export interface PrayerTimeCardProps {
  name: string;
  time: string;
  icon?: ReactNode;
  isNext?: boolean;
}
