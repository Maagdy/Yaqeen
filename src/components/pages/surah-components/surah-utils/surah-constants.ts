import type { DiscoverItem } from "./surah-utils.types";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export const discoverItems: DiscoverItem[] = [
  {
    key: "tafsir",
    icon: MenuBookIcon,
    labelKey: "surah.discover-tafsir",
    onClick: () => {},
  },
  {
    key: "tadabor",
    icon: ChatBubbleOutlineIcon,
    labelKey: "surah.discover-tadabor",
    onClick: () => {},
  },
  {
    key: "lessons",
    icon: ReceiptLongIcon,
    labelKey: "surah.discover-lessons",
    onClick: () => {},
  },
] as const;

// surah-constants.ts
export const getDiscoverItems = (handlers: {
  onTafsirClick: () => void;
  onTadaborClick: () => void;
  onLessonsClick: () => void;
}): DiscoverItem[] => [
  {
    key: "tafsir",
    icon: MenuBookIcon,
    labelKey: "surah.discover-tafsir",
    onClick: handlers.onTafsirClick,
  },
  {
    key: "tadabor",
    icon: ChatBubbleOutlineIcon,
    labelKey: "surah.discover-tadabor",
    onClick: handlers.onTadaborClick,
  },
  {
    key: "lessons",
    icon: ReceiptLongIcon,
    labelKey: "surah.discover-lessons",
    onClick: handlers.onLessonsClick,
  },
];
