import * as React from "react";

export type DiscoverItem = {
  key: string;
  icon: React.ComponentType;
  labelKey:
    | "surah.discover-tafsir"
    | "surah.discover-tadabor"
    | "surah.discover-lessons";
  onClick: () => void;
};
