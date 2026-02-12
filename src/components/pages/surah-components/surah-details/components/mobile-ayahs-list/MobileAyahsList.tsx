import { MobileAyahCard } from "@/components/common";
import type { MobileAyahsListProps } from "./MobileAyahsList.types";

export const MobileAyahsList: React.FC<MobileAyahsListProps> = ({
  ayahs,
  surah,
  isPlaying,
  currentSurahNumber,
  currentAudio,
  onPlay,
  onBookmark,
  onShare,
  onCopy,
  onTafsirClick,
  isBookmarked,
}) => {
  return (
    <div className="space-y-4">
      {ayahs.map((ayah) => {
        const isAyahPlaying =
          isPlaying &&
          currentSurahNumber === surah.number &&
          currentAudio === ayah.audio;

        return (
          <MobileAyahCard
            key={ayah.number}
            ayah={ayah}
            surah={surah}
            isPlaying={isAyahPlaying}
            onPlay={() => onPlay(ayah)}
            onBookmark={() => onBookmark(ayah)}
            onShare={() => onShare(ayah)}
            onCopy={() => onCopy(ayah)}
            onTafsirClick={() => onTafsirClick(ayah)}
            isBookmarked={isBookmarked(ayah)}
          />
        );
      })}
    </div>
  );
};
