export interface ReciterSurahCardProps {
  number: number;
  name: string;
  arabicName?: string;
  onPlay?: () => void;
  isPlaying?: boolean;
  onDownload?: () => void;
  onCopyLink?: () => void;
}
