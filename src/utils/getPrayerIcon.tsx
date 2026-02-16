import type { ReactNode } from "react";
import {
  AccessTime,
  WbTwilight,
  WbSunny,
  Brightness3,
} from "@mui/icons-material";
export const getPrayerIcon = (prayerName: string): ReactNode => {
  const iconProps = { fontSize: "medium" as const };

  switch (prayerName.toLowerCase()) {
    case "fajr":
    case "imsak":
      return <WbTwilight {...iconProps} />;
    case "sunrise":
    case "dhuhr":
    case "asr":
      return <WbSunny {...iconProps} />;
    case "maghrib":
    case "sunset":
    case "isha":
      return <Brightness3 {...iconProps} />;
    default:
      return <AccessTime {...iconProps} />;
  }
};
