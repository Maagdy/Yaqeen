import type { Ayah, SurahData } from "../../../../api";

export interface AyahModalProps {
  open: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  surah: SurahData;
  onAyahChange: (ayah: Ayah) => void;
}
