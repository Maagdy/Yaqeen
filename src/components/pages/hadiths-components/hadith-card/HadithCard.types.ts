import type { Hadith } from "@/api/domains/tafsir";

export interface HadithCardProps {
  hadith: Hadith;
  isRtl?: boolean;
  bookName?: string;
}
