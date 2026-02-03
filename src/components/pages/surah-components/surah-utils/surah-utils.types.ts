import type { SvgIconComponent } from "@mui/icons-material";

export type DiscoverItem = {
  key: string;
  icon: SvgIconComponent;
  labelKey:
    | "surah.discover-tafsir"
    | "surah.discover-tadabor"
    | "surah.discover-lessons";
};
