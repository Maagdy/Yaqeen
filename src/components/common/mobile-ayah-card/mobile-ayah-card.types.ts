import type { Ayah, Surah } from "@/api";

export interface MobileAyahCardProps {
  ayah: Ayah;
  surah: Surah;
  isPlaying: boolean;
  onPlay: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onCopy?: () => void;
  onTafsirClick?: () => void;
  isBookmarked?: boolean;
}
