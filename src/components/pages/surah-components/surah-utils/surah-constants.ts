import type { DiscoverItem } from "./surah-utils.types";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export const discoverItems: DiscoverItem[] = [
  {
    key: "tafsir",
    icon: MenuBookIcon,
    labelKey: "surah.discover-tafsir",
    onClick: () => {},
  },
] as const;

export const getDiscoverItems = (handlers: {
  onTafsirClick: () => void;
}): DiscoverItem[] => [
  {
    key: "tafsir",
    icon: MenuBookIcon,
    labelKey: "surah.discover-tafsir",
    onClick: handlers.onTafsirClick,
  },
];
