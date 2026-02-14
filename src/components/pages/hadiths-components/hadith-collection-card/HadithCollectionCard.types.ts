import type { HadithCollection } from "@/api/domains/tafsir";

export interface HadithCollectionCardProps {
  collection: HadithCollection;
  onClick?: () => void;
}
