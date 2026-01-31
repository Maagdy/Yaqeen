export interface ReciterSurahsListProps {
  surahList: string[];
  isPlaying: boolean;
  currentSurahNumber: number | null;
  language: string;
  onPlay: (surahNumber: number) => void;
  onDownload: (surahNumber: number) => void;
  onCopyLink: (surahNumber: number) => void;
}
