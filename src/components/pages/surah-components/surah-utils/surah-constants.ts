import type { DiscoverItem } from "./surah-utils.types";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export const discoverItems: DiscoverItem[] = [
  {
    key: "tafsir",
    icon: MenuBookIcon,
    labelKey: "surah.discover-tafsir",
  },
  {
    key: "tadabor",
    icon: ChatBubbleOutlineIcon,
    labelKey: "surah.discover-tadabor",
  },
  {
    key: "lessons",
    icon: ReceiptLongIcon,
    labelKey: "surah.discover-lessons",
  },
] as const;
