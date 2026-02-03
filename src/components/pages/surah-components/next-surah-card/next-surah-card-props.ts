export type NextSurah = {
  name: string;
  arabicName: string;
  number: number;
  verses: number;
};

export interface NextSurahCardProps {
  chapter: NextSurah;
  onClick: () => void;
  isPrevious?: boolean;
}
