import type { Ayah, Surah } from "@/api";

export interface MobileAyahsListProps {
  ayahs: Ayah[];
  surah: Surah;
  isPlaying: boolean;
  currentSurahNumber: number | null;
  currentAudio: string | null;
  onPlay: (ayah: Ayah) => void;
  onBookmark: (ayah: Ayah) => void;
  onShare: (ayah: Ayah) => void;
  onCopy: (ayah: Ayah) => void;
  onTafsirClick: (ayah: Ayah) => void;
  isBookmarked: (ayah: Ayah) => boolean;
}
